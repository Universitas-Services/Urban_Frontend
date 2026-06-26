import Link from 'next/link';
import { FaBook, FaGraduationCap } from 'react-icons/fa6';
import { Bot, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InicioServicioCard } from './InicioServicioCard';
import { InicioNewChatButton } from './InicioNewChatButton';
import {
    INICIO_ACCENT_STYLES,
    INICIO_AULA_CIUDAD,
    INICIO_BIBLIOTECA,
    INICIO_BIBLIOTECA_ITEMS,
    INICIO_CONSULTOR_IA,
    type InicioAccent,
} from './inicio.data';

function CardActionButton({ label, accent, href }: { label: string; accent: InicioAccent; href?: string }) {
    const styles = INICIO_ACCENT_STYLES[accent];
    const className = cn(
        'inline-flex h-8 items-center justify-center rounded-lg px-5 text-xs font-semibold transition-colors',
        styles.button
    );

    if (href) {
        return (
            <Link href={href} className={className}>
                {label}
            </Link>
        );
    }

    return (
        <div role="presentation" className={cn(className, 'cursor-default')}>
            {label}
        </div>
    );
}

export function InicioServiciosGrid() {
    return (
        <section className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            <InicioServicioCard
                title={INICIO_BIBLIOTECA.title}
                accent="green"
                icon={<FaBook className="h-4 w-4" />}
                footer={
                    <CardActionButton
                        label={INICIO_BIBLIOTECA.buttonLabel}
                        accent="green"
                        href={INICIO_BIBLIOTECA.href}
                    />
                }
            >
                <p className="descripcion-cards leading-snug">{INICIO_BIBLIOTECA.description}</p>
                <p className="descripcion-cards-small mb-1 mt-2 font-semibold not-italic text-neutral-dark">
                    {INICIO_BIBLIOTECA.accedeLabel}
                </p>
                <ul className="descripcion-cards-small space-y-1">
                    {INICIO_BIBLIOTECA_ITEMS.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </InicioServicioCard>

            <InicioServicioCard
                title={INICIO_CONSULTOR_IA.title}
                accent="blue"
                icon={<Bot className="h-4 w-4" />}
                footer={<InicioNewChatButton label={INICIO_CONSULTOR_IA.buttonLabel} accent="blue" />}
            >
                <p className="descripcion-cards leading-snug">{INICIO_CONSULTOR_IA.description}</p>
                <p className="descripcion-cards-small leading-snug">{INICIO_CONSULTOR_IA.descriptionExtended}</p>
            </InicioServicioCard>

            <InicioServicioCard
                title={INICIO_AULA_CIUDAD.title}
                accent="gold"
                icon={<FaGraduationCap className="h-4 w-4" />}
                className="md:col-span-2 lg:col-span-1"
                footer={
                    <CardActionButton
                        label={INICIO_AULA_CIUDAD.buttonLabel}
                        accent="gold"
                        href={INICIO_AULA_CIUDAD.href}
                    />
                }
            >
                <p className="descripcion-cards leading-snug">{INICIO_AULA_CIUDAD.subtitle}</p>
                <p className="descripcion-cards-small leading-snug">{INICIO_AULA_CIUDAD.description}</p>
                <p className="descripcion-cards-small leading-snug">{INICIO_AULA_CIUDAD.descriptionExtended}</p>
            </InicioServicioCard>
        </section>
    );
}
