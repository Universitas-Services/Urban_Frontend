import type { UserRole } from '@/types/roles';
import { isAdminAreaRole } from '@/types/roles';

export function canWrite(role?: string | null): boolean {
    return role === 'ADMIN';
}

export function isAuditor(role?: string | null): boolean {
    return role === 'AUDITOR';
}

export function canAccessAdminArea(role?: string | null): boolean {
    return isAdminAreaRole(role ?? '');
}

export function isUserAreaRole(role?: string | null): boolean {
    return role === 'USER' || !role;
}

export function roleAllowsRoute(role: string, allowedRoles: UserRole[]): boolean {
    return allowedRoles.includes(role as UserRole);
}
