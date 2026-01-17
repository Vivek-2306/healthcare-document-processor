import api from './api';
import type {
  Document,
  DocumentUploadData,
  DocumentMetadataUpdate,
  DocumentDownloadResponse,
  DocumentListParams,
} from '../types/document.types';

export const documentService = {
  async uploadDocument(data: DocumentUploadData): Promise<Document> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('document_type', data.document_type);
    if (data.description) {
      formData.append('description', data.description);
    }
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach((tag) => {
        formData.append('tags', tag);
      });
    }

    const response = await api.post<Document>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async listDocuments(params: DocumentListParams = {}): Promise<Document[]> {
    const response = await api.get<Document[]>('/documents', {
      params: {
        skip: params.skip || 0,
        limit: params.limit || 50,
      },
    });
    return response.data;
  },

  async getDocument(id: string): Promise<Document> {
    const response = await api.get<Document>(`/documents/${id}`);
    return response.data;
  },

  async updateDocumentMetadata(
    id: string,
    metadata: DocumentMetadataUpdate
  ): Promise<Document> {
    const response = await api.patch<Document>(`/documents/${id}`, metadata);
    return response.data;
  },

  async deleteDocument(id: string): Promise<void> {
    await api.delete(`/documents/${id}`);
  },

  async getDownloadUrl(id: string): Promise<DocumentDownloadResponse> {
    const response = await api.get<DocumentDownloadResponse>(
      `/documents/${id}/download`
    );
    return response.data;
  },
};
