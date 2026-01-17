import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Divider,
    Typography,
    Tooltip,
} from '@mui/material';
import {
    Dashboard,
    Folder,
    Search,
    Analytics,
    Settings,
    HealthAndSafety,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const drawerWidth = 260;

interface SidebarProps {
    mobileOpen: boolean;
    onMobileClose: () => void;
}

const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Documents', icon: <Folder />, path: '/documents' },
    { text: 'Search', icon: <Search />, path: '/search' },
    { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
    const location = useLocation();
    const { user } = useAuth();

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
            <Box
                sx={{
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    color: 'white',
                    minHeight: 64, // Match navbar height
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
                }}
            >
                <HealthAndSafety sx={{ fontSize: 32 }} />
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"Poppins", sans-serif', letterSpacing: '-0.5px' }}>
                        HealthDocs
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                        {user?.role || 'User'}
                    </Typography>
                </Box>
            </Box>

            <List sx={{ flexGrow: 1, pt: 3, px: 2 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                onClick={onMobileClose}
                                sx={{
                                    borderRadius: 2.5,
                                    bgcolor: isActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                                    color: isActive ? 'primary.main' : 'text.secondary',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    py: 1.25,
                                    '&:hover': {
                                        bgcolor: isActive ? 'rgba(79, 70, 229, 0.12)' : 'rgba(0, 0, 0, 0.03)',
                                        color: 'primary.main',
                                        transform: 'translateX(4px)',
                                        '& .MuiListItemIcon-root': {
                                            color: 'primary.main',
                                        },
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: isActive ? 'primary.main' : 'text.secondary',
                                        minWidth: 40,
                                        transition: 'all 0.2s',
                                    },
                                }}
                            >
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 700 : 500,
                                        fontSize: '0.925rem',
                                    }}
                                />
                                {isActive && (
                                    <Box
                                        sx={{
                                            width: 4,
                                            height: 24,
                                            bgcolor: 'primary.main',
                                            borderRadius: 2,
                                            ml: 1,
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Box
                sx={{
                    p: 3,
                    mt: 'auto',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    background: 'rgba(0,0,0,0.01)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        System Online
                    </Typography>
                </Box>
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                    Healthcare Processor v1.0.0
                </Typography>
            </Box>
        </Box>
    );

    return (
        <>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onMobileClose}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        borderRight: '1px solid rgba(0,0,0,0.05)',
                        boxShadow: '10px 0 25px -5px rgba(0,0,0,0.1)',
                    },
                }}
            >
                {drawerContent}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        borderRight: '1px solid rgba(0,0,0,0.05)',
                        top: '64px', // Start below navbar
                        height: 'calc(100% - 64px)',
                        position: 'fixed',
                    },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Sidebar;