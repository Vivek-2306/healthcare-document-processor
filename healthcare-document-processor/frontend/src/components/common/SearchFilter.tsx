import React, { useState } from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Chip,
    Stack,
    Menu,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import {
    Search,
    Clear,
    FilterList,
    Tune,
} from '@mui/icons-material';

interface FilterOption {
    label: string;
    value: string;
}

interface SearchFilterProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    placeholder?: string;
    filters?: {
        label: string;
        options: FilterOption[];
        value: string;
        onChange: (value: string) => void;
    }[];
    onClear?: () => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
    searchValue,
    onSearchChange,
    placeholder = 'Search...',
    filters = [],
    onClear,
}) => {
    const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);

    const handleClear = () => {
        onSearchChange('');
        filters.forEach((filter) => filter.onChange(''));
        onClear?.();
    };

    const activeFiltersCount = filters.filter((f) => f.value).length;

    return (
        <Box sx={{ mb: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <TextField
                    fullWidth
                    placeholder={placeholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: searchValue && (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={handleClear}>
                                    <Clear />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{ flexGrow: 1 }}
                />

                {filters.length > 0 && (
                    <>
                        <IconButton
                            onClick={(e) => setFilterAnchor(e.currentTarget)}
                            sx={{
                                bgcolor: activeFiltersCount > 0 ? 'primary.main' : 'transparent',
                                color: activeFiltersCount > 0 ? 'white' : 'inherit',
                                '&:hover': {
                                    bgcolor: activeFiltersCount > 0 ? 'primary.dark' : 'action.hover',
                                },
                            }}
                        >
                            <Tune />
                        </IconButton>

                        <Menu
                            anchorEl={filterAnchor}
                            open={Boolean(filterAnchor)}
                            onClose={() => setFilterAnchor(null)}
                            PaperProps={{
                                sx: { minWidth: 200, borderRadius: 2 },
                            }}
                        >
                            {filters.map((filter, index) => (
                                <MenuItem key={index} onClick={(e) => e.stopPropagation()}>
                                    <FormControl fullWidth>
                                        <InputLabel>{filter.label}</InputLabel>
                                        <Select
                                            value={filter.value}
                                            onChange={(e) => filter.onChange(e.target.value)}
                                            label={filter.label}
                                        >
                                            <MenuItem value="">All</MenuItem>
                                            {filter.options.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </MenuItem>
                            ))}
                        </Menu>
                    </>
                )}
            </Stack>

            {(searchValue || activeFiltersCount > 0) && (
                <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                    {searchValue && (
                        <Chip
                            label={`Search: ${searchValue}`}
                            onDelete={() => onSearchChange('')}
                            size="small"
                        />
                    )}
                    {filters.map(
                        (filter, index) =>
                            filter.value && (
                                <Chip
                                    key={index}
                                    label={`${filter.label}: ${filter.options.find((o) => o.value === filter.value)?.label || filter.value}`}
                                    onDelete={() => filter.onChange('')}
                                    size="small"
                                />
                            )
                    )}
                    <Chip
                        label="Clear all"
                        onDelete={handleClear}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                </Stack>
            )}
        </Box>
    );
};

export default SearchFilter;