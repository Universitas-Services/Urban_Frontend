'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type SuggestOption = {
    value: string;
    label: string;
    secondary?: string;
    key?: string;
};

interface SuggestibleInputProps {
    value: string;
    onChange: (value: string) => void;
    options: SuggestOption[];
    loading?: boolean;
    disabled?: boolean;
    placeholder?: string;
    emptyMessage?: string;
    searchPlaceholder?: string;
}

function normalize(text: string) {
    return text.trim().toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
}

/**
 * Input libre + listado de sugerencias (API/catálogo).
 * Elegir una opción rellena el campo; el usuario puede escribir cualquier texto.
 */
export function SuggestibleInput({
    value,
    onChange,
    options,
    loading = false,
    disabled,
    placeholder = 'Escribe o elige una opción',
    emptyMessage = 'No hay opciones disponibles',
    searchPlaceholder = 'Buscar…',
}: SuggestibleInputProps) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');

    const filtered = React.useMemo(() => {
        const q = normalize(query);
        const list = q
            ? options.filter(
                  (opt) =>
                      normalize(opt.label).includes(q) ||
                      normalize(opt.secondary || '').includes(q) ||
                      normalize(opt.value).includes(q)
              )
            : options;
        return [...list].sort((a, b) => a.label.localeCompare(b.label, 'es'));
    }, [options, query]);

    const pick = (next: string) => {
        onChange(next);
        setOpen(false);
        setQuery('');
    };

    return (
        <div className="flex gap-1.5">
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder={loading ? 'Cargando…' : placeholder}
                className="min-w-0 flex-1"
            />
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
                        size="icon"
                        disabled={disabled || loading}
                        aria-label="Ver sugerencias"
                        className="shrink-0"
                    >
                        {loading ? (
                            <Loader2 className="size-4 animate-spin opacity-60" />
                        ) : (
                            <ChevronsUpDown className="size-4 opacity-50" />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[260px] p-0" align="end">
                    <div className="border-b p-2">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={searchPlaceholder}
                                className="h-9 pl-8"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="custom-scrollbar max-h-72 overflow-y-auto p-1">
                        {filtered.length === 0 ? (
                            <div className="space-y-2 px-2 py-4 text-center">
                                <p className="text-sm text-muted-foreground">
                                    {options.length === 0 ? emptyMessage : 'Sin resultados en el listado'}
                                </p>
                                {query.trim() ? (
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => pick(query.trim())}
                                    >
                                        Usar «{query.trim()}»
                                    </Button>
                                ) : value.trim() ? null : (
                                    <p className="text-xs text-muted-foreground">
                                        Puedes escribir el nombre en el campo.
                                    </p>
                                )}
                            </div>
                        ) : (
                            filtered.map((opt) => {
                                const selected = value === opt.value;
                                return (
                                    <button
                                        key={opt.key ?? opt.value}
                                        type="button"
                                        onClick={() => pick(opt.value)}
                                        className={cn(
                                            'flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent',
                                            selected && 'bg-accent'
                                        )}
                                    >
                                        <span className="min-w-0 flex-1">
                                            <span className="block leading-snug">{opt.label}</span>
                                            {opt.secondary ? (
                                                <span className="mt-0.5 block text-[11px] text-muted-foreground">
                                                    {opt.secondary}
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
        </div>
    );
}
