export enum ProcessingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface ProcessDocumentResponse {
  message: string;
  document_id: string;
  status: string;
}

export interface DocumentTextResponse {
  document_id: string;
  text: string;
  confidence_score?: number;
  page_count?: number;
  extracted_at?: string;
}

export interface DocumentChunk {
  id: string;
  chunk_index: number;
  content: string;
  page_number?: number;
  metadata?: Record<string, any>;
}

export interface DocumentChunksResponse {
  document_id: string;
  total_chunks: number;
  chunks: DocumentChunk[];
}

export interface ProcessingStage {
  name: string;
  status: ProcessingStatus;
  progress?: number;
  message?: string;
  error?: string;
}
