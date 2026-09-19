'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';

import { RouteGuard } from '@/components/auth/RouteGuard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DocumentUploadForm } from '@/components/staff/documents/DocumentUploadForm';
import {
    getDocumentByIdAction,
    getDocumentRevisionesAction,
    type Documento,
    type DocumentoRevision,
} from '@/lib/services/documents.service';

function CorregirDocumentoContent() {
    const params = useParams<{ id: string }>();
    const [doc, setDoc] = React.useState<Documento | null>(null);
    const [revisiones, setRevisiones] = React.useState<DocumentoRevision[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let cancelled = false;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- loading al cargar detalle
        setLoading(true);
        Promise.all([
            getDocumentByIdAction(params.id),
            getDocumentRevisionesAction(params.id).catch(() => ({ items: [] })),
        ])
            .then(([data, hist]) => {
                if (cancelled) return;
                if (data.estado !== 'RECHAZADO') {
                    setError('Este documento no está en correcciones (no está rechazado).');
                    setDoc(null);
                    return;
                }
                setDoc(data);
                setRevisiones(hist.items.filter((r) => r.accion === 'RECHAZADO'));
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Error al cargar');
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [params.id]);

    if (loading) {
        return <p className="text-sm text-muted-foreground">Cargando documento…</p>;
    }

    if (error) {
        return (
            <div className="space-y-4">
                <p className="text-sm text-destructive">{error}</p>
                <Button asChild variant="outline" size="sm">
                    <Link href="/staff/correcciones">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a correcciones
                    </Link>
                </Button>
            </div>
        );
    }

    if (!doc) return null;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
                <Button asChild variant="outline" size="sm">
                    <Link href="/staff/correcciones">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver
                    </Link>
                </Button>
                <Badge variant="destructive">Rechazado</Badge>
            </div>

            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <h2 className="text-sm font-semibold text-destructive">Motivo del rechazo</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm">{doc.motivoRechazo || 'Sin detalle'}</p>
                {revisiones.length > 1 && (
                    <div className="mt-4 space-y-2 border-t border-destructive/20 pt-3">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Historial de rechazos
                        </p>
                        {revisiones.map((rev) => (
                            <div key={rev.id} className="text-sm">
                                <span className="text-xs text-muted-foreground">
                                    {format(new Date(rev.createdAt), 'd MMM yyyy HH:mm', {
                                        locale: es,
                                    })}
                                    {rev.actor
                                        ? ` · ${rev.actor.nombre}${rev.actor.apellido ? ` ${rev.actor.apellido}` : ''}`
                                        : ''}
                                </span>
                                {rev.motivo && (
                                    <p className="mt-0.5 whitespace-pre-wrap text-muted-foreground">{rev.motivo}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <DocumentUploadForm mode="edit" initialDocumento={doc} />
        </div>
    );
}

export default function StaffCorregirDocumentoPage() {
    return (
        <RouteGuard allowedRoles={['CURADOR']}>
            <CorregirDocumentoContent />
        </RouteGuard>
    );
}
