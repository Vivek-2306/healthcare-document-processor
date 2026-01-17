import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from '@mui/material';
import {
  ViewModule,
  ViewList,
  CloudUpload,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DocumentUpload, DocumentCard } from '../components/documents';
import { SearchFilter, EmptyState, Loading, ConfirmationDialog } from '../components/common';
import { documentService } from '../services/documentService';
import type { Document, DocumentType } from '../types/document.types';

const Documents: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchValue, setSearchValue] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentService.listDocuments(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => documentService.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setDeleteDialogOpen(false);
      setSelectedDocument(null);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, documentType, description, tags }: {
      file: File;
      documentType: DocumentType;
      description?: string;
      tags?: string[];
    }) => {
      return documentService.uploadDocument({ file, documentType, description, tags });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setUploadDialogOpen(false);
    },
  });

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchValue.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchValue.toLowerCase());
    return matchesSearch;
  });

  const handleView = (document: Document) => {
    navigate(`/documents/${document.id}`);
  };

  const handleEdit = (document: Document) => {
    navigate(`/documents/${document.id}/edit`);
  };

  const handleDelete = (document: Document) => {
    setSelectedDocument(document);
    setDeleteDialogOpen(true);
  };

  const handleDownload = async (document: Document) => {
    try {
      const { url } = await documentService.getDownloadUrl(document.id);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedDocument) {
      deleteMutation.mutate(selectedDocument.id);
    }
  };

  const handleUpload = async (file: File, documentType: DocumentType, description?: string, tags?: string[]) => {
    await uploadMutation.mutateAsync({ file, documentType, description, tags });
  };

  if (isLoading) {
    return <Loading fullScreen message="Loading documents..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ width: '100%', py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Documents
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and organize your healthcare documents
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="grid">
                <ViewModule />
              </ToggleButton>
              <ToggleButton value="list">
                <ViewList />
              </ToggleButton>
            </ToggleButtonGroup>
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={() => setUploadDialogOpen(true)}
            >
              Upload
            </Button>
          </Stack>
        </Stack>
      </Box>

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Search documents..."
      />

      {uploadDialogOpen && (
        <Box sx={{ mb: 3 }}>
          <DocumentUpload
            onUpload={handleUpload}
            isUploading={uploadMutation.isPending}
          />
        </Box>
      )}

      {filteredDocuments.length === 0 ? (
        <EmptyState
          variant="folder"
          title="No documents found"
          description={searchValue ? "Try adjusting your search terms" : "Upload your first document to get started"}
          actionLabel="Upload Document"
          onAction={() => setUploadDialogOpen(true)}
        />
      ) : (
        <Grid container spacing={3}>
          {filteredDocuments.map((document) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={document.id}>
              <DocumentCard
                document={document}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDownload={handleDownload}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${selectedDocument?.filename}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        severity="error"
        loading={deleteMutation.isPending}
      />
    </Container>
  );
};

export default Documents;
