from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models import User, Document
from app.services.document_processing_service import DocumentProcessingService
from app.services.ocr_service import OCRService
from app.services.storage_service import S3StorageService


router = APIRouter(prefix="/processing", tags=["document-processing"])

def get_processing_service(db: Session = Depends(get_db)) -> DocumentProcessingService:
    ocr_service = OCRService()
    storage_service = S3StorageService()
    return DocumentProcessingService(
        db=db,
        ocr_service=ocr_service,
        storage_service=storage_service
    )

@router.post("/{document_id}/process", status_code=status.HTTP_202_ACCEPTED)
async def process_document(
    document_id: UUID,
    current_user: User = Depends(get_current_active_user),
    service: DocumentProcessingService = Depends(get_processing_service)
):
    document = service.process_document(document_id, current_user)
    return {
        "message": "Document processing started",
        "document_id": str(document_id),
        "status": document.status.value
    }

@router.get("/{document_id}/text")
async def get_document_text(
    document_id: UUID,
    current_user: User = Depends(get_current_active_user),
    service: DocumentProcessingService = Depends(get_processing_service)
):
    result = service.get_document_text(document_id, current_user)
    return result

@router.get("/{document_id}/chunks")
async def get_document_chunks(
    document_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    from app.models import DocumentChunk
    chunks = db.query(DocumentChunk).filter(
        DocumentChunk.document_id == document_id
    ).order_by(DocumentChunk.chunk_index).all()

    return {
        "document_id": str(document_id),
        "total_chunks": len(chunks),
        "chunks" : [
            {
                "id": str(chunk.id),
                "chunk_index": chunk.chunk_index,
                "content": chunk.content,
                "page_number": chunk.page_number,
                "metadata": chunk.chunk_metadata
            }
            for chunk in chunks
        ]
    }