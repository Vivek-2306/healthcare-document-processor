import { useState, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ragService } from '../services/ragService';
import type {
  SearchQuery,
  SearchResponse,
  SearchFilters,
  SearchSortOption,
} from '../types/rag.types';
import { useToast } from './useToast';

interface UseSearchOptions {
  debounceMs?: number;
  defaultNResults?: number;
}

export const useSearch = (options: UseSearchOptions = {}) => {
  const { debounceMs = 300, defaultNResults = 10 } = options;
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const debounceTimerRef = useRef<any>(null);

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sort, setSort] = useState<SearchSortOption>({
    field: 'similarity_score',
    order: 'desc',
  });
  const [nResults, setNResults] = useState(defaultNResults);

  const searchQuery: SearchQuery = {
    query: query.trim(),
    n_results: nResults,
    ...(filters.document_type && { document_type: filters.document_type }),
    ...(filters.document_id && { document_id: filters.document_id }),
  };

  const {
    data: searchData,
    isLoading,
    error,
    refetch,
  } = useQuery<SearchResponse>({
    queryKey: ['search', query, filters, nResults],
    queryFn: () => ragService.searchDocuments(searchQuery),
    enabled: query.trim().length > 0,
    staleTime: 30000, // 30 seconds
  });

  const indexMutation = useMutation({
    mutationFn: (documentId: string) => ragService.indexDocument(documentId),
    onSuccess: () => {
      showToast('Document indexed successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error: any) => {
      showToast(
        error?.response?.data?.detail || 'Failed to index document',
        'error'
      );
    },
  });

  const deleteIndexMutation = useMutation({
    mutationFn: (documentId: string) =>
      ragService.deleteDocumentIndex(documentId),
    onSuccess: () => {
      showToast('Document removed from index', 'success');
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error: any) => {
      showToast(
        error?.response?.data?.detail || 'Failed to remove document from index',
        'error'
      );
    },
  });

  const reindexChunkMutation = useMutation({
    mutationFn: (chunkId: string) => ragService.reindexChunk(chunkId),
    onSuccess: () => {
      showToast('Chunk reindexed successfully', 'success');
    },
    onError: (error: any) => {
      showToast(
        error?.response?.data?.detail || 'Failed to reindex chunk',
        'error'
      );
    },
  });

  const handleSearch = useCallback(
    (searchQuery: string, searchFilters?: SearchFilters) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        setQuery(searchQuery);
        if (searchFilters) {
          setFilters(searchFilters);
        }
      }, debounceMs);
    },
    [debounceMs]
  );

  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSortChange = useCallback((newSort: SearchSortOption) => {
    setSort(newSort);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setFilters({});
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  return {
    // State
    query,
    filters,
    sort,
    nResults,
    searchData,
    isLoading,
    error,

    // Actions
    handleSearch,
    handleFiltersChange,
    handleSortChange,
    setNResults,
    clearSearch,
    refetch,

    // Mutations
    indexDocument: indexMutation.mutate,
    deleteIndex: deleteIndexMutation.mutate,
    reindexChunk: reindexChunkMutation.mutate,
    isIndexing: indexMutation.isPending,
    isDeletingIndex: deleteIndexMutation.isPending,
    isReindexingChunk: reindexChunkMutation.isPending,
  };
};
