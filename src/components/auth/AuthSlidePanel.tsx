'use client';

import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type AuthPanelSide = 'left' | 'right';

const PANEL_TRANSITION_MS = 650;

interface AuthSlidePanelProps {
    open: boolean;
    side: AuthPanelSide;
    onExited?: () => void;
    children: ReactNode;
}

export function AuthSlidePanel({ open, side, onExited, children }: AuthSlidePanelProps) {
    const isLeft = side === 'left';
    const panelRef = useRef<HTMLElement>(null);
    const [exiting, setExiting] = useState(false);
    const [entered, setEntered] = useState(false);
    const [prevOpen, setPrevOpen] = useState(open);
    const [prevSide, setPrevSide] = useState(side);

    if (open !== prevOpen || side !== prevSide) {
        setPrevOpen(open);
        setPrevSide(side);
        if (open) {
            setExiting(false);
            setEntered(false);
        } else {
            setExiting(true);
            setEntered(false);
        }
    }

    const shouldRender = open || exiting;

    useLayoutEffect(() => {
        if (!open) return;

        const frame = requestAnimationFrame(() => {
            requestAnimationFrame(() => setEntered(true));
        });

        return () => cancelAnimationFrame(frame);
    }, [open, side]);

    useEffect(() => {
        if (open || !shouldRender) return;

        const panel = panelRef.current;
        if (!panel) {
            setExiting(false);
            onExited?.();
            return;
        }

        let exited = false;
        const finish = () => {
            if (exited) return;
            exited = true;
            setExiting(false);
            onExited?.();
        };

        const handleTransitionEnd = (event: TransitionEvent) => {
            if (event.propertyName !== 'transform') return;
            finish();
        };

        const fallback = window.setTimeout(finish, PANEL_TRANSITION_MS + 50);

        panel.addEventListener('transitionend', handleTransitionEnd);

        return () => {
            panel.removeEventListener('transitionend', handleTransitionEnd);
            window.clearTimeout(fallback);
        };
    }, [open, shouldRender, onExited]);

    if (!shouldRender) return null;

    return (
        <aside
            ref={panelRef}
            className={cn(
                'auth-slide-panel text-neutral-dark',
                isLeft ? 'auth-slide-panel--left' : 'auth-slide-panel--right',
                entered && open && 'auth-slide-panel--open'
            )}
            aria-hidden={!open && !entered}
        >
            <div className="auth-slide-panel__scroll custom-scrollbar flex flex-col justify-center">
                <div className="mx-auto w-full max-w-md px-6 py-12 sm:px-8 sm:py-14">{children}</div>
            </div>
        </aside>
    );
}

export { PANEL_TRANSITION_MS };
