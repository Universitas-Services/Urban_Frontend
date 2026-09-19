'use server';

import type { LoginInput, User } from '@/types/auth.types';
import type { UserRole } from '@/types/roles';
import { isUserRole } from '@/types/roles';
import { loginService, logoutService, getProfileService } from '@/lib/services/auth.service';
import {
    setSessionCookies,
    getSessionPayload,
    deleteSessionCookies,
    getRefreshToken,
    ensureFreshAccessToken,
    refreshSession,
    enrichSessionPayload,
} from './session';

/**
 * Server actions de autenticación.
 * Orquestan servicios HTTP con la gestión de sesión (cookies access + refresh).
 */

export async function loginAction(data: LoginInput): Promise<{ user: User }> {
    const tokens = await loginService(data);
    await setSessionCookies(tokens.access_token, tokens.refresh_token);
    const user = await getProfileService();
    // El JWT a veces no trae role; el perfil sí — necesario para redirects en proxy
    if (user.role && isUserRole(user.role)) {
        await enrichSessionPayload({ role: user.role, sub: user.id, email: user.email });
    }
    return { user };
}

export async function logoutAction(): Promise<void> {
    try {
        await logoutService();
    } catch {
        // Aunque el backend falle, siempre limpiamos la sesión local
    } finally {
        await deleteSessionCookies();
    }
}

/** Solo limpia cookies locales (p. ej. refresh inválido / sesión muerta). */
export async function clearLocalSessionAction(): Promise<void> {
    await deleteSessionCookies();
}

export async function getCurrentUser() {
    return getSessionPayload();
}

/** Indica si hay algún indicio de sesión (access payload o refresh). */
export async function hasSessionHint(): Promise<boolean> {
    const payload = await getSessionPayload();
    if (payload) return true;
    return !!(await getRefreshToken());
}

/**
 * Asegura access válido (refresh si hace falta).
 * @returns true si hay access usable
 */
export async function ensureSessionAction(): Promise<boolean> {
    return ensureFreshAccessToken();
}

/** Fuerza un refresh inmediato (útil tras 401). */
export async function refreshSessionAction(): Promise<boolean> {
    return refreshSession();
}

/** Persiste role/identidad en la cookie de payload para el proxy de rutas. */
export async function enrichSessionRoleAction(patch: { role: string; sub?: string; email?: string }): Promise<void> {
    if (!isUserRole(patch.role)) return;
    await enrichSessionPayload({
        role: patch.role as UserRole,
        sub: patch.sub,
        email: patch.email,
    });
}
