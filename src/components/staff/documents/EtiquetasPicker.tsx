'use client';

import * as React from 'react';
import { Loader2, Plus, Search, X } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { createEtiquetaAction, getEtiquetasAction, type Etiqueta } from '@/lib/services/etiquetas.service';

interface EtiquetasPickerProps {
    value: string[];
    onChange: (ids: string[]) => void;
    className?: string;
}

function normalize(text: string) {
    return text.trim().toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
}

export function EtiquetasPicker({ value, onChange, className }: EtiquetasPickerProps) {
    const [catalog, setCatalog] = React.useState<Etiqueta[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [creating, setCreating] = React.useState(false);
    const [query, setQuery] = React.useState('');

    const loadCatalog = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await getEtiquetasAction({ page: 1, limit: 200 });
            setCatalog(res.items);
        } catch {
            setCatalog([]);
            toast.error('No se pudieron cargar las etiquetas');
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial del catálogo
        void loadCatalog();
    }, [loadCatalog]);

    const selectedTags = React.useMemo(() => catalog.filter((tag) => value.includes(tag.id)), [catalog, value]);

    const filteredTags = React.useMemo(() => {
        const q = normalize(query);
        const list = q ? catalog.filter((tag) => normalize(tag.nombre).includes(q)) : catalog;
        return [...list].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    }, [catalog, query]);

    const exactMatch = React.useMemo(() => {
        const q = normalize(query);
        if (!q) return null;
        return catalog.find((tag) => normalize(tag.nombre) === q) ?? null;
    }, [catalog, query]);

    const canCreate = query.trim().length >= 2 && !exactMatch && !creating;

    const toggleTag = (id: string) => {
        onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
    };

    const removeTag = (id: string) => {
        onChange(value.filter((x) => x !== id));
    };

    const handleCreate = async () => {
        const nombre = query.trim();
        if (nombre.length < 2) return;

        setCreating(true);
        try {
            const created = await createEtiquetaAction({ nombre });
            setCatalog((prev) => (prev.some((t) => t.id === created.id) ? prev : [created, ...prev]));
            if (!value.includes(created.id)) {
                onChange([...value, created.id]);
            }
            setQuery('');
            toast.success(`Etiqueta «${created.nombre}» creada`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'No se pudo crear la etiqueta');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className={cn('space-y-3', className)}>
            {selectedTags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                    {selectedTags.map((tag) => (
                        <Badge
                            key={tag.id}
                            variant="default"
                            className="gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                        >
                            {tag.nombre}
                            <button
                                type="button"
                                onClick={() => removeTag(tag.id)}
                                className="rounded-full opacity-80 hover:opacity-100"
                                aria-label={`Quitar ${tag.nombre}`}
                            >
                                <X className="size-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-muted-foreground">Ninguna etiqueta seleccionada.</p>
            )}

            <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (canCreate) void handleCreate();
                                else if (exactMatch) toggleTag(exactMatch.id);
                            }
                        }}
                        placeholder="Buscar o crear etiqueta…"
                        className="pl-9"
                        disabled={loading || creating}
                    />
                </div>
                <Button
                    type="button"
                    variant="secondary"
                    disabled={!canCreate}
                    onClick={() => void handleCreate()}
                    className="shrink-0"
                >
                    {creating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                    <span className="ml-1.5 hidden sm:inline">Crear</span>
                </Button>
            </div>

            {canCreate ? (
                <button
                    type="button"
                    onClick={() => void handleCreate()}
                    className="flex w-full items-center gap-2 rounded-md border border-dashed border-primary/40 bg-primary/5 px-3 py-2 text-left text-sm text-primary transition hover:bg-primary/10"
                >
                    <Plus className="size-4 shrink-0" />
                    Crear nueva etiqueta «{query.trim()}»
                </button>
            ) : null}

            <div className="max-h-48 overflow-y-auto rounded-md border bg-muted/10 p-2 custom-scrollbar">
                {loading ? (
                    <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        Cargando etiquetas…
                    </div>
                ) : filteredTags.length === 0 ? (
                    <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                        {query.trim()
                            ? 'Sin coincidencias. Usa Crear para añadirla al catálogo.'
                            : 'Aún no hay etiquetas. Escribe un nombre y créala aquí.'}
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {filteredTags.map((tag) => {
                            const checked = value.includes(tag.id);
                            return (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => toggleTag(tag.id)}
                                    className={cn(
                                        'rounded-full border px-3 py-1 text-sm transition',
                                        checked
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border bg-background hover:border-primary/50'
                                    )}
                                >
                                    {tag.nombre}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <p className="text-[11px] text-muted-foreground">
                {value.length} seleccionada{value.length === 1 ? '' : 's'}
                {catalog.length > 0 ? ` · ${catalog.length} en catálogo` : ''}
            </p>
        </div>
    );
}
