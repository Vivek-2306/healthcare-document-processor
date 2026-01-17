import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthContextType, User, LoginResponse } from '../types/auth.types';
import { authService } from '../services/authService';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
                const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

                if (storedUser && accessToken) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);

                    // Verify token is still valid by fetching current user
                    try {
                        const currentUser = await authService.getCurrentUser();
                        setUser(currentUser);
                        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
                    } catch (error) {
                        // Token invalid, clear storage
                        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                        localStorage.removeItem(STORAGE_KEYS.USER);
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error('Error loading user:', error);
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        try {
            const response: LoginResponse = await authService.login({ email, password });
            const { access_token, refresh_token, user: userData } = response;

            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            throw error;
        }
    };

    const register = async (email: string, password: string, fullName: string): Promise<void> => {
        try {
            const response: LoginResponse = await authService.register({
                email,
                password,
                confirm_password: password,
                full_name: fullName,
            });

            const { access_token, refresh_token, user: userData } = response;

            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            setUser(null);
        }
    };

    const refreshToken = async (): Promise<void> => {
        try {
            const refreshTokenValue = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
            if (!refreshTokenValue) {
                throw new Error('No refresh token available');
            }

            const tokens = await authService.refreshToken(refreshTokenValue);
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);
            if (tokens.refresh_token) {
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token);
            }
        } catch (error) {
            logout();
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshToken,
    };

    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};