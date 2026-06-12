'use server';

import type { LoginInput, User } from '@/types/auth.types';
import { loginService, logoutService } from '@/lib/services/auth.service';
import { setSessionCookies, getSessionPayload, deleteSessionCookies } from './session';

/**
 * Server actions de autenticación.
 * Orquestan los servicios HTTP (auth.service.ts) con la gestión de sesión (session.ts).
 * No contienen llamadas directas al backend — eso vive en la capa de servicios.
 */

/** Inicia sesión: delega el endpoint al servicio y persiste las cookies de sesión. */
export async function loginAction(data: LoginInput): Promise<{ user: User }> {
    const { user, access_token } = await loginService(data);
    await setSessionCookies(access_token);
    return { user };
}

/** Cierra sesión: notifica al backend y elimina las cookies de sesión locales. */
export async function logoutAction(): Promise<void> {
    try {
        await logoutService();
    } catch {
        // Aunque el backend falle, siempre limpiamos la sesión local
    } finally {
        await deleteSessionCookies();
    }
}

/** Retorna el payload del usuario actual desde la cookie (sin llamar al backend). */
export async function getCurrentUser() {
    return getSessionPayload();
}
