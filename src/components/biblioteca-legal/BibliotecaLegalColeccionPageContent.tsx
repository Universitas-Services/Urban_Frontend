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
import { getMacroTipoForCategoryId } from './biblioteca-legal.category';
import type { BibliotecaLegalCategory } from './biblioteca-legal.data';
import { BibliotecaLegalColeccionToolbar } from './BibliotecaLegalColeccionToolbar';
import {
    BibliotecaLegalColeccionDocumentCard,
    type BibliotecaLegalColeccionViewMode,
} from './BibliotecaLegalColeccionDocumentCard';
import { getPublishedDocumentsAction, type Documento } from '@/lib/services/documents.service';

const PER_PAGE_OPTIONS = [12, 24, 48] as const;

type BibliotecaLegalColeccionPageContentProps = {
    category: BibliotecaLegalCategory;
};

export function BibliotecaLegalColeccionPageContent({ category }: BibliotecaLegalColeccionPageContentProps) {
    const macroTipo = getMacroTipoForCategoryId(category.id);

    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [searchInput, setSearchInput] = useState('');
    const [appliedQ, setAppliedQ] = useState('');
    const [viewMode, setViewMode] = useState<BibliotecaLegalColeccionViewMode>('grid');
    const [perPage, setPerPage] = useState<number>(12);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (!macroTipo) return;

        let cancelled = false;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- carga del listado por categoría
        setIsLoading(true);
        setError(null);

        void getPublishedDocumentsAction({
            macroTipo,
            q: appliedQ.trim() || undefined,
            page: currentPage,
            limit: perPage,
        })
            .then((response) => {
                if (cancelled) return;
                setDocumentos(response.items);
                setTotal(response.total);
                setTotalPages(Math.max(1, response.totalPages));
            })
            .catch((err: Error) => {
                if (!cancelled) {
                    setDocumentos([]);
                    setTotal(0);
                    setTotalPages(1);
                    setError(err.message || 'No se pudieron cargar los documentos. Intenta de nuevo más tarde.');
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [macroTipo, appliedQ, currentPage, perPage]);

    const hasActiveFilters = searchInput.trim() !== '' || appliedQ.trim() !== '';

    const handleClearFilters = () => {
        setSearchInput('');
        setAppliedQ('');
        setCurrentPage(1);
    };

    const applySearch = useCallback(() => {
        setAppliedQ(searchInput.trim());
        setCurrentPage(1);
    }, [searchInput]);

    const effectivePage = Math.min(currentPage, totalPages);
    const showingFrom = total > 0 ? (effectivePage - 1) * perPage + 1 : 0;
    const showingTo = Math.min(effectivePage * perPage, total);

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

    if (!macroTipo) {
        return (
            <div className="flex-1 p-6">
                <div className="mx-auto max-w-6xl rounded-xl border border-gray-200/70 bg-white px-4 py-8 text-center shadow-sm">
                    <p className="descripcion-cards-small text-gray-soft">Categoría no válida.</p>
                    <Link
                        href="/biblioteca-legal"
                        className="biblioteca-category-link mt-4 inline-flex text-sm font-semibold"
                    >
                        Volver a categorías
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
                <div className="flex flex-col gap-3">
                    <Link
                        href="/biblioteca-legal"
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
                            showingFrom={showingFrom}
                            showingTo={showingTo}
                            filteredTotal={total}
                            searchQuery={searchInput}
                            onSearchQueryChange={setSearchInput}
                            onSearchSubmit={applySearch}
                            hasActiveFilters={hasActiveFilters}
                            onClearFilters={handleClearFilters}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                        />

                        <section
                            className={cn(
                                viewMode === 'grid'
                                    ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
                                    : 'flex flex-col gap-3'
                            )}
                            aria-label={`Documentos de ${category.title}`}
                        >
                            {documentos.map((documento) => (
                                <BibliotecaLegalColeccionDocumentCard
                                    key={documento.id}
                                    documento={documento}
                                    categoryId={category.id}
                                    viewMode={viewMode}
                                />
                            ))}
                        </section>

                        {documentos.length === 0 ? (
                            <p className="descripcion-cards-small rounded-xl border border-gray-200/70 bg-white px-4 py-8 text-center text-gray-soft shadow-sm">
                                No hay documentos publicados en esta categoría.
                            </p>
                        ) : null}

                        {total > 0 ? (
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
            </div>
        </div>
    );
}
