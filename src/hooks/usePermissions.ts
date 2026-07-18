'use client';

import {
    canWrite,
    isAdminVisualizador,
    canAccessAdminArea,
    isUserAreaRole,
    isAgentBlockedForRole,
} from '@/lib/auth/permissions';
import { useAuthStore } from '@/store/auth.store';

export function usePermissions() {
    const role = useAuthStore((s) => s.user?.role);

    return {
        role,
        canWrite: canWrite(role),
        isAdminVisualizador: isAdminVisualizador(role),
        isAdmin: role === 'ADMIN',
        isUser: isUserAreaRole(role),
        canAccessAdminArea: canAccessAdminArea(role),
        isAgentBlocked: isAgentBlockedForRole(role),
    };
}
