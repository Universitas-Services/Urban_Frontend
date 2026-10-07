/**
 * Helpers para conservar página/filtros al ir al detalle de un documento y volver.
 */

const STAFF_PREFIX = '/staff/';

/** Ruta relativa actual (pathname + search) para usarla como retorno. */
export function buildStaffListReturnPath(pathname: string, search: string): string {
    const q = search.startsWith('?') ? search : search ? `?${search}` : '';
    return `${pathname}${q}`;
}

/** Href al detalle incluyendo `from` con la lista de origen. */
export function documentDetailHref(documentId: string, returnPath: string): string {
    const params = new URLSearchParams();
    if (returnPath.startsWith(STAFF_PREFIX)) {
        params.set('from', returnPath);
    }
    const qs = params.toString();
    return `/staff/documentos/${documentId}${qs ? `?${qs}` : ''}`;
}

/** Valida `from` (solo rutas staff relativas) o usa el fallback. */
export function resolveStaffBackHref(from: string | null | undefined, fallback: string): string {
    if (!from) return fallback;
    try {
        const decoded = decodeURIComponent(from);
        if (decoded.startsWith(STAFF_PREFIX) && !decoded.startsWith('//') && !decoded.includes('://')) {
            return decoded;
        }
    } catch {
        // ignore malformed
    }
    return fallback;
}
