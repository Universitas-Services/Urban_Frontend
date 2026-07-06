import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    formatBibliotecaDisplayValue,
    formatBibliotecaFecha,
    getBibliotecaDocumentoDescripcion,
} from './biblioteca-legal.filters';
import { getBibliotecaEnteEmisorLabel } from './biblioteca-legal.category';
import type { BibliotecaLegalDocumento } from './biblioteca-legal.types';

export type BibliotecaLegalColeccionViewMode = 'grid' | 'list';

type BibliotecaLegalColeccionDocumentCardProps = {
    documento: BibliotecaLegalDocumento;
    categoryId: string;
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
    categoryId,
    viewMode = 'grid',
    onPreview,
    className,
}: BibliotecaLegalColeccionDocumentCardProps) {
    const tipo = formatBibliotecaDisplayValue(documento.tipoNorma);
    const emisor = formatBibliotecaDisplayValue(documento.enteEmisor);
    const emisorLabel = getBibliotecaEnteEmisorLabel(categoryId);
    const fecha = formatBibliotecaFecha(documento.fechaPublicacion);
    const descripcion = getBibliotecaDocumentoDescripcion(documento);

    if (viewMode === 'list') {
        return (
            <article
                className={cn(
                    'flex flex-col gap-4 rounded-xl border border-gray-200/70 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-start',
                    className
                )}
            >
                <div className="flex min-w-0 flex-1 gap-3">
                    <div className="biblioteca-coleccion-doc-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-lg">
                        <FileText className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="titulos-cards-proyecto-ley break-words text-[15px] leading-snug">
                            {documento.titulo}
                        </h3>
                        {descripcion ? (
                            <p className="descripcion-cards-small mt-1 break-words text-gray-soft">{descripcion}</p>
                        ) : null}
                        <dl className="descripcion-cards-small mt-2 grid gap-x-4 gap-y-2 text-gray-soft sm:grid-cols-2 lg:grid-cols-3">
                            <div className="min-w-0">
                                <dt className="sr-only">Tipo</dt>
                                <dd className="break-words">
                                    <span className="font-medium text-neutral-dark/70">Tipo: </span>
                                    {tipo}
                                </dd>
                            </div>
                            <div className="min-w-0">
                                <dt className="sr-only">{emisorLabel}</dt>
                                <dd className="break-words">
                                    <span className="font-medium text-neutral-dark/70">{emisorLabel}: </span>
                                    {emisor}
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
                <h3 className="titulos-cards-proyecto-ley min-w-0 flex-1 break-words text-[15px] leading-snug">
                    {documento.titulo}
                </h3>
            </div>

            {descripcion ? (
                <p className="descripcion-cards-small mt-2 break-words text-gray-soft">{descripcion}</p>
            ) : null}

            <dl className="descripcion-cards-small mt-3 space-y-2 text-gray-soft">
                <div className="min-w-0">
                    <dt className="sr-only">Tipo</dt>
                    <dd className="break-words">
                        <span className="font-medium text-neutral-dark/70">Tipo: </span>
                        {tipo}
                    </dd>
                </div>
                <div className="min-w-0">
                    <dt className="sr-only">{emisorLabel}</dt>
                    <dd className="break-words">
                        <span className="font-medium text-neutral-dark/70">{emisorLabel}: </span>
                        {emisor}
                    </dd>
                </div>
                <div>
                    <dt className="sr-only">Fecha</dt>
                    <dd className="break-words">
                        <span className="font-medium text-neutral-dark/70">Fecha: </span>
                        {fecha}
                    </dd>
                </div>
            </dl>

            <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-100 pt-3">
                <VerDocumentoButton onClick={() => onPreview(documento)} />
            </div>
        </article>
    );
}
