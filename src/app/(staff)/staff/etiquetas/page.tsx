'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';

import { RouteGuard } from '@/components/auth/RouteGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    createEtiquetaAction,
    deleteEtiquetaAction,
    getEtiquetasAction,
    updateEtiquetaAction,
    type Etiqueta,
} from '@/lib/services/etiquetas.service';

function EtiquetasContent() {
    const [items, setItems] = React.useState<Etiqueta[]>([]);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const [search, setSearch] = React.useState('');
    const [tempSearch, setTempSearch] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [editing, setEditing] = React.useState<Etiqueta | null>(null);
    const [nombre, setNombre] = React.useState('');
    const [deleteId, setDeleteId] = React.useState<string | null>(null);
    const [deleting, setDeleting] = React.useState(false);

    const load = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await getEtiquetasAction({
                page,
                limit: 10,
                q: search || undefined,
            });
            setItems(res.items);
            setTotalPages(res.totalPages);
            setTotal(res.total);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Error al listar etiquetas');
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- carga del listado
        void load();
    }, [load]);

    const openCreate = () => {
        setEditing(null);
        setNombre('');
        setDialogOpen(true);
    };

    const openEdit = (tag: Etiqueta) => {
        setEditing(tag);
        setNombre(tag.nombre);
        setDialogOpen(true);
    };

    const onSave = async () => {
        if (!nombre.trim()) {
            toast.error('El nombre es obligatorio');
            return;
        }
        setSaving(true);
        try {
            if (editing) {
                await updateEtiquetaAction(editing.id, { nombre: nombre.trim() });
                toast.success('Etiqueta actualizada');
            } else {
                await createEtiquetaAction({ nombre: nombre.trim() });
                toast.success('Etiqueta creada');
            }
            setDialogOpen(false);
            setNombre('');
            setEditing(null);
            setPage(1);
            await load();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'No se pudo guardar');
        } finally {
            setSaving(false);
        }
    };

    const onDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await deleteEtiquetaAction(deleteId);
            toast.success('Etiqueta eliminada');
            setDeleteId(null);
            await load();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'No se pudo eliminar');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-dark">Etiquetas</h1>
                    <p className="text-sm text-muted-foreground">
                        Catálogo reutilizable para clasificar documentos al cargarlos.
                    </p>
                </div>
                <Button onClick={openCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva etiqueta
                </Button>
            </div>

            <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-[220px] flex-1">
                    <Label htmlFor="etiqueta-search">Buscar</Label>
                    <div className="mt-1 flex gap-2">
                        <Input
                            id="etiqueta-search"
                            placeholder="Nombre de etiqueta"
                            value={tempSearch}
                            onChange={(e) => setTempSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setPage(1);
                                    setSearch(tempSearch.trim());
                                }
                            }}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setPage(1);
                                setSearch(tempSearch.trim());
                            }}
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead className="w-[160px] text-center">Creada</TableHead>
                            <TableHead className="w-[120px] text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                                    Cargando…
                                </TableCell>
                            </TableRow>
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                                    No hay etiquetas. Crea la primera con el botón superior.
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((tag) => (
                                <TableRow key={tag.id}>
                                    <TableCell className="font-medium">{tag.nombre}</TableCell>
                                    <TableCell className="text-center text-muted-foreground">
                                        {format(new Date(tag.createdAt), 'dd MMM yyyy', { locale: es })}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => openEdit(tag)}
                                                aria-label="Editar"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => setDeleteId(tag.id)}
                                                aria-label="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                    {total} etiqueta{total === 1 ? '' : 's'} · página {page} de {totalPages}
                </span>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Anterior
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Editar etiqueta' : 'Nueva etiqueta'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                        <Label htmlFor="etiqueta-nombre">Nombre</Label>
                        <Input
                            id="etiqueta-nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej. Ordenación territorial"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    void onSave();
                                }
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="button" onClick={() => void onSave()} disabled={saving}>
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {editing ? 'Guardar' : 'Crear'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar etiqueta?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Dejará de estar disponible para nuevas cargas. Los documentos que ya la usan conservarán el
                            vínculo histórico hasta que se reasignen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => void onDelete()}
                            disabled={deleting}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {deleting ? 'Eliminando…' : 'Eliminar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default function StaffEtiquetasPage() {
    return (
        <RouteGuard allowedRoles={['CURADOR']}>
            <EtiquetasContent />
        </RouteGuard>
    );
}
