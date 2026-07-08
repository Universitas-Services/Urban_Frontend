'use client';

import { PdfPreviewModal } from '@/components/shared/PdfPreviewModal';
import { getBibliotecaDocumentoDescripcion } from './biblioteca-legal.filters';
import type { BibliotecaLegalDocumento } from './biblioteca-legal.types';

type BibliotecaLegalPreviewModalProps = {
    open: boolean;
    documento: BibliotecaLegalDocumento | null;
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
    const descripcion = documento ? getBibliotecaDocumentoDescripcion(documento) : '';
    const isPendiente = documento?.gcpFileName?.startsWith('pendientes/') ?? false;

    return (
        <PdfPreviewModal
            open={open}
            title={documento?.titulo ?? 'Documento'}
            description={descripcion || undefined}
            pdfUrl={signedUrl}
            isLoading={isLoading}
            error={error}
            onOpenChange={onOpenChange}
            onRetry={onRetry}
            footerNote={
                isPendiente
                    ? 'Este documento aún está en carpeta pendiente y puede no tener archivo publicado en el bucket.'
                    : undefined
            }
        />
    );
}
