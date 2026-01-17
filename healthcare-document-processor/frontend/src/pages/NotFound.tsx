import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import { Home, ArrowBack, ErrorOutline } from '@mui/icons-material';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
            >
                <ErrorOutline
                    sx={{
                        fontSize: 120,
                        color: 'primary.main',
                        mb: 2,
                    }}
                />
                <Typography variant="h1" sx={{ fontWeight: 700, mb: 2 }}>
                    404
                </Typography>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                    Page Not Found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
                    The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        startIcon={<Home />}
                        onClick={() => navigate('/dashboard')}
                        size="large"
                    >
                        Go to Dashboard
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate(-1)}
                        size="large"
                    >
                        Go Back
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default NotFound;