import { getYoutubeEmbedUrl } from './aula-ciudad.data';

type AulaCiudadVideoPlayerProps = {
    youtubeVideoId: string;
    title: string;
    playlistId?: string;
};

export function AulaCiudadVideoPlayer({ youtubeVideoId, title, playlistId }: AulaCiudadVideoPlayerProps) {
    const embedUrl = getYoutubeEmbedUrl(youtubeVideoId, playlistId);

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200/70 bg-black shadow-sm">
            <div className="relative aspect-video w-full">
                <iframe
                    key={`${youtubeVideoId}-${playlistId ?? 'single'}`}
                    src={embedUrl}
                    title={title}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            </div>
        </div>
    );
}
