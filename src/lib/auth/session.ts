import 'server-only';

import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import type { UserRole } from '@/types/roles';

export const TOKEN_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';
const PAYLOAD_COOKIE = 'access_token_payload';

/** Access JWT del backend: 50m */
const ACCESS_MAX_AGE = 50 * 60;
/** Refresh JWT del backend: 7d */
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;
/** Renovar si faltan menos de 2 minutos */
const REFRESH_SKEW_SECONDS = 120;

const baseCookie = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
};

export interface SessionPayload {
    sub: string;
    email: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
}

function cookieOptions(maxAge: number) {
    return { ...baseCookie, maxAge };
}

/** Persiste access + refresh (+ payload) alineados a los TTL del backend. */
export async function setSessionCookies(accessToken: string, refreshToken: string): Promise<void> {
    const payload = jwtDecode<SessionPayload>(accessToken);
    const store = await cookies();
    store.set(TOKEN_COOKIE, accessToken, cookieOptions(ACCESS_MAX_AGE));
    store.set(REFRESH_COOKIE, refreshToken, cookieOptions(REFRESH_MAX_AGE));
    // Payload para routing/roles: vive con el refresh
    store.set(PAYLOAD_COOKIE, JSON.stringify(payload), cookieOptions(REFRESH_MAX_AGE));
}

/** Completa/actualiza el payload de sesión (p. ej. role desde el perfil). */
export async function enrichSessionPayload(patch: Partial<SessionPayload>): Promise<void> {
    const store = await cookies();
    const current = (await getSessionPayload()) ?? ({} as SessionPayload);
    const next: SessionPayload = {
        ...current,
        ...patch,
        sub: patch.sub ?? current.sub ?? '',
        email: patch.email ?? current.email ?? '',
        role: (patch.role ?? current.role) as UserRole,
    };
    store.set(PAYLOAD_COOKIE, JSON.stringify(next), cookieOptions(REFRESH_MAX_AGE));
}

export async function getSessionPayload(): Promise<SessionPayload | null> {
    const store = await cookies();
    const raw = store.get(PAYLOAD_COOKIE)?.value;
    if (!raw) return null;
    try {
        return JSON.parse(raw) as SessionPayload;
    } catch {
        return null;
    }
}

export async function getServerToken(): Promise<string | null> {
    await ensureFreshAccessToken();
    const store = await cookies();
    return store.get(TOKEN_COOKIE)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
    const store = await cookies();
    return store.get(REFRESH_COOKIE)?.value ?? null;
}

export async function getAuthHeader(): Promise<HeadersInit> {
    const token = await getServerToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

/** Header Authorization sin forzar Content-Type (útil para multipart). */
export async function getBearerHeader(): Promise<HeadersInit> {
    const token = await getServerToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function deleteSessionCookies(): Promise<void> {
    const store = await cookies();
    store.delete(TOKEN_COOKIE);
    store.delete(REFRESH_COOKIE);
    store.delete(PAYLOAD_COOKIE);
}

function isJwtExpiredOrNear(token: string, skewSeconds = REFRESH_SKEW_SECONDS): boolean {
    try {
        const { exp } = jwtDecode<{ exp?: number }>(token);
        if (!exp) return true;
        const now = Math.floor(Date.now() / 1000);
        return exp <= now + skewSeconds;
    } catch {
        return true;
    }
}

let refreshInFlight: Promise<boolean> | null = null;

async function callRefreshEndpoint(refreshToken: string): Promise<AuthTokens | null> {
    const API = process.env.API_URL;
    if (!API) return null;

    const res = await fetch(`${API}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
        cache: 'no-store',
    });

    if (!res.ok) return null;
    const data = (await res.json()) as Partial<AuthTokens>;
    if (!data.access_token || !data.refresh_token) return null;
    return { access_token: data.access_token, refresh_token: data.refresh_token };
}

/**
 * Rota tokens con el refresh cookie.
 * Usa un mutex en memoria para evitar carreras (rotación invalida RT previo).
 */
export async function refreshSession(): Promise<boolean> {
    if (refreshInFlight) return refreshInFlight;

    refreshInFlight = (async () => {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) return false;

        const tokens = await callRefreshEndpoint(refreshToken);
        if (!tokens) return false;

        await setSessionCookies(tokens.access_token, tokens.refresh_token);
        return true;
    })().finally(() => {
        refreshInFlight = null;
    });

    return refreshInFlight;
}

/** Si el access falta o está por vencer, intenta refresh. */
export async function ensureFreshAccessToken(): Promise<boolean> {
    const store = await cookies();
    const access = store.get(TOKEN_COOKIE)?.value;

    if (access && !isJwtExpiredOrNear(access)) {
        return true;
    }

    return refreshSession();
}

/**
 * fetch autenticado: renueva access si hace falta y reintenta una vez ante 401.
 */
export async function authenticatedFetch(input: string | URL, init: RequestInit = {}): Promise<Response> {
    await ensureFreshAccessToken();

    const buildHeaders = async (): Promise<Headers> => {
        const headers = new Headers(init.headers);
        const token = (await cookies()).get(TOKEN_COOKIE)?.value;
        if (token) headers.set('Authorization', `Bearer ${token}`);
        // Solo JSON por defecto si no es FormData y no hay Content-Type
        if (!(init.body instanceof FormData) && !headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }
        return headers;
    };

    let res = await fetch(input, {
        ...init,
        headers: await buildHeaders(),
        cache: init.cache ?? 'no-store',
    });

    if (res.status === 401) {
        const refreshed = await refreshSession();
        if (refreshed) {
            res = await fetch(input, {
                ...init,
                headers: await buildHeaders(),
                cache: init.cache ?? 'no-store',
            });
        }
    }

    return res;
}
