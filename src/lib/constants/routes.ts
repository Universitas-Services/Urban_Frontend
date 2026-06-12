export const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/verificar-email'] as const;

export const ROUTE_PERMISSIONS: Record<string, string[]> = {
    '/inicio': ['USER', 'ADMIN'],
    '/chat': ['USER', 'ADMIN'],
    '/biblioteca-girs': ['USER', 'ADMIN'],
    '/proyecto-ley': ['USER', 'ADMIN'],
    '/repositorio-legal': ['USER', 'ADMIN'],
    '/perfil': ['USER', 'ADMIN'],
    '/acerca-de': ['USER', 'ADMIN'],
    '/faq': ['USER', 'ADMIN'],
    '/admin': ['ADMIN'],
    '/admin/usuarios': ['ADMIN'],
    '/admin/noticias': ['ADMIN'],
};

export function getHomeByRole(role: string): string {
    return role === 'ADMIN' ? '/admin' : '/inicio';
}

export function isPublicRoute(pathname: string): boolean {
    return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function getAllowedRoles(pathname: string): string[] | null {
    if (ROUTE_PERMISSIONS[pathname]) return ROUTE_PERMISSIONS[pathname];
    const match = Object.entries(ROUTE_PERMISSIONS).find(([route]) => pathname.startsWith(`${route}/`));
    return match ? match[1] : null;
}
