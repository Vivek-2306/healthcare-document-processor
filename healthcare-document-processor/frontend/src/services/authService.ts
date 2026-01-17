import api from './api';
import { type LoginData, type RegisterData, type LoginResponse, type AuthTokens, type User, type PasswordChangeData, type BackendAuthResponse } from '../types/auth.types';

export const authService = {
    async register(data: RegisterData): Promise<LoginResponse> {
        const response = await api.post<BackendAuthResponse>('/auth/register', data);
        // Transform backend response to frontend format
        const backendData = response.data;
        return {
            access_token: backendData.tokens.access_token,
            refresh_token: backendData.tokens.refresh_token,
            token_type: backendData.tokens.token_type || 'Bearer',
            user: backendData.user,
        };
    },

    async login(data: LoginData): Promise<LoginResponse> {
        const response = await api.post<BackendAuthResponse>('/auth/login', data);
        // Transform backend response to frontend format
        const backendData = response.data;
        return {
            access_token: backendData.tokens.access_token,
            refresh_token: backendData.tokens.refresh_token,
            token_type: backendData.tokens.token_type || 'Bearer',
            user: backendData.user,
        };
    },

    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        const response = await api.post<AuthTokens>('/auth/refresh', {
            refresh_token: refreshToken
        });
        return response.data;
    },

    async logout(): Promise<void> {
        await api.post('/auth/logout');
    },

    async getCurrentUser(): Promise<User> {
        const response = await api.get<User>('/auth/me');
        return response.data;
    },

    async changePassword(data: PasswordChangeData): Promise<{ message: string }> {
        const response = await api.post<{ message: string }>('/auth/change-password', data);
        return response.data;
    },
};