'use client';

import { canWrite, isAuditor, canAccessAdminArea, isUserAreaRole } from '@/lib/auth/permissions';
import { useAuthStore } from '@/store/auth.store';

export function usePermissions() {
    const role = useAuthStore((s) => s.user?.role);

    return {
        role,
        canWrite: canWrite(role),
        isAuditor: isAuditor(role),
        isAdmin: role === 'ADMIN',
        isUser: isUserAreaRole(role),
        canAccessAdminArea: canAccessAdminArea(role),
    };
}
