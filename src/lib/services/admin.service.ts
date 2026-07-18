'use server';

import { getAuthHeader } from '@/lib/auth/session';
import { sdkApi } from '@/lib/api/universitas.sdk';
import type {
    AbandonedRegistration,
    AbandonedRegistrationsResponse,
    AdminManagedUser,
    CRMNote,
    CRMNotesResponse,
    GetUsersParams,
    UsersResponse,
} from '@/types/admin.types';

const API = process.env.API_URL;

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const message = Array.isArray(err.message) ? err.message[0] : err.message || err.error || 'Error del servidor';
        throw new Error(message);
    }
    if (res.status === 204) return undefined as T;
    return res.json();
}

function cleanParams(params?: GetUsersParams): Record<string, string | number | boolean> {
    const clean: Record<string, string | number | boolean> = {};
    if (!params) return clean;
    if (params.page !== undefined) clean.page = params.page;
    if (params.limit !== undefined) clean.limit = params.limit;
    if (params.search?.trim()) clean.search = params.search.trim();
    if (params.role) clean.role = params.role;
    if (params.isActive !== undefined) clean.isActive = params.isActive;
    if (params.estado) clean.estado = params.estado;
    if (params.municipio) clean.municipio = params.municipio;
    if (params.tipoUsuario) clean.tipoUsuario = params.tipoUsuario;
    if (params.estadoCuenta) clean.estadoCuenta = params.estadoCuenta;
    return clean;
}

function toQuery(params: Record<string, string | number | boolean>): string {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => search.set(key, String(value)));
    const qs = search.toString();
    return qs ? `?${qs}` : '';
}

export async function getAllUsersAction(params?: GetUsersParams): Promise<UsersResponse> {
    const res = await fetch(`${API}/admin/users${toQuery(cleanParams(params))}`, {
        headers: await getAuthHeader(),
        cache: 'no-store',
    });
    return handleResponse<UsersResponse>(res);
}

export async function getUserByIdAction(id: string): Promise<AdminManagedUser> {
    const res = await fetch(`${API}/admin/users/${id}`, {
        headers: await getAuthHeader(),
        cache: 'no-store',
    });
    return handleResponse<AdminManagedUser>(res);
}

export async function updateUserAction(id: string, data: Partial<AdminManagedUser>): Promise<AdminManagedUser> {
    const res = await fetch(`${API}/admin/users/${id}`, {
        method: 'PUT',
        headers: await getAuthHeader(),
        body: JSON.stringify(data),
        cache: 'no-store',
    });
    return handleResponse<AdminManagedUser>(res);
}

export async function deleteUserAction(id: string): Promise<void> {
    const res = await fetch(`${API}/admin/users/${id}`, {
        method: 'DELETE',
        headers: await getAuthHeader(),
        cache: 'no-store',
    });
    return handleResponse<void>(res);
}

export async function bulkDeleteUsersAction(userIds: string[]): Promise<void> {
    const res = await fetch(`${API}/admin/users/bulk-delete`, {
        method: 'POST',
        headers: await getAuthHeader(),
        body: JSON.stringify({ userIds }),
        cache: 'no-store',
    });
    return handleResponse<void>(res);
}

export async function toggleUserActiveAction(id: string): Promise<AdminManagedUser> {
    const res = await fetch(`${API}/admin/users/${id}/toggle-active`, {
        method: 'PATCH',
        headers: await getAuthHeader(),
        cache: 'no-store',
    });
    return handleResponse<AdminManagedUser>(res);
}

export async function updateUserRoleAction(userId: string, newRole: string): Promise<AdminManagedUser> {
    const res = await fetch(`${API}/admin/users/role`, {
        method: 'PATCH',
        headers: await getAuthHeader(),
        body: JSON.stringify({ userId, newRole }),
        cache: 'no-store',
    });
    return handleResponse<AdminManagedUser>(res);
}

export async function updateAccountStatusAction(
    id: string,
    data: { estadoCuenta: string; fechaVencimientoAcceso?: string }
): Promise<AdminManagedUser> {
    const res = await fetch(`${API}/admin/users/${id}/estado-cuenta`, {
        method: 'PATCH',
        headers: await getAuthHeader(),
        body: JSON.stringify(data),
        cache: 'no-store',
    });
    return handleResponse<AdminManagedUser>(res);
}

export async function convertToPrivateTrialAction(id: string): Promise<AdminManagedUser> {
    const res = await fetch(`${API}/admin/users/${id}/convert-to-private-trial`, {
        method: 'PATCH',
        headers: await getAuthHeader(),
        cache: 'no-store',
    });
    return handleResponse<AdminManagedUser>(res);
}

export async function convertToPublicAction(id: string): Promise<AdminManagedUser> {
    const res = await fetch(`${API}/admin/users/${id}/convert-to-public`, {
        method: 'PATCH',
        headers: await getAuthHeader(),
        cache: 'no-store',
    });
    return handleResponse<AdminManagedUser>(res);
}

export async function getCrmNotesAction(userId: string, page = 1, limit = 5): Promise<CRMNotesResponse> {
    const res = await fetch(`${API}/admin/users/${userId}/crm-notes?page=${page}&limit=${limit}`, {
        headers: await getAuthHeader(),
        cache: 'no-store',
    });
    return handleResponse<CRMNotesResponse>(res);
}

export async function createCrmNoteAction(
    userId: string,
    data: { content: string; etiqueta: string | null }
): Promise<CRMNote> {
    const res = await fetch(`${API}/admin/users/${userId}/crm-notes`, {
        method: 'POST',
        headers: await getAuthHeader(),
        body: JSON.stringify(data),
        cache: 'no-store',
    });
    return handleResponse<CRMNote>(res);
}

export async function updateCrmNoteAction(
    noteId: string,
    data: { content?: string; etiqueta?: string | null }
): Promise<CRMNote> {
    const res = await fetch(`${API}/admin/crm-notes/${noteId}`, {
        method: 'PATCH',
        headers: await getAuthHeader(),
        body: JSON.stringify(data),
        cache: 'no-store',
    });
    return handleResponse<CRMNote>(res);
}

export async function deleteCrmNoteAction(noteId: string): Promise<void> {
    const res = await fetch(`${API}/admin/crm-notes/${noteId}`, {
        method: 'DELETE',
        headers: await getAuthHeader(),
        cache: 'no-store',
    });
    return handleResponse<void>(res);
}

export interface TerritorioItem {
    id: number;
    nombre: string;
    estado_id?: number;
}

export async function getEstadosAction(): Promise<TerritorioItem[]> {
    const response = await sdkApi.territorio.getEstados();
    return response.data.map((estado) => ({
        id: estado.id,
        nombre: estado.nombre,
    }));
}

export async function getMunicipiosAction(estadoId: number): Promise<TerritorioItem[]> {
    const response = await sdkApi.territorio.getMunicipios(estadoId);
    return response.data.map((municipio) => ({
        id: municipio.id,
        nombre: municipio.nombre,
        estado_id: estadoId,
    }));
}

export async function addSubscriptionDaysAction(id: string): Promise<AdminManagedUser> {
    const res = await fetch(`${API}/admin/users/${id}/add-subscription`, {
        method: 'PATCH',
        headers: await getAuthHeader(),
        cache: 'no-store',
    });
    return handleResponse<AdminManagedUser>(res);
}

export async function subtractSubscriptionDaysAction(id: string): Promise<AdminManagedUser> {
    const res = await fetch(`${API}/admin/users/${id}/subtract-subscription`, {
        method: 'PATCH',
        headers: await getAuthHeader(),
        cache: 'no-store',
    });
    return handleResponse<AdminManagedUser>(res);
}

export async function createNewsAction(data: { title: string; content: string }): Promise<unknown> {
    const res = await fetch(`${API}/admin/news`, {
        method: 'POST',
        headers: await getAuthHeader(),
        body: JSON.stringify(data),
        cache: 'no-store',
    });
    return handleResponse(res);
}

export async function getAbandonedRegistrationsAction(params?: {
    page?: number;
    limit?: number;
    search?: string;
    tipoUsuario?: string;
}): Promise<AbandonedRegistrationsResponse> {
    const clean: Record<string, string | number> = {};
    if (params?.page !== undefined) clean.page = params.page;
    if (params?.limit !== undefined) clean.limit = params.limit;
    if (params?.search) clean.search = params.search;
    if (params?.tipoUsuario) clean.tipoUsuario = params.tipoUsuario;
    const res = await fetch(`${API}/admin/abandoned-registrations${toQuery(clean)}`, {
        headers: await getAuthHeader(),
        cache: 'no-store',
    });
    return handleResponse<AbandonedRegistrationsResponse>(res);
}

export async function getAbandonedRegistrationByIdAction(id: string): Promise<AbandonedRegistration> {
    const res = await fetch(`${API}/admin/abandoned-registrations/${id}`, {
        headers: await getAuthHeader(),
        cache: 'no-store',
    });
    return handleResponse<AbandonedRegistration>(res);
}

export async function deleteAbandonedRegistrationAction(id: string): Promise<void> {
    const res = await fetch(`${API}/admin/abandoned-registrations/${id}`, {
        method: 'DELETE',
        headers: await getAuthHeader(),
        cache: 'no-store',
    });
    return handleResponse<void>(res);
}

export async function addAbandonedRegistrationNoteAction(id: string, data: { content: string }): Promise<CRMNote> {
    const res = await fetch(`${API}/admin/abandoned-registrations/${id}/notes`, {
        method: 'POST',
        headers: await getAuthHeader(),
        body: JSON.stringify(data),
        cache: 'no-store',
    });
    return handleResponse<CRMNote>(res);
}
