export type UserRole = 'USER' | 'ADMIN' | 'ADMIN_VISUALIZADOR' | 'CURADOR' | 'REVISOR';

export const USER_ROLES = ['USER', 'ADMIN', 'ADMIN_VISUALIZADOR', 'CURADOR', 'REVISOR'] as const;

export const STAFF_ROLES = ['CURADOR', 'REVISOR'] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export function isUserRole(value: string | undefined | null): value is UserRole {
    return (
        value === 'USER' ||
        value === 'ADMIN' ||
        value === 'ADMIN_VISUALIZADOR' ||
        value === 'CURADOR' ||
        value === 'REVISOR'
    );
}

export function isAdminAreaRole(role: string | undefined | null): boolean {
    return role === 'ADMIN' || role === 'ADMIN_VISUALIZADOR';
}

export function isStaffRole(role: string | undefined | null): role is StaffRole {
    return role === 'CURADOR' || role === 'REVISOR';
}
