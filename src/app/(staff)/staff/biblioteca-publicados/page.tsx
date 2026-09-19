'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, Search } from 'lucide-react';
import { toast } from 'sonner';

import { RouteGuard } from '@/components/auth/RouteGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    getPublishedDocumentsAction,
    updateDocumentVisibilityAction,
    type Documento,
    type MacroTipoDocumento,
} from '@/lib/services/documents.service';
import { getEtiquetasAction, type Etiqueta } from '@/lib/services/etiquetas.service';
import { MACRO_TIPO_OPTIONS } from '@/components/staff/documents/document-upload.constants';

function macroLabel(macro: string) {
    return MACRO_TIPO_OPTIONS.find((m) => m.value === macro)?.label ?? macro;
}

function BibliotecaPublicadosContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [tempSearch, setTempSearch] = React.useState(searchParams.get('q') || '');
    const [appliedQ, setAppliedQ] = React.useState(searchParams.get('q') || '');
    const [macroTipo, setMacroTipo] = React.useState<MacroTipoDocumento | 'ALL'>(
        (searchParams.get('macroTipo') as MacroTipoDocumento) || 'ALL'
    );
    const [etiquetaId, setEtiquetaId] = React.useState(searchParams.get('etiquetaId') || 'ALL');
    const [visibleFilter, setVisibleFilter] = React.useState<'ALL' | 'true' | 'false'>(
        (searchParams.get('visible') as 'true' | 'false') || 'ALL'
    );
    const [etiquetas, setEtiquetas] = React.useState<Etiqueta[]>([]);
    const [page, setPage] = React.useState(Number(searchParams.get('page') || 1));
    const [totalPages, setTotalPages] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const [items, setItems] = React.useState<Documento[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [togglingId, setTogglingId] = React.useState<string | null>(null);

    React.useEffect(() => {
        getEtiquetasAction({ page: 1, limit: 100 })
            .then((res) => setEtiquetas(res.items))
            .catch(() => setEtiquetas([]));
    }, []);

    const syncUrl = React.useCallback(
        (next: {
            page?: number;
            q?: string;
            macroTipo?: MacroTipoDocumento | 'ALL';
            etiquetaId?: string;
            visible?: 'ALL' | 'true' | 'false';
        }) => {
            const params = new URLSearchParams();
            const p = next.page ?? page;
            const query = next.q ?? appliedQ;
            const macro = next.macroTipo ?? macroTipo;
            const tag = next.etiquetaId ?? etiquetaId;
            const vis = next.visible ?? visibleFilter;
            if (p > 1) params.set('page', String(p));
            if (query) params.set('q', query);
            if (macro !== 'ALL') params.set('macroTipo', macro);
            if (tag !== 'ALL') params.set('etiquetaId', tag);
            if (vis !== 'ALL') params.set('visible', vis);
            router.replace(`/staff/biblioteca-publicados${params.toString() ? `?${params}` : ''}`);
        },
        [page, appliedQ, macroTipo, etiquetaId, visibleFilter, router]
    );

    const load = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await getPublishedDocumentsAction({
                q: appliedQ.trim() || undefined,
                macroTipo: macroTipo === 'ALL' ? undefined : macroTipo,
                etiquetaId: etiquetaId === 'ALL' ? undefined : etiquetaId,
                visible: visibleFilter === 'ALL' ? undefined : visibleFilter === 'true',
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
    }, [appliedQ, macroTipo, etiquetaId, visibleFilter, page]);

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- carga del listado
        void load();
    }, [load]);

    const onToggleVisibility = async (doc: Documento, next: boolean) => {
        setTogglingId(doc.id);
        const prev = items;
        setItems((curr) => curr.map((d) => (d.id === doc.id ? { ...d, visibleEnBiblioteca: next } : d)));
        try {
            await updateDocumentVisibilityAction(doc.id, next);
            toast.success(
                next ? 'Documento visible en biblioteca de usuarios.' : 'Documento oculto de la biblioteca de usuarios.'
            );
        } catch (err) {
            setItems(prev);
            toast.error(err instanceof Error ? err.message : 'No se pudo actualizar la visibilidad');
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold text-neutral-dark">Biblioteca publicada</h1>
                <p className="text-sm text-muted-foreground">
                    Documentos publicados. El interruptor oculta o muestra en la biblioteca de usuarios finales sin
                    despublicar.
                </p>
            </div>

            <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-[200px] flex-1">
                    <Label htmlFor="pub-search">Buscar</Label>
                    <div className="mt-1 flex gap-2">
                        <Input
                            id="pub-search"
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
                <div className="w-[180px]">
                    <Label>Visibilidad</Label>
                    <Select
                        value={visibleFilter}
                        onValueChange={(v) => {
                            const next = v as 'ALL' | 'true' | 'false';
                            setVisibleFilter(next);
                            setPage(1);
                            syncUrl({ visible: next, page: 1 });
                        }}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Todas</SelectItem>
                            <SelectItem value="true">Visibles</SelectItem>
                            <SelectItem value="false">Ocultas</SelectItem>
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
                            <TableHead className="hidden sm:table-cell text-center">Publicado</TableHead>
                            <TableHead className="text-center">Visible</TableHead>
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
                                    No hay documentos publicados.
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
                                    <TableCell className="hidden text-center text-sm text-muted-foreground sm:table-cell">
                                        {format(new Date(doc.updatedAt), 'dd MMM yyyy', {
                                            locale: es,
                                        })}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Switch
                                                checked={doc.visibleEnBiblioteca !== false}
                                                disabled={togglingId === doc.id}
                                                onCheckedChange={(checked) => void onToggleVisibility(doc, checked)}
                                                aria-label="Visibilidad en biblioteca"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button size="icon" variant="ghost" asChild>
                                            <Link href={`/staff/documentos/${doc.id}`} aria-label="Ver documento">
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

export default function StaffBibliotecaPublicadosPage() {
    return (
        <RouteGuard allowedRoles={['REVISOR']}>
            <React.Suspense fallback={<p className="text-sm text-muted-foreground">Cargando...</p>}>
                <BibliotecaPublicadosContent />
            </React.Suspense>
        </RouteGuard>
    );
}
