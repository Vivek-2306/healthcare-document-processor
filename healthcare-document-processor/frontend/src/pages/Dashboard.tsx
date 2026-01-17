import React from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Avatar,
    LinearProgress,
    Stack,
} from '@mui/material';
import {
    Description,
    CloudUpload,
    CheckCircle,
    TrendingUp,
    HealthAndSafety,
    ArrowForward,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    const stats = [
        {
            title: 'Total Documents',
            value: '24',
            icon: <Description />,
            color: '#4f46e5',
            change: '+12%',
            trend: 'up',
        },
        {
            title: 'Processing',
            value: '3',
            icon: <CloudUpload />,
            color: '#0ea5e9',
            change: '-2%',
            trend: 'down',
        },
        {
            title: 'Completed',
            value: '21',
            icon: <CheckCircle />,
            color: '#10b981',
            change: '+18%',
            trend: 'up',
        },
        {
            title: 'Success Rate',
            value: '98.5%',
            icon: <TrendingUp />,
            color: '#f59e0b',
            change: '+0.5%',
            trend: 'up',
        },
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)',
            }}
        >
            <Container maxWidth="xl" sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ mb: 5 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            mb: 1,
                            fontFamily: '"Poppins", sans-serif',
                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-1px',
                        }}
                    >
                        Hello, {user?.full_name.split(' ')[0]}! 👋
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, opacity: 0.8 }}>
                        Welcome back to your healthcare dashboard.
                    </Typography>
                </Box>

                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        width: '40%',
                                        height: '100%',
                                        background: `linear-gradient(90deg, transparent 0%, ${stat.color}08 100%)`,
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            mb: 3,
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: `${stat.color}15`,
                                                color: stat.color,
                                                width: 52,
                                                height: 52,
                                                borderRadius: 2.5,
                                                boxShadow: `0 8px 16px -4px ${stat.color}25`,
                                            }}
                                        >
                                            {stat.icon}
                                        </Avatar>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                color: stat.trend === 'up' ? 'success.main' : 'error.main',
                                                bgcolor: stat.trend === 'up' ? 'success.light' : 'error.light',
                                                opacity: 0.9,
                                                px: 1.25,
                                                py: 0.5,
                                                borderRadius: 2,
                                            }}
                                        >
                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                {stat.change}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-1px' }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, opacity: 0.7 }}>
                                        {stat.title}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={4}>
                    <Grid item xs={12} lg={8}>
                        <Paper
                            sx={{
                                p: 0,
                                overflow: 'hidden',
                                height: '100%',
                            }}
                        >
                            <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Recent Activity
                                </Typography>
                                <Button size="small" sx={{ fontWeight: 700 }}>View All</Button>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    py: 12,
                                    bgcolor: 'rgba(0,0,0,0.01)',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        bgcolor: 'background.paper',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 3,
                                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                                    }}
                                >
                                    <HealthAndSafety sx={{ fontSize: 40, color: 'text.disabled' }} />
                                </Box>
                                <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600, mb: 1 }}>
                                    No activity yet
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 300 }}>
                                    Upload your first healthcare document to start processing and analyzing data.
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<CloudUpload />}
                                    sx={{ mt: 4, px: 4, borderRadius: 3 }}
                                >
                                    Upload Now
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <Stack spacing={4}>
                            <Paper
                                sx={{
                                    p: 4,
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                    color: 'white',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: -20,
                                        right: -20,
                                        width: 120,
                                        height: 120,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.1)',
                                    },
                                }}
                            >
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, position: 'relative' }}>
                                    Quick Actions
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 4, opacity: 0.9, position: 'relative' }}>
                                    Ready to process new documents? Use the quick actions below to get started.
                                </Typography>
                                <Stack spacing={2} sx={{ position: 'relative' }}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<CloudUpload />}
                                        sx={{
                                            bgcolor: 'white',
                                            color: 'primary.main',
                                            py: 1.5,
                                            fontWeight: 700,
                                            '&:hover': {
                                                bgcolor: 'rgba(255,255,255,0.95)',
                                                transform: 'translateY(-2px)',
                                            },
                                        }}
                                    >
                                        Upload Document
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        startIcon={<Description />}
                                        sx={{
                                            borderColor: 'rgba(255,255,255,0.5)',
                                            color: 'white',
                                            py: 1.5,
                                            fontWeight: 700,
                                            '&:hover': {
                                                borderColor: 'white',
                                                bgcolor: 'rgba(255,255,255,0.1)',
                                                transform: 'translateY(-2px)',
                                            },
                                        }}
                                    >
                                        Manage Files
                                    </Button>
                                </Stack>
                            </Paper>

                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                    Storage Usage
                                </Typography>
                                <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>4.2 GB / 10 GB</Typography>
                                    <Typography variant="body2" color="text.secondary">42%</Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={42}
                                    sx={{
                                        height: 10,
                                        borderRadius: 5,
                                        bgcolor: 'rgba(0,0,0,0.05)',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 5,
                                            background: 'linear-gradient(90deg, #4f46e5, #0ea5e9)',
                                        },
                                    }}
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                                    You have used 42% of your available storage.
                                </Typography>
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Dashboard;