'use client';

import { useAuthStore } from '@/store/auth.store';
import { getHomeByRole } from '@/lib/constants/routes';
import { roleAllowsRoute } from '@/lib/auth/permissions';
import type { UserRole } from '@/types/roles';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface RouteGuardProps {
    allowedRoles: UserRole[];
    children: ReactNode;
}

export function RouteGuard({ allowedRoles, children }: RouteGuardProps) {
    const { user, isLoading, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const role = user?.role ?? '';

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) {
            router.replace('/login');
            return;
        }
        if (!roleAllowsRoute(role, allowedRoles)) {
            router.replace(getHomeByRole(role));
        }
    }, [isLoading, isAuthenticated, role, allowedRoles, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex h-dvh items-center justify-center bg-surface-light">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!roleAllowsRoute(role, allowedRoles)) {
        return (
            <div className="flex h-dvh items-center justify-center bg-surface-light">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return <>{children}</>;
}
