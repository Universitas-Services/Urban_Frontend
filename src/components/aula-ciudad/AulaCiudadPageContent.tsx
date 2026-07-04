'use client';

import { useEffect, useState } from 'react';
import { IoPlayCircleOutline } from 'react-icons/io5';
import { getAulaCiudadPlaylistService } from '@/lib/services/aula-ciudad.service';
import type { AulaCiudadPlaylist } from './aula-ciudad.types';
import { AULA_CIUDAD_INTRO } from './aula-ciudad.data';
import { AulaCiudadVideoPlayer } from './AulaCiudadVideoPlayer';
import { AulaCiudadPlaylistCard } from './AulaCiudadPlaylistCard';
import { AulaCiudadVideoInfo } from './AulaCiudadVideoInfo';

export function AulaCiudadPageContent() {
    const [playlist, setPlaylist] = useState<AulaCiudadPlaylist | null>(null);
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        void getAulaCiudadPlaylistService()
            .then((data) => {
                setPlaylist(data);
                setSelectedVideoId(data.videos[0]?.id ?? null);
            })
            .catch((err: Error & { status?: number }) => {
                if (err.status === 500) {
                    setError('Error al consultar la playlist. Intenta de nuevo más tarde.');
                    return;
                }
                setError(err.message || 'No se pudo cargar la playlist. Intenta de nuevo más tarde.');
            });
    }, []);

    const selectedVideo = playlist?.videos.find((video) => video.id === selectedVideoId) ?? playlist?.videos[0];

    return (
        <div className="px-6 pt-6 pb-2">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
                <div className="rounded-xl border border-gray-200/70 bg-white p-5 shadow-sm md:p-6">
                    <div className="flex items-center gap-2 font-bold text-accent etiquetas">
                        <IoPlayCircleOutline size={18} />
                        <span>{AULA_CIUDAD_INTRO.eyebrow}</span>
                    </div>

                    <div className="mt-3 space-y-2">
                        <h1 className="titulos-cards mb-0 text-3xl leading-tight md:text-[34px]">
                            {AULA_CIUDAD_INTRO.title}
                        </h1>
                        {AULA_CIUDAD_INTRO.paragraphs.map((paragraph) => (
                            <p
                                key={paragraph}
                                className="descripcion-cards max-w-3xl text-base leading-relaxed md:text-[17px]"
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>

                {error ? (
                    <div className="rounded-xl border border-gray-200/70 bg-white px-4 py-6 text-center shadow-sm">
                        <p className="descripcion-cards-small text-gray-soft">{error}</p>
                    </div>
                ) : null}

                {!playlist && !error ? (
                    <div className="rounded-xl border border-gray-200/70 bg-white px-4 py-10 text-center shadow-sm">
                        <p className="descripcion-cards-small text-gray-soft">Cargando playlist...</p>
                    </div>
                ) : null}

                {playlist && selectedVideo ? (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch lg:gap-x-5">
                        <div className="flex min-w-0 flex-col lg:col-span-2">
                            <AulaCiudadVideoPlayer
                                youtubeVideoId={selectedVideo.youtubeVideoId}
                                title={selectedVideo.title}
                                playlistId={playlist.id}
                                className="shrink-0 rounded-b-none border-b-0 shadow-none"
                            />
                            <AulaCiudadVideoInfo
                                video={selectedVideo}
                                className="[&_.video-title-card]:rounded-t-none [&_.video-title-card]:border-t-0 [&_.video-title-card]:shadow-none"
                            />
                        </div>

                        <div className="relative min-h-0 lg:col-span-1">
                            <AulaCiudadPlaylistCard
                                title={playlist.title}
                                videoCount={playlist.videos.length}
                                videos={playlist.videos}
                                selectedVideoId={selectedVideo.id}
                                onSelectVideo={setSelectedVideoId}
                                className="max-lg:max-h-80 lg:absolute lg:inset-0"
                            />
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
