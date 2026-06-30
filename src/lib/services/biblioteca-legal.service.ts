'use server';

import type {
    BibliotecaLegalDocumento,
    BibliotecaLegalPreview,
} from '@/components/biblioteca-legal/biblioteca-legal.types';
import { getAuthHeader } from '@/lib/auth/session';

const API = process.env.API_URL;

type ApiError = Error & { status?: number };

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const message = Array.isArray(err.message) ? err.message[0] : err.message || err.error || 'Error del servidor';
        const error = new Error(message) as ApiError;
        error.status = res.status;
        throw error;
    }
    if (res.status === 204) return undefined as T;
    return res.json();
}

function normalizeDocumentosList(
    data: BibliotecaLegalDocumento[] | { data: BibliotecaLegalDocumento[] }
): BibliotecaLegalDocumento[] {
    return Array.isArray(data) ? data : data.data;
}

export async function getBibliotecaLegalDocumentosService(): Promise<BibliotecaLegalDocumento[]> {
    const res = await fetch(`${API}/biblioteca-legal/documentos`, {
        headers: await getAuthHeader(),
        cache: 'no-store',
    });

    if (res.status === 503) {
        const error = new Error(
            'No se pudo contactar el servicio de biblioteca. Puede estar iniciando; intenta de nuevo en unos segundos.'
        ) as ApiError;
        error.status = 503;
        throw error;
    }

    const data = await handleResponse<BibliotecaLegalDocumento[] | { data: BibliotecaLegalDocumento[] }>(res);
    return normalizeDocumentosList(data);
}

export async function getBibliotecaLegalPreviewService(id: string): Promise<BibliotecaLegalPreview> {
    const res = await fetch(`${API}/biblioteca-legal/documentos/preview/${id}`, {
        headers: await getAuthHeader(),
        cache: 'no-store',
    });

    if (res.status === 404) {
        const error = new Error('No existe un documento con ese ID en la biblioteca legal.') as ApiError;
        error.status = 404;
        throw error;
    }

    if (res.status === 500) {
        const error = new Error(
            'No se pudo generar la URL de previsualización. El archivo puede no estar disponible.'
        ) as ApiError;
        error.status = 500;
        throw error;
    }

    return handleResponse<BibliotecaLegalPreview>(res);
}
