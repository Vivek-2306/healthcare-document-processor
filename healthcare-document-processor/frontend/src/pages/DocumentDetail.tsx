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
  IconButton,
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

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: { xs: 3, md: 4 }, mb: 4, borderRadius: 4 }}>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 3,
              mb: 4
            }}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Avatar
                  sx={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    width: { xs: 56, md: 72 },
                    height: { xs: 56, md: 72 },
                    boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)',
                  }}
                >
                  {React.cloneElement(getFileIcon(document.mime_type) as React.ReactElement, { sx: { fontSize: { xs: 28, md: 36 } } })}
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.5px', fontFamily: '"Poppins", sans-serif' }}>
                    {document.filename}
                  </Typography>
                  <Stack direction="row" spacing={1.5} flexWrap="wrap" gap={1}>
                    <Chip
                      label={document.document_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      size="small"
                      sx={{ fontWeight: 600, bgcolor: 'rgba(0,0,0,0.05)' }}
                    />
                    <Chip
                      label={document.status}
                      size="small"
                      color={getStatusColor(document.status)}
                      sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem' }}
                    />
                  </Stack>
                </Box>
              </Box>
              <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                <IconButton
                  onClick={handleDownload}
                  sx={{ bgcolor: 'rgba(79, 70, 229, 0.05)', color: 'primary.main', '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.1)' } }}
                >
                  <Download />
                </IconButton>
                <IconButton
                  onClick={() => navigate(`/documents/${document.id}/edit`)}
                  sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)', color: 'text.secondary', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.1)' } }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{ bgcolor: 'rgba(239, 68, 68, 0.05)', color: 'error.main', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                >
                  <Delete />
                </IconButton>
              </Stack>
            </Box>

            <Divider sx={{ my: 4, opacity: 0.6 }} />

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <InsertDriveFile sx={{ color: 'primary.main', fontSize: 20 }} />
                Document Metadata
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', mb: 0.5, display: 'block' }}>
                      File Size
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {formatFileSize(document.file_size)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', mb: 0.5, display: 'block' }}>
                      Upload Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {format(new Date(document.created_at), 'MMM dd, yyyy • HH:mm')}
                    </Typography>
                  </Box>
                </Grid>
                {document.processed_at && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', mb: 0.5, display: 'block' }}>
                        Processing Date
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {format(new Date(document.processed_at), 'MMM dd, yyyy • HH:mm')}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {document.mime_type && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', mb: 0.5, display: 'block' }}>
                        File Format
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {document.mime_type.split('/')[1].toUpperCase()}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {document.description && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, bgcolor: 'rgba(0,0,0,0.02)', p: 3, borderRadius: 3 }}>
                    {document.description}
                  </Typography>
                </Box>
              )}

              {document.tags && document.tags.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Tags & Labels
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {document.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        sx={{
                          fontWeight: 600,
                          bgcolor: 'rgba(79, 70, 229, 0.08)',
                          color: 'primary.main',
                          border: '1px solid rgba(79, 70, 229, 0.1)',
                          '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.12)' }
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>

            {document.status === DocumentStatus.PROCESSING && (
              <Box sx={{ mt: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    Processing in progress...
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    75%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: 'rgba(79, 70, 229, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                      background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                    }
                  }}
                />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Stack spacing={4} sx={{ position: 'sticky', top: 100 }}>
            <Paper sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Actions
              </Typography>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<Download />}
                  onClick={handleDownload}
                  sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
                >
                  Download File
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<Edit />}
                  onClick={() => navigate(`/documents/${document.id}/edit`)}
                  sx={{ py: 1.5, borderRadius: 3, fontWeight: 700, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                >
                  Edit Details
                </Button>
              </Stack>
            </Paper>

            <Paper
              sx={{
                p: 4,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Need Help?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                If you're having trouble viewing or processing this document, please contact our support team.
              </Typography>
              <Button color="primary" sx={{ fontWeight: 700, p: 0 }}>Contact Support</Button>
            </Paper>
          </Stack>
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
