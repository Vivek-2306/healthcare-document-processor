from sqlalchemy import BigInteger, Column, UUID, String, DateTime, Text, Enum, JSON, ForeignKey, Float, false, null
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from uuid import uuid4
from app.core.database import Base

class DocumentType(str, enum.Enum):
    MEDICAL_RECORD = "medical_record"
    LAB_RESULT = "lab_result"
    IMAGING = "imaging"
    PRESCRIPTION = "prescription"
    INSURANCE = "insurance"
    IDENTIFICATION = "identification"
    OTHER = "other"

class DocumentStatus(str, enum.Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    PROCESSED = "processed"
    FAILED = "failed"
    ARCHIVED = "archived"

class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID, primary_key=True, index=True, default=uuid4)
    user_id = Column(UUID, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    mime_type = Column(String(100), nullable=False)
    document_type = Column(Enum(DocumentType), nullable=False)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.UPLOADED, nullable=False)
    document_metadata = Column(JSON, nullable=True)  # Additional document metadata
    description = Column(Text, nullable=True)
    tags = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, onupdate=func.now())
    processed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="documents")
    analyses = relationship("DocumentAnalysis", back_populates="document", cascade="all, delete-orphan")
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Document(id={self.id}, filename='{self.filename}', status='{self.status}')>"