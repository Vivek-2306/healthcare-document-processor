import api from './api';
import type {
  ProcessDocumentResponse,
  DocumentTextResponse,
  DocumentChunksResponse,
} from '../types/processing.types';

export const processingService = {
  /**
   * Process a document (trigger OCR and chunking)
   * @param documentId - The ID of the document to process
   * @returns Promise with processing response
   */
  async processDocument(documentId: string): Promise<ProcessDocumentResponse> {
    const response = await api.post<ProcessDocumentResponse>(
      `/processing/${documentId}/process`
    );
    return response.data;
  },

  /**
   * Get extracted text from a processed document
   * @param documentId - The ID of the document
   * @returns Promise with document text response
   */
  async getDocumentText(documentId: string): Promise<DocumentTextResponse> {
    const response = await api.get<DocumentTextResponse>(
      `/processing/${documentId}/text`
    );
    return response.data;
  },

  /**
   * Get document chunks from a processed document
   * @param documentId - The ID of the document
   * @returns Promise with document chunks response
   */
  async getDocumentChunks(
    documentId: string
  ): Promise<DocumentChunksResponse> {
    const response = await api.get<DocumentChunksResponse>(
      `/processing/${documentId}/chunks`
    );
    return response.data;
  },
};
