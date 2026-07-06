'use server';

import type {
    BibliotecaLegalDocumentosQuery,
    BibliotecaLegalDocumentosResponse,
    BibliotecaLegalPreview,
} from '@/components/biblioteca-legal/biblioteca-legal.types';
import {
    normalizeBibliotecaDocumentosPaginatedResponse,
    normalizeBibliotecaPreviewResponse,
} from '@/components/biblioteca-legal/biblioteca-legal.mapper';
import { getAuthHeader } from '@/lib/auth/session';

const API = process.env.API_URL?.replace(/\/+$/, '') ?? '';

type ApiError = Error & { status?: number };

async function parseErrorMessage(res: Response): Promise<string> {
    const err = await res.json().catch(() => ({}));
    const body = err as { message?: string | string[]; error?: string };

    if (Array.isArray(body.message)) return body.message[0] ?? 'Error del servidor';
    if (typeof body.message === 'string' && body.message.trim()) return body.message;
    if (typeof body.error === 'string' && body.error.trim()) return body.error;

    return 'Error del servidor';
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const message = await parseErrorMessage(res);
        const error = new Error(message) as ApiError;
        error.status = res.status;
        throw error;
    }
    if (res.status === 204) return undefined as T;
    return res.json();
}

function buildDocumentosQuery(params?: BibliotecaLegalDocumentosQuery): string {
    const searchParams = new URLSearchParams();

    if (params?.search?.trim()) {
        searchParams.set('search', params.search.trim());
    }
    if (params?.page && params.page > 0) {
        searchParams.set('page', String(params.page));
    }
    if (params?.limit && params.limit > 0) {
        searchParams.set('limit', String(Math.min(params.limit, 100)));
    }

    const query = searchParams.toString();
    return query ? `?${query}` : '';
}

export async function getBibliotecaLegalDocumentosService(
    params?: BibliotecaLegalDocumentosQuery
): Promise<BibliotecaLegalDocumentosResponse> {
    const res = await fetch(`${API}/biblioteca-legal/documentos${buildDocumentosQuery(params)}`, {
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

    const data = await handleResponse<unknown>(res);
    return normalizeBibliotecaDocumentosPaginatedResponse(data, params);
}

export async function getBibliotecaLegalPreviewService(id: string): Promise<BibliotecaLegalPreview> {
    const trimmedId = id.trim();
    if (!trimmedId) {
        throw new Error('No se recibió un ID de documento válido para la previsualización.');
    }

    const res = await fetch(`${API}/biblioteca-legal/documentos/preview/${encodeURIComponent(trimmedId)}`, {
        headers: await getAuthHeader(),
        cache: 'no-store',
    });

    if (!res.ok) {
        const message = await parseErrorMessage(res);

        if (res.status === 404) {
            throw new Error(message || 'No existe un documento con ese ID en la biblioteca legal.');
        }

        if (res.status === 500) {
            throw new Error(
                message || 'No se pudo generar la URL de previsualización. El archivo puede no estar disponible.'
            );
        }

        throw new Error(message);
    }

    const rawBody = await res.text();
    const signedUrl = normalizeBibliotecaPreviewResponse(parsePreviewResponseBody(rawBody));

    return { signedUrl };
}

function parsePreviewResponseBody(rawBody: string): unknown {
    const trimmed = rawBody.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
    }

    try {
        return JSON.parse(trimmed) as unknown;
    } catch {
        return trimmed;
    }
}
