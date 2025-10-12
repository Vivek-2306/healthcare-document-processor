from sqlalchemy import Column, Integer, String, DateTime, UUID, Text, JSON, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from uuid import uuid4
from app.core.database import Base

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(UUID, primary_key=True, index=True, default=uuid4)
    document_id = Column(UUID, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    chunk_index = Column(Integer, nullable=False)  # Order of chunk in document
    content = Column(Text, nullable=False)  # The actual text content
    content_type = Column(String(50), default="text", nullable=False)  # text, table, image, etc.
    embedding_id = Column(String(255), nullable=True, index=True)  # Vector database embedding ID
    embedding_model = Column(String(100), nullable=True)  # Model used for embedding
    chunk_metadata = Column(JSON, nullable=True)  # Additional chunk metadata
    confidence_score = Column(Float, nullable=True)  # Confidence in chunk extraction
    page_number = Column(Integer, nullable=True)  # Source page number
    coordinates = Column(JSON, nullable=True)  # Bounding box coordinates if applicable
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    document = relationship("Document", back_populates="chunks")
    
    def __repr__(self):
        return f"<DocumentChunk(id={self.id}, document_id={self.document_id}, chunk_index={self.chunk_index})>"