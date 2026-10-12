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

/** La API limita `limit` a 100 por página. */
const MAX_PAGE_SIZE = 100;

/** Catálogo completo (recorre todas las páginas; la API no devuelve más de 100 por request). */
export async function getAllEtiquetasAction(): Promise<Etiqueta[]> {
    const first = await getEtiquetasAction({ page: 1, limit: MAX_PAGE_SIZE });
    const items = [...first.items];
    for (let page = 2; page <= first.totalPages; page++) {
        const res = await getEtiquetasAction({ page, limit: MAX_PAGE_SIZE });
        items.push(...res.items);
    }
    return items;
}

export type CreateEtiquetaResult = { ok: true; etiqueta: Etiqueta } | { ok: false; error: string; existing?: Etiqueta };

function normalizeNombre(nombre: string) {
    return nombre.trim().replace(/\s+/g, ' ').toLowerCase();
}

async function readErrorMessage(res: Response): Promise<string> {
    const err = await res.json().catch(() => ({}));
    const message = Array.isArray(err.message) ? err.message[0] : err.message || err.error;
    if (res.status === 401) return 'Tu sesión expiró. Vuelve a iniciar sesión.';
    if (res.status === 403) return 'No tienes permiso para crear etiquetas.';
    if (res.status >= 500) return 'El servidor no pudo crear la etiqueta. Intenta de nuevo o avisa al administrador.';
    return typeof message === 'string' && message.trim() ? message : `Error del servidor (${res.status})`;
}

/**
 * Crea una etiqueta. No lanza: en producción Next oculta el mensaje de las
 * excepciones de server actions (React #441), así que devolvemos el error.
 * Ante 409 busca la etiqueta existente para que el cliente pueda seleccionarla.
 */
export async function createEtiquetaAction(data: { nombre: string }): Promise<CreateEtiquetaResult> {
    try {
        const res = await authenticatedFetch(`${API}/etiquetas`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (res.ok) return { ok: true, etiqueta: (await res.json()) as Etiqueta };

        const error = await readErrorMessage(res);
        if (res.status === 409) {
            const target = normalizeNombre(data.nombre);
            const found = await getEtiquetasAction({ q: data.nombre.trim(), limit: MAX_PAGE_SIZE }).catch(() => null);
            const existing = found?.items.find((tag) => normalizeNombre(tag.nombre) === target);
            return { ok: false, error, existing };
        }
        return { ok: false, error };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error && error.message ? error.message : 'No se pudo crear la etiqueta',
        };
    }
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
