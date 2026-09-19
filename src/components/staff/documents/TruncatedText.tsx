'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface TruncatedTextProps {
    text: string | null | undefined;
    /** Cantidad máxima de caracteres visibles antes de “…”. */
    maxLength?: number;
    className?: string;
    tooltipClassName?: string;
    emptyFallback?: string;
}

/**
 * Trunca texto largo con “…” y muestra el completo en tooltip (shadcn).
 * Combina corte por caracteres + ellipsis CSS para que no se desborde la celda.
 */
export function TruncatedText({
    text,
    maxLength = 28,
    className,
    tooltipClassName,
    emptyFallback = '—',
}: TruncatedTextProps) {
    const value = (text ?? '').trim();
    if (!value) {
        return <span className={className}>{emptyFallback}</span>;
    }

    const isTruncated = value.length > maxLength;
    const display = isTruncated ? `${value.slice(0, maxLength).trimEnd()}…` : value;

    const textClass = cn('block min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap', className);

    if (!isTruncated) {
        return <span className={textClass}>{display}</span>;
    }

    return (
        <TooltipProvider delayDuration={250}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span tabIndex={0} className={cn(textClass, 'cursor-help outline-none focus-visible:underline')}>
                        {display}
                    </span>
                </TooltipTrigger>
                <TooltipContent
                    side="top"
                    className={cn(
                        'max-w-xs whitespace-normal break-words text-left font-normal leading-relaxed sm:max-w-sm',
                        tooltipClassName
                    )}
                >
                    {value}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
