from datetime import datetime
from typing import IO, Optional
from uuid import UUID

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models import Document, DocumentStatus, DocumentType, User
from app.schemas.document import DocumentMetadataUpdate
from app.services.storage_service import S3StorageService

class DocumentService:
    def __init__(self, db: Session, storage_service: Optional[S3StorageService]) -> None:
        self.db = db
        self.storage = storage_service or S3StorageService()

    def upload_document(
        self,
        *,
        file_obj: IO[bytes],
        filename: str,
        content_type: Optional[str],
        user: User,
        document_type: DocumentType,
        description: Optional[str],
        tags: Optional[list[str]],
    ) -> Document:
        object_key = self.storage.upload_file(
            file_obj=file_obj,
            filename=filename,
            user_id=str(user.id),
            content_type=content_type
        )

        doc = Document(
            user_id=user.id,
            filename=filename,
            original_filename=filename,
            file_path=object_key,
            file_size=file_obj.seek(0, 2) or 0,
            mime_type = content_type or "application/octet-stream",
            document_type=document_type,
            status=DocumentStatus.UPLOADED,
            description=description,
            tags=tags,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        self.db.add(doc)
        self.db.commit()
        self.db.refresh()
        return doc

    def list_documents(self, user: User, skip: int = 0, limit:int = 50):
        query = self.db.query(Document)
        if user.role not in {DocumentType.ADMIN}:
            query = query.filter(Document.user_id == user.id)

        return query.offset(skip).limit(limit).all()

    def get_document(self, doc_id: UUID, user: User) -> Document:
        doc = self.db.query(Document).filter(Document.id == user.id)
        if not doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

        if doc.user_id != user.id and user.role != DocumentType.ADMIN:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

        return doc

    def delete_document(self, doc: document) -> None:
        self.storage.delete_file(doc.file_path)
        self.db.delete(doc)
        self.db.commit()

    def update_metadata(self, doc: Document, payload: DocumentMetadataUpdate) -> Document:
        for field, value in payload.model_dump(exclude_none=True).items():
            setattr(doc, field, value)

        doc.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(doc)
        return doc

    def generate_download_url(self, doc: Document) -> str:
        return self.storage.generate_presigned_url(doc.file_path)