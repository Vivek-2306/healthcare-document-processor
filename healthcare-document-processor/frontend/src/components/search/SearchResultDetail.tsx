import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Chip,
  Divider,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Close,
  OpenInNew,
  ContentCopy,
  Download,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { SearchResult } from '../../types/rag.types';

interface SearchResultDetailProps {
  result: SearchResult | null;
  open: boolean;
  onClose: () => void;
  query?: string;
}

const SearchResultDetail: React.FC<SearchResultDetailProps> = ({
  result,
  open,
  onClose,
  query = '',
}) => {
  const navigate = useNavigate();

  if (!result) return null;

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <mark
            key={index}
            style={{ backgroundColor: '#ffeb3b', padding: '2px 0' }}
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.content);
  };

  const handleViewDocument = () => {
    navigate(`/documents/${result.document_id}`);
    onClose();
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '60vh' },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">Search Result Details</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Chip
                label={`${(result.similarity_score * 100).toFixed(1)}% match`}
                color={getSimilarityColor(result.similarity_score)}
                size="small"
              />
              <Chip
                label={`Chunk ${result.chunk_index}`}
                size="small"
                variant="outlined"
              />
              {result.page_number && (
                <Chip
                  label={`Page ${result.page_number}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Source Document
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {result.document.filename}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {result.document.document_type.replace('_', ' ')}
              </Typography>
            </Paper>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Content
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                backgroundColor: 'background.default',
                maxHeight: 400,
                overflow: 'auto',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                }}
              >
                {highlightText(result.content, query)}
              </Typography>
            </Paper>
          </Box>

          {result.metadata && Object.keys(result.metadata).length > 0 && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Metadata
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {Object.entries(result.metadata).map(([key, value]) => (
                    <Chip
                      key={key}
                      label={`${key}: ${value}`}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCopy} startIcon={<ContentCopy />}>
          Copy Text
        </Button>
        <Button
          variant="contained"
          onClick={handleViewDocument}
          startIcon={<OpenInNew />}
        >
          View Document
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchResultDetail;
