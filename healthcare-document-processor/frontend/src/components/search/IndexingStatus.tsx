import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  IconButton,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Refresh,
  Delete,
  CloudUpload,
} from '@mui/icons-material';
import { format } from 'date-fns';
import type { Document } from '../../types/document.types';

interface IndexingStatusProps {
  document: Document;
  isIndexed: boolean;
  isIndexing?: boolean;
  onIndex?: () => void;
  onReindex?: () => void;
  onDeleteIndex?: () => void;
  chunkCount?: number;
}

const IndexingStatus: React.FC<IndexingStatusProps> = ({
  document,
  isIndexed,
  isIndexing = false,
  onIndex,
  onReindex,
  onDeleteIndex,
  chunkCount,
}) => {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6">Search Index Status</Typography>
            <Chip
              label={isIndexed ? 'Indexed' : 'Not Indexed'}
              color={isIndexed ? 'success' : 'default'}
              icon={isIndexed ? <CheckCircle /> : undefined}
            />
          </Box>

          {isIndexing && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Indexing document...
              </Typography>
              <LinearProgress sx={{ mt: 1 }} />
            </Box>
          )}

          {isIndexed && chunkCount !== undefined && (
            <Typography variant="body2" color="text.secondary">
              {chunkCount} chunk{chunkCount !== 1 ? 's' : ''} indexed
            </Typography>
          )}

          {document.status === 'processed' && !isIndexed && (
            <Alert severity="info">
              This document is processed but not yet indexed for search. Index it
              to enable semantic search.
            </Alert>
          )}

          {document.status !== 'processed' && (
            <Alert severity="warning">
              Document must be processed before it can be indexed for search.
            </Alert>
          )}

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {!isIndexed && document.status === 'processed' && onIndex && (
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={onIndex}
                disabled={isIndexing}
              >
                Index Document
              </Button>
            )}

            {isIndexed && onReindex && (
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={onReindex}
                disabled={isIndexing}
              >
                Reindex
              </Button>
            )}

            {isIndexed && onDeleteIndex && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={onDeleteIndex}
                disabled={isIndexing}
              >
                Remove from Index
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default IndexingStatus;
