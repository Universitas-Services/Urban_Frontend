'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { TribunalTerritorio } from '@/lib/api/territorio-tribunales';

interface TribunalSelectProps {
    value: string;
    onChange: (nombre: string) => void;
    tribunales: TribunalTerritorio[];
    loading?: boolean;
    disabled?: boolean;
    placeholder?: string;
    emptyMessage?: string;
}

function normalize(text: string) {
    return text.trim().toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
}

export function TribunalSelect({
    value,
    onChange,
    tribunales,
    loading = false,
    disabled,
    placeholder = 'Selecciona un tribunal',
    emptyMessage = 'No hay tribunales para esta ubicación',
}: TribunalSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');

    const filtered = React.useMemo(() => {
        const q = normalize(query);
        const list = q
            ? tribunales.filter((t) => normalize(t.nombre).includes(q) || normalize(t.categoria || '').includes(q))
            : tribunales;
        return [...list].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    }, [tribunales, query]);

    return (
        <Popover
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (!next) setQuery('');
            }}
        >
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled || loading}
                    className={cn(
                        'h-auto min-h-9 w-full justify-between py-2 font-normal',
                        !value && 'text-muted-foreground'
                    )}
                >
                    <span className="line-clamp-2 min-w-0 flex-1 text-left text-sm">
                        {loading ? 'Cargando tribunales…' : value || placeholder}
                    </span>
                    {loading ? (
                        <Loader2 className="ml-2 size-4 shrink-0 animate-spin opacity-60" />
                    ) : (
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <div className="border-b p-2">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar tribunal…"
                            className="h-9 pl-8"
                            autoFocus
                        />
                    </div>
                </div>
                <div className="custom-scrollbar max-h-72 overflow-y-auto p-1">
                    {filtered.length === 0 ? (
                        <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                            {tribunales.length === 0 ? emptyMessage : 'Sin resultados'}
                        </p>
                    ) : (
                        filtered.map((tribunal) => {
                            const selected = value === tribunal.nombre;
                            return (
                                <button
                                    key={tribunal.id}
                                    type="button"
                                    onClick={() => {
                                        onChange(tribunal.nombre);
                                        setOpen(false);
                                        setQuery('');
                                    }}
                                    className={cn(
                                        'flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent',
                                        selected && 'bg-accent'
                                    )}
                                >
                                    <span className="min-w-0 flex-1">
                                        <span className="block leading-snug">{tribunal.nombre}</span>
                                        {tribunal.categoria ? (
                                            <span className="mt-0.5 block text-[11px] text-muted-foreground">
                                                {tribunal.categoria}
                                            </span>
                                        ) : null}
                                    </span>
                                    {selected ? <Check className="mt-0.5 size-4 shrink-0 text-primary" /> : null}
                                </button>
                            );
                        })
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
