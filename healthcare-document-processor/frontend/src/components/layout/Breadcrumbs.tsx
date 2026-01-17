import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    Breadcrumbs as MuiBreadcrumbs,
    Typography,
    Box,
    Chip,
} from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';

interface BreadcrumbItem {
    label: string;
    path?: string;
}

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const breadcrumbMap: Record<string, string> = {
        dashboard: 'Dashboard',
        documents: 'Documents',
        search: 'Search',
        analytics: 'Analytics',
        settings: 'Settings',
        profile: 'Profile',
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', path: '/dashboard' },
        ...pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            return {
                label: breadcrumbMap[value] || value.charAt(0).toUpperCase() + value.slice(1),
                path: index === pathnames.length - 1 ? undefined : to,
            };
        }),
    ];

    return (
        <MuiBreadcrumbs
            separator={<NavigateNext fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 2 }}
        >
            {breadcrumbs.map((breadcrumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return breadcrumb.path && !isLast ? (
                    <Link
                        key={breadcrumb.path}
                        to={breadcrumb.path}
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                        }}
                    >
                        {index === 0 && <Home sx={{ fontSize: 18 }} />}
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'primary.main',
                                '&:hover': { textDecoration: 'underline' },
                            }}
                        >
                            {breadcrumb.label}
                        </Typography>
                    </Link>
                ) : (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {index === 0 && <Home sx={{ fontSize: 18, color: 'text.secondary' }} />}
                        <Chip
                            label={breadcrumb.label}
                            size="small"
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                fontWeight: 600,
                                height: 24,
                            }}
                        />
                    </Box>
                );
            })}
        </MuiBreadcrumbs>
    );
};

export default Breadcrumbs;