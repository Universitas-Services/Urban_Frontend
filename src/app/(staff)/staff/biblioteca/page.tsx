'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, Search, Upload } from 'lucide-react';

import { RouteGuard } from '@/components/auth/RouteGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    getMyDocumentsAction,
    type Documento,
    type EstadoDocumento,
    type MacroTipoDocumento,
} from '@/lib/services/documents.service';
import { getEtiquetasAction, type Etiqueta } from '@/lib/services/etiquetas.service';
import { ESTADO_LABELS, MACRO_TIPO_OPTIONS } from '@/components/staff/documents/document-upload.constants';

const ESTADO_FILTERS: { value: 'ALL' | EstadoDocumento; label: string }[] = [
    { value: 'ALL', label: 'Todos' },
    { value: 'PENDIENTE_REVISION', label: 'Pendientes' },
    { value: 'RECHAZADO', label: 'Observados' },
    { value: 'PUBLICADO', label: 'Publicados' },
];

function macroLabel(macro: string) {
    return MACRO_TIPO_OPTIONS.find((m) => m.value === macro)?.label ?? macro;
}

function estadoBadgeVariant(estado: EstadoDocumento) {
    if (estado === 'PUBLICADO') return 'default' as const;
    if (estado === 'RECHAZADO') return 'destructive' as const;
    return 'secondary' as const;
}

function BibliotecaContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialEstado = (searchParams.get('estado') as EstadoDocumento | null) || 'ALL';

    const [estado, setEstado] = React.useState<'ALL' | EstadoDocumento>(
        ESTADO_FILTERS.some((t) => t.value === initialEstado) ? initialEstado : 'ALL'
    );
    const [tempSearch, setTempSearch] = React.useState(searchParams.get('q') || '');
    const [appliedQ, setAppliedQ] = React.useState(searchParams.get('q') || '');
    const [macroTipo, setMacroTipo] = React.useState<MacroTipoDocumento | 'ALL'>(
        (searchParams.get('macroTipo') as MacroTipoDocumento) || 'ALL'
    );
    const [etiquetaId, setEtiquetaId] = React.useState(searchParams.get('etiquetaId') || 'ALL');
    const [etiquetas, setEtiquetas] = React.useState<Etiqueta[]>([]);
    const [page, setPage] = React.useState(Number(searchParams.get('page') || 1));
    const [totalPages, setTotalPages] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const [items, setItems] = React.useState<Documento[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        getEtiquetasAction({ page: 1, limit: 100 })
            .then((res) => setEtiquetas(res.items))
            .catch(() => setEtiquetas([]));
    }, []);

    const syncUrl = React.useCallback(
        (next: {
            estado?: 'ALL' | EstadoDocumento;
            page?: number;
            q?: string;
            macroTipo?: MacroTipoDocumento | 'ALL';
            etiquetaId?: string;
        }) => {
            const params = new URLSearchParams();
            const e = next.estado ?? estado;
            const p = next.page ?? page;
            const query = next.q ?? appliedQ;
            const macro = next.macroTipo ?? macroTipo;
            const tag = next.etiquetaId ?? etiquetaId;
            if (e !== 'ALL') params.set('estado', e);
            if (p > 1) params.set('page', String(p));
            if (query) params.set('q', query);
            if (macro !== 'ALL') params.set('macroTipo', macro);
            if (tag !== 'ALL') params.set('etiquetaId', tag);
            router.replace(`/staff/biblioteca${params.toString() ? `?${params}` : ''}`);
        },
        [estado, page, appliedQ, macroTipo, etiquetaId, router]
    );

    const load = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await getMyDocumentsAction({
                estado: estado === 'ALL' ? undefined : estado,
                q: appliedQ.trim() || undefined,
                macroTipo: macroTipo === 'ALL' ? undefined : macroTipo,
                etiquetaId: etiquetaId === 'ALL' ? undefined : etiquetaId,
                page,
                limit: 10,
            });
            setItems(res.items);
            setTotalPages(res.totalPages);
            setTotal(res.total);
        } catch (err) {
            setItems([]);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [estado, appliedQ, macroTipo, etiquetaId, page]);

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- carga del listado
        void load();
    }, [load]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-dark">Biblioteca Legal</h1>
                    <p className="text-sm text-muted-foreground">
                        Pipeline de tus documentos: pendientes, observados y publicados.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/staff/carga">
                        <Upload className="mr-2 h-4 w-4" />
                        Nueva carga
                    </Link>
                </Button>
            </div>

            <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-[200px] flex-1">
                    <Label htmlFor="doc-search">Buscar</Label>
                    <div className="mt-1 flex gap-2">
                        <Input
                            id="doc-search"
                            placeholder="Título, ente o resumen"
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
                <div className="w-[170px]">
                    <Label>Estado</Label>
                    <Select
                        value={estado}
                        onValueChange={(v) => {
                            const next = v as 'ALL' | EstadoDocumento;
                            setEstado(next);
                            setPage(1);
                            syncUrl({ estado: next, page: 1 });
                        }}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {ESTADO_FILTERS.map((f) => (
                                <SelectItem key={f.value} value={f.value}>
                                    {f.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-[200px]">
                    <Label>Tipo</Label>
                    <Select
                        value={macroTipo}
                        onValueChange={(v) => {
                            const next = v as MacroTipoDocumento | 'ALL';
                            setMacroTipo(next);
                            setPage(1);
                            syncUrl({ macroTipo: next, page: 1 });
                        }}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Todos</SelectItem>
                            {MACRO_TIPO_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-[200px]">
                    <Label>Etiqueta</Label>
                    <Select
                        value={etiquetaId}
                        onValueChange={(v) => {
                            setEtiquetaId(v);
                            setPage(1);
                            syncUrl({ etiquetaId: v, page: 1 });
                        }}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Todas</SelectItem>
                            {etiquetas.map((tag) => (
                                <SelectItem key={tag.id} value={tag.id}>
                                    {tag.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Documento</TableHead>
                            <TableHead className="hidden md:table-cell">Tipo</TableHead>
                            <TableHead className="hidden lg:table-cell">Ente</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                            <TableHead className="hidden sm:table-cell text-center">Fecha</TableHead>
                            <TableHead className="w-[70px] text-center">Ver</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                                    Cargando…
                                </TableCell>
                            </TableRow>
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                                    No hay documentos con estos filtros.
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell>
                                        <div className="min-w-0 space-y-1">
                                            <p className="font-medium leading-tight">
                                                {doc.tituloBreve || doc.tituloIntegro}
                                            </p>
                                            <p className="line-clamp-1 text-xs text-muted-foreground">
                                                {doc.tituloIntegro}
                                            </p>
                                            {!!doc.etiquetas?.length && (
                                                <div className="flex flex-wrap gap-1 pt-0.5">
                                                    {doc.etiquetas.slice(0, 3).map((e) => (
                                                        <Badge
                                                            key={e.etiqueta.id}
                                                            variant="outline"
                                                            className="text-[10px]"
                                                        >
                                                            {e.etiqueta.nombre}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden text-sm md:table-cell">
                                        {macroLabel(doc.macroTipo)}
                                    </TableCell>
                                    <TableCell className="hidden max-w-[160px] truncate text-sm lg:table-cell">
                                        {doc.enteEmisor}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <Badge variant={estadoBadgeVariant(doc.estado)}>
                                                {ESTADO_LABELS[doc.estado] ?? doc.estado}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden text-center text-sm text-muted-foreground sm:table-cell">
                                        {format(new Date(doc.createdAt), 'dd MMM yyyy', { locale: es })}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button size="icon" variant="ghost" asChild>
                                            <Link href={`/staff/documentos/${doc.id}`} aria-label="Ver detalle">
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
                    {total} documento{total === 1 ? '' : 's'} · página {page} de {totalPages}
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

export default function StaffBibliotecaPage() {
    return (
        <RouteGuard allowedRoles={['CURADOR']}>
            <React.Suspense fallback={<p className="text-sm text-muted-foreground">Cargando...</p>}>
                <BibliotecaContent />
            </React.Suspense>
        </RouteGuard>
    );
}
