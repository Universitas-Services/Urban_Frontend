'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Documento } from '@/lib/services/documents.service';
import {
    getMacroTipoLabel,
    getPublishedCardFields,
    getPublishedDocumentSummary,
    getPublishedDocumentSubtitle,
    getPublishedDocumentTitle,
} from './biblioteca-legal.published';

export type BibliotecaLegalColeccionViewMode = 'grid' | 'list';

type BibliotecaLegalColeccionDocumentCardProps = {
    documento: Documento;
    categoryId: string;
    viewMode?: BibliotecaLegalColeccionViewMode;
    className?: string;
};

function VerDocumentoLink({ href }: { href: string }) {
    return (
        <Link
            href={href}
            className="biblioteca-category-link inline-flex shrink-0 items-center gap-1 text-sm font-semibold"
        >
            Ver documento
            <span aria-hidden>→</span>
        </Link>
    );
}

function DocumentFields({ documento }: { documento: Documento }) {
    const fields = getPublishedCardFields(documento);

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
    categoryId,
    viewMode = 'grid',
    className,
}: BibliotecaLegalColeccionDocumentCardProps) {
    const title = getPublishedDocumentTitle(documento);
    const subtitle = getPublishedDocumentSubtitle(documento);
    const summary = getPublishedDocumentSummary(documento);
    const tipoLabel = getMacroTipoLabel(documento.macroTipo);
    const detailHref = `/biblioteca-legal/${categoryId}/${documento.id}`;

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
                            {tipoLabel}
                        </span>
                        <h3 className="titulos-cards-proyecto-ley break-words text-[15px] leading-snug">
                            <Link href={detailHref} className="hover:underline">
                                {title}
                            </Link>
                        </h3>
                        {subtitle ? (
                            <p className="descripcion-cards-small mt-1 line-clamp-2 break-words text-gray-soft">
                                {subtitle}
                            </p>
                        ) : null}
                        {summary ? (
                            <p className="descripcion-cards-small mt-1 line-clamp-2 break-words text-gray-soft">
                                {summary}
                            </p>
                        ) : null}
                        <div className="mt-2">
                            <DocumentFields documento={documento} />
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 items-center justify-end border-t border-gray-100 pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4">
                    <VerDocumentoLink href={detailHref} />
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
                        {tipoLabel}
                    </span>
                    <h3 className="titulos-cards-proyecto-ley break-words text-[15px] leading-snug">
                        <Link href={detailHref} className="hover:underline">
                            {title}
                        </Link>
                    </h3>
                </div>
            </div>

            {summary ? (
                <p className="descripcion-cards-small mt-2 line-clamp-3 break-words text-gray-soft">{summary}</p>
            ) : null}

            <div className="mt-3 flex-1">
                <DocumentFields documento={documento} />
            </div>

            <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-100 pt-3">
                <VerDocumentoLink href={detailHref} />
            </div>
        </article>
    );
}
