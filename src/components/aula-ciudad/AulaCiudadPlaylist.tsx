import { cn } from '@/lib/utils';
import type { AulaCiudadVideo } from './aula-ciudad.types';
import { getYoutubeThumbnailUrl } from './aula-ciudad.data';

type AulaCiudadVideoListProps = {
    videos: AulaCiudadVideo[];
    selectedVideoId: string;
    onSelectVideo: (videoId: string) => void;
    className?: string;
};

export function AulaCiudadVideoList({ videos, selectedVideoId, onSelectVideo, className }: AulaCiudadVideoListProps) {
    return (
        <div className={cn('flex min-h-0 flex-col gap-1.5', className)}>
            {videos.map((video) => {
                const isActive = video.id === selectedVideoId;

                return (
                    <button
                        key={video.id}
                        type="button"
                        onClick={() => onSelectVideo(video.id)}
                        className={cn(
                            'flex min-h-[3rem] w-full gap-2 rounded-lg border p-1.5 text-left transition-colors',
                            isActive
                                ? 'border-primary bg-surface-soft/40 shadow-sm'
                                : 'border-gray-200/70 bg-white hover:border-primary/20 hover:bg-surface-soft/20'
                        )}
                    >
                        <div className="relative h-9 w-[4.5rem] shrink-0 overflow-hidden rounded-md bg-surface-soft">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={getYoutubeThumbnailUrl(video.youtubeVideoId)}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-xs font-semibold leading-snug text-primary">
                                {video.title}
                            </p>
                            {video.durationLabel || video.publishedAt ? (
                                <p className="mt-0.5 text-[10px] text-gray-soft">
                                    {video.durationLabel ?? video.publishedAt}
                                </p>
                            ) : null}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
