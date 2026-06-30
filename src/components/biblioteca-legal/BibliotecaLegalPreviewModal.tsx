'use client';

import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { BibliotecaLegalDocumento } from './biblioteca-legal.types';

type BibliotecaLegalPreviewModalProps = {
    open: boolean;
    documento: BibliotecaLegalDocumento | null;
    signedUrl: string | null;
    isLoading: boolean;
    error: string | null;
    onOpenChange: (open: boolean) => void;
};

export function BibliotecaLegalPreviewModal({
    open,
    documento,
    signedUrl,
    isLoading,
    error,
    onOpenChange,
}: BibliotecaLegalPreviewModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[95vh] flex-col gap-4 overflow-hidden p-4 sm:max-w-4xl md:p-6">
                <DialogHeader>
                    <DialogTitle className="titulos-cards-proyecto-ley pr-8 text-left leading-snug">
                        {documento?.titulo ?? 'Documento'}
                    </DialogTitle>
                    {documento?.descripcion ? (
                        <DialogDescription className="descripcion-cards-small text-left">
                            {documento.descripcion}
                        </DialogDescription>
                    ) : null}
                </DialogHeader>

                <div className="min-h-[50vh] flex-1 overflow-hidden rounded-xl border border-gray-200/70 bg-surface-soft/30">
                    {isLoading ? (
                        <div className="flex h-full min-h-[50vh] items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : null}

                    {!isLoading && error ? (
                        <div className="flex h-full min-h-[50vh] items-center justify-center px-6 text-center">
                            <p className="descripcion-cards-small text-gray-soft">{error}</p>
                        </div>
                    ) : null}

                    {!isLoading && signedUrl ? (
                        <iframe
                            src={signedUrl}
                            title={documento?.titulo ?? 'Vista previa del documento'}
                            className="aspect-[3/4] h-full min-h-[50vh] w-full md:aspect-video"
                        />
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
