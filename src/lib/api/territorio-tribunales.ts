/**
 * Extensiones de territorio no disponibles aún en @universitas/sdk-global@1.4.0.
 * Usan la misma base URL que el SDK.
 */

export interface TribunalTerritorio {
    id: number;
    nombre: string;
    categoria: string;
}

interface GenericResponse<T> {
    message: string;
    data: T;
}

function getBaseUrl(): string {
    const base = process.env.NEXT_PUBLIC_UNIVERSITAS_SDK_URL?.trim();
    if (!base) {
        throw new Error('NEXT_PUBLIC_UNIVERSITAS_SDK_URL no está configurada');
    }
    return base.replace(/\/+$/, '');
}

async function territorioRequest<T>(endpoint: string): Promise<GenericResponse<T>> {
    const url = `${getBaseUrl()}${endpoint}`;
    const res = await fetch(url, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });
    const data = (await res.json().catch(() => ({}))) as GenericResponse<T> & { message?: string };
    if (!res.ok) {
        throw new Error(data.message || `Error HTTP ${res.status}`);
    }
    return data;
}

/** GET /api/v1/territorio/estados/{estado_id}/tribunales */
export async function getTribunalesByEstado(estadoId: number): Promise<TribunalTerritorio[]> {
    const res = await territorioRequest<TribunalTerritorio[]>(`/api/v1/territorio/estados/${estadoId}/tribunales`);
    return res.data ?? [];
}

/** GET /api/v1/territorio/municipios/{municipio_id}/tribunales */
export async function getTribunalesByMunicipio(municipioId: number): Promise<TribunalTerritorio[]> {
    const res = await territorioRequest<TribunalTerritorio[]>(
        `/api/v1/territorio/municipios/${municipioId}/tribunales`
    );
    return res.data ?? [];
}
