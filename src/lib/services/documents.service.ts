'use server';

import { authenticatedFetch } from '@/lib/auth/session';
import type { MacroTipoDocumento } from '@/lib/services/documents.types';

export type { MacroTipoDocumento } from '@/lib/services/documents.types';
export type EstadoDocumento = 'PENDIENTE_REVISION' | 'PUBLICADO' | 'RECHAZADO';

export interface DocumentoEtiquetaRef {
    etiqueta: {
        id: string;
        nombre: string;
    };
}

export type AccionRevision = 'APROBADO' | 'RECHAZADO' | 'REENVIADO';

export interface Documento {
    id: string;
    autorId: string;
    macroTipo: MacroTipoDocumento;
    carpetaSlug: string;
    tituloIntegro: string;
    tituloBreve: string;
    parametrosEspecificos: Record<string, unknown>;
    enteEmisor: string;
    fechaPublicacion: string | null;
    categorias: string | null;
    resumenDescriptivo: string;
    resumenCorto: string | null;
    palabrasClave: string | null;
    legibilidadPdf: 'PDF_TEXTO' | 'SOLO_IMAGEN';
    archivoPath: string;
    archivoUrl: string;
    estado: EstadoDocumento;
    motivoRechazo: string | null;
    visibleEnBiblioteca?: boolean;
    createdAt: string;
    updatedAt: string;
    previewUrl?: string | null;
    etiquetas?: DocumentoEtiquetaRef[];
}

export interface DocumentoRevisionActor {
    id: string;
    nombre: string;
    apellido: string | null;
    email: string;
    role: string;
}

export interface DocumentoRevision {
    id: string;
    documentoId: string;
    actorId: string;
    accion: AccionRevision;
    motivo: string | null;
    createdAt: string;
    actor?: DocumentoRevisionActor;
    documento?: {
        id: string;
        tituloBreve: string;
        tituloIntegro: string;
        estado: EstadoDocumento;
        macroTipo: MacroTipoDocumento;
        enteEmisor: string;
    };
}

export interface DocumentStats {
    total: number;
    pendientes: number;
    rechazados: number;
    publicados: number;
}

export interface DocumentsListResponse {
    items: Documento[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface UploadDocumentMetadata {
    macroTipo: MacroTipoDocumento;
    tituloIntegro: string;
    tituloBreve: string;
    parametrosEspecificos: Record<string, unknown>;
    enteEmisor: string;
    fechaPublicacion?: string | null;
    categorias?: string;
    etiquetaIds?: string[];
    resumenDescriptivo: string;
    resumenCorto?: string;
    palabrasClave?: string;
    noLegible?: boolean;
}

export interface DocumentsQueryParams {
    estado?: EstadoDocumento;
    page?: number;
    limit?: number;
    q?: string;
    macroTipo?: MacroTipoDocumento;
    etiquetaId?: string;
    visible?: boolean;
}

export interface RevisionsListResponse {
    items: DocumentoRevision[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
}

const API = process.env.API_URL?.replace(/\/+$/, '') ?? '';

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const message = Array.isArray(err.message) ? err.message[0] : err.message || err.error || 'Error del servidor';
        throw new Error(message);
    }
    if (res.status === 204) return undefined as T;
    return res.json();
}

/** Credenciales cortas para subir PDF desde el navegador (evita límite Netlify). */
export async function getDocumentsUploadAuthAction(): Promise<{
    apiBaseUrl: string;
    accessToken: string;
}> {
    if (!API) {
        throw new Error('API_URL no está configurada en el frontend.');
    }
    const { getServerToken } = await import('@/lib/auth/session');
    const accessToken = await getServerToken();
    if (!accessToken) {
        throw new Error('Sesión expirada. Vuelve a iniciar sesión.');
    }
    return { apiBaseUrl: API, accessToken };
}

function toQuery(params?: DocumentsQueryParams): string {
    if (!params) return '';
    const search = new URLSearchParams();
    if (params.estado) search.set('estado', params.estado);
    if (params.page) search.set('page', String(params.page));
    if (params.limit) search.set('limit', String(params.limit));
    if (params.q?.trim()) search.set('q', params.q.trim());
    if (params.macroTipo) search.set('macroTipo', params.macroTipo);
    if (params.etiquetaId) search.set('etiquetaId', params.etiquetaId);
    if (typeof params.visible === 'boolean') {
        search.set('visible', String(params.visible));
    }
    const qs = search.toString();
    return qs ? `?${qs}` : '';
}

export async function getDocumentStatsAction(): Promise<DocumentStats> {
    const res = await authenticatedFetch(`${API}/documents/mine/stats`);
    return handleResponse<DocumentStats>(res);
}

export async function getMyDocumentsAction(params?: DocumentsQueryParams): Promise<DocumentsListResponse> {
    const res = await authenticatedFetch(`${API}/documents/mine${toQuery(params)}`);
    return handleResponse<DocumentsListResponse>(res);
}

export async function getPendingDocumentsAction(params?: DocumentsQueryParams): Promise<DocumentsListResponse> {
    const res = await authenticatedFetch(`${API}/documents/pending${toQuery(params)}`);
    return handleResponse<DocumentsListResponse>(res);
}

export async function getPendingStatsAction(): Promise<{ pendientes: number }> {
    const res = await authenticatedFetch(`${API}/documents/pending/stats`);
    return handleResponse<{ pendientes: number }>(res);
}

export async function approveDocumentAction(id: string): Promise<Documento> {
    const res = await authenticatedFetch(`${API}/documents/${id}/approve`, {
        method: 'PATCH',
    });
    return handleResponse<Documento>(res);
}

export async function rejectDocumentAction(id: string, motivoRechazo: string): Promise<Documento> {
    const res = await authenticatedFetch(`${API}/documents/${id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ motivoRechazo }),
    });
    return handleResponse<Documento>(res);
}

export async function getPublishedDocumentsAction(params?: DocumentsQueryParams): Promise<DocumentsListResponse> {
    const res = await authenticatedFetch(`${API}/documents/published${toQuery(params)}`);
    return handleResponse<DocumentsListResponse>(res);
}

export async function getDocumentByIdAction(id: string): Promise<Documento> {
    const res = await authenticatedFetch(`${API}/documents/${id}`);
    return handleResponse<Documento>(res);
}

/** @deprecated No usar: el PDF debe subirse con uploadDocumentDirect (cliente → Cloud Run). */
export async function uploadDocumentAction(_formData: FormData): Promise<Documento> {
    throw new Error('uploadDocumentAction está deshabilitado. Usa uploadDocumentDirect desde el cliente.');
}

export async function resubmitDocumentAction(id: string): Promise<Documento> {
    const res = await authenticatedFetch(`${API}/documents/${id}/resubmit`, {
        method: 'PATCH',
    });
    return handleResponse<Documento>(res);
}

/** @deprecated No usar: corrige con correctDocumentDirect (cliente → Cloud Run). */
export async function correctAndResubmitDocumentAction(_id: string, _formData: FormData): Promise<Documento> {
    throw new Error('correctAndResubmitDocumentAction está deshabilitado. Usa correctDocumentDirect desde el cliente.');
}

export async function deleteDocumentAction(id: string): Promise<Documento> {
    const res = await authenticatedFetch(`${API}/documents/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<Documento>(res);
}

export async function updateDocumentVisibilityAction(id: string, visibleEnBiblioteca: boolean): Promise<Documento> {
    const res = await authenticatedFetch(`${API}/documents/${id}/visibility`, {
        method: 'PATCH',
        body: JSON.stringify({ visibleEnBiblioteca }),
    });
    return handleResponse<Documento>(res);
}

export async function getDocumentRevisionesAction(id: string): Promise<{ items: DocumentoRevision[] }> {
    const res = await authenticatedFetch(`${API}/documents/${id}/revisiones`);
    return handleResponse<{ items: DocumentoRevision[] }>(res);
}

export async function getReviewHistoryAction(params?: DocumentsQueryParams): Promise<RevisionsListResponse> {
    const res = await authenticatedFetch(`${API}/documents/review/history${toQuery(params)}`);
    return handleResponse<RevisionsListResponse>(res);
}
