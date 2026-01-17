import React from 'react';
import { Box, Container, Typography, Link, Stack, IconButton, Divider } from '@mui/material';
import {
    GitHub,
    LinkedIn,
    Twitter,
    Email,
    HealthAndSafety,
} from '@mui/icons-material';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                width: '100%',
                mt: 'auto',
                py: { xs: 3, sm: 4 },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
            }}
        >
            <Container maxWidth="xl" sx={{ width: '100%' }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={4}
                    justifyContent="space-between"
                    alignItems={{ xs: 'center', md: 'flex-start' }}
                >
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            <HealthAndSafety />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Healthcare Docs
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ opacity: 0.9, maxWidth: 300 }}>
                            Secure document processing and management for healthcare professionals.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                            Quick Links
                        </Typography>
                        <Stack spacing={1}>
                            <Link href="/dashboard" color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>
                                Dashboard
                            </Link>
                            <Link href="/documents" color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>
                                Documents
                            </Link>
                            <Link href="/search" color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>
                                Search
                            </Link>
                        </Stack>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                            Connect
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'white',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                                }}
                            >
                                <GitHub fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'white',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                                }}
                            >
                                <LinkedIn fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'white',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                                }}
                            >
                                <Twitter fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'white',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                                }}
                            >
                                <Email fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Box>
                </Stack>

                <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        © {currentYear} Healthcare Document Processor. All rights reserved.
                    </Typography>
                    <Stack direction="row" spacing={3}>
                        <Link href="#" color="inherit" underline="hover" variant="body2">
                            Privacy Policy
                        </Link>
                        <Link href="#" color="inherit" underline="hover" variant="body2">
                            Terms of Service
                        </Link>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;