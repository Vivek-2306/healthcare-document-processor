export const UserRole = {
    ADMIN: 'admin',
    DOCTOR: 'doctor',
    NURSE: 'nurse',
    PATIENT: 'patient',
    STAFF: 'staff'
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];


export interface User {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    is_active: boolean;
    is_verified: boolean;
    created_at: string;
    last_login: string | null;
}

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface BackendAuthResponse {
    user: User;
    tokens: AuthTokens;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user: User;
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, full_name: string) => Promise<void>;
    logout: () => void;
    refreshToken: () => void;
}

export interface RegisterData {
    email: string;
    password: string;
    confirm_password: string;
    full_name: string;
    role?: UserRole
}

export interface LoginData {
    email: string;
    password: string;
}

export interface PasswordChangeData {
    current_password: string;
    new_password: string;
    confirm_password: string;
}