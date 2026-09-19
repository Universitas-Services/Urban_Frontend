'use server';

import { authenticatedFetch } from '@/lib/auth/session';
import type { PaginationMeta } from '@/types/admin.types';
import type { StaffRole } from '@/types/roles';

const API = process.env.API_URL;

export interface StaffUser {
    id: string;
    email: string;
    nombre: string;
    apellido: string | null;
    role: StaffRole;
    isActive: boolean;
    isEmailVerified: boolean;
    estadoCuenta: string;
    createdAt: string;
    updatedAt: string;
}

export interface StaffUsersResponse {
    data: StaffUser[];
    meta: PaginationMeta;
}

export interface GetStaffParams {
    page?: number;
    limit?: number;
    role?: StaffRole;
    search?: string;
}

export interface CreateStaffPayload {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    role: StaffRole;
}

export interface UpdateStaffPayload {
    nombre?: string;
    apellido?: string;
    email?: string;
    password?: string;
    role?: StaffRole;
    isActive?: boolean;
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

function toQuery(params?: GetStaffParams): string {
    if (!params) return '';
    const search = new URLSearchParams();
    if (params.page !== undefined) search.set('page', String(params.page));
    if (params.limit !== undefined) search.set('limit', String(params.limit));
    if (params.role) search.set('role', params.role);
    if (params.search?.trim()) search.set('search', params.search.trim());
    const qs = search.toString();
    return qs ? `?${qs}` : '';
}

export async function getStaffUsersAction(params?: GetStaffParams): Promise<StaffUsersResponse> {
    const res = await authenticatedFetch(`${API}/admin/staff${toQuery(params)}`);
    return handleResponse<StaffUsersResponse>(res);
}

export async function getStaffUserByIdAction(id: string): Promise<StaffUser> {
    const res = await authenticatedFetch(`${API}/admin/staff/${id}`);
    return handleResponse<StaffUser>(res);
}

export async function createStaffUserAction(data: CreateStaffPayload): Promise<StaffUser> {
    const res = await authenticatedFetch(`${API}/admin/staff`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return handleResponse<StaffUser>(res);
}

export async function updateStaffUserAction(id: string, data: UpdateStaffPayload): Promise<StaffUser> {
    const res = await authenticatedFetch(`${API}/admin/staff/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
    return handleResponse<StaffUser>(res);
}

export async function deleteStaffUserAction(id: string): Promise<void> {
    const res = await authenticatedFetch(`${API}/admin/staff/${id}`, {
        method: 'DELETE',
    });
    await handleResponse<unknown>(res);
}
