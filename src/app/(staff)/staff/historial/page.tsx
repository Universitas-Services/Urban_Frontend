'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, Search } from 'lucide-react';

import { RouteGuard } from '@/components/auth/RouteGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getReviewHistoryAction, type AccionRevision, type DocumentoRevision } from '@/lib/services/documents.service';
import { TruncatedText } from '@/components/staff/documents/TruncatedText';

const ACCION_LABELS: Record<AccionRevision, string> = {
    APROBADO: 'Aprobado',
    RECHAZADO: 'Rechazado',
    REENVIADO: 'Reenviado',
};

const ACCION_VARIANT: Record<AccionRevision, 'default' | 'destructive' | 'secondary' | 'outline'> = {
    APROBADO: 'default',
    RECHAZADO: 'destructive',
    REENVIADO: 'secondary',
};

function HistorialContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [tempSearch, setTempSearch] = React.useState(searchParams.get('q') || '');
    const [appliedQ, setAppliedQ] = React.useState(searchParams.get('q') || '');
    const [page, setPage] = React.useState(Number(searchParams.get('page') || 1));
    const [totalPages, setTotalPages] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const [items, setItems] = React.useState<DocumentoRevision[]>([]);
    const [loading, setLoading] = React.useState(true);

    const syncUrl = React.useCallback(
        (next: { page?: number; q?: string }) => {
            const params = new URLSearchParams();
            const p = next.page ?? page;
            const query = next.q ?? appliedQ;
            if (p > 1) params.set('page', String(p));
            if (query) params.set('q', query);
            router.replace(`/staff/historial${params.toString() ? `?${params}` : ''}`);
        },
        [page, appliedQ, router]
    );

    const load = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await getReviewHistoryAction({
                q: appliedQ.trim() || undefined,
                page,
                limit: 15,
            });
            setItems(res.items);
            setTotalPages(res.totalPages ?? 1);
            setTotal(res.total ?? res.items.length);
        } catch (err) {
            setItems([]);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [appliedQ, page]);

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- carga del listado
        void load();
    }, [load]);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold text-neutral-dark">Mi historial</h1>
                <p className="text-sm text-muted-foreground">
                    Acciones de revisión que has realizado (aprobaciones y rechazos).
                </p>
            </div>

            <div className="max-w-md">
                <Label htmlFor="hist-search">Buscar</Label>
                <div className="mt-1 flex gap-2">
                    <Input
                        id="hist-search"
                        placeholder="Documento o motivo"
                        value={tempSearch}
                        onChange={(e) => setTempSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setPage(1);
                                setAppliedQ(tempSearch.trim());
                                syncUrl({ q: tempSearch.trim(), page: 1 });
                            }
                        }}
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            setPage(1);
                            setAppliedQ(tempSearch.trim());
                            syncUrl({ q: tempSearch.trim(), page: 1 });
                        }}
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Documento</TableHead>
                            <TableHead className="w-[120px]">Acción</TableHead>
                            <TableHead className="hidden md:table-cell">Motivo</TableHead>
                            <TableHead className="hidden sm:table-cell text-center">Fecha</TableHead>
                            <TableHead className="w-[70px] text-center">Ver</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                                    Cargando…
                                </TableCell>
                            </TableRow>
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                                    Aún no hay acciones en tu historial.
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((rev) => (
                                <TableRow key={rev.id}>
                                    <TableCell className="w-[28%] max-w-[160px] overflow-hidden">
                                        <div className="mx-auto w-full min-w-0 max-w-[140px] space-y-1 overflow-hidden text-center">
                                            <TruncatedText
                                                text={
                                                    rev.documento?.tituloBreve ||
                                                    rev.documento?.tituloIntegro ||
                                                    'Documento'
                                                }
                                                maxLength={24}
                                                className="font-medium leading-tight"
                                            />
                                            {rev.documento?.enteEmisor ? (
                                                <TruncatedText
                                                    text={rev.documento.enteEmisor}
                                                    maxLength={18}
                                                    className="text-xs text-muted-foreground"
                                                />
                                            ) : null}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={ACCION_VARIANT[rev.accion]}>{ACCION_LABELS[rev.accion]}</Badge>
                                    </TableCell>
                                    <TableCell className="hidden max-w-[160px] overflow-hidden text-sm text-muted-foreground md:table-cell">
                                        <TruncatedText text={rev.motivo || '—'} maxLength={32} />
                                    </TableCell>
                                    <TableCell className="hidden text-center text-sm text-muted-foreground sm:table-cell">
                                        {format(new Date(rev.createdAt), 'dd MMM yyyy HH:mm', {
                                            locale: es,
                                        })}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button size="icon" variant="ghost" asChild>
                                            <Link
                                                href={`/staff/documentos/${rev.documentoId}`}
                                                aria-label="Ver documento"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                    {total} acción{total === 1 ? '' : 'es'} · página {page} de {totalPages}
                </span>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => {
                            const next = page - 1;
                            setPage(next);
                            syncUrl({ page: next });
                        }}
                    >
                        Anterior
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => {
                            const next = page + 1;
                            setPage(next);
                            syncUrl({ page: next });
                        }}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function StaffHistorialPage() {
    return (
        <RouteGuard allowedRoles={['REVISOR']}>
            <React.Suspense fallback={<p className="text-sm text-muted-foreground">Cargando...</p>}>
                <HistorialContent />
            </React.Suspense>
        </RouteGuard>
    );
}
