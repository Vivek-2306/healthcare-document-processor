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
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box
                sx={{
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    minHeight: 64, // Match navbar height
                }}
            >
                <HealthAndSafety sx={{ fontSize: 32 }} />
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Healthcare Docs
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        {user?.role || 'User'}
                    </Typography>
                </Box>
            </Box>

            <Divider />

            <List sx={{ flexGrow: 1, pt: 2 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5, px: 2 }}>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                onClick={onMobileClose}
                                sx={{
                                    borderRadius: 2,
                                    bgcolor: isActive ? 'primary.main' : 'transparent',
                                    color: isActive ? 'white' : 'text.primary',
                                    '&:hover': {
                                        bgcolor: isActive ? 'primary.dark' : 'action.hover',
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: isActive ? 'white' : 'text.secondary',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 400,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Box
                sx={{
                    p: 2,
                    mt: 'auto',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Typography variant="caption" color="text.secondary">
                    Version 1.0.0
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
                        borderRight: 'none',
                        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
                        top: '64px', // Start below navbar
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
                        borderRight: 'none',
                        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
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