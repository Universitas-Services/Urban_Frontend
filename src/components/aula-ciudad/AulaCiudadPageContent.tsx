'use client';

import { useEffect, useState } from 'react';
import { IoPlayCircleOutline } from 'react-icons/io5';
import { getAulaCiudadPlaylistService } from '@/lib/services/aula-ciudad.service';
import type { AulaCiudadPlaylist } from './aula-ciudad.types';
import { AULA_CIUDAD_INTRO } from './aula-ciudad.data';
import { AulaCiudadVideoPlayer } from './AulaCiudadVideoPlayer';
import { AulaCiudadVideoList } from './AulaCiudadPlaylist';

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
            .catch(() => {
                setError('No se pudo cargar la playlist. Intenta de nuevo más tarde.');
            });
    }, []);

    const selectedVideo = playlist?.videos.find((video) => video.id === selectedVideoId) ?? playlist?.videos[0];

    return (
        <div className="flex-1 p-6">
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
                <div className="flex flex-col gap-4 rounded-xl border border-gray-200/70 bg-white p-6 shadow-sm md:p-8">
                    <div className="flex items-center gap-2 font-bold text-accent etiquetas">
                        <IoPlayCircleOutline size={18} />
                        <span>{AULA_CIUDAD_INTRO.eyebrow}</span>
                    </div>

                    <div className="space-y-3">
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
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
                        <div className="flex flex-col gap-3 lg:col-span-2">
                            <AulaCiudadVideoPlayer
                                youtubeVideoId={selectedVideo.youtubeVideoId}
                                title={selectedVideo.title}
                                playlistId={playlist.id}
                            />
                            <div className="rounded-xl border border-gray-200/70 bg-white px-4 py-4 shadow-sm">
                                <h2 className="titulos-cards-proyecto-ley mb-1 leading-tight">{selectedVideo.title}</h2>
                                {selectedVideo.description ? (
                                    <p className="descripcion-cards-small leading-snug">{selectedVideo.description}</p>
                                ) : null}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 lg:col-span-1">
                            <h2 className="titulos-cards-proyecto-ley px-1 leading-tight">{playlist.title}</h2>
                            <AulaCiudadVideoList
                                videos={playlist.videos}
                                selectedVideoId={selectedVideo.id}
                                onSelectVideo={setSelectedVideoId}
                            />
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
