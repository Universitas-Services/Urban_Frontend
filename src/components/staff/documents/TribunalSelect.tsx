'use client';

import type { TribunalTerritorio } from '@/lib/api/territorio-tribunales';
import { SuggestibleInput } from './SuggestibleInput';

interface TribunalSelectProps {
    value: string;
    onChange: (nombre: string) => void;
    tribunales: TribunalTerritorio[];
    loading?: boolean;
    disabled?: boolean;
    placeholder?: string;
    emptyMessage?: string;
}

/** Listado de tribunales (API) como sugerencias; el valor siempre es editable. */
export function TribunalSelect({
    value,
    onChange,
    tribunales,
    loading = false,
    disabled,
    placeholder = 'Escribe o elige un tribunal',
    emptyMessage = 'No hay tribunales para esta ubicación',
}: TribunalSelectProps) {
    return (
        <SuggestibleInput
            value={value}
            onChange={onChange}
            loading={loading}
            disabled={disabled}
            placeholder={placeholder}
            emptyMessage={emptyMessage}
            searchPlaceholder="Buscar tribunal…"
            options={tribunales.map((t) => ({
                key: t.id,
                value: t.nombre,
                label: t.nombre,
                secondary: t.categoria || undefined,
            }))}
        />
    );
}
