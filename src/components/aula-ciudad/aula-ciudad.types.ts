export type AulaCiudadVideo = {
    id: string;
    youtubeVideoId: string;
    title: string;
    description?: string;
    durationLabel?: string;
    publishedAt?: string;
};

export type AulaCiudadPlaylist = {
    id: string;
    title: string;
    videos: AulaCiudadVideo[];
};
