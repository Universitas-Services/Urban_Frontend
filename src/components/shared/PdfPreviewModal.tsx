'use client';

import { ExternalLink, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type PdfPreviewModalProps = {
    open: boolean;
    title: string;
    description?: string;
    pdfUrl: string | null;
    isLoading?: boolean;
    error?: string | null;
    onOpenChange: (open: boolean) => void;
    onRetry?: () => void;
    footerNote?: string;
};

export function PdfPreviewModal({
    open,
    title,
    description,
    pdfUrl,
    isLoading = false,
    error = null,
    onOpenChange,
    onRetry,
    footerNote,
}: PdfPreviewModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex w-[min(96vw,520px)] max-w-[520px] flex-col gap-3 overflow-hidden p-4 sm:p-5">
                <DialogHeader className="shrink-0 space-y-1">
                    <DialogTitle className="titulos-cards-proyecto-ley pr-8 text-left text-base leading-snug">
                        {title}
                    </DialogTitle>
                    {description ? (
                        <DialogDescription className="descripcion-cards-small line-clamp-2 text-left">
                            {description}
                        </DialogDescription>
                    ) : null}
                </DialogHeader>

                <div
                    className="relative mx-auto w-full overflow-hidden rounded-xl border border-gray-200/70 bg-surface-soft/30 shadow-inner"
                    style={{ aspectRatio: '8.5 / 11', maxHeight: 'min(75vh, 673px)' }}
                >
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : null}

                    {!isLoading && error ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                            <p className="descripcion-cards-small text-gray-soft">{error}</p>
                            {footerNote ? (
                                <p className="descripcion-cards-small text-gray-soft/80">{footerNote}</p>
                            ) : null}
                        </div>
                    ) : null}

                    {!isLoading && pdfUrl ? (
                        <iframe src={pdfUrl} title={title} className="absolute inset-0 h-full w-full bg-white" />
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

                    {pdfUrl ? (
                        <Button asChild variant="outline" size="sm" className="border-gray-200/80">
                            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                                Abrir en nueva pestaña
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
