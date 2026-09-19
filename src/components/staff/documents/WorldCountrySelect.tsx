'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CountryFlag, findCountryByName, getWorldCountriesEs } from './country-flags';

interface WorldCountrySelectProps {
    value: string;
    onChange: (countryName: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

function normalize(text: string) {
    return text.trim().toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
}

export function WorldCountrySelect({
    value,
    onChange,
    placeholder = 'Selecciona un país',
    disabled,
    className,
}: WorldCountrySelectProps) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');

    const countries = React.useMemo(() => getWorldCountriesEs(), []);
    const selected = React.useMemo(() => findCountryByName(value), [value]);

    const filtered = React.useMemo(() => {
        const q = normalize(query);
        if (!q) return countries;
        return countries.filter((c) => normalize(c.name).includes(q) || normalize(c.code).includes(q));
    }, [countries, query]);

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
                    disabled={disabled}
                    className={cn(
                        'w-full justify-between font-normal',
                        !selected && 'text-muted-foreground',
                        className
                    )}
                >
                    <span className="flex min-w-0 items-center gap-2">
                        {selected ? (
                            <>
                                <CountryFlag code={selected.code} title={selected.name} />
                                <span className="truncate">{selected.name}</span>
                            </>
                        ) : (
                            <span className="truncate">{placeholder}</span>
                        )}
                    </span>
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <div className="border-b p-2">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar país…"
                            className="h-9 pl-8"
                            autoFocus
                        />
                    </div>
                </div>
                <div className="custom-scrollbar max-h-64 overflow-y-auto p-1">
                    {filtered.length === 0 ? (
                        <p className="px-2 py-6 text-center text-sm text-muted-foreground">Sin resultados</p>
                    ) : (
                        filtered.map((country) => {
                            const isSelected = selected?.code === country.code;
                            return (
                                <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => {
                                        onChange(country.name);
                                        setOpen(false);
                                        setQuery('');
                                    }}
                                    className={cn(
                                        'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent',
                                        isSelected && 'bg-accent'
                                    )}
                                >
                                    <CountryFlag code={country.code} title={country.name} />
                                    <span className="min-w-0 flex-1 truncate">{country.name}</span>
                                    {isSelected ? <Check className="size-4 shrink-0 text-primary" /> : null}
                                </button>
                            );
                        })
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
