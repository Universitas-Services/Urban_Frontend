'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { es } from 'react-day-picker/locale';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = DayPickerProps & {
    fromYear?: number;
    toYear?: number;
};

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    captionLayout = 'dropdown',
    fromYear = 1950,
    toYear = new Date().getFullYear() + 5,
    ...props
}: CalendarProps) {
    const isDropdown =
        captionLayout === 'dropdown' || captionLayout === 'dropdown-months' || captionLayout === 'dropdown-years';

    return (
        <DayPicker
            locale={es}
            showOutsideDays={showOutsideDays}
            captionLayout={captionLayout}
            startMonth={new Date(fromYear, 0)}
            endMonth={new Date(toYear, 11)}
            className={cn('p-3', className)}
            classNames={{
                root: 'w-fit',
                months: 'relative flex flex-col gap-2 sm:flex-row',
                month: 'flex flex-col gap-4',
                // px-8 deja hueco a los botones prev/next absolutos
                month_caption: cn('relative flex h-8 w-full items-center justify-center', isDropdown && 'px-8'),
                // Con dropdowns el label queda encima del select → ocultarlo
                caption_label: cn('text-sm font-medium', isDropdown && 'hidden'),
                dropdowns: 'flex items-center justify-center gap-1.5',
                dropdown:
                    'h-8 max-w-[9.5rem] rounded-md border border-input bg-background px-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring',
                months_dropdown: 'appearance-auto',
                years_dropdown: 'appearance-auto',
                nav: 'absolute inset-x-0 top-0 flex items-center justify-between',
                button_previous: cn(
                    buttonVariants({ variant: 'outline' }),
                    'z-10 size-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                ),
                button_next: cn(
                    buttonVariants({ variant: 'outline' }),
                    'z-10 size-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                ),
                month_grid: 'w-full border-collapse',
                weekdays: 'flex',
                weekday: 'w-8 rounded-md text-[0.8rem] font-normal text-muted-foreground',
                week: 'mt-2 flex w-full',
                day: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:rounded-md',
                day_button: cn(
                    buttonVariants({ variant: 'ghost' }),
                    'size-8 p-0 font-normal aria-selected:opacity-100'
                ),
                selected:
                    'rounded-md bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                today: 'rounded-md bg-accent text-accent-foreground',
                outside: 'text-muted-foreground opacity-50',
                disabled: 'text-muted-foreground opacity-50',
                hidden: 'invisible',
                ...classNames,
            }}
            components={{
                Chevron: ({ orientation }) => {
                    const Icon = orientation === 'left' ? ChevronLeft : ChevronRight;
                    return <Icon className="size-4" />;
                },
            }}
            {...props}
        />
    );
}

Calendar.displayName = 'Calendar';

export { Calendar };
