import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Chip,
  Stack,
  Button,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import {
  Search,
  Clear,
  FilterList,
  Tune,
  History,
} from '@mui/icons-material';
import { DocumentType } from '../../types/document.types';
import type { SearchFilters } from '../../types/rag.types';

interface SearchBarProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  initialQuery?: string;
  initialFilters?: SearchFilters;
  placeholder?: string;
  showAdvanced?: boolean;
  onFiltersChange?: (filters: SearchFilters) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  initialQuery = '',
  initialFilters,
  placeholder = 'Search documents...',
  showAdvanced = true,
  onFiltersChange,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || {});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim(), filters);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery('');
    const clearedFilters: SearchFilters = {};
    setFilters(clearedFilters);
    if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const handleRemoveFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const activeFiltersCount = Object.keys(filters).filter(
    (key) => filters[key as keyof SearchFilters]
  ).length;

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            variant="outlined"
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              endAdornment: query && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    edge="end"
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={!query.trim()}
            sx={{ minWidth: 100, height: 56 }}
          >
            Search
          </Button>
          {showAdvanced && (
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              color={activeFiltersCount > 0 ? 'primary' : 'default'}
              sx={{ height: 56, width: 56 }}
            >
              <Tune />
            </IconButton>
          )}
        </Box>

        {activeFiltersCount > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {filters.document_type && (
              <Chip
                label={`Type: ${filters.document_type}`}
                onDelete={() => handleRemoveFilter('document_type')}
                size="small"
              />
            )}
            {filters.document_id && (
              <Chip
                label={`Document: ${filters.document_id.substring(0, 8)}...`}
                onDelete={() => handleRemoveFilter('document_id')}
                size="small"
              />
            )}
            {filters.date_from && (
              <Chip
                label={`From: ${new Date(filters.date_from).toLocaleDateString()}`}
                onDelete={() => handleRemoveFilter('date_from')}
                size="small"
              />
            )}
            {filters.date_to && (
              <Chip
                label={`To: ${new Date(filters.date_to).toLocaleDateString()}`}
                onDelete={() => handleRemoveFilter('date_to')}
                size="small"
              />
            )}
          </Stack>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: { minWidth: 300, p: 2 },
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Advanced Filters
          </Typography>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Document Type</InputLabel>
              <Select
                value={filters.document_type || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'document_type',
                    e.target.value || undefined
                  )
                }
                label="Document Type"
              >
                <MenuItem value="">All Types</MenuItem>
                {Object.values(DocumentType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Date From"
              type="date"
              size="small"
              value={filters.date_from || ''}
              onChange={(e) =>
                handleFilterChange('date_from', e.target.value || undefined)
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="Date To"
              type="date"
              size="small"
              value={filters.date_to || ''}
              onChange={(e) =>
                handleFilterChange('date_to', e.target.value || undefined)
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <Button
              variant="outlined"
              onClick={() => {
                handleClear();
                setAnchorEl(null);
              }}
              fullWidth
            >
              Clear All Filters
            </Button>
          </Stack>
        </Menu>
      </Stack>
    </Paper>
  );
};

export default SearchBar;
