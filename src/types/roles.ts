export type UserRole = 'USER' | 'ADMIN' | 'AUDITOR';

export const USER_ROLES = ['USER', 'ADMIN', 'AUDITOR'] as const;

export function isUserRole(value: string | undefined | null): value is UserRole {
    return value === 'USER' || value === 'ADMIN' || value === 'AUDITOR';
}

export function isAdminAreaRole(role: string | undefined | null): boolean {
    return role === 'ADMIN' || role === 'AUDITOR';
}
