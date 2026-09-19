'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Check, ExternalLink, History, Loader2, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';

import { RouteGuard } from '@/components/auth/RouteGuard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
    approveDocumentAction,
    getDocumentByIdAction,
    getDocumentRevisionesAction,
    rejectDocumentAction,
    updateDocumentVisibilityAction,
    type AccionRevision,
    type Documento,
    type DocumentoRevision,
} from '@/lib/services/documents.service';
import { ESTADO_LABELS, MACRO_TIPO_OPTIONS } from '@/components/staff/documents/document-upload.constants';
import { useAuthStore } from '@/store/auth.store';

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

const PARAM_LABELS: Record<string, string> = {
    tipo_norma: 'Tipo de norma',
    ente_emisor: 'Ente emisor',
    numero_gaceta: 'Nº de gaceta',
    fecha_publicacion: 'Fecha de publicación',
    ambito_territorial: 'Ámbito territorial',
    estado: 'Estado',
    municipio: 'Municipio',
    detalles_aprobacion: 'Detalles de aprobación',
    tipo_tribunal: 'Tipo de tribunal',
    sala_tsj: 'Sala TSJ',
    magistrado_tsj: 'Magistrado del TSJ',
    tribunal_nacional: 'Tribunal nacional',
    tribunal_municipal: 'Tribunal municipal',
    numero_sentencia: 'Número de sentencia',
    numero_expediente: 'Número de expediente',
    tipo_corte: 'Tipo de corte',
    pais: 'País',
    demandante: 'Demandante',
    demandado: 'Demandado',
    tipo_doctrina: 'Tipo de doctrina',
    autor: 'Autor o autores',
    edicion_volumenes: 'Edición / Volúmenes',
    editorial: 'Editorial',
};

function MetaRow({ label, value }: { label: string; value?: React.ReactNode }) {
    if (value === undefined || value === null || value === '') return null;
    return (
        <div className="grid grid-cols-[140px_1fr] gap-2 text-sm sm:grid-cols-[160px_1fr]">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-medium break-words">{value}</dd>
        </div>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h4 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">{children}</h4>;
}

function DocumentDetailContent() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuthStore();
    const isRevisor = user?.role === 'REVISOR';

    const [doc, setDoc] = React.useState<Documento | null>(null);
    const [revisiones, setRevisiones] = React.useState<DocumentoRevision[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [approveOpen, setApproveOpen] = React.useState(false);
    const [rejectOpen, setRejectOpen] = React.useState(false);
    const [motivo, setMotivo] = React.useState('');
    const [acting, setActing] = React.useState(false);
    const [togglingVisibility, setTogglingVisibility] = React.useState(false);
    const [previewKey, setPreviewKey] = React.useState(0);
    const [historyOpen, setHistoryOpen] = React.useState(false);

    const loadAll = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [data, hist] = await Promise.all([
                getDocumentByIdAction(params.id),
                getDocumentRevisionesAction(params.id).catch(() => ({ items: [] })),
            ]);
            setDoc(data);
            setRevisiones(hist.items);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar');
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- carga del documento
        void loadAll();
    }, [loadAll]);

    const backHref = React.useMemo(() => {
        if (!isRevisor) return '/staff/biblioteca';
        if (doc?.estado === 'PUBLICADO') return '/staff/biblioteca-publicados';
        if (doc?.estado === 'RECHAZADO') return '/staff/historial';
        return '/staff/revision';
    }, [isRevisor, doc?.estado]);

    const canApprove = isRevisor && doc?.estado === 'PENDIENTE_REVISION';
    const canReject = isRevisor && (doc?.estado === 'PENDIENTE_REVISION' || doc?.estado === 'PUBLICADO');
    const canToggleVisibility = isRevisor && doc?.estado === 'PUBLICADO';

    const rejectionNotes = revisiones.filter((r) => r.accion === 'RECHAZADO');

    const onApprove = async () => {
        if (!doc) return;
        setActing(true);
        try {
            await approveDocumentAction(doc.id);
            toast.success('Documento aprobado y publicado.');
            setApproveOpen(false);
            router.push('/staff/revision');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'No se pudo aprobar');
        } finally {
            setActing(false);
        }
    };

    const onReject = async () => {
        if (!doc) return;
        const trimmed = motivo.trim();
        if (trimmed.length < 5) {
            toast.error('El motivo debe tener al menos 5 caracteres.');
            return;
        }
        setActing(true);
        try {
            await rejectDocumentAction(doc.id, trimmed);
            toast.success('Documento rechazado.');
            setRejectOpen(false);
            setMotivo('');
            if (doc.estado === 'PUBLICADO') {
                router.push('/staff/biblioteca-publicados');
            } else {
                router.push('/staff/revision');
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'No se pudo rechazar');
        } finally {
            setActing(false);
        }
    };

    const onToggleVisibility = async (next: boolean) => {
        if (!doc) return;
        setTogglingVisibility(true);
        const prev = doc.visibleEnBiblioteca;
        setDoc({ ...doc, visibleEnBiblioteca: next });
        try {
            const updated = await updateDocumentVisibilityAction(doc.id, next);
            setDoc(updated);
            toast.success(
                next ? 'Documento visible en biblioteca de usuarios.' : 'Documento oculto de la biblioteca de usuarios.'
            );
        } catch (err) {
            setDoc({ ...doc, visibleEnBiblioteca: prev });
            toast.error(err instanceof Error ? err.message : 'No se pudo actualizar la visibilidad');
        } finally {
            setTogglingVisibility(false);
        }
    };

    const refreshPreview = async () => {
        try {
            const data = await getDocumentByIdAction(params.id);
            setDoc(data);
            setPreviewKey((k) => k + 1);
            toast.success('Vista previa actualizada.');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'No se pudo renovar');
        }
    };

    if (loading) return <p className="text-sm text-muted-foreground">Cargando documento...</p>;
    if (error) return <p className="text-sm text-destructive">{error}</p>;
    if (!doc) return null;

    const macroLabel = MACRO_TIPO_OPTIONS.find((m) => m.value === doc.macroTipo)?.label ?? doc.macroTipo;
    const preview = doc.previewUrl || doc.archivoUrl;
    const paramEntries = Object.entries(doc.parametrosEspecificos || {}).filter(
        ([, v]) => v !== undefined && v !== null && String(v).trim() !== ''
    );

    return (
        <div className="flex h-[calc(100vh-7rem)] min-h-[560px] flex-col gap-3">
            {/* Toolbar superior */}
            <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex flex-wrap items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href={backHref}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Link>
                    </Button>
                    <Badge>{ESTADO_LABELS[doc.estado] ?? doc.estado}</Badge>
                    {doc.estado === 'PUBLICADO' && (
                        <Badge variant={doc.visibleEnBiblioteca !== false ? 'outline' : 'secondary'}>
                            {doc.visibleEnBiblioteca !== false ? 'Visible en biblioteca' : 'Oculto en biblioteca'}
                        </Badge>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
                        <SheetTrigger asChild>
                            <Button type="button" variant="outline" size="sm">
                                <History className="mr-2 h-4 w-4" />
                                Historial
                                {rejectionNotes.length > 0 ? ` (${rejectionNotes.length})` : ''}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>Historial de revisiones</SheetTitle>
                                <SheetDescription>Aprobaciones, rechazos y reenvíos con sus notas.</SheetDescription>
                            </SheetHeader>
                            <div className="px-4 pb-6">
                                {revisiones.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">Sin acciones registradas todavía.</p>
                                ) : (
                                    <ol className="relative space-y-5 border-l border-border pl-4">
                                        {revisiones.map((rev) => (
                                            <li key={rev.id} className="relative">
                                                <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge variant={ACCION_VARIANT[rev.accion]}>
                                                        {ACCION_LABELS[rev.accion]}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {format(new Date(rev.createdAt), 'd MMM yyyy HH:mm', {
                                                            locale: es,
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-sm">
                                                    {rev.actor
                                                        ? `${rev.actor.nombre}${rev.actor.apellido ? ` ${rev.actor.apellido}` : ''} (${rev.actor.role})`
                                                        : 'Actor desconocido'}
                                                </p>
                                                {rev.motivo && (
                                                    <p className="mt-2 rounded-md bg-muted/60 p-3 text-sm whitespace-pre-wrap">
                                                        {rev.motivo}
                                                    </p>
                                                )}
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>

                    {canReject && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-destructive text-destructive hover:bg-destructive/10"
                            onClick={() => setRejectOpen(true)}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Rechazar
                        </Button>
                    )}
                    {canApprove && (
                        <Button type="button" size="sm" onClick={() => setApproveOpen(true)}>
                            <Check className="mr-2 h-4 w-4" />
                            Aprobar
                        </Button>
                    )}
                </div>
            </div>

            {/* Layout paralelo */}
            <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(320px,420px)_1fr]">
                {/* Columna izquierda: metadata */}
                <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="border-b px-5 py-4 shrink-0">
                        <h2 className="text-base font-semibold">Información del documento</h2>
                        <p className="text-sm text-muted-foreground">Metadata ingresada por el curador en la carga</p>
                    </div>

                    <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
                        <section>
                            <SectionTitle>Datos generales</SectionTitle>
                            <dl className="space-y-2.5">
                                <MetaRow label="Título íntegro" value={doc.tituloIntegro} />
                                <MetaRow label="Título breve" value={doc.tituloBreve} />
                                <MetaRow label="Macro tipo" value={macroLabel} />
                                <MetaRow
                                    label="Legibilidad PDF"
                                    value={doc.legibilidadPdf === 'PDF_TEXTO' ? 'PDF con texto' : 'Solo imagen'}
                                />
                                <MetaRow label="Ente emisor" value={doc.enteEmisor} />
                                <MetaRow
                                    label="Fecha publicación"
                                    value={
                                        doc.fechaPublicacion
                                            ? format(new Date(doc.fechaPublicacion), 'yyyy-MM-dd')
                                            : undefined
                                    }
                                />
                            </dl>
                            {preview && (
                                <Button asChild variant="outline" className="mt-4 w-full">
                                    <a href={preview} target="_blank" rel="noreferrer">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Ver documento asociado
                                    </a>
                                </Button>
                            )}
                        </section>

                        {paramEntries.length > 0 && (
                            <>
                                <Separator />
                                <section>
                                    <SectionTitle>Parametrización jurídica</SectionTitle>
                                    <dl className="space-y-2.5">
                                        {paramEntries.map(([key, value]) => (
                                            <MetaRow
                                                key={key}
                                                label={PARAM_LABELS[key] ?? key.replace(/_/g, ' ')}
                                                value={String(value)}
                                            />
                                        ))}
                                    </dl>
                                </section>
                            </>
                        )}

                        <Separator />
                        <section>
                            <SectionTitle>Indexación</SectionTitle>
                            <dl className="space-y-2.5">
                                <MetaRow label="Categorías" value={doc.categorias || undefined} />
                                <MetaRow label="Palabras clave" value={doc.palabrasClave || undefined} />
                                <MetaRow label="Resumen corto" value={doc.resumenCorto || undefined} />
                            </dl>
                            {!!doc.etiquetas?.length && (
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {doc.etiquetas.map((e) => (
                                        <Badge key={e.etiqueta.id} variant="outline">
                                            {e.etiqueta.nombre}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            <div className="mt-3">
                                <p className="mb-1 text-sm text-muted-foreground">Resumen descriptivo</p>
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{doc.resumenDescriptivo}</p>
                            </div>
                        </section>

                        {canToggleVisibility && (
                            <>
                                <Separator />
                                <section className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-medium">Visible en biblioteca</p>
                                        <p className="text-xs text-muted-foreground">Ocultar sin despublicar</p>
                                    </div>
                                    <Switch
                                        checked={doc.visibleEnBiblioteca !== false}
                                        disabled={togglingVisibility}
                                        onCheckedChange={(checked) => void onToggleVisibility(checked)}
                                    />
                                </section>
                            </>
                        )}

                        {doc.motivoRechazo && (
                            <>
                                <Separator />
                                <section>
                                    <SectionTitle>Último rechazo</SectionTitle>
                                    <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive whitespace-pre-wrap">
                                        {doc.motivoRechazo}
                                    </p>
                                </section>
                            </>
                        )}
                    </div>
                </aside>

                {/* Columna derecha: preview PDF */}
                <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2.5 shrink-0">
                        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Vista previa del PDF
                        </h3>
                        <Button type="button" variant="ghost" size="sm" onClick={() => void refreshPreview()}>
                            <RefreshCw className="mr-2 h-3.5 w-3.5" />
                            Renovar
                        </Button>
                    </div>
                    <div className="min-h-0 flex-1 bg-neutral-100">
                        {preview ? (
                            <iframe
                                key={previewKey}
                                title="Vista previa PDF"
                                src={preview}
                                className="h-full w-full border-0 bg-white"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                No hay vista previa disponible.
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <AlertDialog open={approveOpen} onOpenChange={setApproveOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Aprobar este documento?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Quedará publicado y visible en la biblioteca de usuarios.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={acting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => void onApprove()} disabled={acting}>
                            {acting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Aprobar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {doc.estado === 'PUBLICADO' ? 'Rechazar documento publicado' : 'Rechazar documento'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                        <Label htmlFor="motivo-rechazo">Motivo (mín. 5 caracteres)</Label>
                        <Textarea
                            id="motivo-rechazo"
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            rows={4}
                            placeholder="Indica qué debe corregir el curador…"
                        />
                        {doc.estado === 'PUBLICADO' && (
                            <p className="text-xs text-muted-foreground">
                                Volverá a Correcciones del curador y se ocultará de la biblioteca de usuarios. El PDF no
                                se mueve de carpeta.
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setRejectOpen(false)} disabled={acting}>
                            Cancelar
                        </Button>
                        <Button type="button" variant="destructive" onClick={() => void onReject()} disabled={acting}>
                            {acting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Confirmar rechazo
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function StaffDocumentoDetailPage() {
    return (
        <RouteGuard allowedRoles={['CURADOR', 'REVISOR']}>
            <DocumentDetailContent />
        </RouteGuard>
    );
}
