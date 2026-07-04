'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BIBLIOTECA_LEGAL_CATEGORIES } from './biblioteca-legal.data';
import { countDocumentosByCategory } from './biblioteca-legal.category';
import type { BibliotecaLegalDocumento } from './biblioteca-legal.types';
import { BibliotecaLegalHero } from './BibliotecaLegalHero';
import { BibliotecaLegalCategoryCard } from './BibliotecaLegalCategoryCard';
import { getBibliotecaLegalDocumentosService } from '@/lib/services/biblioteca-legal.service';

export function BibliotecaLegalPageContent() {
    const [documentos, setDocumentos] = useState<BibliotecaLegalDocumento[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        void getBibliotecaLegalDocumentosService()
            .then((data) => {
                if (!cancelled) setDocumentos(data);
            })
            .catch((err: Error) => {
                if (!cancelled) {
                    setError(err.message || 'No se pudieron cargar los documentos. Intenta de nuevo más tarde.');
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const countsByCategory = useMemo(() => countDocumentosByCategory(documentos), [documentos]);

    return (
        <div className="flex-1 p-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 md:gap-6">
                <BibliotecaLegalHero />

                {error ? (
                    <div className="rounded-xl border border-gray-200/70 bg-white px-4 py-8 text-center shadow-sm">
                        <p className="descripcion-cards-small text-gray-soft">{error}</p>
                    </div>
                ) : null}

                {isLoading ? (
                    <div className="flex items-center justify-center rounded-xl border border-gray-200/70 bg-white px-4 py-16 shadow-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Cargando categorías" />
                    </div>
                ) : null}

                {!isLoading ? (
                    <section
                        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
                        aria-label="Categorías de la Biblioteca Legal"
                    >
                        {BIBLIOTECA_LEGAL_CATEGORIES.map((category) => (
                            <BibliotecaLegalCategoryCard
                                key={category.id}
                                category={category}
                                documentCount={countsByCategory[category.id] ?? 0}
                            />
                        ))}
                    </section>
                ) : null}
            </div>
        </div>
    );
}
