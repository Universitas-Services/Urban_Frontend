import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { isPublicRoute, getAllowedRoles, getHomeByRole } from '@/lib/constants/routes';

const TOKEN_COOKIE = 'access_token';
const PAYLOAD_COOKIE = 'access_token_payload';

interface JwtPayload {
    sub?: string;
    role?: string;
}

function getPayloadFromRequest(request: NextRequest): JwtPayload | null {
    // Ruta rápida: leer el payload desde la cookie JSON (sin decodificar el JWT)
    const rawPayload = request.cookies.get(PAYLOAD_COOKIE)?.value;
    if (rawPayload) {
        try {
            return JSON.parse(rawPayload) as JwtPayload;
        } catch {
            // Cookie corrupta — caer al fallback
        }
    }

    // Fallback: decodificar el JWT directamente (sin verificar firma)
    const token = request.cookies.get(TOKEN_COOKIE)?.value;
    if (token) {
        try {
            return jwtDecode<JwtPayload>(token);
        } catch {
            return null;
        }
    }

    return null;
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasToken = !!request.cookies.get(TOKEN_COOKIE)?.value;

    // 1. Estáticos y API — siempre pasar
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
        return NextResponse.next();
    }

    // 2. Raíz → login
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. Rutas públicas: si ya tiene sesión redirigir al home de su rol
    if (isPublicRoute(pathname)) {
        if (hasToken) {
            const payload = getPayloadFromRequest(request);
            if (payload?.role) {
                return NextResponse.redirect(new URL(getHomeByRole(payload.role), request.url));
            }
        }
        return NextResponse.next();
    }

    // 4. Ruta protegida sin cookie → login
    if (!hasToken) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 5. Leer rol del payload para routing (la verificación real la hace el backend)
    const payload = getPayloadFromRequest(request);
    const role = payload?.role ?? '';

    // 6. Verificar permisos de ruta según rol
    const allowedRoles = getAllowedRoles(pathname);
    if (allowedRoles && !allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL(getHomeByRole(role), request.url));
    }

    // 7. Inyectar headers para Server Components
    const response = NextResponse.next();
    if (payload?.sub) response.headers.set('x-user-id', payload.sub);
    if (role) response.headers.set('x-user-role', role);
    return response;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|asset/).*)'],
};
