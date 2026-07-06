'use client';

import { LayoutGrid, List, RotateCcw, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { BIBLIOTECA_LEGAL_CATEGORIES } from './biblioteca-legal.data';
import type { BibliotecaLegalColeccionViewMode } from './BibliotecaLegalColeccionDocumentCard';

export const BIBLIOTECA_LEGAL_TODAS_CATEGORIAS = 'todas';

type BibliotecaLegalColeccionToolbarProps = {
    showingFrom: number;
    showingTo: number;
    filteredTotal: number;
    searchQuery: string;
    onSearchQueryChange: (value: string) => void;
    selectedCategory?: string;
    onSelectedCategoryChange?: (value: string) => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    viewMode: BibliotecaLegalColeccionViewMode;
    onViewModeChange: (mode: BibliotecaLegalColeccionViewMode) => void;
};

export function BibliotecaLegalColeccionToolbar({
    showingFrom,
    showingTo,
    filteredTotal,
    searchQuery,
    onSearchQueryChange,
    selectedCategory,
    onSelectedCategoryChange,
    hasActiveFilters,
    onClearFilters,
    viewMode,
    onViewModeChange,
}: BibliotecaLegalColeccionToolbarProps) {
    const showCategoryFilter = selectedCategory !== undefined && onSelectedCategoryChange !== undefined;

    return (
        <div className="rounded-xl border border-gray-200/70 bg-white p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-soft"
                            aria-hidden
                        />
                        <Input
                            type="search"
                            value={searchQuery}
                            onChange={(event) => onSearchQueryChange(event.target.value)}
                            placeholder="Buscar por título o descripción..."
                            className="h-11 border-gray-200/80 bg-surface-light/60 pl-10 text-sm"
                            aria-label="Buscar en Biblioteca Legal"
                        />
                    </div>

                    {showCategoryFilter ? (
                        <Select value={selectedCategory} onValueChange={onSelectedCategoryChange}>
                            <SelectTrigger
                                className="h-11 w-full border-gray-200/80 bg-white text-sm sm:w-[15.5rem]"
                                aria-label="Filtrar por tipo de documento"
                            >
                                <SelectValue placeholder="Tipo de documento" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={BIBLIOTECA_LEGAL_TODAS_CATEGORIAS}>Todos los tipos</SelectItem>
                                {BIBLIOTECA_LEGAL_CATEGORIES.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : null}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClearFilters}
                        disabled={!hasActiveFilters}
                        className="h-11 shrink-0 border-gray-200/80 bg-white text-sm font-medium text-neutral-dark disabled:opacity-50"
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Limpiar filtros
                    </Button>
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="descripcion-cards-small text-neutral-dark/80">
                    {filteredTotal > 0 ? (
                        <>
                            Mostrando{' '}
                            <span className="font-semibold text-neutral-dark">
                                {showingFrom}–{showingTo}
                            </span>{' '}
                            de <span className="font-semibold text-neutral-dark">{filteredTotal}</span> documentos
                        </>
                    ) : (
                        <>No se encontraron documentos con los filtros seleccionados</>
                    )}
                </p>

                <div className="flex items-center rounded-lg border border-gray-200/80 p-0.5">
                    <button
                        type="button"
                        onClick={() => onViewModeChange('grid')}
                        className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                            viewMode === 'grid'
                                ? 'bg-surface-soft text-primary'
                                : 'text-gray-soft hover:text-neutral-dark'
                        )}
                        aria-label="Vista en cuadrícula"
                        aria-pressed={viewMode === 'grid'}
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onViewModeChange('list')}
                        className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                            viewMode === 'list'
                                ? 'bg-surface-soft text-primary'
                                : 'text-gray-soft hover:text-neutral-dark'
                        )}
                        aria-label="Vista en lista"
                        aria-pressed={viewMode === 'list'}
                    >
                        <List className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
