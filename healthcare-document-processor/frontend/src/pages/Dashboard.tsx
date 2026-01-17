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
            value: '0',
            icon: <Description />,
            color: '#6366f1',
            change: '+0%',
        },
        {
            title: 'Processing',
            value: '0',
            icon: <CloudUpload />,
            color: '#ec4899',
            change: '+0%',
        },
        {
            title: 'Completed',
            value: '0',
            icon: <CheckCircle />,
            color: '#10b981',
            change: '+0%',
        },
        {
            title: 'Success Rate',
            value: '100%',
            icon: <TrendingUp />,
            color: '#f59e0b',
            change: '+0%',
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
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Welcome back, {user?.full_name}! 👋
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Here's what's happening with your documents today
                    </Typography>
                </Box>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    borderRadius: 3,
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.15)',
                                    },
                                }}
                            >
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            mb: 2,
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: stat.color,
                                                width: 56,
                                                height: 56,
                                            }}
                                        >
                                            {stat.icon}
                                        </Avatar>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: stat.color,
                                                fontWeight: 600,
                                                bgcolor: `${stat.color}15`,
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 2,
                                            }}
                                        >
                                            {stat.change}
                                        </Typography>
                                    </Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {stat.title}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                Recent Activity
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    py: 6,
                                }}
                            >
                                <HealthAndSafety sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="body1" color="text.secondary">
                                    No recent activity
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Upload your first document to get started
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                Quick Actions
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    startIcon={<CloudUpload />}
                                    sx={{
                                        bgcolor: 'white',
                                        color: 'primary.main',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.9)',
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
                                        borderColor: 'white',
                                        color: 'white',
                                        '&:hover': {
                                            borderColor: 'white',
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                        },
                                    }}
                                >
                                    View Documents
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Dashboard;