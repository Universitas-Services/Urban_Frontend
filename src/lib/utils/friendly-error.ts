/**
 * Traduce errores opacos de producción (p. ej. React #441 / digest de RSC)
 * a mensajes útiles para el usuario.
 */
export function getFriendlyErrorMessage(error: unknown, fallback = 'Ocurrió un error. Intenta de nuevo.'): string {
    const raw = error instanceof Error ? error.message : typeof error === 'string' ? error : '';

    if (!raw.trim()) return fallback;

    const lower = raw.toLowerCase();

    // Next.js / React en producción ocultan el mensaje real detrás de digests (#441, etc.)
    if (
        lower.includes('minified react error') ||
        lower.includes('server components render') ||
        lower.includes('an error occurred in the server') ||
        /\bdigest\b/i.test(raw) ||
        /react error #\d+/i.test(raw) ||
        /^#\d+$/.test(raw.trim())
    ) {
        return fallback;
    }

    if (
        lower.includes('failed to fetch') ||
        lower.includes('networkerror') ||
        lower.includes('load failed') ||
        lower.includes('network request failed')
    ) {
        return 'No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.';
    }

    if (
        lower.includes('unauthorized') ||
        lower.includes('credenciales') ||
        lower.includes('invalid credentials') ||
        lower.includes('status code 401')
    ) {
        return 'Correo o contraseña incorrectos.';
    }

    if (lower.includes('status code 403') || lower.includes('forbidden')) {
        return 'No tienes permiso para realizar esta acción.';
    }

    if (
        (lower.includes('body') && (lower.includes('limit') || lower.includes('too large'))) ||
        lower.includes('file too large') ||
        lower.includes('payload too large') ||
        lower.includes('status code 413')
    ) {
        return 'El archivo supera el tamaño máximo permitido (50 MB).';
    }

    return raw.trim();
}
