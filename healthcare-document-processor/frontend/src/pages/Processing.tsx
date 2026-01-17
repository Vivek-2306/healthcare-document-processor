import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Stack,
  Tabs,
  Tab,
  Alert,
  Breadcrumbs as MuiBreadcrumbs,
  Link,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loading } from '../components/common';
import { documentService } from '../services/documentService';
import { processingService } from '../services/processingService';
import ProcessingStatus from '../components/processing/ProcessingStatus';
import DocumentTextViewer from '../components/processing/DocumentTextViewer';
import DocumentChunksViewer from '../components/processing/DocumentChunksViewer';
import ProcessDocumentButton from '../components/processing/ProcessDocumentButton';
import { DocumentStatus } from '../types/document.types';
import { useToast } from '../hooks/useToast';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`processing-tabpanel-${index}`}
      aria-labelledby={`processing-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const Processing: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [tabValue, setTabValue] = useState(0);
  const [pollingInterval, setPollingInterval] = useState<number | false>(false);

  // Fetch document details
  const { data: document, isLoading: documentLoading } = useQuery({
    queryKey: ['document', id],
    queryFn: () => documentService.getDocument(id!),
    enabled: !!id,
    refetchInterval: pollingInterval,
  });

  // Fetch document text
  const {
    data: textData,
    isLoading: textLoading,
    error: textError,
  } = useQuery({
    queryKey: ['document-text', id],
    queryFn: () => processingService.getDocumentText(id!),
    enabled: !!id && document?.status === DocumentStatus.PROCESSED,
  });

  // Fetch document chunks
  const {
    data: chunksData,
    isLoading: chunksLoading,
    error: chunksError,
  } = useQuery({
    queryKey: ['document-chunks', id],
    queryFn: () => processingService.getDocumentChunks(id!),
    enabled: !!id && document?.status === DocumentStatus.PROCESSED,
  });

  // Process document mutation
  const processMutation = useMutation({
    mutationFn: (documentId: string) =>
      processingService.processDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document', id] });
      showToast('Document processing started', 'success');
      // Start polling for status updates
      setPollingInterval(3000); // Poll every 3 seconds
    },
    onError: (error: any) => {
      showToast(
        error?.response?.data?.detail || 'Failed to start processing',
        'error'
      );
    },
  });

  // Poll for status updates when processing
  useEffect(() => {
    if (document?.status === DocumentStatus.PROCESSING) {
      setPollingInterval(3000);
    } else if (document?.status === DocumentStatus.PROCESSED) {
      setPollingInterval(false);
      // Invalidate text and chunks queries when processing completes
      queryClient.invalidateQueries({ queryKey: ['document-text', id] });
      queryClient.invalidateQueries({ queryKey: ['document-chunks', id] });
      showToast('Document processing completed', 'success');
    } else if (document?.status === DocumentStatus.FAILED) {
      setPollingInterval(false);
    }
  }, [document?.status, id, queryClient, showToast]);

  const handleProcess = async (documentId: string) => {
    await processMutation.mutateAsync(documentId);
  };

  const handleRetry = () => {
    if (id) {
      handleProcess(id);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (documentLoading) {
    return <Loading fullScreen message="Loading document..." />;
  }

  if (!document) {
    return (
      <Container>
        <Alert severity="error">Document not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <MuiBreadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/documents')}
          sx={{ cursor: 'pointer' }}
        >
          Documents
        </Link>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate(`/documents/${id}`)}
          sx={{ cursor: 'pointer' }}
        >
          {document.filename}
        </Link>
        <Typography variant="body2" color="text.primary">
          Processing
        </Typography>
      </MuiBreadcrumbs>
      <Box sx={{ mb: 4 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <ArrowBack
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate(`/documents/${id}`)}
            />
            <Typography variant="h4">Document Processing</Typography>
          </Stack>
          <ProcessDocumentButton
            documentId={document.id}
            documentStatus={document.status}
            onProcess={handleProcess}
          />
        </Stack>
      </Box>

      <Stack spacing={3}>
        <Box>
          <ProcessingStatus
            status={document.status}
            onRetry={handleRetry}
            estimatedTimeRemaining={
              document.status === DocumentStatus.PROCESSING ? 60 : undefined
            }
          />
        </Box>

        {document.status === DocumentStatus.PROCESSED && (
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Extracted Text" />
                <Tab label="Document Chunks" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              {textLoading ? (
                <Loading message="Loading extracted text..." />
              ) : textError ? (
                <Alert severity="error">
                  Failed to load extracted text. Please try processing the
                  document again.
                </Alert>
              ) : textData ? (
                <DocumentTextViewer textData={textData} />
              ) : (
                <Alert severity="info">
                  No extracted text available. Please process the document
                  first.
                </Alert>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {chunksLoading ? (
                <Loading message="Loading document chunks..." />
              ) : chunksError ? (
                <Alert severity="error">
                  Failed to load document chunks. Please try processing the
                  document again.
                </Alert>
              ) : chunksData ? (
                <DocumentChunksViewer chunksData={chunksData} />
              ) : (
                <Alert severity="info">
                  No document chunks available. Please process the document
                  first.
                </Alert>
              )}
            </TabPanel>
          </Box>
        )}
      </Stack>
    </Container>
  );
};

export default Processing;
