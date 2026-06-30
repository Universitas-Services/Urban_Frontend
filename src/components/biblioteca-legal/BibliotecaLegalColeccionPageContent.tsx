'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BibliotecaLegalCategory } from './biblioteca-legal.data';
import {
    filterBibliotecaLegalColeccionDocumentos,
    getBibliotecaLegalColeccionDocumentos,
    getBibliotecaLegalColeccionMeta,
} from './biblioteca-legal.coleccion.data';
import { BibliotecaLegalColeccionToolbar } from './BibliotecaLegalColeccionToolbar';
import {
    BibliotecaLegalColeccionDocumentCard,
    type BibliotecaLegalColeccionViewMode,
} from './BibliotecaLegalColeccionDocumentCard';
import { useBibliotecaLegalTerritorioFilters } from './useBibliotecaLegalTerritorioFilters';

type BibliotecaLegalColeccionPageContentProps = {
    category: BibliotecaLegalCategory;
};

export function BibliotecaLegalColeccionPageContent({ category }: BibliotecaLegalColeccionPageContentProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMateria, setSelectedMateria] = useState('todas');
    const [viewMode, setViewMode] = useState<BibliotecaLegalColeccionViewMode>('grid');
    const meta = getBibliotecaLegalColeccionMeta(category.id);
    const allDocumentos = getBibliotecaLegalColeccionDocumentos(category.id);
    const totalPages = Math.ceil(meta.total / meta.perPage);

    const {
        estados,
        municipios,
        selectedEstadoId,
        selectedEstadoNombre,
        selectedMunicipioNombre,
        isLoadingEstados,
        isLoadingMunicipios,
        handleEstadoChange,
        handleMunicipioChange,
        resetTerritorioFilters,
    } = useBibliotecaLegalTerritorioFilters();

    const hasActiveFilters =
        searchQuery.trim() !== '' ||
        selectedEstadoId !== null ||
        selectedMunicipioNombre !== 'all' ||
        selectedMateria !== 'todas';

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedMateria('todas');
        resetTerritorioFilters();
    };

    const filteredDocumentos = useMemo(
        () =>
            filterBibliotecaLegalColeccionDocumentos(allDocumentos, {
                searchQuery,
                estadoNombre: selectedEstadoNombre,
                municipioNombre: selectedMunicipioNombre,
            }),
        [allDocumentos, searchQuery, selectedEstadoNombre, selectedMunicipioNombre]
    );

    const showingFrom = filteredDocumentos.length > 0 ? 1 : 0;
    const showingTo = filteredDocumentos.length;

    return (
        <div className="flex-1 p-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
                <div className="flex flex-col gap-3">
                    <Link
                        href="/biblioteca-girs"
                        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
                    >
                        <ArrowLeft className="h-4 w-4" aria-hidden />
                        Volver a Biblioteca Legal
                    </Link>
                    <h1 className="titulos-cards mb-0 text-2xl leading-tight md:text-3xl">{category.title}</h1>
                </div>

                <BibliotecaLegalColeccionToolbar
                    categoryTitle={category.title}
                    labelPlural={meta.labelPlural}
                    showingFrom={showingFrom}
                    showingTo={showingTo}
                    filteredTotal={filteredDocumentos.length}
                    searchQuery={searchQuery}
                    onSearchQueryChange={setSearchQuery}
                    estados={estados}
                    municipios={municipios}
                    selectedEstadoId={selectedEstadoId}
                    selectedMunicipioNombre={selectedMunicipioNombre}
                    isLoadingEstados={isLoadingEstados}
                    isLoadingMunicipios={isLoadingMunicipios}
                    onEstadoChange={handleEstadoChange}
                    onMunicipioChange={handleMunicipioChange}
                    selectedMateria={selectedMateria}
                    onMateriaChange={setSelectedMateria}
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
                    {filteredDocumentos.map((documento) => (
                        <BibliotecaLegalColeccionDocumentCard
                            key={documento.id}
                            documento={documento}
                            viewMode={viewMode}
                        />
                    ))}
                </section>

                {filteredDocumentos.length === 0 ? (
                    <p className="descripcion-cards-small rounded-xl border border-gray-200/70 bg-white px-4 py-8 text-center text-gray-soft shadow-sm">
                        No hay documentos que coincidan con los filtros aplicados.
                    </p>
                ) : null}

                <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row">
                    <Pagination className="mx-0 w-auto justify-start sm:justify-center">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" className="pointer-events-none opacity-50" />
                            </PaginationItem>
                            {[1, 2, 3, 4, 5].map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        href="#"
                                        isActive={page === meta.currentPage}
                                        className={
                                            page === meta.currentPage
                                                ? 'border-primary bg-primary text-on-primary hover:bg-primary-hover hover:text-on-primary'
                                                : undefined
                                        }
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">{totalPages}</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>

                    <div className="flex items-center gap-2">
                        <span className="descripcion-cards-small text-neutral-dark/70">Mostrar:</span>
                        <Select defaultValue="12">
                            <SelectTrigger className="h-9 w-[8.5rem] border-gray-200/80 bg-white text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="12">12 por página</SelectItem>
                                <SelectItem value="24">24 por página</SelectItem>
                                <SelectItem value="48">48 por página</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}
