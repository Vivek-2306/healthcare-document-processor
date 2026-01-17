export const ROUTES = {
    HOME: '/dashboard',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    DOCUMENTS: '/documents',
    DOCUMENT_DETAIL: (id: string) => `/documents/${id}`,
    SEARCH: '/search',
    ANALYTICS: '/analytics',
    SETTINGS: '/settings',
    PROFILE: '/profile',
} as const;

export const navigateTo = (path: string) => {
    window.location.href = path;
};

export const isActiveRoute = (currentPath: string, route: string): boolean => {
    return currentPath === route || currentPath.startsWith(`${route}/`);
};