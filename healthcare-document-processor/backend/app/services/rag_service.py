from typing import List, Dict, Any, Optional
from uuid import UUID
from sqlalchemy.orm import Session
import logging

from app.models import DocumentChunk, Document, User
from app.services.embedding_service import EmbeddingService
from app.services.vector_db_service import get_vector_db_service, VectorDBService

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(
        self,
        db: Session,
        embedding_service: Optional[EmbeddingService] = None,
        vector_db_service: Optional[VectorDBService] = None
    ):
        self.db = db
        self.embedding_service = embedding_service or EmbeddingService()
        self.vector_db = vector_db_service or get_vector_db_service()

    
    def index_document_chunks(self, document_id: UUID, user: User) -> Dict[str, Any]:
        document = self.db.query(Document).filter(
            Document.id == document_id,
            Document.user_id == user.id
        ).first()

        if not document:
            raise ValueError("Document not found or access denied")

        chunks = self.db.query(DocumentChunk).filter(
            DocumentChunk.document_id == document_id
        ).order_by(DocumentChunk.chunk_index).all()

        if not chunks:
            raise ValueError("No chunks found for document")

        texts = [chunk.content for chunk in chunks]
        embeddings = self.embedding_service.generate_embeddings_batch(texts)
        ids = [str(chunk.id) for chunk in chunks]
        documents = [chunk.content for chunk in chunks]
        metadata = [
            {
                'document_id': str(document_id),
                'chunk_id': str(chunk.id),
                'chunk_index': chunk.chunk_index,
                'page_number': chunk.page_number,
                'user_id': str(user.id),
                'document_type': document.document_type.value if document.document_type else None,
                'filename': document.filename
            }
            for chunk in chunks
        ]

        self.vector_db.add_embeddings(
            embeddings=embeddings,
            documents=documents,
            metadatas=metadata,
            ids=ids
        )

        for chunk, embedding_id in zip(chunks, ids):
            chunk.embedding_id = embedding_id
            chunk.embedding_model = self.embedding_service.model

        self.db.commit()

        return {
            'document_id': str(document.id),
            'chunk_indexed': len(chunks),
            'status': 'success'
        }

    def search_documents(
        self,
        query: str, 
        user: User,
        n_results: int = 10,
        document_type: Optional[str] = None,
        document_id: Optional[UUID] = None
    ) -> List[Dict[str, Any]]:

        query_embedding = self.embedding_service.generate_embedding(query)
        filter_dict = {'user_id': str(user.id)}

        if document_type:
            filter_dict['document_type'] = document_type
        
        if document_id:
            filter_dict['document_id'] = str(document_id)

        results = self.vector_db.search(
            query_embedding=query_embedding,
            n_results=n_results,
            filter=filter_dict
        )

        enriched_results = []
        for result in results:
            chunk_id = UUID(result['metadata'].get('chunk_id'))
            chunk = self.db.query(DocumentChunk).filter(
                DocumentChunk.id == chunk_id
            ).first()

            if chunk:
                document = self.db.query(Document).filter(
                    Document.id == chunk.document_id
                ).first()

                enriched_results.append({
                    'chunk_id': str(chunk.id),
                    'document_id': str(chunk.document_id),
                    'content': result['document'],
                    'similarity_score': 1 - result['distance'],
                    'chunk_index': chunk.chunk_index,
                    'page_number': chunk.page_number,
                    'document': {
                        'id': str(document.id) if document else None,
                        'filename': document.filename if document else None,
                        'document_type': document.document_type.value if document and document.document_type else None,
                        'status': document.status.value if document else None
                    },
                    'metadata': result['metadata']
                })

        return enriched_results

    def delete_document_index(self, document_id: UUID, user: User) -> None:
        document = self.db.query(Document).filter(
            Document.id == document_id,
            Document.user_id == user.id
        ).first()

        if not document:
            raise ValueError("Document not found or access denied")

        chunks = self.db.query(DocumentChunk).filter(
            DocumentChunk.document_id == document_id,
            DocumentChunk.embedding_id.isnot(None)
        ).all()

        if chunks:
            embedding_ids = [chunk.embedding_id for chunk in chunks]
            self.vector_db.delete_embeddings(ids=embedding_ids)

            for chunk in chunks:
                chunk.embedding_id = None
                chunk.embedding_model = None

            self.db.commit()

    def update_chunk_embedding(
        self,
        chunk_id: UUID,
        user: User
    ) -> Dict[str, Any]:
        chunk = self.db.query(DocumentChunk).filter(
            Document.id == chunk.document_id,
            Document.user_id == user.id
        ).first()

        if not chunk:
            raise ValueError("Chunk not found")

        document = self.db.query(Document).filter(
            Document.id == chunk.document_id,
            Document.user_id == user.id
        ).first()

        if not document:
            raise ValueError("Access denied")

        embedding = self.embedding_service.generate_embedding(chunk.content)

        metadata = {
            'document_id': str(chunk.document_id),
            'chunk_id': str(chunk.id),
            'chunk_index': chunk.chunk_index,
            'page_number': chunk.page_number,
            'user_id': str(user.id),
            'document_type': document.document_type.value if document.document_type else None,
            'filename': document.filename
        }

        embedding_id = chunk.embedding_id or str(chunk.id)
        self.vector_db.update_embedding(
            id=embedding_id,
            embedding=embedding,
            document=chunk.content,
            metadata=metadata
        )

        chunk.embedding_id = embedding_id
        chunk.embedding_model = self.embedding_service.model
        self.db.commit()

        return {
            'chunk_id': str(chunk_id),
            'embedding_id': embedding_id,
            'status': 'updated'
        }