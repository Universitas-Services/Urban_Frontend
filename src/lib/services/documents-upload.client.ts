'use client';

import type { Documento } from '@/lib/services/documents.service';
import { getDocumentsUploadAuthAction } from '@/lib/services/documents.service';

function resolveApiBaseUrl(fromServer?: string): string {
    const raw = fromServer || process.env.NEXT_PUBLIC_API_URL || '';
    const base = raw.replace(/\/+$/, '');
    if (!base) {
        throw new Error('NEXT_PUBLIC_API_URL / API_URL no está configurada.');
    }
    return base;
}

async function readApiError(res: Response): Promise<string> {
    const err = await res.json().catch(() => ({}) as Record<string, unknown>);
    const message = err.message;
    if (Array.isArray(message)) return String(message[0] ?? 'Error del servidor');
    if (typeof message === 'string' && message.trim()) return message;
    if (typeof err.error === 'string') return err.error;
    return `Error del servidor (${res.status})`;
}

async function authorizedMultipart(path: string, method: 'POST' | 'PATCH', formData: FormData): Promise<Response> {
    const auth = await getDocumentsUploadAuthAction();
    const apiBaseUrl = resolveApiBaseUrl(auth.apiBaseUrl);
    return fetch(`${apiBaseUrl}${path}`, {
        method,
        headers: { Authorization: `Bearer ${auth.accessToken}` },
        body: formData,
    });
}

/**
 * Sube cualquier macro-tipo (legislación, ordenanza, sentencias, etc.)
 * directo a Cloud Run — no pasa el PDF por Netlify/Server Actions.
 */
export async function uploadDocumentDirect(formData: FormData): Promise<Documento> {
    const res = await authorizedMultipart('/documents/upload', 'POST', formData);
    if (!res.ok) throw new Error(await readApiError(res));
    return res.json();
}

/**
 * Corrige y reenvía (metadata + PDF opcional) directo a Cloud Run.
 */
export async function correctDocumentDirect(id: string, formData: FormData): Promise<Documento> {
    const res = await authorizedMultipart(`/documents/${id}/correct`, 'PATCH', formData);
    if (!res.ok) throw new Error(await readApiError(res));
    return res.json();
}
