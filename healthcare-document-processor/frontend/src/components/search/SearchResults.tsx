import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Divider,
  Button,
} from '@mui/material';
import {
  Sort,
  ExpandMore,
  Visibility,
  Download,
  OpenInNew,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import type { SearchResult, SearchSortOption } from '../../types/rag.types';
import { Loading, EmptyState } from '../common';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading?: boolean;
  onResultClick?: (result: SearchResult) => void;
  onSortChange?: (sort: SearchSortOption) => void;
  currentSort?: SearchSortOption;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  query,
  isLoading = false,
  onResultClick,
  onSortChange,
  currentSort,
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedResults, setExpandedResults] = useState<Set<string>>(
    new Set()
  );

  const sortedResults = useMemo(() => {
    if (!currentSort) return results;

    return [...results].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (currentSort.field) {
        case 'similarity_score':
          aValue = a.similarity_score;
          bValue = b.similarity_score;
          break;
        case 'chunk_index':
          aValue = a.chunk_index;
          bValue = b.chunk_index;
          break;
        case 'page_number':
          aValue = a.page_number || 0;
          bValue = b.page_number || 0;
          break;
        default:
          return 0;
      }

      if (currentSort.order === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }, [results, currentSort]);

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

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const toggleExpanded = (chunkId: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(chunkId)) {
      newExpanded.delete(chunkId);
    } else {
      newExpanded.add(chunkId);
    }
    setExpandedResults(newExpanded);
  };

  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result);
    } else {
      navigate(`/documents/${result.document_id}`);
    }
  };

  const handleViewDocument = (result: SearchResult) => {
    navigate(`/documents/${result.document_id}`);
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };

  if (isLoading) {
    return <Loading message="Searching documents..." />;
  }

  if (results.length === 0 && !isLoading) {
    return (
      <EmptyState
        variant="search"
        title="No results found"
        description={`No documents match your search for "${query}"`}
      />
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6">
          {results.length} result{results.length !== 1 ? 's' : ''} found
        </Typography>
        {onSortChange && (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={
                currentSort
                  ? `${currentSort.field}_${currentSort.order}`
                  : 'similarity_score_desc'
              }
              onChange={(e) => {
                const [field, order] = e.target.value.split('_');
                onSortChange({ field: field as any, order: order as 'asc' | 'desc' });
              }}
              label="Sort by"
            >
              <MenuItem value="similarity_score_desc">
                Relevance (High to Low)
              </MenuItem>
              <MenuItem value="similarity_score_asc">
                Relevance (Low to High)
              </MenuItem>
              <MenuItem value="chunk_index_asc">Chunk Index (Ascending)</MenuItem>
              <MenuItem value="chunk_index_desc">Chunk Index (Descending)</MenuItem>
              <MenuItem value="page_number_asc">Page (Ascending)</MenuItem>
              <MenuItem value="page_number_desc">Page (Descending)</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>

      <Stack spacing={2}>
        {sortedResults.map((result) => {
          const isExpanded = expandedResults.has(result.chunk_id);
          const displayText = isExpanded
            ? result.content
            : truncateText(result.content, 200);

          return (
            <Card
              key={result.chunk_id}
              sx={{
                '&:hover': {
                  boxShadow: 4,
                },
                transition: 'box-shadow 0.3s',
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
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
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        {result.document.filename}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {result.document.document_type.replace('_', ' ')}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDocument(result)}
                        title="View document"
                      >
                        <OpenInNew fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>

                  <Divider />

                  <Box>
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
                      {highlightText(displayText, query)}
                    </Typography>
                    {result.content.length > 200 && (
                      <Button
                        size="small"
                        onClick={() => toggleExpanded(result.chunk_id)}
                        sx={{ mt: 1 }}
                      >
                        {isExpanded ? 'Show Less' : 'Show More'}
                      </Button>
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 1,
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleResultClick(result)}
                    >
                      View Details
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
};

export default SearchResults;
