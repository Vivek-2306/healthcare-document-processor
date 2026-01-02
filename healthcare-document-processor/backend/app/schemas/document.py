from datetime import datetime
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel
from app.models import DocumentStatus, DocumentType

class DocumentUploadResponse(BaseModel):
    id: UUID
    filename: str
    document_type: DocumentType
    status: DocumentStatus
    file_path: str
    created_at: datetime

    class Config:
        from_attributes = True


class DocumentMetadataUpdate(BaseModel):
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    document_type: Optional[DocumentType] = None
    status: Optional[DocumentStatus] = None
    