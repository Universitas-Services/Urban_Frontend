'use client';

import * as React from 'react';
import { format, parse, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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

/** Value/onChange usan formato ISO `yyyy-MM-dd` (compatible con el API). */
export function DatePicker({
    value,
    onChange,
    placeholder = 'Seleccionar fecha',
    disabled,
    className,
    fromYear = 1950,
    toYear = new Date().getFullYear() + 5,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false);

    const selected = React.useMemo(() => {
        if (!value) return undefined;
        const parsed = parse(value, 'yyyy-MM-dd', new Date());
        return isValid(parsed) ? parsed : undefined;
    }, [value]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !selected && 'text-muted-foreground',
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 size-4" />
                    {selected ? format(selected, 'd MMM yyyy', { locale: es }) : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
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
                            setOpen(false);
                        }
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}
