from typing import List, Optional
from unittest import result
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, query
from pydantic import BaseModel

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models import User
from app.services.rag_service import RAGService
from app.services.embedding_service import EmbeddingService
from app.services.vector_db_service import get_vector_db_service

router = APIRouter(prefix="/rag", tags=["rag-search"])

class SearchQuery(BaseModel):
    query: str
    n_results: int = 10
    document_type: Optional[str] = None
    document_id: Optional[UUID] = None

class SearchResponse(BaseModel):
    query: str
    results: List[dict]
    total_results: int

def get_rag_service(db: Session = Depends(get_db)) -> RAGService:
    embedding_service = EmbeddingService()
    vector_db_service = get_vector_db_service()
    return RAGService(
        db=db,
        embedding_service=embedding_service,
        vector_db_service=vector_db_service
    )

@router.post("/index/{document_id}", status_code=status.HTTP_200_OK)
async def index_document(
    document_id: UUID,
    current_user: User = Depends(get_current_active_user),
    service: RAGService = Depends(get_rag_service)
):
    try: 
        result = service.index_document_chunks(document_id, current_user)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error indexing document: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error indexing document: {str(e)}"
        )

@router.post("/search", response_model=SearchResponse)
async def search_document(
    search_query: SearchQuery,
    current_user: User = Depends(get_current_active_user),
    service: RAGService = Depends(get_rag_service)
): 
    try:
        results = service.search_documents(
            query=query,
            user=current_user,
            n_results=search_query.n_results,
            document_type=search_query.document_type,
            document_id=search_query.document_id
        )

        return SearchQuery(
            query=search_query.query,
            results=results,
            total_results=len(results)
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error searching documents: {str(e)}"
        )

@router.get("/search", response_model=SearchResponse)
async def search_document_get(
    q: str = Query(..., description="Search query"),
    n_results: int = Query(10, ge=1, le=100, description="Number of results"),
    document_type: Optional[str] = Query(None, descriptioni="Filter by document type"),
    document_id: Optional[UUID] = Query(None, description="Filter by document ID"),
    current_user: User = Depends(get_current_active_user),
    service: RAGService = Depends(get_rag_service)
):
    try:
        results = service.search_documents(
            query=q,
            user=current_user,
            n_results=n_results,
            document_type=document_type,
            document_id=document_id
        )
        return SearchResponse(
            query=q,
            results=results,
            total_results=len(results)
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error searching documents: {str(e)}"
        )

@router.delete("/index/{document_id}", status_code=status.HTTP_200_OK)
async def delete_document_index(
    document_id: UUID,
    current_user: User = Depends(get_current_active_user),
    service: RAGService = Depends(get_rag_service)
):
    try:
        service.delete_document_index(document_id=document_id, user=current_user)
        return {"message": "Document removed from index", "document_id": str(document_id)}

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error removing documents from index: {str(e)}"
        )

@router.post("/chunk/{chunk_id}/reindex", status_code=status.HTTP_200_OK)
async def reindex_chunk(
    chunk_id: UUID,
    current_user: User = Depends(get_current_active_user),
    service: RAGService = Depends(get_rag_service)
):
    try:
        result = service.update_chunk_embedding(chunk_id, current_user)
        return result

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error reindexing chunk: {str(e)}"
        )