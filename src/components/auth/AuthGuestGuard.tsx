'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { getHomeByRole } from '@/lib/constants/routes';

/**
 * Evita que usuarios con sesión abierta vean páginas públicas de auth
 * (/login, /register, etc.). Complementa el redirect de proxy.ts.
 */
export function AuthGuestGuard({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { initAuth, isAuthenticated, isLoading, user } = useAuthStore();

    useEffect(() => {
        void initAuth();
    }, [initAuth]);

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) return;
        router.replace(getHomeByRole(user?.role ?? 'USER'));
    }, [isLoading, isAuthenticated, user?.role, router]);

    if (isLoading || isAuthenticated) {
        return (
            <div className="flex h-dvh items-center justify-center bg-surface-light">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return <>{children}</>;
}
