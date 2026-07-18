import type { UserRole } from '@/types/roles';
import { isAdminAreaRole } from '@/types/roles';

export const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/verificar-email'] as const;

export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
    '/inicio': ['USER'],
    '/chat': ['USER', 'ADMIN_VISUALIZADOR'],
    '/biblioteca-legal': ['USER'],
    '/proyecto-ley': ['USER'],
    '/repositorio-legal': ['USER'],
    '/perfil': ['USER'],
    '/acerca-de': ['USER'],
    '/faq': ['USER'],
    '/admin': ['ADMIN', 'ADMIN_VISUALIZADOR'],
    '/admin/usuarios': ['ADMIN', 'ADMIN_VISUALIZADOR'],
    '/admin/noticias': ['ADMIN', 'ADMIN_VISUALIZADOR'],
    '/admin/avisos': ['ADMIN', 'ADMIN_VISUALIZADOR'],
    '/admin/chats': ['ADMIN', 'ADMIN_VISUALIZADOR'],
};

export function getHomeByRole(role: string): string {
    if (isAdminAreaRole(role)) return '/admin';
    return '/inicio';
}

export function isPublicRoute(pathname: string): boolean {
    return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function getAllowedRoles(pathname: string): UserRole[] | null {
    if (ROUTE_PERMISSIONS[pathname]) return ROUTE_PERMISSIONS[pathname];
    const match = Object.entries(ROUTE_PERMISSIONS).find(([route]) => pathname.startsWith(`${route}/`));
    return match ? match[1] : null;
}
