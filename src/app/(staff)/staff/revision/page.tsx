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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getPendingDocumentsAction, type Documento, type MacroTipoDocumento } from '@/lib/services/documents.service';
import { getEtiquetasAction, type Etiqueta } from '@/lib/services/etiquetas.service';
import { MACRO_TIPO_OPTIONS } from '@/components/staff/documents/document-upload.constants';
import { TruncatedText } from '@/components/staff/documents/TruncatedText';

function macroLabel(macro: string) {
    return MACRO_TIPO_OPTIONS.find((m) => m.value === macro)?.label ?? macro;
}

function RevisionContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

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
        (next: { page?: number; q?: string; macroTipo?: MacroTipoDocumento | 'ALL'; etiquetaId?: string }) => {
            const params = new URLSearchParams();
            const p = next.page ?? page;
            const query = next.q ?? appliedQ;
            const macro = next.macroTipo ?? macroTipo;
            const tag = next.etiquetaId ?? etiquetaId;
            if (p > 1) params.set('page', String(p));
            if (query) params.set('q', query);
            if (macro !== 'ALL') params.set('macroTipo', macro);
            if (tag !== 'ALL') params.set('etiquetaId', tag);
            router.replace(`/staff/revision${params.toString() ? `?${params}` : ''}`);
        },
        [page, appliedQ, macroTipo, etiquetaId, router]
    );

    const load = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await getPendingDocumentsAction({
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
    }, [appliedQ, macroTipo, etiquetaId, page]);

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- carga del listado
        void load();
    }, [load]);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold text-neutral-dark">Cola de revisión</h1>
                <p className="text-sm text-muted-foreground">Documentos pendientes de aprobación o rechazo.</p>
            </div>

            <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-[200px] flex-1">
                    <Label htmlFor="rev-search">Buscar</Label>
                    <div className="mt-1 flex gap-2">
                        <Input
                            id="rev-search"
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
            </div>

            <div className="overflow-hidden rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Documento</TableHead>
                            <TableHead className="hidden md:table-cell">Tipo</TableHead>
                            <TableHead className="hidden lg:table-cell">Ente / Autor</TableHead>
                            <TableHead className="hidden sm:table-cell text-center">Recibido</TableHead>
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
                                    No hay documentos pendientes.
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
                                                className="font-medium leading-tight"
                                            />
                                            <TruncatedText
                                                text={doc.tituloIntegro}
                                                maxLength={28}
                                                className="text-xs text-muted-foreground"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden max-w-[120px] overflow-hidden text-sm md:table-cell">
                                        <TruncatedText text={macroLabel(doc.macroTipo)} maxLength={22} />
                                    </TableCell>
                                    <TableCell className="hidden max-w-[120px] overflow-hidden text-sm lg:table-cell">
                                        <TruncatedText text={doc.enteEmisor} maxLength={18} />
                                    </TableCell>
                                    <TableCell className="hidden text-center text-sm text-muted-foreground sm:table-cell">
                                        {format(new Date(doc.createdAt), 'dd MMM yyyy', { locale: es })}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button size="icon" variant="ghost" asChild>
                                            <Link href={`/staff/documentos/${doc.id}`} aria-label="Revisar documento">
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
                    {total} pendiente{total === 1 ? '' : 's'} · página {page} de {totalPages}
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

export default function StaffRevisionPage() {
    return (
        <RouteGuard allowedRoles={['REVISOR']}>
            <React.Suspense fallback={<p className="text-sm text-muted-foreground">Cargando...</p>}>
                <RevisionContent />
            </React.Suspense>
        </RouteGuard>
    );
}
