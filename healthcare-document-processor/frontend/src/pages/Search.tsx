import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Stack,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import { useSearch } from '../hooks/useSearch';
import SearchBar from '../components/search/SearchBar';
import SearchResults from '../components/search/SearchResults';
import SearchResultDetail from '../components/search/SearchResultDetail';
import IndexingStatus from '../components/search/IndexingStatus';
import { Loading } from '../components/common';
import type { SearchResult } from '../types/rag.types';
import { useQuery } from '@tanstack/react-query';
import { documentService } from '../services/documentService';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(
    null
  );
  const [tabValue, setTabValue] = useState(0);

  const initialQuery = searchParams.get('q') || '';
  const documentId = searchParams.get('document_id') || undefined;

  const {
    query,
    filters,
    sort,
    searchData,
    isLoading,
    error,
    handleSearch,
    handleFiltersChange,
    handleSortChange,
    clearSearch,
  } = useSearch({ debounceMs: 500 });

  // Fetch documents for indexing status (if needed)
  const { data: documents } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentService.listDocuments(),
  });

  React.useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery, documentId ? { document_id: documentId } : {});
    }
  }, [initialQuery, documentId]);

  const handleSearchSubmit = (searchQuery: string, searchFilters?: any) => {
    handleSearch(searchQuery, searchFilters);
    // Update URL params
    const params = new URLSearchParams();
    params.set('q', searchQuery);
    if (searchFilters?.document_id) {
      params.set('document_id', searchFilters.document_id);
    }
    setSearchParams(params);
  };

  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result);
  };

  const handleCloseDetail = () => {
    setSelectedResult(null);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Search Documents
      </Typography>

      <Box sx={{ mb: 4 }}>
        <SearchBar
          onSearch={handleSearchSubmit}
          initialQuery={initialQuery}
          initialFilters={documentId ? { document_id: documentId } : filters}
          placeholder="Search across all your documents..."
          onFiltersChange={handleFiltersChange}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error instanceof Error
            ? error.message
            : 'An error occurred while searching'}
        </Alert>
      )}

      {query && (
        <Box>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Search Results" />
            <Tab label="Indexing Status" />
          </Tabs>

          <Box
            role="tabpanel"
            hidden={tabValue !== 0}
            id="search-results-tab"
          >
            {tabValue === 0 && (
              <SearchResults
                results={searchData?.results || []}
                query={query}
                isLoading={isLoading}
                onResultClick={handleResultClick}
                onSortChange={handleSortChange}
                currentSort={sort}
              />
            )}
          </Box>

          <Box
            role="tabpanel"
            hidden={tabValue !== 1}
            id="indexing-status-tab"
          >
            {tabValue === 1 && (
              <Stack spacing={2}>
                {documents && documents.length > 0 ? (
                  documents.map((doc) => (
                    <IndexingStatus
                      key={doc.id}
                      document={doc}
                      isIndexed={false} // TODO: Check actual indexed status
                      chunkCount={undefined}
                    />
                  ))
                ) : (
                  <Alert severity="info">
                    No documents available for indexing
                  </Alert>
                )}
              </Stack>
            )}
          </Box>
        </Box>
      )}

      {!query && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Enter a search query to find documents
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Search across all your indexed documents using natural language
          </Typography>
        </Box>
      )}

      <SearchResultDetail
        result={selectedResult}
        open={selectedResult !== null}
        onClose={handleCloseDetail}
        query={query}
      />
    </Container>
  );
};

export default Search;
