'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AuthLandingProps {
    showActions?: boolean;
    revealDelayed?: boolean;
    className?: string;
}

export function AuthLanding({ showActions = true, revealDelayed = false, className }: AuthLandingProps) {
    const router = useRouter();

    return (
        <div
            className={cn(
                'flex w-full max-w-md flex-col items-center justify-center px-6 text-center sm:max-w-lg',
                className
            )}
        >
            <h1 className="auth-landing-title text-4xl sm:text-5xl">Te damos la bienvenida</h1>

            <div className="auth-landing-logo mt-6 flex w-full max-w-[220px] items-center justify-center sm:mt-8 sm:max-w-[260px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/asset/icons_11.png"
                    alt="IUS Urbano"
                    draggable={false}
                    className="h-auto w-full object-contain"
                />
            </div>

            <p className="mt-4 max-w-sm text-base leading-relaxed text-neutral-dark/70 sm:mt-6 sm:text-lg">
                Inteligencia jurídica para las ciudades del futuro
            </p>

            <div
                className={cn(
                    'pointer-events-auto mt-8 flex w-full flex-col items-center gap-3 transition-all duration-700 ease-out md:flex-row md:justify-center md:gap-3',
                    showActions && 'translate-y-0 opacity-100',
                    showActions && revealDelayed && 'delay-300',
                    !showActions && 'pointer-events-none translate-y-2 opacity-0'
                )}
            >
                <button
                    type="button"
                    onClick={() => router.replace('/login?panel=login')}
                    className="h-14 w-full max-w-[17.5rem] shrink-0 rounded-full border-2 border-primary px-8 text-sm font-bold text-primary transition-colors hover:bg-primary/5 md:h-12 md:max-w-none md:min-w-[10.5rem] md:flex-1"
                >
                    Iniciar sesión
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/register')}
                    className="h-14 w-full max-w-[17.5rem] shrink-0 rounded-full bg-auth-accent px-8 text-sm font-bold text-on-primary shadow-lg shadow-auth-accent/25 transition-colors hover:bg-auth-accent-hover md:h-12 md:max-w-none md:min-w-[10.5rem] md:flex-1"
                >
                    Registrarse
                </button>
            </div>
        </div>
    );
}
