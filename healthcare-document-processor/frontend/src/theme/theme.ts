import { createTheme, type ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        gradient: {
            primary: string;
            secondary: string;
        };
    }
    interface PaletteOptions {
        gradient?: {
            primary?: string;
            secondary?: string;
        };
    }
}

const baseTheme: ThemeOptions = {
    palette: {
        primary: {
            main: '#4f46e5', // Indigo 600
            light: '#818cf8', // Indigo 400
            dark: '#3730a3', // Indigo 800
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#0ea5e9', // Sky 500
            light: '#38bdf8', // Sky 400
            dark: '#0369a1', // Sky 700
        },
        error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
        },
        warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
        },
        info: {
            main: '#3b82f6',
            light: '#60a5fa',
            dark: '#2563eb',
        },
        success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        gradient: {
            primary: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            secondary: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
        },
    },
    typography: {
        fontFamily: '"Inter", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        h1: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 700,
            fontSize: '2.5rem',
            lineHeight: 1.2,
        },
        h2: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 700,
            fontSize: '2rem',
            lineHeight: 1.3,
        },
        h3: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            fontSize: '1.75rem',
            lineHeight: 1.4,
        },
        h4: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.4,
        },
        h5: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        h6: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            fontSize: '1rem',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    spacing: 8,
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900, // Adjusted md breakpoint for better layouts
            lg: 1200,
            xl: 1536,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '8px 20px',
                    fontSize: '0.9375rem',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                    },
                },
                contained: {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            backgroundColor: '#ffffff',
                            '& fieldset': {
                                borderColor: '#4f46e5',
                            },
                        },
                        '&.Mui-focused': {
                            backgroundColor: '#ffffff',
                            '& fieldset': {
                                borderColor: '#4f46e5',
                                borderWidth: 2,
                            },
                        },
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backdropFilter: 'blur(8px)',
                    backgroundColor: 'rgba(79, 70, 229, 0.9)',
                },
            },
        },
    },
};

export const lightTheme = createTheme(baseTheme);

export const darkTheme = createTheme({
    ...baseTheme,
    palette: {
        ...baseTheme.palette,
        mode: 'dark',
        primary: {
            main: '#818cf8',
            light: '#a5b4fc',
            dark: '#6366f1',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#f472b6',
            light: '#f9a8d4',
            dark: '#ec4899',
        },
        background: {
            default: '#0f172a',
            paper: '#1e293b',
        },
        text: {
            primary: '#f1f5f9',
            secondary: '#cbd5e1',
        },
        gradient: {
            primary: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
            secondary: 'linear-gradient(135deg, #f472b6 0%, #fb7185 100%)',
        },
    },
});

export const theme = lightTheme;