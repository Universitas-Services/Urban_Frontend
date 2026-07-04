'use server';

import { mapYoutubePlaylistToAulaCiudad } from '@/components/aula-ciudad/aula-ciudad.mapper';
import type { AulaCiudadPlaylist, YoutubePlaylistVideoDto } from '@/components/aula-ciudad/aula-ciudad.types';
import { getAuthHeader } from '@/lib/auth/session';

const API = process.env.API_URL;

type ApiError = Error & { status?: number };

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const message = Array.isArray(err.message) ? err.message[0] : err.message || err.error || 'Error del servidor';
        const error = new Error(message) as ApiError;
        error.status = res.status;
        throw error;
    }
    if (res.status === 204) return undefined as T;
    return res.json();
}

// GET /youtube/playlist → AulaCiudadPlaylist
export async function getAulaCiudadPlaylistService(): Promise<AulaCiudadPlaylist> {
    const res = await fetch(`${API}/youtube/playlist`, {
        headers: await getAuthHeader(),
        cache: 'no-store',
    });

    const dtos = await handleResponse<YoutubePlaylistVideoDto[]>(res);
    return mapYoutubePlaylistToAulaCiudad(dtos);
}

// DELETE /youtube/cache — solo administradores; sin UI por ahora
export async function invalidateYoutubeCacheService(): Promise<{ message: string }> {
    const res = await fetch(`${API}/youtube/cache`, {
        method: 'DELETE',
        headers: await getAuthHeader(),
        cache: 'no-store',
    });

    return handleResponse<{ message: string }>(res);
}
