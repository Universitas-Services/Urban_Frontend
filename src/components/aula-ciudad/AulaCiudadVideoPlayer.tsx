import { cn } from '@/lib/utils';
import { getYoutubeEmbedUrl } from './aula-ciudad.data';

type AulaCiudadVideoPlayerProps = {
    youtubeVideoId: string;
    title: string;
    playlistId?: string;
    className?: string;
};

export function AulaCiudadVideoPlayer({ youtubeVideoId, title, playlistId, className }: AulaCiudadVideoPlayerProps) {
    const embedUrl = getYoutubeEmbedUrl(youtubeVideoId, playlistId);

    return (
        <div className={cn('overflow-hidden rounded-xl border border-gray-200/70 bg-black shadow-sm', className)}>
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
