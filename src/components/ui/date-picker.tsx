'use client';

import * as React from 'react';
import { format, parse, isValid } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    fromYear?: number;
    toYear?: number;
}

/** Convierte ISO `yyyy-MM-dd` → `dd / mm / aaaa`. */
function isoToMasked(iso: string | undefined): string {
    if (!iso) return '';
    const parsed = parse(iso, 'yyyy-MM-dd', new Date());
    if (!isValid(parsed)) return '';
    return format(parsed, 'dd / MM / yyyy');
}

/** Solo dígitos, máx. 8 (ddmmyyyy). */
function extractDigits(raw: string): string {
    return raw.replace(/\D/g, '').slice(0, 8);
}

/** Aplica máscara visual `dd / mm / aaaa` a medida que se escribe. */
function maskDigits(digits: string): string {
    const d = digits.slice(0, 2);
    const m = digits.slice(2, 4);
    const y = digits.slice(4, 8);

    if (digits.length <= 2) return d;
    if (digits.length <= 4) return `${d} / ${m}`;
    return `${d} / ${m} / ${y}`;
}

/** Intenta parsear dígitos ddmmyyyy a ISO; null si incompleto o inválido. */
function digitsToIso(digits: string): string | null {
    if (digits.length !== 8) return null;
    const dd = digits.slice(0, 2);
    const mm = digits.slice(2, 4);
    const yyyy = digits.slice(4, 8);
    const iso = `${yyyy}-${mm}-${dd}`;
    const parsed = parse(iso, 'yyyy-MM-dd', new Date());
    if (!isValid(parsed)) return null;
    // Evita desbordes tipo 31/02 → marzo
    if (format(parsed, 'yyyy-MM-dd') !== iso) return null;
    return iso;
}

/** Value/onChange usan formato ISO `yyyy-MM-dd` (compatible con el API). */
export function DatePicker({
    value,
    onChange,
    placeholder = 'dd / mm / aaaa',
    disabled,
    className,
    fromYear = 1950,
    toYear = new Date().getFullYear() + 5,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false);
    /** Mientras edita, el texto no se deriva del `value` externo. */
    const [draft, setDraft] = React.useState<string | null>(null);
    const text = draft !== null ? draft : isoToMasked(value);

    const selected = React.useMemo(() => {
        if (!value) return undefined;
        const parsed = parse(value, 'yyyy-MM-dd', new Date());
        return isValid(parsed) ? parsed : undefined;
    }, [value]);

    const commitDigits = (digits: string) => {
        if (digits.length === 0) {
            onChange('');
            return;
        }
        if (digits.length < 8) return;
        const iso = digitsToIso(digits);
        if (iso) onChange(iso);
    };

    const handleTextChange = (raw: string) => {
        const digits = extractDigits(raw);
        setDraft(maskDigits(digits));
        commitDigits(digits);
    };

    const handleBlur = () => {
        const digits = extractDigits(text);
        if (digits.length === 0) {
            if (value) onChange('');
            setDraft(null);
            return;
        }
        const iso = digitsToIso(digits);
        if (iso) {
            if (iso !== value) onChange(iso);
            setDraft(null);
            return;
        }
        // Fecha incompleta o inválida: volver al valor válido
        setDraft(null);
    };

    return (
        <div className={cn('flex gap-1.5', className)}>
            <Input
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                onBlur={handleBlur}
                placeholder={placeholder}
                disabled={disabled}
                inputMode="numeric"
                autoComplete="off"
                spellCheck={false}
                aria-label="Fecha (día / mes / año)"
                className="min-w-0 flex-1 font-mono tabular-nums tracking-wide"
            />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={disabled}
                        aria-label="Abrir calendario"
                        className="shrink-0"
                    >
                        <CalendarIcon className="size-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        mode="single"
                        selected={selected}
                        defaultMonth={selected}
                        captionLayout="dropdown"
                        fromYear={fromYear}
                        toYear={toYear}
                        onSelect={(date) => {
                            if (date) {
                                onChange(format(date, 'yyyy-MM-dd'));
                                setDraft(null);
                                setOpen(false);
                            }
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
