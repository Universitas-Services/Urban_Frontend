'use client';

import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBibliotecaDocumentoDescripcion } from './biblioteca-legal.filters';
import {
    getBibliotecaDocumentoDisplayFields,
    getBibliotecaDocumentoDisplayTitle,
    getBibliotecaDocumentVariantLabel,
    resolveBibliotecaDocumentVariant,
} from './biblioteca-legal.document-variant';
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

function DocumentFields({ documento }: { documento: BibliotecaLegalDocumento }) {
    const fields = getBibliotecaDocumentoDisplayFields(documento).filter((field) => field.label !== 'Título');

    return (
        <dl className="descripcion-cards-small space-y-2 text-gray-soft">
            {fields.map((field) => (
                <div key={field.label} className="min-w-0">
                    <dt className="sr-only">{field.label}</dt>
                    <dd className="break-words">
                        <span className="font-medium text-neutral-dark/70">{field.label}: </span>
                        {field.value}
                    </dd>
                </div>
            ))}
        </dl>
    );
}

export function BibliotecaLegalColeccionDocumentCard({
    documento,
    viewMode = 'grid',
    onPreview,
    className,
}: BibliotecaLegalColeccionDocumentCardProps) {
    const variant = resolveBibliotecaDocumentVariant(documento);
    const variantLabel = getBibliotecaDocumentVariantLabel(variant);
    const title = getBibliotecaDocumentoDisplayTitle(documento);
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
                        <span className="mb-2 inline-flex rounded-full bg-surface-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary/80">
                            {variantLabel}
                        </span>
                        <h3 className="titulos-cards-proyecto-ley break-words text-[15px] leading-snug">{title}</h3>
                        {descripcion ? (
                            <p className="descripcion-cards-small mt-1 break-words text-gray-soft">{descripcion}</p>
                        ) : null}
                        <div className="mt-2">
                            <DocumentFields documento={documento} />
                        </div>
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
                <div className="min-w-0 flex-1">
                    <span className="mb-2 inline-flex rounded-full bg-surface-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary/80">
                        {variantLabel}
                    </span>
                    <h3 className="titulos-cards-proyecto-ley break-words text-[15px] leading-snug">{title}</h3>
                </div>
            </div>

            {descripcion ? (
                <p className="descripcion-cards-small mt-2 break-words text-gray-soft">{descripcion}</p>
            ) : null}

            <div className="mt-3 flex-1">
                <DocumentFields documento={documento} />
            </div>

            <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-100 pt-3">
                <VerDocumentoButton onClick={() => onPreview(documento)} />
            </div>
        </article>
    );
}
