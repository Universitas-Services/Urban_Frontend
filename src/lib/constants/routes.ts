import type { UserRole } from '@/types/roles';
import { isAdminAreaRole, isStaffRole } from '@/types/roles';

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
    '/admin/staff': ['ADMIN', 'ADMIN_VISUALIZADOR'],
    '/staff': ['CURADOR', 'REVISOR'],
    '/staff/perfil': ['CURADOR', 'REVISOR'],
    '/staff/carga': ['CURADOR'],
    '/staff/biblioteca': ['CURADOR'],
    '/staff/correcciones': ['CURADOR'],
    '/staff/etiquetas': ['CURADOR'],
    '/staff/revision': ['REVISOR'],
    '/staff/documentos': ['CURADOR', 'REVISOR'],
};

export function getHomeByRole(role: string): string {
    if (isAdminAreaRole(role)) return '/admin';
    if (isStaffRole(role)) return '/staff';
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
