import { ReactNode, Suspense } from 'react';
import { AuthExperience } from '@/components/auth/AuthExperience';
import { AuthGuestGuard } from '@/components/auth/AuthGuestGuard';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<div className="min-h-dvh bg-white" />}>
            <AuthGuestGuard>
                <AuthExperience>{children}</AuthExperience>
            </AuthGuestGuard>
        </Suspense>
    );
}
