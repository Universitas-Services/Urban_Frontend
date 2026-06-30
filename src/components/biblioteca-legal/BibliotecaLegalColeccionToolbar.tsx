'use client';

import { LayoutGrid, List, RotateCcw, Search } from 'lucide-react';
import type { Estado, Municipio } from '@universitas/sdk-global';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { BibliotecaLegalColeccionViewMode } from './BibliotecaLegalColeccionDocumentCard';

type BibliotecaLegalColeccionToolbarProps = {
    categoryTitle: string;
    labelPlural: string;
    showingFrom: number;
    showingTo: number;
    filteredTotal: number;
    searchQuery: string;
    onSearchQueryChange: (value: string) => void;
    estados: Estado[];
    municipios: Municipio[];
    selectedEstadoId: number | null;
    selectedMunicipioNombre: string;
    isLoadingEstados: boolean;
    isLoadingMunicipios: boolean;
    onEstadoChange: (value: string) => void;
    onMunicipioChange: (value: string) => void;
    selectedMateria: string;
    onMateriaChange: (value: string) => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    viewMode: BibliotecaLegalColeccionViewMode;
    onViewModeChange: (mode: BibliotecaLegalColeccionViewMode) => void;
};

export function BibliotecaLegalColeccionToolbar({
    categoryTitle,
    labelPlural,
    showingFrom,
    showingTo,
    filteredTotal,
    searchQuery,
    onSearchQueryChange,
    estados,
    municipios,
    selectedEstadoId,
    selectedMunicipioNombre,
    isLoadingEstados,
    isLoadingMunicipios,
    onEstadoChange,
    onMunicipioChange,
    selectedMateria,
    onMateriaChange,
    hasActiveFilters,
    onClearFilters,
    viewMode,
    onViewModeChange,
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
                    placeholder="Buscar por título, municipio, materia o palabra clave..."
                    className="h-11 border-gray-200/80 bg-surface-light/60 pl-10 text-sm"
                    aria-label={`Buscar en ${categoryTitle}`}
                />
            </div>

            <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-center">
                <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
                    <Select
                        value={selectedEstadoId?.toString() ?? 'all'}
                        onValueChange={onEstadoChange}
                        disabled={isLoadingEstados}
                    >
                        <SelectTrigger className="h-10 w-full border-gray-200/80 bg-white text-sm">
                            <SelectValue placeholder={isLoadingEstados ? 'Cargando estados...' : 'Estado: Todos'} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Estado: Todos</SelectItem>
                            {estados.map((estado) => (
                                <SelectItem key={estado.id} value={estado.id.toString()}>
                                    {estado.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={selectedMunicipioNombre}
                        onValueChange={onMunicipioChange}
                        disabled={!selectedEstadoId || isLoadingMunicipios}
                    >
                        <SelectTrigger className="h-10 w-full border-gray-200/80 bg-white text-sm">
                            <SelectValue
                                placeholder={
                                    !selectedEstadoId
                                        ? 'Selecciona un estado'
                                        : isLoadingMunicipios
                                          ? 'Cargando municipios...'
                                          : 'Municipio: Todos'
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Municipio: Todos</SelectItem>
                            {municipios.map((municipio) => (
                                <SelectItem key={municipio.id} value={municipio.nombre}>
                                    {municipio.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedMateria} onValueChange={onMateriaChange}>
                        <SelectTrigger className="h-10 w-full border-gray-200/80 bg-white text-sm">
                            <SelectValue placeholder="Materia" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todas">Materia: Todas</SelectItem>
                            <SelectItem value="uso-suelo">Uso del suelo</SelectItem>
                            <SelectItem value="ambiental">Protección ambiental</SelectItem>
                            <SelectItem value="construccion">Construcción</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

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
                        <Select defaultValue="recientes">
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
