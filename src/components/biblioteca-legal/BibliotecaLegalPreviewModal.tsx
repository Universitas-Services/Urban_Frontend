'use client';

import { ExternalLink, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Documento } from '@/lib/services/documents.service';
import {
    getPublishedDetailFields,
    getPublishedDocumentSummary,
    getPublishedDocumentTitle,
} from './biblioteca-legal.published';

type BibliotecaLegalPreviewModalProps = {
    open: boolean;
    documento: Documento | null;
    signedUrl: string | null;
    isLoading: boolean;
    error: string | null;
    onOpenChange: (open: boolean) => void;
    onRetry?: () => void;
};

export function BibliotecaLegalPreviewModal({
    open,
    documento,
    signedUrl,
    isLoading,
    error,
    onOpenChange,
    onRetry,
}: BibliotecaLegalPreviewModalProps) {
    const title = documento ? getPublishedDocumentTitle(documento) : 'Documento';
    const summary = documento ? getPublishedDocumentSummary(documento) : '';
    const detailFields = documento ? getPublishedDetailFields(documento) : [];
    const descripcionLarga = documento?.resumenDescriptivo?.trim() || '';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[92vh] w-[min(98vw,1100px)] max-w-[1100px] flex-col gap-0 overflow-hidden p-0">
                <DialogHeader className="shrink-0 space-y-1 border-b border-gray-100 px-5 py-4">
                    <DialogTitle className="titulos-cards-proyecto-ley pr-8 text-left text-base leading-snug md:text-lg">
                        {title}
                    </DialogTitle>
                    {summary ? (
                        <DialogDescription className="descripcion-cards-small line-clamp-2 text-left">
                            {summary}
                        </DialogDescription>
                    ) : (
                        <DialogDescription className="sr-only">Detalle y vista previa del documento</DialogDescription>
                    )}
                </DialogHeader>

                <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(260px,340px)_1fr]">
                    <aside className="custom-scrollbar max-h-[40vh] space-y-4 overflow-y-auto border-b border-gray-100 px-5 py-4 lg:max-h-none lg:border-r lg:border-b-0">
                        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Datos del documento
                        </h3>
                        <dl className="space-y-2.5 text-sm">
                            {detailFields.map((field) => (
                                <div key={field.label} className="min-w-0">
                                    <dt className="text-xs text-muted-foreground">{field.label}</dt>
                                    <dd className="break-words font-medium text-neutral-dark">{field.value}</dd>
                                </div>
                            ))}
                        </dl>
                        {descripcionLarga ? (
                            <div>
                                <p className="mb-1 text-xs text-muted-foreground">Resumen descriptivo</p>
                                <p className="descripcion-cards-small whitespace-pre-wrap leading-relaxed text-gray-soft">
                                    {descripcionLarga}
                                </p>
                            </div>
                        ) : null}
                    </aside>

                    <div className="flex min-h-0 flex-col gap-3 px-5 py-4">
                        <div
                            className="relative mx-auto w-full flex-1 overflow-hidden rounded-xl border border-gray-200/70 bg-surface-soft/30 shadow-inner"
                            style={{ minHeight: 'min(55vh, 560px)' }}
                        >
                            {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Cargando PDF" />
                                </div>
                            ) : null}

                            {!isLoading && error ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                                    <p className="descripcion-cards-small text-gray-soft">{error}</p>
                                </div>
                            ) : null}

                            {!isLoading && signedUrl ? (
                                <iframe
                                    src={signedUrl}
                                    title={title}
                                    className="absolute inset-0 h-full w-full bg-white"
                                />
                            ) : null}
                        </div>

                        <div className="flex shrink-0 justify-end gap-2">
                            {error && onRetry ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-200/80"
                                    onClick={onRetry}
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Reintentar
                                </Button>
                            ) : null}
                            {signedUrl ? (
                                <Button type="button" size="sm" asChild>
                                    <a href={signedUrl} target="_blank" rel="noreferrer">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Abrir en pestaña
                                    </a>
                                </Button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
