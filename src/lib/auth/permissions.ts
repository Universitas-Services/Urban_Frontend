import type { UserRole } from '@/types/roles';
import { isAdminAreaRole } from '@/types/roles';
import { APP_CONFIG } from '@/config/app.config';

export function canWrite(role?: string | null): boolean {
    return role === 'ADMIN';
}

export function isAdminVisualizador(role?: string | null): boolean {
    return role === 'ADMIN_VISUALIZADOR';
}

export function canAccessAdminArea(role?: string | null): boolean {
    return isAdminAreaRole(role ?? '');
}

export function isUserAreaRole(role?: string | null): boolean {
    return role === 'USER' || !role;
}

/** Agente en entrenamiento: bloquea solo usuarios comunes; visualizador puede probar. */
export function isAgentBlockedForRole(role?: string | null): boolean {
    if (!APP_CONFIG.AGENT_UNDER_CONSTRUCTION) return false;
    return isUserAreaRole(role);
}

export function roleAllowsRoute(role: string, allowedRoles: UserRole[]): boolean {
    return allowedRoles.includes(role as UserRole);
}
