'use client';

import { ReactNode, useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AuthLanding } from './AuthLanding';
import { AuthSlidePanel, type AuthPanelSide } from './AuthSlidePanel';
import { AuthPanelContext, type AuthPanelTheme } from './auth-context';
import { DashboardCityscapeBackground } from '@/components/layout/DashboardCityscapeBackground';
import { cn } from '@/lib/utils';

export type AuthPanel = 'landing' | 'login' | 'register' | 'forgot' | 'verify';

const LANDING_TRANSITION_MS = 650;

function resolvePanel(pathname: string, panelParam: string | null): AuthPanel {
    if (pathname === '/register') return 'register';
    if (pathname === '/forgot-password') return 'forgot';
    if (pathname === '/verificar-email') return 'verify';
    if (pathname === '/login' && panelParam === 'login') return 'login';
    if (pathname === '/login') return 'landing';
    return 'landing';
}

function panelSide(panel: AuthPanel): AuthPanelSide {
    return panel === 'register' ? 'right' : 'left';
}

interface AuthExperienceProps {
    children: ReactNode;
}

export function AuthExperience({ children }: AuthExperienceProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isClosing, setIsClosing] = useState(false);
    const [prevPanel, setPrevPanel] = useState<AuthPanel | null>(null);

    const panel = useMemo(() => resolvePanel(pathname, searchParams.get('panel')), [pathname, searchParams]);

    if (panel !== prevPanel) {
        setPrevPanel(panel);
        if (panel === 'landing') {
            setIsClosing(false);
        }
    }

    const isPanelOpen = panel !== 'landing';
    const side = panelSide(panel);
    const theme: AuthPanelTheme = panel === 'register' ? 'register' : 'login';
    const panelAnimOpen = isPanelOpen && !isClosing;

    const isLandingCentered = panel === 'landing' || isClosing;
    const showLandingActions = panel === 'landing' || isClosing;

    const handleBack = () => {
        if (isClosing || !isPanelOpen) return;
        setIsClosing(true);
    };

    const handlePanelExited = useCallback(() => {
        if (!isClosing) return;
        router.replace('/login');
    }, [isClosing, router]);

    const returnZoneOnRight = isPanelOpen && side === 'left' && !isClosing;

    return (
        <AuthPanelContext.Provider value={{ isPanel: isPanelOpen && !isClosing, theme }}>
            <div className="relative min-h-dvh overflow-hidden bg-surface-light">
                <DashboardCityscapeBackground imageSrc="/asset/City.svg" />

                <div className="relative z-10 min-h-dvh">
                    {/* Landing persistente — se desplaza al centro o a la mitad opuesta */}
                    <div
                        className={cn(
                            'auth-landing-stage absolute inset-y-0 z-20 flex items-center justify-center',
                            !isPanelOpen && 'pointer-events-auto',
                            isPanelOpen && !isClosing && 'pointer-events-none',
                            isLandingCentered && 'inset-x-0 auth-landing-stage--center',
                            !isLandingCentered && side === 'left' && 'right-0 w-[10%] min-w-[2.75rem] md:w-1/2',
                            !isLandingCentered && side === 'right' && 'left-0 w-[10%] min-w-[2.75rem] md:w-1/2'
                        )}
                        style={{ transitionDuration: `${LANDING_TRANSITION_MS}ms` }}
                    >
                        <AuthLanding
                            showActions={showLandingActions}
                            revealDelayed={isClosing}
                            className={cn(
                                'auth-landing-content',
                                isLandingCentered && 'auth-landing-content--center',
                                !isLandingCentered && 'max-md:opacity-0'
                            )}
                        />
                    </div>

                    {/* Zona clicable transparente (mitad opuesta al panel) */}
                    {isPanelOpen && !isClosing && (
                        <button
                            type="button"
                            onClick={handleBack}
                            aria-label="Volver a la elección"
                            className={cn(
                                'absolute inset-y-0 z-30 border-0 bg-transparent p-0',
                                returnZoneOnRight
                                    ? 'right-0 w-[10%] min-w-[2.75rem] md:w-1/2'
                                    : 'left-0 w-[10%] min-w-[2.75rem] md:w-1/2'
                            )}
                        />
                    )}

                    <AuthSlidePanel open={panelAnimOpen} side={side} onExited={handlePanelExited}>
                        {isPanelOpen ? children : null}
                    </AuthSlidePanel>

                    <p
                        className={cn(
                            'pointer-events-none absolute bottom-6 z-10 w-full px-4 text-center text-[11px] font-medium text-neutral-dark/45 transition-opacity duration-[650ms] md:text-xs',
                            isPanelOpen && !isClosing && 'hidden md:block md:w-1/2',
                            returnZoneOnRight && 'md:left-auto md:right-0',
                            isClosing && 'opacity-100'
                        )}
                    >
                        © 2026 Universitas Services, C.A. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </AuthPanelContext.Provider>
    );
}
