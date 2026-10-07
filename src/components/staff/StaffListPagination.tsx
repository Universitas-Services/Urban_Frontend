'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function getVisiblePages(current: number, total: number, maxVisible = 5): number[] {
    if (total <= 0) return [];
    const pages: number[] = [];
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    const end = Math.min(total, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    for (let p = start; p <= end; p += 1) pages.push(p);
    return pages;
}

interface StaffListPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
    disabled?: boolean;
}

export function StaffListPagination({
    page,
    totalPages,
    onPageChange,
    className,
    disabled = false,
}: StaffListPaginationProps) {
    const safeTotal = Math.max(1, totalPages);
    const current = Math.min(Math.max(1, page), safeTotal);
    const pages = getVisiblePages(current, safeTotal);

    return (
        <div className={cn('flex flex-wrap items-center gap-1', className)}>
            <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || current <= 1}
                onClick={() => onPageChange(current - 1)}
            >
                Anterior
            </Button>
            {pages[0] > 1 && (
                <>
                    <Button
                        type="button"
                        variant={current === 1 ? 'default' : 'outline'}
                        size="sm"
                        className="min-w-9"
                        disabled={disabled}
                        onClick={() => onPageChange(1)}
                    >
                        1
                    </Button>
                    {pages[0] > 2 && (
                        <span className="px-1 text-muted-foreground" aria-hidden>
                            …
                        </span>
                    )}
                </>
            )}
            {pages.map((p) => (
                <Button
                    key={p}
                    type="button"
                    variant={p === current ? 'default' : 'outline'}
                    size="sm"
                    className="min-w-9"
                    disabled={disabled}
                    aria-current={p === current ? 'page' : undefined}
                    onClick={() => onPageChange(p)}
                >
                    {p}
                </Button>
            ))}
            {pages[pages.length - 1] < safeTotal && (
                <>
                    {pages[pages.length - 1] < safeTotal - 1 && (
                        <span className="px-1 text-muted-foreground" aria-hidden>
                            …
                        </span>
                    )}
                    <Button
                        type="button"
                        variant={current === safeTotal ? 'default' : 'outline'}
                        size="sm"
                        className="min-w-9"
                        disabled={disabled}
                        onClick={() => onPageChange(safeTotal)}
                    >
                        {safeTotal}
                    </Button>
                </>
            )}
            <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || current >= safeTotal}
                onClick={() => onPageChange(current + 1)}
            >
                Siguiente
            </Button>
        </div>
    );
}
