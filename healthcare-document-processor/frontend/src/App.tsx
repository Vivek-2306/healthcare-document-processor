import React, { Suspense, lazy } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, ErrorBoundary, Loading } from './components/common';
import { MainLayout } from './components/layout';

// Lazy load pages for code splitting
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Documents = lazy(() => import('./pages/Documents'));
const DocumentDetail = lazy(() => import('./pages/DocumentDetail'));
const Processing = lazy(() => import('./pages/Processing'));
const Search = lazy(() => import('./pages/Search'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <AuthProvider>
            <BrowserRouter>
              <Suspense fallback={<Loading fullScreen message="Loading application..." />}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <MainLayout>
                          <Dashboard />
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/documents"
                    element={
                      <ProtectedRoute>
                        <MainLayout>
                          <Documents />
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/documents/:id"
                    element={
                      <ProtectedRoute>
                        <MainLayout>
                          <DocumentDetail />
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/documents/:id/processing"
                    element={
                      <ProtectedRoute>
                        <MainLayout>
                          <Processing />
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/search"
                    element={
                      <ProtectedRoute>
                        <MainLayout>
                          <Search />
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;