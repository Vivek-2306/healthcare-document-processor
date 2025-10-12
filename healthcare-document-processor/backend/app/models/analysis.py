from sqlalchemy import Column, UUID, String, DateTime, Text, Enum, JSON, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from uuid import uuid4
from app.core.database import Base


class AnalysisType(str, enum.Enum):
    OCR = "ocr"
    MEDICAL_EXTRACTION = "medical_extraction"
    CLASSIFICATION = "classification"
    SUMMARIZATION = "summarization"
    TRANSLATION = "translation"
    ANOMALY_DETECTION = "anomaly_detection"

class AnalysisStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class DocumentAnalysis(Base):
    __tablename__ = "document_analysis"

    id = Column(UUID, primary_key=True, index=True, default=uuid4)
    document_id = Column(UUID, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    analysis_type = Column(Enum(AnalysisType), nullable=False)
    status = Column(Enum(AnalysisStatus), default=AnalysisStatus.PENDING, nullable=False)
    extracted_data = Column(JSON, nullable=True)  # Structured extracted information
    confidence_scores = Column(JSON, nullable=True)  # Confidence scores for extracted data
    processing_time = Column(Float, nullable=True)  # Processing time in seconds
    error_message = Column(Text, nullable=True)
    model_version = Column(String(50), nullable=True)  # AI model version used
    parameters = Column(JSON, nullable=True)  # Analysis parameters
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    document = relationship("Document", back_populates="analyses")
    user = relationship("User", back_populates="analyses")

    def __repr__(self):
        return f"<DocumentAnalysis(id={self.id}, analysis_type={self.analysis_type}, status={self.status})>"