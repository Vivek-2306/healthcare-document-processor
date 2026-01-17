import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    Divider,
} from '@mui/material';
import {
    Email,
    Lock,
    Visibility,
    VisibilityOff,
    Login as LoginIcon,
    HealthAndSafety,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../hooks/useAuth';
import { loginSchema } from '../utils/validators';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: { email: string; password: string }) => {
        try {
            setError(null);
            setIsLoading(true);
            await login(data.email, data.password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(
                err.response?.data?.detail || err.message || 'Login failed. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '40%',
                    height: '40%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-10%',
                    right: '-10%',
                    width: '50%',
                    height: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                },
            }}
        >
            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: 5,
                    }}
                >
                    <Box
                        sx={{
                            bgcolor: 'white',
                            borderRadius: '24px',
                            p: 2,
                            mb: 3,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                            transform: 'rotate(-5deg)',
                        }}
                    >
                        <HealthAndSafety sx={{ fontSize: 56, color: 'primary.main' }} />
                    </Box>
                    <Typography
                        variant="h3"
                        sx={{
                            color: 'white',
                            fontWeight: 800,
                            mb: 1.5,
                            textAlign: 'center',
                            fontFamily: '"Poppins", sans-serif',
                            letterSpacing: '-1px',
                        }}
                    >
                        HealthDocs
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(255,255,255,0.85)',
                            textAlign: 'center',
                            fontWeight: 500,
                            maxWidth: 400,
                        }}
                    >
                        Secure, intelligent document processing for the modern healthcare era.
                    </Typography>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        padding: { xs: 4, sm: 6 },
                        borderRadius: 4,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5, fontFamily: '"Poppins", sans-serif' }}>
                            Welcome Back
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Please enter your details to sign in
                        </Typography>
                    </Box>

                    {error && (
                        <Alert
                            severity="error"
                            variant="filled"
                            sx={{ mb: 4, borderRadius: 3, fontWeight: 600 }}
                            onClose={() => setError(null)}
                        >
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    autoComplete="email"
                                    autoFocus
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email sx={{ color: 'primary.main', mr: 1 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 3 }}
                                />
                            )}
                        />

                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="current-password"
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock sx={{ color: 'primary.main', mr: 1 }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 4 }}
                                />
                            )}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                            sx={{
                                py: 2,
                                borderRadius: 3,
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                textTransform: 'none',
                                boxShadow: '0 10px 20px -5px rgba(79, 70, 229, 0.4)',
                                '&:hover': {
                                    boxShadow: '0 15px 30px -5px rgba(79, 70, 229, 0.5)',
                                },
                            }}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>

                        <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <Divider sx={{ flex: 1 }} />
                            <Typography variant="caption" sx={{ px: 2, color: 'text.disabled', fontWeight: 700, textTransform: 'uppercase' }}>
                                New to HealthDocs?
                            </Typography>
                            <Divider sx={{ flex: 1 }} />
                        </Box>

                        <Box textAlign="center" sx={{ mt: 3 }}>
                            <Button
                                component={Link}
                                to="/register"
                                fullWidth
                                variant="outlined"
                                sx={{
                                    py: 1.5,
                                    borderRadius: 3,
                                    fontWeight: 700,
                                    color: 'primary.main',
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderWidth: 2,
                                        bgcolor: 'rgba(79, 70, 229, 0.04)',
                                    },
                                }}
                            >
                                Create an account
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;