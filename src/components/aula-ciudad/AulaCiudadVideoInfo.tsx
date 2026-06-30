import { cn } from '@/lib/utils';
import type { AulaCiudadVideo } from './aula-ciudad.types';
import { AULA_CIUDAD_PANEL_SCROLL_HEIGHT } from './aula-ciudad.data';
import { linkifyText } from './linkifyText';

type AulaCiudadVideoInfoProps = {
    video: AulaCiudadVideo;
    className?: string;
};

const FALLBACK_DESCRIPTION =
    'Descripción no disponible para este video. Selecciona otro de la lista para continuar explorando la playlist.';

export function AulaCiudadVideoInfo({ video, className }: AulaCiudadVideoInfoProps) {
    const description = video.description?.trim() || FALLBACK_DESCRIPTION;

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <div className="video-title-card rounded-xl border border-gray-200/70 bg-white px-3 py-2.5 shadow-sm">
                <h2 className="titulos-cards-proyecto-ley line-clamp-2 leading-tight">{video.title}</h2>
            </div>

            <div className="flex flex-col rounded-xl border border-gray-200/70 bg-white px-3 py-3 shadow-sm">
                <p className="mb-1.5 shrink-0 text-[11px] font-bold uppercase tracking-wide text-primary/70">
                    Descripción
                </p>
                <p
                    className={cn(
                        'descripcion-cards-small overflow-y-auto leading-relaxed custom-scrollbar',
                        AULA_CIUDAD_PANEL_SCROLL_HEIGHT
                    )}
                >
                    {linkifyText(description)}
                </p>
            </div>
        </div>
    );
}
