# app/core/db_utils.py
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

class DatabaseUtils:
    """Utility class for common database operations"""
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[Any]:
        """Get user by email"""
        from app.models import User
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[Any]:
        """Get user by ID"""
        from app.models import User
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def get_documents_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Any]:
        """Get documents for a specific user"""
        from app.models import Document
        return db.query(Document).filter(
            Document.user_id == user_id
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_analyses_by_document(db: Session, document_id: int) -> List[Any]:
        """Get all analyses for a document"""
        from app.models import DocumentAnalysis
        return db.query(DocumentAnalysis).filter(
            DocumentAnalysis.document_id == document_id
        ).all()
    
    @staticmethod
    def get_chunks_by_document(db: Session, document_id: int) -> List[Any]:
        """Get all chunks for a document"""
        from app.models import DocumentChunk
        return db.query(DocumentChunk).filter(
            DocumentChunk.document_id == document_id
        ).order_by(DocumentChunk.chunk_index).all()
    
    @staticmethod
    def execute_raw_query(db: Session, query: str, params: Dict[str, Any] = None) -> List[Dict]:
        """Execute raw SQL query"""
        try:
            result = db.execute(text(query), params or {})
            return [dict(row) for row in result]
        except Exception as e:
            logger.error(f"Error executing raw query: {e}")
            return []
    
    @staticmethod
    def get_database_stats(db: Session) -> Dict[str, int]:
        """Get database statistics"""
        from app.models import User, Document, DocumentAnalysis, DocumentChunk, DocumentStatus
        
        stats = {
            "total_users": db.query(User).count(),
            "active_users": db.query(User).filter(User.is_active == True).count(),
            "total_documents": db.query(Document).count(),
            "processed_documents": db.query(Document).filter(
                Document.status == DocumentStatus.PROCESSED
            ).count(),
            "total_analyses": db.query(DocumentAnalysis).count(),
            "completed_analyses": db.query(DocumentAnalysis).filter(
                DocumentAnalysis.status == "completed"
            ).count(),
            "total_chunks": db.query(DocumentChunk).count()
        }
        return stats