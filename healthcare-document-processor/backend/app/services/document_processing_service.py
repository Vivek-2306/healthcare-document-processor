from datetime import datetime
from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models import Document, DocumentStatus, DocumentChunk, User
from app.services.ocr_service import OCRService
from app.services.document_preprocessing import DocumentPreprocessor
from app.services.storage_service import S3StorageService


class DocumentProcessingService:
    def __init__(self, db: Session, ocr_service: Optional[OCRService], storage_service: Optional[S3StorageService]) -> None:
        self.db = db
        self.ocr_service = ocr_service or OCRService()
        self.preprocessor = DocumentPreprocessor(self.ocr_service)
        self.storage_service = storage_service or S3StorageService()

    def process_document(self, document_id: UUID, user: User) -> Document:
        document = self.db.query(Document).filter(
            Document.id == document_id,
            Document.user_id == user.id
        ).first()

        if not document:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Document not found')

        document.status = DocumentStatus.PROCESSING
        document.updated_at = datetime.utcnow()
        self.db.commit()

        try:
            file_bytes = self._download_file_from_s3(document.file_path)
            processing_result = self.preprocessor.process_document(
                file_bytes=file_bytes,
                filename=document.filename,
                mime_type=document.mime_type
            )

            self.db.query(DocumentChunk).filter(
                DocumentChunk.document_id == document_id
            ).delete()

            for chunk_data in processing_result['chunks']:
                chunk = DocumentChunk(
                    document_id=document_id,
                    chunk_index=chunk_data['chunk_index'],
                    content = chunk_data['content'],
                    content_type='text',
                    page_number=processing_result['ocr_metadata'].get('pages', [{}])[0].get('page_number') if processing_result['ocr_metadata'].get('pages') else None,
                    metadata={
                        'start_char': chunk_data['start_char'],
                        'end_char': chunk_data['end_char'],
                        'word_count': chunk_data.get('word_count', 0)
                    }
                )
                self.db.add(chunk)

            document.status = DocumentStatus.PROCESSED
            document.processed_at = datetime.utcnow()
            document.document_metadata = {
                'ocr_confidence': processing_result['ocr_metadata'].get('average_confidence', 0),
                'total_chunks': processing_result['total_chunks'],
                'total_words': processing_result['total_words'],
                'total_characters': processing_result['total_characters']
            }
            document.updated_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(document)

            return document

        except Exception as e:
            document.status = DocumentStatus.FAILED
            document.document_metadata = {
                'error': str(e)
            }
            document.updated_at = datetime.utcnow()
            self.db.commit()

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Document processing failed: {e}"
            )

    def _download_file_from_s3(self, object_key: str) -> bytes:
        try:
            response = self.storage_service.client.get_object(Bucket=self.storage_service.bucket, Key=object_key)
            return response['Body'].read()

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to download file from storage: {e}"
            )

    def get_document_text(self, document_id: UUID, user: User) -> dict:
        
        document = self.db.query(Document).filter(
            Document.id == document_id,
            Document.user_id == user.id
        ).first()

        if not document:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found"
            )

        if document.status != DocumentStatus.PROCESSED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Document has not been processed yet"
            )

        chunks = self.db.query(DocumentChunk).filter(
            DocumentChunk.document_id == document_id
        ).order_by(DocumentChunk.chunk_index).all()

        full_text = '\n\n'.join([chunk.content for chunk in chunks])
        return {
            'document_id': str(document_id),
            'text': full_text,
            'total_chunks': len(chunks),
            'metadata': document.document_metadata
        }