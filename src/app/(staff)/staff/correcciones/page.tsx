'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, Pencil, Search } from 'lucide-react';

import { RouteGuard } from '@/components/auth/RouteGuard';
import { StaffListPagination } from '@/components/staff/StaffListPagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMyDocumentsAction, type Documento } from '@/lib/services/documents.service';
import { TruncatedText } from '@/components/staff/documents/TruncatedText';
import { buildStaffListReturnPath, documentDetailHref } from '@/lib/utils/staff-list-navigation';

function CorreccionesContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [items, setItems] = React.useState<Documento[]>([]);
    const [page, setPage] = React.useState(Number(searchParams.get('page') || 1));
    const [totalPages, setTotalPages] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const [tempSearch, setTempSearch] = React.useState(searchParams.get('q') || '');
    const [appliedQ, setAppliedQ] = React.useState(searchParams.get('q') || '');
    const [loading, setLoading] = React.useState(true);

    const returnPath = React.useMemo(
        () => buildStaffListReturnPath(pathname, searchParams.toString() ? `?${searchParams}` : ''),
        [pathname, searchParams]
    );

    const syncUrl = React.useCallback(
        (next: { page?: number; q?: string }) => {
            const params = new URLSearchParams();
            const p = next.page ?? page;
            const query = next.q ?? appliedQ;
            if (p > 1) params.set('page', String(p));
            if (query) params.set('q', query);
            router.replace(`/staff/correcciones${params.toString() ? `?${params}` : ''}`);
        },
        [page, appliedQ, router]
    );

    React.useEffect(() => {
        const nextPage = Number(searchParams.get('page') || 1);
        const nextQ = searchParams.get('q') || '';
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratar filtros/página desde la URL
        setPage(nextPage);
        setAppliedQ((prev) => {
            if (prev !== nextQ) setTempSearch(nextQ);
            return nextQ;
        });
    }, [searchParams]);

    const load = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await getMyDocumentsAction({
                estado: 'RECHAZADO',
                page,
                limit: 10,
                q: appliedQ || undefined,
            });
            setItems(res.items);
            setTotalPages(res.totalPages);
            setTotal(res.total);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Error al cargar correcciones');
        } finally {
            setLoading(false);
        }
    }, [page, appliedQ]);

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- carga del listado
        void load();
    }, [load]);

    const applySearch = () => {
        const q = tempSearch.trim();
        setPage(1);
        setAppliedQ(q);
        syncUrl({ q, page: 1 });
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold text-neutral-dark">Correcciones pendientes</h1>
                <p className="text-sm text-muted-foreground">
                    Documentos observados por el revisor. Revisa el motivo, corrige y reenvía a revisión.
                </p>
            </div>

            <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-[220px] flex-1">
                    <Label htmlFor="corr-search">Buscar</Label>
                    <div className="mt-1 flex gap-2">
                        <Input
                            id="corr-search"
                            placeholder="Título o ente"
                            value={tempSearch}
                            onChange={(e) => setTempSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') applySearch();
                            }}
                        />
                        <Button type="button" variant="secondary" onClick={applySearch}>
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Documento</TableHead>
                            <TableHead>Motivo</TableHead>
                            <TableHead className="hidden text-center sm:table-cell">Fecha</TableHead>
                            <TableHead className="w-[160px] text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                                    Cargando…
                                </TableCell>
                            </TableRow>
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                                    No tienes correcciones pendientes.
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell className="w-[28%] max-w-[160px] overflow-hidden">
                                        <div className="mx-auto w-full min-w-0 max-w-[140px] space-y-1 overflow-hidden text-center">
                                            <TruncatedText
                                                text={doc.tituloBreve || doc.tituloIntegro}
                                                maxLength={24}
                                                className="font-medium"
                                            />
                                            <TruncatedText
                                                text={doc.enteEmisor}
                                                maxLength={18}
                                                className="text-xs text-muted-foreground"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[160px] overflow-hidden text-sm text-muted-foreground">
                                        <TruncatedText text={doc.motivoRechazo || 'Sin detalle'} maxLength={32} />
                                    </TableCell>
                                    <TableCell className="hidden text-center text-sm text-muted-foreground sm:table-cell">
                                        {format(new Date(doc.updatedAt), 'dd MMM yyyy', { locale: es })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center gap-1">
                                            <Button size="icon" variant="ghost" asChild>
                                                <Link href={documentDetailHref(doc.id, returnPath)} aria-label="Ver">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button size="sm" asChild>
                                                <Link
                                                    href={`/staff/correcciones/${doc.id}?from=${encodeURIComponent(returnPath)}`}
                                                >
                                                    <Pencil className="mr-1 h-3.5 w-3.5" />
                                                    Corregir
                                                </Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <span className="text-muted-foreground">
                    {total} · página {page} de {totalPages}
                </span>
                <StaffListPagination
                    page={page}
                    totalPages={totalPages}
                    disabled={loading}
                    onPageChange={(next) => {
                        setPage(next);
                        syncUrl({ page: next });
                    }}
                />
            </div>
        </div>
    );
}

export default function StaffCorreccionesPage() {
    return (
        <RouteGuard allowedRoles={['CURADOR']}>
            <React.Suspense fallback={<p className="text-sm text-muted-foreground">Cargando...</p>}>
                <CorreccionesContent />
            </React.Suspense>
        </RouteGuard>
    );
}
