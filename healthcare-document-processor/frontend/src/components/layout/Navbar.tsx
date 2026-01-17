import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Avatar,
    Divider,
    Badge,
    Chip,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    AccountCircle,
    Logout,
    Dashboard,
    Folder,
    Settings,
    Notifications,
    HealthAndSafety,
    Menu as MenuIcon,
    Search,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
    onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationsAnchor(event.currentTarget);
    };

    const handleNotificationsClose = () => {
        setNotificationsAnchor(null);
    };

    const handleLogout = async () => {
        handleMenuClose();
        await logout();
        navigate('/login');
    };

    const handleProfile = () => {
        handleMenuClose();
        navigate('/profile');
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                color: 'text.primary',
            }}
        >
            <Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 }, width: '100%', maxWidth: '100%' }}>
                {isMobile && onMenuClick && (
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={onMenuClick}
                        sx={{ mr: 1 }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', mr: { xs: 1, sm: 2, md: 4 } }}>
                    <HealthAndSafety sx={{ mr: 1, fontSize: { xs: 24, sm: 28 }, color: 'primary.main' }} />
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontWeight: 800,
                            fontFamily: '"Poppins", sans-serif',
                            display: { xs: 'none', sm: 'block' },
                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        HealthDocs
                    </Typography>
                </Box>

                {!isMobile && (
                    <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                        <Button
                            component={Link}
                            to="/dashboard"
                            startIcon={<Dashboard />}
                            sx={{
                                color: isActive('/dashboard') ? 'primary.main' : 'text.secondary',
                                fontWeight: isActive('/dashboard') ? 700 : 500,
                                bgcolor: isActive('/dashboard') ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                                '&:hover': {
                                    bgcolor: 'rgba(79, 70, 229, 0.04)',
                                    color: 'primary.main',
                                },
                            }}
                        >
                            Dashboard
                        </Button>
                        <Button
                            component={Link}
                            to="/documents"
                            startIcon={<Folder />}
                            sx={{
                                color: isActive('/documents') ? 'primary.main' : 'text.secondary',
                                fontWeight: isActive('/documents') ? 700 : 500,
                                bgcolor: isActive('/documents') ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                                '&:hover': {
                                    bgcolor: 'rgba(79, 70, 229, 0.04)',
                                    color: 'primary.main',
                                },
                            }}
                        >
                            Documents
                        </Button>
                    </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, ml: 'auto' }}>
                    {!isMobile && (
                        <>
                            <IconButton
                                color="inherit"
                                sx={{
                                    color: 'text.secondary',
                                    '&:hover': {
                                        bgcolor: 'rgba(0,0,0,0.04)',
                                        color: 'primary.main',
                                    },
                                }}
                            >
                                <Search />
                            </IconButton>

                            <IconButton
                                color="inherit"
                                onClick={handleNotificationsOpen}
                                sx={{
                                    color: 'text.secondary',
                                    '&:hover': {
                                        bgcolor: 'rgba(0,0,0,0.04)',
                                        color: 'primary.main',
                                    },
                                }}
                            >
                                <Badge badgeContent={3} color="error" overlap="circular">
                                    <Notifications />
                                </Badge>
                            </IconButton>
                        </>
                    )}

                    <Menu
                        anchorEl={notificationsAnchor}
                        open={Boolean(notificationsAnchor)}
                        onClose={handleNotificationsClose}
                        PaperProps={{
                            sx: {
                                mt: 1.5,
                                minWidth: 300,
                                borderRadius: 3,
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                                border: '1px solid rgba(0,0,0,0.05)',
                            },
                        }}
                    >
                        <MenuItem disabled>
                            <Typography variant="subtitle2" fontWeight={700}>
                                Notifications
                            </Typography>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleNotificationsClose} sx={{ py: 2 }}>
                            <Typography variant="body2" color="text.secondary">No new notifications</Typography>
                        </MenuItem>
                    </Menu>

                    {!isMobile && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                ml: 2,
                                px: 2,
                                py: 0.75,
                                borderRadius: 2.5,
                                bgcolor: 'rgba(0,0,0,0.03)',
                                border: '1px solid rgba(0,0,0,0.05)',
                            }}
                        >
                            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, display: { xs: 'none', lg: 'block' } }}>
                                {user?.full_name}
                            </Typography>
                            {user?.role && (
                                <Chip
                                    label={user.role}
                                    size="small"
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        fontWeight: 700,
                                        height: 22,
                                        fontSize: '0.65rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                    }}
                                />
                            )}
                        </Box>
                    )}

                    <IconButton
                        size="large"
                        edge="end"
                        onClick={handleMenuOpen}
                        sx={{
                            ml: { xs: 0, sm: 1 },
                            transition: 'all 0.2s',
                            '&:hover': {
                                bgcolor: 'rgba(79, 70, 229, 0.08)',
                            },
                        }}
                    >
                        {user?.full_name ? (
                            <Avatar
                                sx={{
                                    width: { xs: 32, sm: 38 },
                                    height: { xs: 32, sm: 38 },
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
                                }}
                            >
                                {getInitials(user.full_name)}
                            </Avatar>
                        ) : (
                            <AccountCircle sx={{ fontSize: { xs: 32, sm: 38 }, color: 'text.secondary' }} />
                        )}
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        PaperProps={{
                            sx: {
                                mt: 1.5,
                                minWidth: 200,
                                borderRadius: 2,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            },
                        }}
                    >
                        {isMobile && (
                            <>
                                <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard'); }}>
                                    <Dashboard sx={{ mr: 2, fontSize: 20 }} />
                                    Dashboard
                                </MenuItem>
                                <MenuItem onClick={() => { handleMenuClose(); navigate('/documents'); }}>
                                    <Folder sx={{ mr: 2, fontSize: 20 }} />
                                    Documents
                                </MenuItem>
                                <Divider />
                            </>
                        )}
                        <MenuItem onClick={handleProfile}>
                            <AccountCircle sx={{ mr: 2, fontSize: 20 }} />
                            Profile
                        </MenuItem>
                        <MenuItem>
                            <Settings sx={{ mr: 2, fontSize: 20 }} />
                            Settings
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                            <Logout sx={{ mr: 2, fontSize: 20 }} />
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;