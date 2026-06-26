import { FaInstagram, FaLinkedin, FaFacebook, FaXTwitter, FaUsers, FaThreads } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import { INICIO_ACCENT_STYLES, INICIO_CONOCENOS, INICIO_CONOCENOS_ITEMS, INICIO_CONOCENOS_REDES } from './inicio.data';

const SOCIAL_ICONS = {
    instagram: FaInstagram,
    threads: FaThreads,
    linkedin: FaLinkedin,
    facebook: FaFacebook,
    x: FaXTwitter,
} as const;

export function InicioConocenos() {
    const styles = INICIO_ACCENT_STYLES.green;

    return (
        <section className="flex flex-col rounded-xl border border-gray-200/70 bg-white px-4 py-4 shadow-sm md:px-5 md:py-5 lg:col-span-1">
            <div className="mb-3 flex items-center gap-2">
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', styles.iconBox)}>
                    <FaUsers className={cn('h-4 w-4', styles.icon)} />
                </div>
                <h2 className="titulos-cards-proyecto-ley leading-tight">Conócenos</h2>
            </div>

            <p className="descripcion-cards mb-3 leading-snug">{INICIO_CONOCENOS.description}</p>

            <p className="descripcion-cards-small mb-2 font-semibold not-italic text-neutral-dark">
                {INICIO_CONOCENOS.accedeLabel}
            </p>

            <ul className="mb-5 flex flex-col gap-1.5">
                {INICIO_CONOCENOS_ITEMS.map((item) => (
                    <li key={item} className="descripcion-cards-small flex items-start gap-2 leading-snug">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>

            <div className="mt-auto">
                <p className="descripcion-cards-small mb-2.5 font-semibold not-italic text-neutral-dark">
                    {INICIO_CONOCENOS.redesLabel}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-primary">
                    {INICIO_CONOCENOS_REDES.map((red) => {
                        const Icon = SOCIAL_ICONS[red.id as keyof typeof SOCIAL_ICONS];
                        return (
                            <span
                                key={red.id}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary/80"
                                title={red.label}
                            >
                                <Icon size={18} className="shrink-0" />
                                <span>{red.label}</span>
                            </span>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
