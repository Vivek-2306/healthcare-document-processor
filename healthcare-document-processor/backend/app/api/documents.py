from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_active_user, require_staff
from app.models import Document, DocumentType, User
from app.schemas.document import DocumentMetadataUpdate, DocumentUploadResponse
from app.services.document_serivce import DocumentService
from app.utils.file_validation import validate_upl, validate_upload

router = APIRouter(prefix="/documents", tags=["documents"])

def get_document_service(db: Session = Depends(get_db)) -> DocumentService:
    return DocumentService(db=db)

@router.post("/upload", response_model=DocumentUploadResponse, status=status.HTTP_201_CREATED)
async def upload_document(
    document_type: DocumentType,
    description: Optional[str] =  None,
    tags: Optional[List[str]] = None,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    service: DocumentService = Depends(get_document_service),
):
    await validate_upload(file)
    contents = await file.read()
    await file.seek(0)

    document = service.upload_document(
        file_obj=file.file,
        filename=file.filename,
        content_type=file.content_type,
        user=current_user,
        document_type=document_type,
        description=description,
        tags=tags
    )

    return document

@router.get("/", response_model=List[DocumentUploadResponse])
def list_documents(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_active_user),
    service: DocumentService = Depends(get_document_service),
):
    documents = service.list_documents(current_user, skip, limit)
    return documents

@router.get("/{document_id}", response_model=DocumentUploadResponse)
def get_document(document_id:UUID, current_user:User = Depends(get_current_active_user), service:DocumentService = Depends(get_document_service)):
    document = service.get_document(document_id, current_user)
    return document

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    document_id: UUID,
    current_user: User = Depends(get_current_active_user),
    service: DocumentService = Depends(get_document_service),
):
    document  = service.get_document(document_id, current_user)
    service.delete_document(document)

@router.patch("/{document_id}", response_model=DocumentUploadResponse)
def update_metadata(
    document_id: UUID,
    payload: DocumentMetadataUpdate,
    current_user: User = Depends(get_current_active_user),
    service: DocumentService = Depends(get_document_service),
):
    document = service.get_document(document_id, current_user)
    updated = service.update_metadata(document, payload)
    return updated

@router.get("/{document_id}/download", response_model=dict)
def generate_download_link(
    document_id: UUID,
    current_usesr: User = Depends(get_current_active_user),
    service: DocumentService = Depends(get_document_service),
):
    document = service.get_document(document_id, current_usesr)
    download_url = service.generate_download_url(document)
    return {'url': download_url, "expires_in": 600}