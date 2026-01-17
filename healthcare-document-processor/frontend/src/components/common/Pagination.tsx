import React from 'react';
import {
    Pagination as MuiPagination,
    PaginationItem,
    Box,
    Typography,
} from '@mui/material';
import type { PaginationProps as MuiPaginationProps } from '@mui/material/Pagination';

interface PaginationProps extends Omit<MuiPaginationProps, 'onChange'> {
    page: number;
    totalPages: number;
    totalItems?: number;
    itemsPerPage?: number;
    onChange: (page: number) => void;
    showInfo?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
    page,
    totalPages,
    totalItems,
    itemsPerPage,
    onChange,
    showInfo = true,
    ...props
}) => {
    const startItem = totalItems && itemsPerPage ? (page - 1) * itemsPerPage + 1 : 0;
    const endItem =
        totalItems && itemsPerPage
            ? Math.min(page * itemsPerPage, totalItems)
            : 0;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                mt: 3,
            }}
        >
            {showInfo && totalItems && (
                <Typography variant="body2" color="text.secondary">
                    Showing {startItem} to {endItem} of {totalItems} results
                </Typography>
            )}
            <MuiPagination
                count={totalPages}
                page={page}
                onChange={(_, value) => onChange(value)}
                color="primary"
                shape="rounded"
                renderItem={(item) => (
                    <PaginationItem
                        {...item}
                        sx={{
                            '&.Mui-selected': {
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                },
                            },
                        }}
                    />
                )}
                {...props}
            />
        </Box>
    );
};

export default Pagination;