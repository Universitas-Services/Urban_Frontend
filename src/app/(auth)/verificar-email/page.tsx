'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { confirmEmailService } from '@/lib/services/auth.service';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ConfirmEmailContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setTimeout(() => setStatus('error'), 0);
            return;
        }

        const confirm = async () => {
            try {
                await confirmEmailService(token);
                setStatus('success');
            } catch {
                setStatus('error');
            }
        };

        confirm();
    }, [searchParams]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (status === 'success') {
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        window.location.replace('/login?panel=login');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [status]);

    return (
        <div className="flex w-full flex-col items-center justify-center space-y-8 text-center">
            {status === 'loading' && (
                <>
                    <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-primary/10">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="font-display text-2xl font-bold text-primary">Verificando...</h2>
                        <p className="text-sm text-neutral-dark/60">
                            Por favor espera mientras confirmamos tu correo electrónico.
                        </p>
                    </div>
                </>
            )}

            {status === 'success' && (
                <>
                    <div className="auth-icon-box flex h-20 w-20 animate-bounce items-center justify-center rounded-full">
                        <CheckCircle2 className="h-10 w-10 text-auth-accent" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="font-display text-3xl font-bold text-primary">¡Cuenta verificada!</h2>
                        <p className="text-sm text-neutral-dark/70">
                            Tu correo ha sido confirmado exitosamente. Serás redirigido al inicio de sesión en{' '}
                            <span className="font-bold text-auth-accent">{countdown}</span> segundos.
                        </p>
                        <Button
                            className="mt-4 w-full rounded-full bg-auth-accent hover:bg-auth-accent-hover"
                            onClick={() => window.location.replace('/login?panel=login')}
                        >
                            Ir a iniciar sesión ahora
                        </Button>
                    </div>
                </>
            )}

            {status === 'error' && (
                <>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
                        <XCircle className="h-10 w-10 text-red-500" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-red-600">Enlace inválido o expirado</h2>
                        <p className="text-sm text-neutral-dark/70">
                            No pudimos verificar tu correo. Es posible que el enlace ya haya sido utilizado o haya
                            caducado.
                        </p>
                        <Button
                            className="mt-4 w-full rounded-full bg-auth-accent hover:bg-auth-accent-hover"
                            onClick={() => window.location.replace('/login')}
                        >
                            Volver al inicio
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

export default function ConfirmEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="flex w-full items-center justify-center py-12">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            }
        >
            <ConfirmEmailContent />
        </Suspense>
    );
}
