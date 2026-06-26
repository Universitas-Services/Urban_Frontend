import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { INICIO_ACTUALIDAD, INICIO_ACTUALIDAD_DESTACADOS } from './inicio.data';

export function InicioActualidad() {
    return (
        <section className="flex flex-col rounded-xl border border-gray-200/70 bg-white px-4 py-4 shadow-sm md:px-5 md:py-5 lg:col-span-2">
            <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                </div>
                <h2 className="titulos-cards-proyecto-ley leading-tight">{INICIO_ACTUALIDAD.title}</h2>
            </div>

            <p className="descripcion-cards-small mb-4 leading-snug">{INICIO_ACTUALIDAD.description}</p>

            <ul className="mb-5 flex flex-col gap-2.5">
                {INICIO_ACTUALIDAD_DESTACADOS.map((item) => (
                    <li
                        key={item.id}
                        className="rounded-lg border border-gray-100 bg-surface-soft/30 px-3 py-2.5 transition-colors hover:border-primary/15 hover:bg-surface-soft/60"
                    >
                        <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wide text-primary/70">
                            {item.category}
                        </p>
                        <p className="text-sm font-semibold leading-snug text-primary">{item.title}</p>
                    </li>
                ))}
            </ul>

            <Link
                href={INICIO_ACTUALIDAD.href}
                className="mt-auto inline-flex h-8 w-fit items-center gap-1.5 rounded-lg bg-primary px-5 text-xs font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
                {INICIO_ACTUALIDAD.buttonLabel}
                <ArrowRight className="h-3.5 w-3.5" />
            </Link>
        </section>
    );
}
