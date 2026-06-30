import { cn } from '@/lib/utils';
import type { BibliotecaLegalColeccionDocumento } from './biblioteca-legal.coleccion.data';

export type BibliotecaLegalColeccionViewMode = 'grid' | 'list';

type BibliotecaLegalColeccionDocumentCardProps = {
    documento: BibliotecaLegalColeccionDocumento;
    viewMode?: BibliotecaLegalColeccionViewMode;
    className?: string;
};

const STATUS_LABELS = {
    vigente: 'Vigente',
    'parcialmente-vigente': 'Parcialmente vigente',
} as const;

function StatusBadge({ status }: { status: BibliotecaLegalColeccionDocumento['status'] }) {
    return (
        <span
            className={cn(
                'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                status === 'vigente' ? 'biblioteca-coleccion-badge--vigente' : 'biblioteca-coleccion-badge--parcial'
            )}
        >
            {STATUS_LABELS[status]}
        </span>
    );
}

function VerDocumentoButton() {
    return (
        <button
            type="button"
            className="biblioteca-category-link inline-flex shrink-0 items-center gap-1 text-sm font-semibold"
        >
            Ver documento
            <span aria-hidden>→</span>
        </button>
    );
}

export function BibliotecaLegalColeccionDocumentCard({
    documento,
    viewMode = 'grid',
    className,
}: BibliotecaLegalColeccionDocumentCardProps) {
    const Icon = documento.icon;

    if (viewMode === 'list') {
        return (
            <article
                className={cn(
                    'flex flex-col gap-4 rounded-xl border border-gray-200/70 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center',
                    className
                )}
            >
                <div className="flex min-w-0 flex-1 gap-3">
                    <div className="biblioteca-coleccion-doc-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-lg">
                        <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="titulos-cards-proyecto-ley text-[15px] leading-snug">{documento.title}</h3>
                        <dl className="descripcion-cards-small mt-2 grid gap-x-4 gap-y-1 text-gray-soft sm:grid-cols-2 lg:grid-cols-4">
                            <div className="min-w-0">
                                <dt className="sr-only">Municipio</dt>
                                <dd className="truncate">
                                    <span className="font-medium text-neutral-dark/70">Municipio: </span>
                                    {documento.municipio}
                                </dd>
                            </div>
                            <div className="min-w-0">
                                <dt className="sr-only">Estado</dt>
                                <dd className="truncate">
                                    <span className="font-medium text-neutral-dark/70">Estado: </span>
                                    {documento.estado}
                                </dd>
                            </div>
                            <div className="min-w-0">
                                <dt className="sr-only">Gaceta</dt>
                                <dd className="truncate">
                                    <span className="font-medium text-neutral-dark/70">Gaceta: </span>
                                    {documento.gaceta}
                                </dd>
                            </div>
                            <div>
                                <dt className="sr-only">Fecha</dt>
                                <dd>
                                    <span className="font-medium text-neutral-dark/70">Fecha: </span>
                                    {documento.fecha}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 pt-3 sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4">
                    <StatusBadge status={documento.status} />
                    <VerDocumentoButton />
                </div>
            </article>
        );
    }

    return (
        <article
            className={cn(
                'flex h-full flex-col rounded-xl border border-gray-200/70 bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
                className
            )}
        >
            <div className="flex gap-3">
                <div className="biblioteca-coleccion-doc-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-lg">
                    <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="titulos-cards-proyecto-ley line-clamp-3 min-w-0 flex-1 text-[15px] leading-snug">
                    {documento.title}
                </h3>
            </div>

            <dl className="descripcion-cards-small mt-3 space-y-1 text-gray-soft">
                <div className="flex gap-1">
                    <dt className="shrink-0 font-medium text-neutral-dark/70">Municipio:</dt>
                    <dd className="min-w-0 truncate">{documento.municipio}</dd>
                </div>
                <div className="flex gap-1">
                    <dt className="shrink-0 font-medium text-neutral-dark/70">Estado:</dt>
                    <dd className="min-w-0 truncate">{documento.estado}</dd>
                </div>
                <div className="flex gap-1">
                    <dt className="shrink-0 font-medium text-neutral-dark/70">Gaceta:</dt>
                    <dd className="min-w-0 truncate">{documento.gaceta}</dd>
                </div>
                <div className="flex gap-1">
                    <dt className="shrink-0 font-medium text-neutral-dark/70">Fecha:</dt>
                    <dd>{documento.fecha}</dd>
                </div>
            </dl>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                <StatusBadge status={documento.status} />
                <VerDocumentoButton />
            </div>
        </article>
    );
}
