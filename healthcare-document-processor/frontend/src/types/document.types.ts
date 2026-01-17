export enum DocumentType {
  MEDICAL_RECORD = 'medical_record',
  LAB_RESULT = 'lab_result',
  IMAGING = 'imaging',
  PRESCRIPTION = 'prescription',
  INSURANCE = 'insurance',
  IDENTIFICATION = 'identification',
  OTHER = 'other',
}

export enum DocumentStatus {
  UPLOADED = 'uploaded',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  FAILED = 'failed',
  ARCHIVED = 'archived',
}

export interface Document {
  id: string;
  filename: string;
  original_filename?: string;
  document_type: DocumentType;
  status: DocumentStatus;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  description?: string;
  tags?: string[];
  created_at: string;
  updated_at?: string;
  processed_at?: string;
  document_metadata?: Record<string, any>;
}

export interface DocumentUploadData {
  file: File;
  document_type: DocumentType;
  description?: string;
  tags?: string[];
}

export interface DocumentMetadataUpdate {
  description?: string;
  tags?: string[];
  document_type?: DocumentType;
  status?: DocumentStatus;
}

export interface DocumentDownloadResponse {
  url: string;
  expires_in: number;
}

export interface DocumentListParams {
  skip?: number;
  limit?: number;
  search?: string;
  document_type?: DocumentType;
  status?: DocumentStatus;
  sortBy?: 'created_at' | 'filename' | 'document_type' | 'status';
  sortOrder?: 'asc' | 'desc';
}
