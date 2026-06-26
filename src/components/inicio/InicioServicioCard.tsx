import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { InicioAccent } from './inicio.data';
import { INICIO_ACCENT_STYLES } from './inicio.data';

type InicioServicioCardProps = {
    title: string;
    accent: InicioAccent;
    icon: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    className?: string;
};

export function InicioServicioCard({ title, accent, icon, children, footer, className }: InicioServicioCardProps) {
    const styles = INICIO_ACCENT_STYLES[accent];

    return (
        <article
            className={cn(
                'relative flex min-h-[320px] flex-col overflow-hidden rounded-xl border border-gray-200/70 bg-white px-4 py-4 shadow-sm',
                className
            )}
        >
            <div className="relative z-10 flex flex-1 flex-col">
                <div className="mb-2 flex items-center gap-2">
                    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', styles.iconBox)}>
                        <span className={styles.icon}>{icon}</span>
                    </div>
                    <h2 className="titulos-cards-proyecto-ley leading-tight">{title}</h2>
                </div>

                <div className="flex flex-1 flex-col gap-2">{children}</div>

                {footer ? <div className="mt-4 shrink-0">{footer}</div> : null}
            </div>
        </article>
    );
}
