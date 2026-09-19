'use server';

import type {
    User,
    UserProfile,
    LoginInput,
    RegisterInput,
    UpdateProfileInput,
    ChangePasswordInput,
} from '@/types/auth.types';
import { authenticatedFetch, getAuthHeader } from '@/lib/auth/session';

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

export type LoginTokens = {
    access_token: string;
    refresh_token: string;
};

export async function loginService(data: LoginInput): Promise<LoginTokens> {
    const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        cache: 'no-store',
    });
    return handleResponse<LoginTokens>(res);
}

export async function refreshTokensService(refreshToken: string): Promise<LoginTokens> {
    const res = await fetch(`${API}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
        cache: 'no-store',
    });
    return handleResponse<LoginTokens>(res);
}

export async function logoutService(): Promise<void> {
    await authenticatedFetch(`${API}/auth/logout`, {
        method: 'POST',
    });
}

export async function registerService(data: RegisterInput): Promise<{ message: string }> {
    const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        cache: 'no-store',
    });
    return handleResponse<{ message: string }>(res);
}

export async function confirmEmailService(token: string): Promise<{ message: string }> {
    const res = await fetch(`${API}/auth/confirm-email/${token}`, {
        cache: 'no-store',
    });
    return handleResponse<{ message: string }>(res);
}

export async function forgotPasswordService(email: string): Promise<{ message: string }> {
    const res = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        cache: 'no-store',
    });
    return handleResponse<{ message: string }>(res);
}

export async function verifyOtpService(email: string, otp: string): Promise<{ message: string }> {
    const res = await fetch(`${API}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
        cache: 'no-store',
    });
    return handleResponse<{ message: string }>(res);
}

export async function resetPasswordService(email: string, newPassword: string): Promise<{ message: string }> {
    const res = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
        cache: 'no-store',
    });
    return handleResponse<{ message: string }>(res);
}

function normalizeUserProfile(raw: Record<string, unknown>): UserProfile {
    const profile = (raw.profile ?? raw.user ?? raw) as Record<string, unknown>;

    return {
        id: String(profile.id ?? ''),
        email: String(profile.email ?? ''),
        nombre: (profile.nombre as string | null | undefined) ?? null,
        apellido: (profile.apellido as string | null | undefined) ?? null,
        telefono: (profile.telefono as string | null | undefined) ?? null,
        role: String(profile.role ?? ''),
        isEmailVerified: Boolean(profile.isEmailVerified),
        isActive: Boolean(profile.isActive),
        estado: (profile.estado as string | null | undefined) ?? null,
        municipio: (profile.municipio as string | null | undefined) ?? null,
        tipo_usuario: (profile.tipo_usuario as string | null | undefined) ?? null,
        nombre_ente: (profile.nombre_ente as string | null | undefined) ?? null,
        cargo: (profile.cargo as string | null | undefined) ?? null,
        estatus_normativa_girs: (profile.estatus_normativa_girs as string | null | undefined) ?? null,
        profileCompleted: Boolean(profile.profileCompleted),
        estadoCuenta: profile.estadoCuenta as string | undefined,
        hasUnreadNews: profile.hasUnreadNews as boolean | undefined,
        latestNews: profile.latestNews as UserProfile['latestNews'],
        alertaVencimiento: profile.alertaVencimiento as UserProfile['alertaVencimiento'],
        createdAt: String(profile.createdAt ?? ''),
        updatedAt: String(profile.updatedAt ?? ''),
    };
}

export async function getProfileService(): Promise<User> {
    const res = await authenticatedFetch(`${API}/users/my`);
    return handleResponse<User>(res);
}

export async function getFullProfileService(): Promise<UserProfile> {
    const res = await authenticatedFetch(`${API}/users/profile`);
    const data = await handleResponse<Record<string, unknown>>(res);
    return normalizeUserProfile(data);
}

export async function updateProfileService(data: UpdateProfileInput): Promise<User> {
    const res = await authenticatedFetch(`${API}/users/profile`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
    return handleResponse<User>(res);
}

export async function changePasswordService(data: ChangePasswordInput): Promise<{ message: string }> {
    const res = await authenticatedFetch(`${API}/users/password/change`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return handleResponse<{ message: string }>(res);
}

export async function acceptNewsService(): Promise<{ message: string }> {
    const res = await authenticatedFetch(`${API}/users/accept-news`, {
        method: 'POST',
    });
    return handleResponse<{ message: string }>(res);
}

export async function deleteAccountService(password: string): Promise<{ message: string }> {
    const res = await authenticatedFetch(`${API}/users/me`, {
        method: 'DELETE',
        body: JSON.stringify({ password }),
    });
    return handleResponse<{ message: string }>(res);
}

/** @deprecated prefer authenticatedFetch */
export async function authHeaders(): Promise<HeadersInit> {
    return getAuthHeader();
}
