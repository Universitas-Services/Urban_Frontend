'use server';

import type { AulaCiudadPlaylist } from '@/components/aula-ciudad/aula-ciudad.types';
import { AULA_CIUDAD_YOUTUBE_PLAYLIST_ID } from '@/components/aula-ciudad/aula-ciudad.data';
import { parseYoutubePlaylistFeed } from '@/lib/youtube/parse-playlist-feed';

const PLAYLIST_FEED_URL = `https://www.youtube.com/feeds/videos.xml?playlist_id=${AULA_CIUDAD_YOUTUBE_PLAYLIST_ID}`;

// GET /aula-ciudad/playlist → AulaCiudadPlaylist
export async function getAulaCiudadPlaylistService(): Promise<AulaCiudadPlaylist> {
    const response = await fetch(PLAYLIST_FEED_URL, {
        next: { revalidate: 3600 },
    });

    if (!response.ok) {
        throw new Error('No se pudo cargar la playlist de Aula Ciudad.');
    }

    const xml = await response.text();
    return parseYoutubePlaylistFeed(xml, AULA_CIUDAD_YOUTUBE_PLAYLIST_ID);
}
