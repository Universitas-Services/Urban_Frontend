import { INICIO_HERO } from './inicio.data';

export function InicioHero() {
    return (
        <section className="inicio-hero-card relative min-h-[280px] overflow-hidden rounded-xl border border-sidebar-border shadow-sm md:min-h-[300px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={INICIO_HERO.imageSrc}
                alt={INICIO_HERO.imageAlt}
                className="inicio-hero-card__image"
                draggable={false}
            />

            <div className="inicio-hero-card__overlay" aria-hidden />

            <div className="inicio-hero-card__content relative z-10 flex max-w-xl flex-col gap-2 p-4 md:max-w-2xl md:p-6">
                <h1 className="titulos-cards mb-0 leading-tight tracking-tight">{INICIO_HERO.title}</h1>
                <p className="text-xs font-semibold italic text-accent md:text-[0.8rem]">{INICIO_HERO.subtitle}</p>
                <p className="descripcion-cards leading-snug">{INICIO_HERO.description}</p>
            </div>
        </section>
    );
}
