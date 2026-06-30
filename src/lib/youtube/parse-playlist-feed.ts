import type { AulaCiudadPlaylist } from '@/components/aula-ciudad/aula-ciudad.types';

function decodeXmlEntities(value: string) {
    return value
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

export function parseYoutubePlaylistFeed(xml: string, playlistId: string): AulaCiudadPlaylist {
    const playlistTitle =
        xml
            .match(/<feed[\s\S]*?<title>([^<]+)<\/title>/)?.[1]
            ?.replace(' - YouTube', '')
            .trim() ?? 'Aula Ciudad';

    const entries = xml.split('<entry>').slice(1);

    const videos = entries
        .map((entry, index) => {
            const youtubeVideoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? '';
            const title = entry.match(/<title>([^<]+)<\/title>/)?.[1] ?? '';
            const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1]?.split('T')[0];
            const description =
                entry.match(/<media:description>([^<]*)<\/media:description>/)?.[1]?.trim() ||
                entry.match(/<summary>([^<]*)<\/summary>/)?.[1]?.trim() ||
                undefined;

            if (!youtubeVideoId) return null;

            return {
                id: youtubeVideoId,
                youtubeVideoId,
                title: decodeXmlEntities(title),
                description: description ? decodeXmlEntities(description) : undefined,
                publishedAt,
            };
        })
        .filter((video): video is NonNullable<typeof video> => video !== null);

    return {
        id: playlistId,
        title: decodeXmlEntities(playlistTitle),
        videos,
    };
}
