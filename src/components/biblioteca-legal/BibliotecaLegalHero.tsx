import { BIBLIOTECA_LEGAL_HERO } from './biblioteca-legal.data';

export function BibliotecaLegalHero() {
    return (
        <section className="inicio-hero-card relative min-h-[280px] overflow-hidden rounded-xl border border-sidebar-border shadow-sm md:min-h-[300px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={BIBLIOTECA_LEGAL_HERO.imageSrc}
                alt={BIBLIOTECA_LEGAL_HERO.imageAlt}
                className="inicio-hero-card__image"
                draggable={false}
            />

            <div className="inicio-hero-card__overlay" aria-hidden />

            <div className="inicio-hero-card__content relative z-10 flex max-w-xl flex-col gap-2 p-4 md:max-w-2xl md:p-6">
                <h1 className="titulos-cards mb-0 leading-tight tracking-tight">{BIBLIOTECA_LEGAL_HERO.title}</h1>
                <p className="text-xs font-semibold italic text-accent md:text-[0.8rem]">
                    {BIBLIOTECA_LEGAL_HERO.subtitle}
                </p>
                <p className="descripcion-cards leading-snug">{BIBLIOTECA_LEGAL_HERO.description}</p>
            </div>
        </section>
    );
}
