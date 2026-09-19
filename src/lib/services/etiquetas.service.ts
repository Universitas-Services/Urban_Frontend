'use server';

import { authenticatedFetch } from '@/lib/auth/session';

const API = process.env.API_URL;

export interface Etiqueta {
    id: string;
    nombre: string;
    autorId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface EtiquetasListResponse {
    items: Etiqueta[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const message = Array.isArray(err.message) ? err.message[0] : err.message || err.error || 'Error del servidor';
        throw new Error(message);
    }
    if (res.status === 204) return undefined as T;
    return res.json();
}

function toQuery(params?: { page?: number; limit?: number; q?: string }): string {
    if (!params) return '';
    const search = new URLSearchParams();
    if (params.page) search.set('page', String(params.page));
    if (params.limit) search.set('limit', String(params.limit));
    if (params.q?.trim()) search.set('q', params.q.trim());
    const qs = search.toString();
    return qs ? `?${qs}` : '';
}

export async function getEtiquetasAction(params?: {
    page?: number;
    limit?: number;
    q?: string;
}): Promise<EtiquetasListResponse> {
    const res = await authenticatedFetch(`${API}/etiquetas${toQuery(params)}`);
    return handleResponse<EtiquetasListResponse>(res);
}

export async function createEtiquetaAction(data: { nombre: string }): Promise<Etiqueta> {
    const res = await authenticatedFetch(`${API}/etiquetas`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return handleResponse<Etiqueta>(res);
}

export async function updateEtiquetaAction(id: string, data: { nombre?: string }): Promise<Etiqueta> {
    const res = await authenticatedFetch(`${API}/etiquetas/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
    return handleResponse<Etiqueta>(res);
}

export async function deleteEtiquetaAction(id: string): Promise<Etiqueta> {
    const res = await authenticatedFetch(`${API}/etiquetas/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<Etiqueta>(res);
}
