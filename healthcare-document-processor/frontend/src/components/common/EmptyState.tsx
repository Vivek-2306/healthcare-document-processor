import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import {
    Inbox,
    FolderOpen,
    SearchOff,
    CloudUpload,
} from '@mui/icons-material';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    variant?: 'default' | 'upload' | 'search' | 'folder';
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    actionLabel,
    onAction,
    variant = 'default',
}) => {
    const getDefaultIcon = () => {
        const iconProps = { sx: { fontSize: 64, color: 'text.secondary', mb: 2 } };
        switch (variant) {
            case 'upload':
                return <CloudUpload {...iconProps} />;
            case 'search':
                return <SearchOff {...iconProps} />;
            case 'folder':
                return <FolderOpen {...iconProps} />;
            default:
                return <Inbox {...iconProps} />;
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                px: 2,
                textAlign: 'center',
            }}
        >
            {icon || getDefaultIcon()}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
                {description}
            </Typography>
            {actionLabel && onAction && (
                <Button variant="contained" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </Box>
    );
};

export default EmptyState;