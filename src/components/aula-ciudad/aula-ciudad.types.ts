export type YoutubePlaylistVideoDto = {
    videoId: string;
    title: string;
    description: string;
    thumbnail: string;
    url: string;
    position: number;
};

export type AulaCiudadVideo = {
    id: string;
    youtubeVideoId: string;
    title: string;
    description?: string;
    thumbnail?: string;
    url?: string;
    durationLabel?: string;
    publishedAt?: string;
};

export type AulaCiudadPlaylist = {
    id: string;
    title: string;
    videos: AulaCiudadVideo[];
};
