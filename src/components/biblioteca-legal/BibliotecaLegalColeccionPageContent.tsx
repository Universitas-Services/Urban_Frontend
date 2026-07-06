'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { filterDocumentosByCategory } from './biblioteca-legal.category';
import type { BibliotecaLegalCategory } from './biblioteca-legal.data';
import {
    extractMateriaOptions,
    filterBibliotecaLegalDocumentos,
    sortBibliotecaDocumentos,
} from './biblioteca-legal.filters';
import type { BibliotecaLegalDocumento, BibliotecaLegalSortBy } from './biblioteca-legal.types';
import { BibliotecaLegalColeccionToolbar } from './BibliotecaLegalColeccionToolbar';
import {
    BibliotecaLegalColeccionDocumentCard,
    type BibliotecaLegalColeccionViewMode,
} from './BibliotecaLegalColeccionDocumentCard';
import { BibliotecaLegalPreviewModal } from './BibliotecaLegalPreviewModal';
import {
    getBibliotecaLegalDocumentosService,
    getBibliotecaLegalPreviewService,
} from '@/lib/services/biblioteca-legal.service';

const PER_PAGE_OPTIONS = [12, 24, 48] as const;

type BibliotecaLegalColeccionPageContentProps = {
    category: BibliotecaLegalCategory;
};

export function BibliotecaLegalColeccionPageContent({ category }: BibliotecaLegalColeccionPageContentProps) {
    const [documentos, setDocumentos] = useState<BibliotecaLegalDocumento[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMateria, setSelectedMateria] = useState('todas');
    const [viewMode, setViewMode] = useState<BibliotecaLegalColeccionViewMode>('grid');
    const [sortBy, setSortBy] = useState<BibliotecaLegalSortBy>('recientes');
    const [perPage, setPerPage] = useState<number>(12);
    const [currentPage, setCurrentPage] = useState(1);

    const [previewDocumento, setPreviewDocumento] = useState<BibliotecaLegalDocumento | null>(null);
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState<string | null>(null);

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

    const categoryDocumentos = useMemo(
        () => filterDocumentosByCategory(documentos, category.id),
        [documentos, category.id]
    );

    const materiaOptions = useMemo(() => extractMateriaOptions(categoryDocumentos), [categoryDocumentos]);

    const hasActiveFilters = searchQuery.trim() !== '' || selectedMateria !== 'todas';

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedMateria('todas');
        setCurrentPage(1);
    };

    const filteredDocumentos = useMemo(() => {
        const filtered = filterBibliotecaLegalDocumentos(categoryDocumentos, {
            searchQuery,
            estadoNombre: null,
            municipioNombre: null,
            selectedMateria,
        });
        return sortBibliotecaDocumentos(filtered, sortBy);
    }, [categoryDocumentos, searchQuery, selectedMateria, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filteredDocumentos.length / perPage));
    const effectivePage = Math.min(currentPage, totalPages);

    const paginatedDocumentos = useMemo(() => {
        const start = (effectivePage - 1) * perPage;
        return filteredDocumentos.slice(start, start + perPage);
    }, [filteredDocumentos, effectivePage, perPage]);

    const showingFrom = filteredDocumentos.length > 0 ? (effectivePage - 1) * perPage + 1 : 0;
    const showingTo = Math.min(effectivePage * perPage, filteredDocumentos.length);

    const handlePreview = useCallback((documento: BibliotecaLegalDocumento) => {
        setPreviewDocumento(documento);
        setSignedUrl(null);
        setPreviewError(null);
        setPreviewLoading(true);

        void getBibliotecaLegalPreviewService(documento.id)
            .then((preview) => setSignedUrl(preview.signedUrl))
            .catch((err: Error) => {
                setPreviewError(err.message || 'No se pudo cargar la vista previa del documento.');
            })
            .finally(() => setPreviewLoading(false));
    }, []);

    const handlePreviewOpenChange = (open: boolean) => {
        if (!open) {
            setPreviewDocumento(null);
            setSignedUrl(null);
            setPreviewError(null);
            setPreviewLoading(false);
        }
    };

    const pageNumbers = useMemo(() => {
        const pages: number[] = [];
        const maxVisible = 5;
        let start = Math.max(1, effectivePage - 2);
        const end = Math.min(totalPages, start + maxVisible - 1);
        start = Math.max(1, end - maxVisible + 1);

        for (let page = start; page <= end; page += 1) {
            pages.push(page);
        }

        return pages;
    }, [effectivePage, totalPages]);

    return (
        <div className="flex-1 p-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
                <div className="flex flex-col gap-3">
                    <Link
                        href="/biblioteca-girs"
                        className="biblioteca-category-link inline-flex w-fit items-center gap-1.5 text-sm font-semibold"
                    >
                        <ArrowLeft className="h-4 w-4" aria-hidden />
                        Volver a categorías
                    </Link>
                    <h1 className="titulos-cards mb-0 text-2xl leading-tight md:text-3xl">{category.title}</h1>
                    <p className="descripcion-cards max-w-3xl text-base leading-relaxed text-gray-soft md:text-[17px]">
                        {category.description}
                    </p>
                </div>

                {error ? (
                    <div className="rounded-xl border border-gray-200/70 bg-white px-4 py-8 text-center shadow-sm">
                        <p className="descripcion-cards-small text-gray-soft">{error}</p>
                    </div>
                ) : null}

                {isLoading ? (
                    <div className="flex items-center justify-center rounded-xl border border-gray-200/70 bg-white px-4 py-16 shadow-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Cargando documentos" />
                    </div>
                ) : null}

                {!isLoading && !error ? (
                    <>
                        <BibliotecaLegalColeccionToolbar
                            categoryTitle={category.title}
                            labelPlural="documentos"
                            showingFrom={showingFrom}
                            showingTo={showingTo}
                            filteredTotal={filteredDocumentos.length}
                            searchQuery={searchQuery}
                            onSearchQueryChange={(value) => {
                                setSearchQuery(value);
                                setCurrentPage(1);
                            }}
                            selectedMateria={selectedMateria}
                            onMateriaChange={(value) => {
                                setSelectedMateria(value);
                                setCurrentPage(1);
                            }}
                            materiaOptions={materiaOptions}
                            hasActiveFilters={hasActiveFilters}
                            onClearFilters={handleClearFilters}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                            sortBy={sortBy}
                            onSortByChange={(value) => {
                                setSortBy(value);
                                setCurrentPage(1);
                            }}
                        />

                        <section
                            className={cn(
                                viewMode === 'grid'
                                    ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
                                    : 'flex flex-col gap-3'
                            )}
                            aria-label={`Documentos de ${category.title}`}
                        >
                            {paginatedDocumentos.map((documento) => (
                                <BibliotecaLegalColeccionDocumentCard
                                    key={documento.id}
                                    documento={documento}
                                    categoryId={category.id}
                                    viewMode={viewMode}
                                    onPreview={handlePreview}
                                />
                            ))}
                        </section>

                        {filteredDocumentos.length === 0 ? (
                            <p className="descripcion-cards-small rounded-xl border border-gray-200/70 bg-white px-4 py-8 text-center text-gray-soft shadow-sm">
                                No hay documentos que coincidan con los filtros aplicados.
                            </p>
                        ) : null}

                        {filteredDocumentos.length > 0 ? (
                            <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row">
                                <Pagination className="mx-0 w-auto justify-start sm:justify-center">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    if (effectivePage > 1) setCurrentPage(effectivePage - 1);
                                                }}
                                                className={cn(effectivePage <= 1 && 'pointer-events-none opacity-50')}
                                            />
                                        </PaginationItem>
                                        {pageNumbers.map((page) => (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    href="#"
                                                    isActive={page === effectivePage}
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        setCurrentPage(page);
                                                    }}
                                                    className={
                                                        page === effectivePage
                                                            ? 'border-primary bg-primary text-on-primary hover:bg-primary-hover hover:text-on-primary'
                                                            : undefined
                                                    }
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    if (effectivePage < totalPages) setCurrentPage(effectivePage + 1);
                                                }}
                                                className={cn(
                                                    effectivePage >= totalPages && 'pointer-events-none opacity-50'
                                                )}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>

                                <div className="flex items-center gap-2">
                                    <span className="descripcion-cards-small text-neutral-dark/70">Mostrar:</span>
                                    <Select
                                        value={String(perPage)}
                                        onValueChange={(value) => {
                                            setPerPage(Number(value));
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="h-9 w-[8.5rem] border-gray-200/80 bg-white text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PER_PAGE_OPTIONS.map((option) => (
                                                <SelectItem key={option} value={String(option)}>
                                                    {option} por página
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        ) : null}
                    </>
                ) : null}

                <BibliotecaLegalPreviewModal
                    open={previewDocumento !== null}
                    documento={previewDocumento}
                    signedUrl={signedUrl}
                    isLoading={previewLoading}
                    error={previewError}
                    onOpenChange={handlePreviewOpenChange}
                    onRetry={
                        previewDocumento
                            ? () => {
                                  handlePreview(previewDocumento);
                              }
                            : undefined
                    }
                />
            </div>
        </div>
    );
}
