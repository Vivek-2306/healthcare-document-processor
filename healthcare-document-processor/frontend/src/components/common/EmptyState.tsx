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
        const iconProps = { 
            sx: { 
                fontSize: 80, 
                color: 'primary.main', 
                mb: 3,
                opacity: 0.2,
                filter: 'drop-shadow(0 4px 12px rgba(79, 70, 229, 0.2))'
            } 
        };
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
                py: 12,
                px: 3,
                textAlign: 'center',
                borderRadius: 4,
                bgcolor: 'rgba(0,0,0,0.01)',
                border: '2px dashed rgba(0,0,0,0.05)',
            }}
        >
            <Box sx={{ position: 'relative' }}>
                {icon || getDefaultIcon()}
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, fontFamily: '"Poppins", sans-serif' }}>
                {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 450, fontWeight: 500, lineHeight: 1.6 }}>
                {description}
            </Typography>
            {actionLabel && onAction && (
                <Button 
                    variant="contained" 
                    size="large"
                    onClick={onAction}
                    sx={{ 
                        px: 4, 
                        py: 1.5, 
                        borderRadius: 3, 
                        fontWeight: 700,
                        boxShadow: '0 8px 20px -6px rgba(79, 70, 229, 0.4)'
                    }}
                >
                    {actionLabel}
                </Button>
            )}
        </Box>
    );
};

export default EmptyState;