'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PAISES_CIDH, PAISES_CIDH_ISO } from './document-upload.constants';
import { CountryFlag } from './country-flags';

function resolveIso(nombre: string): string | undefined {
    return PAISES_CIDH_ISO[nombre as keyof typeof PAISES_CIDH_ISO];
}

interface PaisCidhSelectProps {
    value: string;
    onChange: (value: string) => void;
    extras?: string[];
    customInput?: string;
    onCustomInputChange?: (value: string) => void;
    onAddCustom?: () => void;
}

export function PaisCidhSelect({
    value,
    onChange,
    extras = [],
    customInput = '',
    onCustomInputChange,
    onAddCustom,
}: PaisCidhSelectProps) {
    const all = React.useMemo(() => {
        const catalog = PAISES_CIDH as readonly string[];
        const custom = extras.filter((e) => !catalog.includes(e));
        return [...catalog, ...custom];
    }, [extras]);

    return (
        <div className="space-y-2">
            <Select value={value || ''} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecciona o agrega" />
                </SelectTrigger>
                <SelectContent>
                    {all.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                            <span className="flex items-center gap-2">
                                <CountryFlag code={resolveIso(opt)} title={opt} />
                                <span>{opt}</span>
                            </span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div className="flex gap-2">
                <Input
                    placeholder="Agregar país"
                    value={customInput}
                    onChange={(e) => onCustomInputChange?.(e.target.value)}
                />
                <Button type="button" variant="outline" size="icon" onClick={onAddCustom}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
