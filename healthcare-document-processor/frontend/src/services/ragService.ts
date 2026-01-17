import api from './api';
import type {
  SearchQuery,
  SearchResponse,
  IndexDocumentResponse,
  DeleteIndexResponse,
  ReindexChunkResponse,
} from '../types/rag.types';

export const ragService = {
  /**
   * Index a document for search (create embeddings and add to vector DB)
   * @param documentId - The ID of the document to index
   * @returns Promise with indexing response
   */
  async indexDocument(documentId: string): Promise<IndexDocumentResponse> {
    const response = await api.post<IndexDocumentResponse>(
      `/rag/index/${documentId}`
    );
    return response.data;
  },

  /**
   * Search documents using RAG (POST method)
   * @param query - Search query parameters
   * @returns Promise with search results
   */
  async searchDocuments(query: SearchQuery): Promise<SearchResponse> {
    const response = await api.post<SearchResponse>('/rag/search', query);
    return response.data;
  },

  /**
   * Search documents using RAG (GET method)
   * @param query - Search query string
   * @param nResults - Number of results to return
   * @param documentType - Optional document type filter
   * @param documentId - Optional document ID filter
   * @returns Promise with search results
   */
  async searchDocumentsGet(
    query: string,
    nResults: number = 10,
    documentType?: string,
    documentId?: string
  ): Promise<SearchResponse> {
    const params: Record<string, any> = {
      q: query,
      n_results: nResults,
    };

    if (documentType) {
      params.document_type = documentType;
    }

    if (documentId) {
      params.document_id = documentId;
    }

    const response = await api.get<SearchResponse>('/rag/search', { params });
    return response.data;
  },

  /**
   * Delete document from search index
   * @param documentId - The ID of the document to remove from index
   * @returns Promise with deletion response
   */
  async deleteDocumentIndex(
    documentId: string
  ): Promise<DeleteIndexResponse> {
    const response = await api.delete<DeleteIndexResponse>(
      `/rag/index/${documentId}`
    );
    return response.data;
  },

  /**
   * Reindex a specific chunk
   * @param chunkId - The ID of the chunk to reindex
   * @returns Promise with reindexing response
   */
  async reindexChunk(chunkId: string): Promise<ReindexChunkResponse> {
    const response = await api.post<ReindexChunkResponse>(
      `/rag/chunk/${chunkId}/reindex`
    );
    return response.data;
  },
};
