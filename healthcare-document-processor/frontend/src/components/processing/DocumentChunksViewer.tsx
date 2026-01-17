import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Chip,
  Pagination as MuiPagination,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  Search,
  Clear,
  ExpandMore,
  ExpandLess,
  Download,
  ContentCopy,
} from '@mui/icons-material';
import type { DocumentChunksResponse, DocumentChunk } from '../../types/processing.types';

interface DocumentChunksViewerProps {
  chunksData: DocumentChunksResponse;
  itemsPerPage?: number;
  onChunkSelect?: (chunk: DocumentChunk) => void;
}

const DocumentChunksViewer: React.FC<DocumentChunksViewerProps> = ({
  chunksData,
  itemsPerPage = 10,
  onChunkSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedChunk, setSelectedChunk] = useState<DocumentChunk | null>(null);
  const [expandedChunks, setExpandedChunks] = useState<Set<number>>(new Set());

  const filteredChunks = useMemo(() => {
    if (!searchQuery.trim()) {
      return chunksData.chunks;
    }

    const query = searchQuery.toLowerCase();
    return chunksData.chunks.filter(
      (chunk) =>
        chunk.content.toLowerCase().includes(query) ||
        chunk.chunk_index.toString().includes(query)
    );
  }, [chunksData.chunks, searchQuery]);

  const paginatedChunks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredChunks.slice(startIndex, endIndex);
  }, [filteredChunks, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredChunks.length / itemsPerPage);

  const handleChunkClick = (chunk: DocumentChunk) => {
    if (onChunkSelect) {
      onChunkSelect(chunk);
    } else {
      setSelectedChunk(chunk);
    }
  };

  const toggleChunkExpansion = (chunkIndex: number) => {
    const newExpanded = new Set(expandedChunks);
    if (newExpanded.has(chunkIndex)) {
      newExpanded.delete(chunkIndex);
    } else {
      newExpanded.add(chunkIndex);
    }
    setExpandedChunks(newExpanded);
  };

  const handleCopyChunk = (chunk: DocumentChunk) => {
    navigator.clipboard.writeText(chunk.content);
  };

  const handleExportChunks = () => {
    const content = chunksData.chunks
      .map(
        (chunk) =>
          `=== Chunk ${chunk.chunk_index}${chunk.page_number ? ` (Page ${chunk.page_number})` : ''} ===\n${chunk.content}\n`
      )
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-${chunksData.document_id}-chunks.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="h6">Document Chunks</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={`${chunksData.total_chunks} total chunks`}
                size="small"
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<Download />}
                onClick={handleExportChunks}
              >
                Export All
              </Button>
            </Stack>
          </Box>

          <TextField
            fullWidth
            placeholder="Search chunks..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                    edge="end"
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {searchQuery && (
            <Typography variant="body2" color="text.secondary">
              Found {filteredChunks.length} chunk{filteredChunks.length !== 1 ? 's' : ''} matching your search
            </Typography>
          )}

          <Stack spacing={2}>
            {paginatedChunks.map((chunk) => {
              const isExpanded = expandedChunks.has(chunk.chunk_index);
              const displayText = isExpanded
                ? chunk.content
                : truncateText(chunk.content);

              return (
                <Paper
                  key={chunk.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    cursor: onChunkSelect ? 'pointer' : 'default',
                    '&:hover': onChunkSelect
                      ? {
                        backgroundColor: 'action.hover',
                      }
                      : {},
                  }}
                  onClick={() => handleChunkClick(chunk)}
                >
                  <Stack spacing={1}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={`Chunk ${chunk.chunk_index}`}
                          size="small"
                          color="primary"
                        />
                        {chunk.page_number && (
                          <Chip
                            label={`Page ${chunk.page_number}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleChunkExpansion(chunk.chunk_index);
                          }}
                        >
                          {isExpanded ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyChunk(chunk);
                          }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        lineHeight: 1.6,
                      }}
                    >
                      {displayText}
                    </Typography>

                    {chunk.metadata && Object.keys(chunk.metadata).length > 0 && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Metadata:
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          {Object.entries(chunk.metadata).map(([key, value]) => (
                            <Chip
                              key={key}
                              label={`${key}: ${value}`}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              );
            })}
          </Stack>

          {totalPages > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 2,
              }}
            >
              <MuiPagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
              />
            </Box>
          )}

          {paginatedChunks.length === 0 && (
            <Typography variant="body2" color="text.secondary" align="center">
              {searchQuery
                ? 'No chunks found matching your search'
                : 'No chunks available'}
            </Typography>
          )}
        </Stack>
      </CardContent>

      <Dialog
        open={selectedChunk !== null}
        onClose={() => setSelectedChunk(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedChunk && (
          <>
            <DialogTitle>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={`Chunk ${selectedChunk.chunk_index}`}
                  color="primary"
                />
                {selectedChunk.page_number && (
                  <Chip
                    label={`Page ${selectedChunk.page_number}`}
                    variant="outlined"
                  />
                )}
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                }}
              >
                {selectedChunk.content}
              </Typography>
              {selectedChunk.metadata &&
                Object.keys(selectedChunk.metadata).length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" gutterBottom>
                      Metadata:
                    </Typography>
                    <Box>
                      {Object.entries(selectedChunk.metadata).map(
                        ([key, value]) => (
                          <Chip
                            key={key}
                            label={`${key}: ${value}`}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        )
                      )}
                    </Box>
                  </>
                )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => handleCopyChunk(selectedChunk)}
                startIcon={<ContentCopy />}
              >
                Copy
              </Button>
              <Button onClick={() => setSelectedChunk(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Card>
  );
};

export default DocumentChunksViewer;
