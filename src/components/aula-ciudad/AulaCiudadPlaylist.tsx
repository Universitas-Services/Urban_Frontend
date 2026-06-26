import { cn } from '@/lib/utils';
import type { AulaCiudadVideo } from './aula-ciudad.types';
import { getYoutubeThumbnailUrl } from './aula-ciudad.data';

type AulaCiudadVideoListProps = {
    videos: AulaCiudadVideo[];
    selectedVideoId: string;
    onSelectVideo: (videoId: string) => void;
};

export function AulaCiudadVideoList({ videos, selectedVideoId, onSelectVideo }: AulaCiudadVideoListProps) {
    return (
        <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar max-h-[520px] lg:max-h-none lg:h-full">
            {videos.map((video) => {
                const isActive = video.id === selectedVideoId;

                return (
                    <button
                        key={video.id}
                        type="button"
                        onClick={() => onSelectVideo(video.id)}
                        className={cn(
                            'flex w-full gap-3 rounded-xl border p-2.5 text-left transition-colors',
                            isActive
                                ? 'border-primary bg-surface-soft/40 shadow-sm'
                                : 'border-gray-200/70 bg-white hover:border-primary/20 hover:bg-surface-soft/20'
                        )}
                    >
                        <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-soft">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={getYoutubeThumbnailUrl(video.youtubeVideoId)}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-semibold leading-snug text-primary">
                                {video.title}
                            </p>
                            {video.durationLabel || video.publishedAt ? (
                                <p className="mt-1 text-[11px] text-gray-soft">
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
