import { cn } from '@/lib/utils';
import type { AulaCiudadVideo } from './aula-ciudad.types';
import { AulaCiudadVideoList } from './AulaCiudadPlaylist';

type AulaCiudadPlaylistCardProps = {
    title: string;
    videoCount: number;
    videos: AulaCiudadVideo[];
    selectedVideoId: string;
    onSelectVideo: (videoId: string) => void;
    className?: string;
};

export function AulaCiudadPlaylistCard({
    title,
    videoCount,
    videos,
    selectedVideoId,
    onSelectVideo,
    className,
}: AulaCiudadPlaylistCardProps) {
    return (
        <div
            className={cn(
                'flex min-h-0 flex-col overflow-hidden rounded-xl border border-gray-200/70 bg-white shadow-sm',
                className
            )}
        >
            <div className="shrink-0 border-b border-gray-100 px-3 py-2">
                <h2 className="titulos-cards-proyecto-ley line-clamp-2 text-sm leading-tight">{title}</h2>
                <p className="descripcion-cards-small mt-0.5 text-[10px] text-gray-soft">{videoCount} videos</p>
            </div>

            <div
                className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-2 custom-scrollbar sidebar-scrollbar"
                role="list"
                aria-label="Lista de videos de la playlist"
            >
                <AulaCiudadVideoList videos={videos} selectedVideoId={selectedVideoId} onSelectVideo={onSelectVideo} />
            </div>
        </div>
    );
}
