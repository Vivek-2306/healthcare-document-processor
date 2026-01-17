import { DocumentType, DocumentStatus } from './document.types';

export interface SearchQuery {
  query: string;
  n_results?: number;
  document_type?: DocumentType;
  document_id?: string;
}

export interface SearchResultDocument {
  id: string;
  filename: string;
  document_type: DocumentType;
  status: DocumentStatus;
}

export interface SearchResult {
  chunk_id: string;
  document_id: string;
  content: string;
  similarity_score: number;
  chunk_index: number;
  page_number?: number;
  document: SearchResultDocument;
  metadata: Record<string, any>;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  total_results: number;
}

export interface IndexDocumentResponse {
  document_id: string;
  chunk_indexed: number;
  status: string;
}

export interface DeleteIndexResponse {
  message: string;
  document_id: string;
}

export interface ReindexChunkResponse {
  chunk_id: string;
  status: string;
}

export interface SearchFilters {
  document_type?: DocumentType;
  document_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface SearchSortOption {
  field: 'similarity_score' | 'chunk_index' | 'page_number';
  order: 'asc' | 'desc';
}
