'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
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
import type { BibliotecaLegalDocumento } from './biblioteca-legal.types';
import { BibliotecaLegalHero } from './BibliotecaLegalHero';
import { BIBLIOTECA_LEGAL_TODAS_CATEGORIAS, BibliotecaLegalColeccionToolbar } from './BibliotecaLegalColeccionToolbar';
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
const SEARCH_DEBOUNCE_MS = 400;
const CLIENT_FILTER_FETCH_LIMIT = 100;

export function BibliotecaLegalDocumentosPageContent() {
    const [documentos, setDocumentos] = useState<BibliotecaLegalDocumento[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(BIBLIOTECA_LEGAL_TODAS_CATEGORIAS);
    const [viewMode, setViewMode] = useState<BibliotecaLegalColeccionViewMode>('grid');
    const [perPage, setPerPage] = useState<number>(12);
    const [currentPage, setCurrentPage] = useState(1);

    const [previewDocumento, setPreviewDocumento] = useState<BibliotecaLegalDocumento | null>(null);
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState<string | null>(null);

    const isClientFilterMode = selectedCategory !== BIBLIOTECA_LEGAL_TODAS_CATEGORIAS;

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setSearchQuery(searchInput.trim());
            setCurrentPage(1);
            setIsLoading(true);
        }, SEARCH_DEBOUNCE_MS);

        return () => window.clearTimeout(timeoutId);
    }, [searchInput]);

    useEffect(() => {
        let cancelled = false;

        void getBibliotecaLegalDocumentosService({
            search: searchQuery || undefined,
            page: isClientFilterMode ? 1 : currentPage,
            limit: isClientFilterMode ? CLIENT_FILTER_FETCH_LIMIT : perPage,
        })
            .then((response) => {
                if (cancelled) return;
                setError(null);
                setDocumentos(response.items);
                setTotal(response.total);
                setTotalPages(response.totalPages);
            })
            .catch((err: Error) => {
                if (cancelled) return;
                setError(err.message || 'No se pudieron cargar los documentos. Intenta de nuevo más tarde.');
                setDocumentos([]);
                setTotal(0);
                setTotalPages(1);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [searchQuery, currentPage, perPage, isClientFilterMode]);

    const filteredDocumentos = useMemo(() => {
        if (!isClientFilterMode) return documentos;
        return filterDocumentosByCategory(documentos, selectedCategory);
    }, [documentos, isClientFilterMode, selectedCategory]);

    const displayTotal = isClientFilterMode ? filteredDocumentos.length : total;
    const displayTotalPages = isClientFilterMode
        ? Math.max(1, Math.ceil(filteredDocumentos.length / perPage))
        : totalPages;
    const effectivePage = Math.min(currentPage, displayTotalPages);
    const showingFrom = displayTotal > 0 ? (effectivePage - 1) * perPage + 1 : 0;
    const showingTo = Math.min(effectivePage * perPage, displayTotal);
    const hasActiveFilters = searchInput.trim() !== '' || selectedCategory !== BIBLIOTECA_LEGAL_TODAS_CATEGORIAS;

    const visibleDocumentos = useMemo(() => {
        if (!isClientFilterMode) return documentos;
        const start = (effectivePage - 1) * perPage;
        return filteredDocumentos.slice(start, start + perPage);
    }, [documentos, filteredDocumentos, effectivePage, isClientFilterMode, perPage]);

    const handleClearFilters = () => {
        setSearchInput('');
        setSearchQuery('');
        setSelectedCategory(BIBLIOTECA_LEGAL_TODAS_CATEGORIAS);
        setCurrentPage(1);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        setCurrentPage(1);
        setIsLoading(true);
    };

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
        const end = Math.min(displayTotalPages, start + maxVisible - 1);
        start = Math.max(1, end - maxVisible + 1);

        for (let page = start; page <= end; page += 1) {
            pages.push(page);
        }

        return pages;
    }, [effectivePage, displayTotalPages]);

    return (
        <div className="flex-1 p-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 md:gap-6">
                <BibliotecaLegalHero />

                {error ? (
                    <div className="rounded-xl border border-gray-200/70 bg-white px-4 py-8 text-center shadow-sm">
                        <p className="descripcion-cards-small text-gray-soft">{error}</p>
                    </div>
                ) : null}

                <BibliotecaLegalColeccionToolbar
                    showingFrom={showingFrom}
                    showingTo={showingTo}
                    filteredTotal={displayTotal}
                    searchQuery={searchInput}
                    onSearchQueryChange={setSearchInput}
                    selectedCategory={selectedCategory}
                    onSelectedCategoryChange={handleCategoryChange}
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />

                {isLoading ? (
                    <div className="flex items-center justify-center rounded-xl border border-gray-200/70 bg-white px-4 py-16 shadow-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Cargando documentos" />
                    </div>
                ) : null}

                {!isLoading && !error ? (
                    <>
                        <section
                            className={cn(
                                viewMode === 'grid'
                                    ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
                                    : 'flex flex-col gap-3'
                            )}
                            aria-label="Documentos de la Biblioteca Legal"
                        >
                            {visibleDocumentos.map((documento) => (
                                <BibliotecaLegalColeccionDocumentCard
                                    key={documento.id}
                                    documento={documento}
                                    viewMode={viewMode}
                                    onPreview={handlePreview}
                                />
                            ))}
                        </section>

                        {visibleDocumentos.length === 0 ? (
                            <p className="descripcion-cards-small rounded-xl border border-gray-200/70 bg-white px-4 py-8 text-center text-gray-soft shadow-sm">
                                No hay documentos que coincidan con los filtros aplicados.
                            </p>
                        ) : null}

                        {displayTotal > 0 ? (
                            <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row">
                                <Pagination className="mx-0 w-auto justify-start sm:justify-center">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    if (effectivePage > 1) {
                                                        setCurrentPage(effectivePage - 1);
                                                        if (!isClientFilterMode) setIsLoading(true);
                                                    }
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
                                                        if (!isClientFilterMode) setIsLoading(true);
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
                                                    if (effectivePage < displayTotalPages) {
                                                        setCurrentPage(effectivePage + 1);
                                                        if (!isClientFilterMode) setIsLoading(true);
                                                    }
                                                }}
                                                className={cn(
                                                    effectivePage >= displayTotalPages &&
                                                        'pointer-events-none opacity-50'
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
                                            setIsLoading(true);
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
