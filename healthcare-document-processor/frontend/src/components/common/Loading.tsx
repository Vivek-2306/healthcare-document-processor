import React from 'react';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';
import { HealthAndSafety } from '@mui/icons-material';

interface LoadingProps {
    fullScreen?: boolean;
    message?: string;
    size?: number;
}

const Loading: React.FC<LoadingProps> = ({
    fullScreen = false,
    message = 'Loading...',
    size = 40,
}) => {
    const content = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
            }}
        >
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress size={size} thickness={4} />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <HealthAndSafety sx={{ fontSize: size * 0.5, color: 'primary.main' }} />
                </Box>
            </Box>
            {message && (
                <Typography variant="body2" color="text.secondary">
                    {message}
                </Typography>
            )}
        </Box>
    );

    if (fullScreen) {
        return (
            <Backdrop
                open
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                }}
            >
                {content}
            </Backdrop>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 200,
            }}
        >
            {content}
        </Box>
    );
};

export default Loading;