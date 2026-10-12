import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { isPublicRoute, getAllowedRoles, getHomeByRole } from '@/lib/constants/routes';

const TOKEN_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';
const PAYLOAD_COOKIE = 'access_token_payload';

interface JwtPayload {
    sub?: string;
    role?: string;
}

function getPayloadFromRequest(request: NextRequest): JwtPayload | null {
    const rawPayload = request.cookies.get(PAYLOAD_COOKIE)?.value;
    if (rawPayload) {
        try {
            return JSON.parse(rawPayload) as JwtPayload;
        } catch {
            // Cookie corrupta — caer al fallback
        }
    }

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

function hasSessionCookies(request: NextRequest): boolean {
    return !!request.cookies.get(TOKEN_COOKIE)?.value || !!request.cookies.get(REFRESH_COOKIE)?.value;
}

function resolveHome(request: NextRequest): string {
    const payload = getPayloadFromRequest(request);
    return getHomeByRole(payload?.role ?? 'USER');
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasSession = hasSessionCookies(request);

    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
        return NextResponse.next();
    }

    // Raíz: autenticado → home por rol; sin sesión → login
    if (pathname === '/') {
        if (hasSession) {
            return NextResponse.redirect(new URL(resolveHome(request), request.url));
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Rutas públicas de auth: con sesión no deben mostrarse
    if (isPublicRoute(pathname)) {
        if (hasSession) {
            return NextResponse.redirect(new URL(resolveHome(request), request.url));
        }
        return NextResponse.next();
    }

    // Sin access ni refresh → login
    if (!hasSession) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    const payload = getPayloadFromRequest(request);
    const role = payload?.role ?? '';

    const allowedRoles = getAllowedRoles(pathname);
    if (allowedRoles && role && !allowedRoles.includes(role as import('@/types/roles').UserRole)) {
        return NextResponse.redirect(new URL(getHomeByRole(role), request.url));
    }

    const response = NextResponse.next();
    if (payload?.sub) response.headers.set('x-user-id', payload.sub);
    if (role) response.headers.set('x-user-role', role);
    return response;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|asset/).*)'],
};
