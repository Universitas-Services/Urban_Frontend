import 'server-only';

import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

export const TOKEN_COOKIE = 'access_token';
const PAYLOAD_COOKIE = 'access_token_payload';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
};

export interface SessionPayload {
    sub: string;
    email: string;
    role: 'USER' | 'ADMIN';
    iat?: number;
    exp?: number;
}

/** Guarda el JWT y su payload decodificado como dos cookies httpOnly. */
export async function setSessionCookies(token: string): Promise<void> {
    const payload = jwtDecode<SessionPayload>(token);
    const store = await cookies();
    store.set(TOKEN_COOKIE, token, COOKIE_OPTIONS);
    store.set(PAYLOAD_COOKIE, JSON.stringify(payload), COOKIE_OPTIONS);
}

/** Lee el payload desde la cookie JSON (sin decodificar el JWT). */
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

/** Retorna el token JWT crudo para llamadas al backend. */
export async function getServerToken(): Promise<string | null> {
    const store = await cookies();
    return store.get(TOKEN_COOKIE)?.value ?? null;
}

/** Construye el header de autorización para llamadas al backend. */
export async function getAuthHeader(): Promise<HeadersInit> {
    const token = await getServerToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Cookie: `${TOKEN_COOKIE}=${token}` } : {}),
    };
}

/** Elimina ambas cookies de sesión. */
export async function deleteSessionCookies(): Promise<void> {
    const store = await cookies();
    store.delete(TOKEN_COOKIE);
    store.delete(PAYLOAD_COOKIE);
}
