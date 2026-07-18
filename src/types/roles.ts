export type UserRole = 'USER' | 'ADMIN' | 'ADMIN_VISUALIZADOR';

export const USER_ROLES = ['USER', 'ADMIN', 'ADMIN_VISUALIZADOR'] as const;

export function isUserRole(value: string | undefined | null): value is UserRole {
    return value === 'USER' || value === 'ADMIN' || value === 'ADMIN_VISUALIZADOR';
}

export function isAdminAreaRole(role: string | undefined | null): boolean {
    return role === 'ADMIN' || role === 'ADMIN_VISUALIZADOR';
}
