'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth.service';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ConfirmEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
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
                await authService.confirmEmail(token);
                setStatus('success');
            } catch (error) {
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
                        // Hard redirect to prevent "back button" behavior
                        window.location.replace('/login');
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
        <div className="w-full max-w-md mx-auto animate-fade-in flex flex-col items-center justify-center space-y-8 text-center bg-white p-8 rounded-2xl shadow-sm border border-surface-soft/20">
            {status === 'loading' && (
                <>
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-primary">Verificando...</h2>
                        <p className="text-neutral-dark/60">
                            Por favor espera mientras confirmamos tu correo electrónico.
                        </p>
                    </div>
                </>
            )}

            {status === 'success' && (
                <>
                    <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center animate-bounce">
                        <CheckCircle2 className="w-10 h-10 text-accent" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-primary">¡Cuenta Verificada!</h2>
                        <p className="text-neutral-dark/70 text-base">
                            Tu correo ha sido confirmado exitosamente. Serás redirigido al inicio de sesión en{' '}
                            <span className="font-bold text-accent">{countdown}</span> segundos.
                        </p>

                        <Button className="w-full mt-4" onClick={() => window.location.replace('/login')}>
                            Ir a iniciar sesión ahora
                        </Button>
                    </div>
                </>
            )}

            {status === 'error' && (
                <>
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                        <XCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-red-600">Enlace inválido o expirado</h2>
                        <p className="text-neutral-dark/70 text-base">
                            No pudimos verificar tu correo. Es posible que el enlace ya haya sido utilizado o haya
                            caducado.
                        </p>

                        <Button className="w-full mt-4" variant="default" onClick={() => router.push('/login')}>
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
                <div className="w-full max-w-md mx-auto items-center justify-center flex p-8 bg-white rounded-2xl">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            }
        >
            <ConfirmEmailContent />
        </Suspense>
    );
}
