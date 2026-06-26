export const AULA_CIUDAD_YOUTUBE_PLAYLIST_ID = 'PLRJBaSLMa1H0_4vzPAmrSDy-02VoGdW8_' as const;

export const AULA_CIUDAD_INTRO = {
    title: 'Aula Ciudad',
    eyebrow: 'Formación académica',
    paragraphs: [
        'Aula Ciudad es una iniciativa académica de Universitas Fundación dedicada a la difusión y análisis de los temas jurídicos que impactan la gestión, regulación y desarrollo de las ciudades.',
        'Incluye un espacio especializado en Derecho Urbanístico, con contenidos orientados a la planificación territorial, la ordenación urbana y la gobernanza local.',
    ],
} as const;

export function getYoutubeThumbnailUrl(youtubeVideoId: string) {
    return `https://img.youtube.com/vi/${youtubeVideoId}/mqdefault.jpg`;
}

export function getYoutubeEmbedUrl(youtubeVideoId: string, playlistId?: string) {
    const params = new URLSearchParams({ rel: '0', modestbranding: '1' });
    if (playlistId) {
        params.set('list', playlistId);
    }
    return `https://www.youtube.com/embed/${youtubeVideoId}?${params.toString()}`;
}

export function getYoutubePlaylistEmbedUrl(playlistId: string) {
    const params = new URLSearchParams({ list: playlistId, rel: '0', modestbranding: '1' });
    return `https://www.youtube.com/embed/videoseries?${params.toString()}`;
}
