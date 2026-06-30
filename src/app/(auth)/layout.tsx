import { ReactNode, Suspense } from 'react';
import { AuthExperience } from '@/components/auth/AuthExperience';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<div className="min-h-dvh bg-white" />}>
            <AuthExperience>{children}</AuthExperience>
        </Suspense>
    );
}
