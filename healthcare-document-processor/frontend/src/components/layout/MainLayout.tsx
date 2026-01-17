import React, { useState } from 'react';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
            <Navbar onMenuClick={handleDrawerToggle} />
            <Box sx={{ display: 'flex', flex: 1, width: '100%', overflow: 'hidden' }}>
                <Sidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        width: '100%',
                        minWidth: 0, // Prevents overflow
                        p: { xs: 2, sm: 3, md: 4 },
                        pt: { xs: 2, sm: 3 },
                        minHeight: 'calc(100vh - 64px)',
                        background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)',
                        ml: { md: '260px' }, // Offset for sidebar on desktop
                        mt: '64px', // Offset for navbar
                    }}
                >
                    {children}
                </Box>
            </Box>
            <Footer />
        </Box>
    );
};

export default MainLayout;