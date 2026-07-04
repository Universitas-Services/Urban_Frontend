import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    formatBibliotecaDisplayValue,
    formatBibliotecaFecha,
    getBibliotecaDocumentoDescripcion,
    getBibliotecaDocumentoReferencia,
} from './biblioteca-legal.filters';
import type { BibliotecaLegalDocumento } from './biblioteca-legal.types';

export type BibliotecaLegalColeccionViewMode = 'grid' | 'list';

type BibliotecaLegalColeccionDocumentCardProps = {
    documento: BibliotecaLegalDocumento;
    viewMode?: BibliotecaLegalColeccionViewMode;
    onPreview: (documento: BibliotecaLegalDocumento) => void;
    className?: string;
};

function VerDocumentoButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
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
    onPreview,
    className,
}: BibliotecaLegalColeccionDocumentCardProps) {
    const tipo = formatBibliotecaDisplayValue(documento.tipoNorma);
    const emisor = formatBibliotecaDisplayValue(documento.enteEmisor);
    const referencia = getBibliotecaDocumentoReferencia(documento);
    const fecha = formatBibliotecaFecha(documento.fechaPublicacion);
    const descripcion = getBibliotecaDocumentoDescripcion(documento);

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
                        <FileText className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="titulos-cards-proyecto-ley text-[15px] leading-snug">{documento.titulo}</h3>
                        {descripcion ? (
                            <p className="descripcion-cards-small mt-1 line-clamp-2 text-gray-soft">{descripcion}</p>
                        ) : null}
                        <dl className="descripcion-cards-small mt-2 grid gap-x-4 gap-y-1 text-gray-soft sm:grid-cols-2 lg:grid-cols-4">
                            <div className="min-w-0">
                                <dt className="sr-only">Tipo</dt>
                                <dd className="truncate">
                                    <span className="font-medium text-neutral-dark/70">Tipo: </span>
                                    {tipo}
                                </dd>
                            </div>
                            <div className="min-w-0">
                                <dt className="sr-only">Emisor</dt>
                                <dd className="truncate">
                                    <span className="font-medium text-neutral-dark/70">Emisor: </span>
                                    {emisor}
                                </dd>
                            </div>
                            <div className="min-w-0">
                                <dt className="sr-only">Referencia</dt>
                                <dd className="truncate">
                                    <span className="font-medium text-neutral-dark/70">Referencia: </span>
                                    {referencia}
                                </dd>
                            </div>
                            <div>
                                <dt className="sr-only">Fecha</dt>
                                <dd>
                                    <span className="font-medium text-neutral-dark/70">Fecha: </span>
                                    {fecha}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="flex shrink-0 items-center justify-end border-t border-gray-100 pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4">
                    <VerDocumentoButton onClick={() => onPreview(documento)} />
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
                    <FileText className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="titulos-cards-proyecto-ley line-clamp-3 min-w-0 flex-1 text-[15px] leading-snug">
                    {documento.titulo}
                </h3>
            </div>

            {descripcion ? (
                <p className="descripcion-cards-small mt-2 line-clamp-3 text-gray-soft">{descripcion}</p>
            ) : null}

            <dl className="descripcion-cards-small mt-3 space-y-1 text-gray-soft">
                <div className="flex gap-1">
                    <dt className="shrink-0 font-medium text-neutral-dark/70">Tipo:</dt>
                    <dd className="min-w-0 truncate">{tipo}</dd>
                </div>
                <div className="flex gap-1">
                    <dt className="shrink-0 font-medium text-neutral-dark/70">Emisor:</dt>
                    <dd className="min-w-0 truncate">{emisor}</dd>
                </div>
                <div className="flex gap-1">
                    <dt className="shrink-0 font-medium text-neutral-dark/70">Referencia:</dt>
                    <dd className="min-w-0 truncate">{referencia}</dd>
                </div>
                <div className="flex gap-1">
                    <dt className="shrink-0 font-medium text-neutral-dark/70">Fecha:</dt>
                    <dd>{fecha}</dd>
                </div>
            </dl>

            <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-100 pt-3">
                <VerDocumentoButton onClick={() => onPreview(documento)} />
            </div>
        </article>
    );
}
