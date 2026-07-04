import { AULA_CIUDAD_INTRO, AULA_CIUDAD_YOUTUBE_PLAYLIST_ID } from './aula-ciudad.data';
import type { AulaCiudadPlaylist, YoutubePlaylistVideoDto } from './aula-ciudad.types';

export function mapYoutubePlaylistToAulaCiudad(dtos: YoutubePlaylistVideoDto[]): AulaCiudadPlaylist {
    const videos = [...dtos]
        .sort((a, b) => a.position - b.position)
        .map((dto) => ({
            id: dto.videoId,
            youtubeVideoId: dto.videoId,
            title: dto.title,
            description: dto.description || undefined,
            thumbnail: dto.thumbnail?.trim() || undefined,
            url: dto.url,
        }));

    return {
        id: AULA_CIUDAD_YOUTUBE_PLAYLIST_ID,
        title: AULA_CIUDAD_INTRO.title,
        videos,
    };
}
