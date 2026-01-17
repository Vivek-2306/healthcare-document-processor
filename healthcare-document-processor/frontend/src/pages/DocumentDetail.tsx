import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  Stack,
  Divider,
  Grid,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Edit,
  Delete,
  PictureAsPdf,
  Image as ImageIcon,
  InsertDriveFile,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Loading, ConfirmationDialog } from '../components/common';
import { Breadcrumbs } from '../components/layout';
import { documentService } from '../services/documentService';
import { DocumentStatus } from '../types/document.types';

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: document, isLoading } = useQuery({
    queryKey: ['document', id],
    queryFn: () => documentService.getDocument(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => documentService.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      navigate('/documents');
    },
  });

  const handleDownload = async () => {
    if (document) {
      try {
        const { url } = await documentService.getDownloadUrl(document.id);
        window.open(url, '_blank');
      } catch (error) {
        console.error('Download error:', error);
      }
    }
  };

  const handleDelete = () => {
    if (document) {
      deleteMutation.mutate(document.id);
    }
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.PROCESSED:
        return 'success';
      case DocumentStatus.PROCESSING:
        return 'info';
      case DocumentStatus.FAILED:
        return 'error';
      case DocumentStatus.ARCHIVED:
        return 'default';
      default:
        return 'warning';
    }
  };

  const getFileIcon = (mimeType?: string) => {
    if (mimeType?.includes('pdf')) return <PictureAsPdf />;
    if (mimeType?.startsWith('image/')) return <ImageIcon />;
    return <InsertDriveFile />;
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return <Loading fullScreen message="Loading document..." />;
  }

  if (!document) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h6">Document not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs />
      
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/documents')}
          sx={{ mb: 2 }}
        >
          Back to Documents
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.light',
                    width: 64,
                    height: 64,
                  }}
                >
                  {getFileIcon(document.mime_type)}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {document.filename}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    <Chip
                      label={document.document_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      size="small"
                    />
                    <Chip
                      label={document.status}
                      size="small"
                      color={getStatusColor(document.status)}
                    />
                  </Stack>
                </Box>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleDownload}
                >
                  Download
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => navigate(`/documents/${document.id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
              </Stack>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Document Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    File Size
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formatFileSize(document.file_size)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Uploaded
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {format(new Date(document.created_at), 'PPpp')}
                  </Typography>
                </Grid>
                {document.processed_at && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Processed
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {format(new Date(document.processed_at), 'PPpp')}
                    </Typography>
                  </Grid>
                )}
                {document.mime_type && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      MIME Type
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {document.mime_type}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              {document.description && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {document.description}
                  </Typography>
                </Box>
              )}

              {document.tags && document.tags.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Tags
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {document.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>

            {document.status === DocumentStatus.PROCESSING && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Processing Status
                </Typography>
                <LinearProgress />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 80 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Actions
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Download />}
                onClick={handleDownload}
              >
                Download Document
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Edit />}
                onClick={() => navigate(`/documents/${document.id}/edit`)}
              >
                Edit Metadata
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${document.filename}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        severity="error"
        loading={deleteMutation.isPending}
      />
    </Container>
  );
};

export default DocumentDetail;
