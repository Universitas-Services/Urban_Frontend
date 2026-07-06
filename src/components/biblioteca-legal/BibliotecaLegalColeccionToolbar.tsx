'use client';

import { LayoutGrid, List, RotateCcw, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { BibliotecaLegalColeccionViewMode } from './BibliotecaLegalColeccionDocumentCard';
import type { BibliotecaLegalMateriaOption, BibliotecaLegalSortBy } from './biblioteca-legal.types';

type BibliotecaLegalColeccionToolbarProps = {
    categoryTitle: string;
    labelPlural: string;
    showingFrom: number;
    showingTo: number;
    filteredTotal: number;
    searchQuery: string;
    onSearchQueryChange: (value: string) => void;
    selectedMateria: string;
    onMateriaChange: (value: string) => void;
    materiaOptions: BibliotecaLegalMateriaOption[];
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    viewMode: BibliotecaLegalColeccionViewMode;
    onViewModeChange: (mode: BibliotecaLegalColeccionViewMode) => void;
    sortBy: BibliotecaLegalSortBy;
    onSortByChange: (value: BibliotecaLegalSortBy) => void;
};

export function BibliotecaLegalColeccionToolbar({
    categoryTitle,
    labelPlural,
    showingFrom,
    showingTo,
    filteredTotal,
    searchQuery,
    onSearchQueryChange,
    selectedMateria,
    onMateriaChange,
    materiaOptions,
    hasActiveFilters,
    onClearFilters,
    viewMode,
    onViewModeChange,
    sortBy,
    onSortByChange,
}: BibliotecaLegalColeccionToolbarProps) {
    return (
        <div className="rounded-xl border border-gray-200/70 bg-white p-4 shadow-sm md:p-5">
            <div className="relative">
                <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-soft"
                    aria-hidden
                />
                <Input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => onSearchQueryChange(event.target.value)}
                    placeholder="Buscar por título, emisor, tipo, categoría o palabra clave..."
                    className="h-11 border-gray-200/80 bg-surface-light/60 pl-10 text-sm"
                    aria-label={`Buscar en ${categoryTitle}`}
                />
            </div>

            <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-center">
                <Select value={selectedMateria} onValueChange={onMateriaChange}>
                    <SelectTrigger className="h-10 w-full border-gray-200/80 bg-white text-sm lg:max-w-xs">
                        <SelectValue placeholder="Categorías" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todas">Categorías: Todas</SelectItem>
                        {materiaOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button
                    type="button"
                    variant="outline"
                    onClick={onClearFilters}
                    disabled={!hasActiveFilters}
                    className="h-10 shrink-0 border-gray-200/80 bg-white text-sm font-medium text-neutral-dark disabled:opacity-50"
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Limpiar filtros
                </Button>
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="descripcion-cards-small text-neutral-dark/80">
                    {filteredTotal > 0 ? (
                        <>
                            Mostrando{' '}
                            <span className="font-semibold text-neutral-dark">
                                {showingFrom}–{showingTo}
                            </span>{' '}
                            de <span className="font-semibold text-neutral-dark">{filteredTotal}</span> {labelPlural}
                        </>
                    ) : (
                        <>No se encontraron {labelPlural} con los filtros seleccionados</>
                    )}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="descripcion-cards-small shrink-0 text-neutral-dark/70">Ordenar por:</span>
                        <Select
                            value={sortBy}
                            onValueChange={(value) => onSortByChange(value as BibliotecaLegalSortBy)}
                        >
                            <SelectTrigger className="h-9 w-[10.5rem] border-gray-200/80 bg-white text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recientes">Más recientes</SelectItem>
                                <SelectItem value="antiguos">Más antiguos</SelectItem>
                                <SelectItem value="alfabetico">Alfabético</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

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
        </div>
    );
}
