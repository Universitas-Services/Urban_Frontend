import 'server-only';

import { createHash } from 'node:crypto';
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

/**
 * Rotaciones recientes: refresh viejo (hash) → tokens nuevos.
 * La API rota el refresh en cada uso y trata un refresh viejo como robo (RF2),
 * borrando la sesión. Si dos requests concurrentes traen el mismo refresh, solo
 * la primera llama a la API; las demás reutilizan los tokens ya rotados.
 */
const ROTATION_GRACE_MS = 60_000;
const recentRotations = new Map<string, { tokens: AuthTokens; at: number }>();
const refreshInFlight = new Map<string, Promise<AuthTokens | null>>();

function tokenKey(token: string): string {
    return createHash('sha256').update(token).digest('hex');
}

function rememberRotation(key: string, tokens: AuthTokens): void {
    const now = Date.now();
    for (const [k, entry] of recentRotations) {
        if (now - entry.at > ROTATION_GRACE_MS) recentRotations.delete(k);
    }
    recentRotations.set(key, { tokens, at: now });
}

async function callRefreshEndpoint(refreshToken: string): Promise<AuthTokens | null> {
    const API = process.env.API_URL;
    if (!API) return null;

    try {
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
    } catch {
        return null;
    }
}

/**
 * Rota tokens con el refresh cookie y los persiste en la request actual.
 * Deduplica por refresh token para no disparar la detección de reutilización.
 */
export async function refreshSession(): Promise<boolean> {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return false;

    const key = tokenKey(refreshToken);
    const cached = recentRotations.get(key);
    let tokens = cached && Date.now() - cached.at <= ROTATION_GRACE_MS ? cached.tokens : null;

    if (!tokens) {
        let pending = refreshInFlight.get(key);
        if (!pending) {
            pending = callRefreshEndpoint(refreshToken)
                .then((result) => {
                    if (result) rememberRotation(key, result);
                    return result;
                })
                .finally(() => refreshInFlight.delete(key));
            refreshInFlight.set(key, pending);
        }
        tokens = await pending;
    }

    if (!tokens) return false;

    // Cada request escribe sus propias cookies (cookies() es por request)
    await setSessionCookies(tokens.access_token, tokens.refresh_token);
    return true;
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
