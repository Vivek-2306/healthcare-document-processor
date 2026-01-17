from typing import List, Optional, Dict, Any
from uuid import UUID
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

class VectorDBService:

    def __init__(self) -> None:
        self.collection_name = "healthcare_documents"

    def create_collection(self, collection_name: str) -> None: 
        raise NotImplementedError

    def add_embeddings(
        self,
        embeddings: List[List[float]],
        documents: List[str],
        metadatas: List[Dict[str, Any]],
        ids: List[str]
    ) -> None:
        raise NotImplementedError

    def search(
        self,
        query_embedding: List[float],
        n_results: int = 10,
        filter: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        raise NotImplementedError

    def delete_embeddings(self, ids: List[str]) -> None:
        raise NotImplementedError

    def update_embedding(
        self,
        id: str, 
        embedding: List[float],
        document: str,
        metadata: Dict[str, Any]
    ) -> None:
        raise NotImplementedError

class ChromaDBService(VectorDBService):

    def __init__(self) -> None:
        super().__init__()
        try:
            import chromadb

            # Check if ChromaDB Cloud credentials are configured
            if settings.CHROMADB_API_KEY and settings.CHROMADB_TENANT:
                # Use ChromaDB Cloud Client
                logger.info("Initializing ChromaDB Cloud Client")
                self.client = chromadb.CloudClient(
                    api_key=settings.CHROMADB_API_KEY,
                    tenant=settings.CHROMADB_TENANT,
                    database=settings.CHROMADB_DATABASE or 'healthcare-documents'
                )
            else:
                # Fall back to local PersistentClient
                logger.info("ChromaDB Cloud not configured, using local PersistentClient")
                self.client = chromadb.PersistentClient(
                    path="./chroma_db"
                )
            
            # Get or create the collection
            self.collection = self.client.get_or_create_collection(
                name=self.collection_name
            )
            logger.info(f"ChromaDB collection '{self.collection_name}' ready")

        except ImportError:
            logger.error("ChromaDB is not installed. Install with: pip install chromadb")
            raise
        except Exception as e:
            logger.error(f"Error initializing ChromaDB: {e}")
            raise

    def add_embeddings(self, embeddings: List[List[float]], documents: List[str], metadatas: List[Dict[str, Any]], ids: List[str]) -> None:
        try:
            self.collection.add(
                embeddings=embeddings,
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
        except Exception as e:
            logger.error(f"Error adding embeddings to ChromaDB: {e}")
            raise

    def search(self, query_embedding: List[float], n_results: int = 10, filter: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        try:
            where = filter if filter else None
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results,
                where=where
            )
            
            formatted_results = []
            if results['ids'] and len(results['ids'][0]) > 0:
                for i in range(len(results['ids'][0])):
                    formatted_results.append({
                        'id': results['ids'][0][i],
                        'document': results['documents'][0][i] if results['documents'] else '',
                        'metadata': results['metadatas'][0][i] if results['metadatas'] else {},
                        'distance': results['distances'][0][i] if results['distances'] else 0.0
                    })

            return formatted_results
        except Exception as e:
            logger.error(f"Error searching in ChromaDB: {e}")
            raise

    def delete_embeddings(self, ids: List[str]) -> None:
        try:
            self.collection.delete(ids=ids)
        except Exception as e:
            logger.error(f"Error deleteing embeddings from ChromaDB: {e}")
            raise

    def update_embedding(self, id: str, embedding: List[float], document: str, metadata: Dict[str, Any]) -> None:
        try:
            self.collection.update(
                ids=[id],
                embeddings=[embedding],
                documents=[document],
                metadatas=[metadata]
            )
        except Exception as e:
            logger.error(f"Error updating embedding in ChromaDB: {e}")
            raise

def get_vector_db_service() -> VectorDBService:
    return ChromaDBService()