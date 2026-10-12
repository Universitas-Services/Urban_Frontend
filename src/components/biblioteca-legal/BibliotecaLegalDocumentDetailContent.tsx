'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Building2, CalendarDays, FileText, Hash, Loader2, PanelRight, Scale, Tags, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getDocumentByIdAction, type Documento } from '@/lib/services/documents.service';
import {
    formatPublishedFecha,
    getMacroTipoLabel,
    getPublishedEtiquetaNombres,
    getPublishedPreviewUrl,
} from './biblioteca-legal.published';

const BibliotecaPdfViewer = dynamic(() => import('./BibliotecaPdfViewer').then((mod) => mod.BibliotecaPdfViewer), {
    ssr: false,
    loading: () => (
        <div className="flex h-full items-center justify-center text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" aria-label="Cargando visor" />
        </div>
    ),
});

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

function SectionHeading({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
    return (
        <h3 className="mb-3 flex items-center gap-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {children}
        </h3>
    );
}

type BibliotecaLegalDocumentDetailContentProps = {
    documentId: string;
    categoryId: string;
    categoryTitle: string;
};

export function BibliotecaLegalDocumentDetailContent({
    documentId,
    categoryId,
    categoryTitle,
}: BibliotecaLegalDocumentDetailContentProps) {
    const [doc, setDoc] = React.useState<Documento | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [fichaOpen, setFichaOpen] = React.useState(true);

    const load = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDocumentByIdAction(documentId);
            setDoc(data);
        } catch (err) {
            setDoc(null);
            setError(err instanceof Error ? err.message : 'No se pudo cargar el documento');
        } finally {
            setLoading(false);
        }
    }, [documentId]);

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- carga del detalle
        void load();
    }, [load]);

    const backHref = `/biblioteca-legal/${categoryId}`;

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                Cargando documento…
            </div>
        );
    }

    if (error || !doc) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
                <p className="text-sm text-destructive">{error || 'Documento no encontrado'}</p>
                <Button asChild variant="outline" size="sm">
                    <Link href={backHref}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a {categoryTitle}
                    </Link>
                </Button>
            </div>
        );
    }

    const macroLabel = getMacroTipoLabel(doc.macroTipo);
    const preview = getPublishedPreviewUrl(doc);
    const title = doc.tituloIntegro?.trim() || doc.tituloBreve?.trim() || 'Documento';
    const breve = doc.tituloBreve?.trim();
    const etiquetas = getPublishedEtiquetaNombres(doc);
    const palabras = (doc.palabrasClave || '')
        .split(/[,;]/)
        .map((item) => item.trim())
        .filter(Boolean);
    const paramEntries = Object.entries(doc.parametrosEspecificos || {}).filter(([key, value]) => {
        if (key === 'ente_emisor' || key === 'fecha_publicacion') return false;
        if (value === undefined || value === null) return false;
        return String(value).trim() !== '';
    });

    return (
        <div className="flex h-full min-h-0 flex-1 flex-col bg-[#f4f6f8]">
            <header className="shrink-0 border-b bg-white px-4 py-3 md:px-6">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <Button asChild variant="ghost" size="sm" className="-ml-2 h-8">
                            <Link href={backHref}>
                                <ArrowLeft className="mr-1.5 h-4 w-4" />
                                {categoryTitle}
                            </Link>
                        </Button>
                        <span aria-hidden>/</span>
                        <span className="truncate">{breve || title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            size="sm"
                            variant={fichaOpen ? 'default' : 'outline'}
                            onClick={() => setFichaOpen((open) => !open)}
                        >
                            <PanelRight className="mr-1.5 h-4 w-4" />
                            Ficha técnica
                        </Button>
                    </div>
                </div>
                <h1 className="max-w-5xl text-xl leading-tight font-semibold text-neutral-dark md:text-2xl">{title}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/10">{macroLabel}</Badge>
                    {doc.enteEmisor?.trim() ? (
                        <span className="inline-flex items-center gap-1.5">
                            <Building2 className="h-4 w-4 shrink-0" aria-hidden />
                            {doc.enteEmisor}
                        </span>
                    ) : null}
                    {doc.fechaPublicacion ? (
                        <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
                            {formatPublishedFecha(doc.fechaPublicacion)}
                        </span>
                    ) : null}
                    {breve && breve !== title ? (
                        <span className="inline-flex items-center gap-1.5">
                            <FileText className="h-4 w-4 shrink-0" aria-hidden />
                            {breve}
                        </span>
                    ) : null}
                </div>
            </header>

            <div className="flex min-h-0 flex-1 flex-col items-stretch lg:flex-row">
                <section className="flex min-h-[720px] min-w-0 flex-1 flex-col p-3 md:p-4">
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-[#1c2430] shadow-sm">
                        {preview ? (
                            <BibliotecaPdfViewer url={preview} title={title} />
                        ) : (
                            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-white/70">
                                No hay archivo disponible para previsualizar.
                            </div>
                        )}
                    </div>
                </section>

                {fichaOpen ? (
                    <aside className="flex min-h-[720px] w-full shrink-0 flex-col self-stretch p-3 pt-0 md:p-4 md:pt-0 lg:w-[min(42vw,480px)] lg:pt-4 lg:pl-0">
                        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border bg-[#f7f8fa] shadow-sm">
                            <div className="flex items-center justify-between border-b bg-white px-5 py-4">
                                <h2 className="flex items-center gap-2 text-base font-semibold">
                                    <Scale className="h-4 w-4 text-primary" aria-hidden />
                                    Ficha técnica
                                </h2>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                    onClick={() => setFichaOpen(false)}
                                    aria-label="Cerrar ficha técnica"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto px-4 py-4">
                                <section className="rounded-xl border bg-white p-4 shadow-sm">
                                    <SectionHeading icon={Tags}>Clasificación</SectionHeading>
                                    <Badge variant="outline">{macroLabel}</Badge>
                                    {etiquetas.length > 0 ? (
                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                            {etiquetas.map((nombre) => (
                                                <span
                                                    key={nombre}
                                                    className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                                                >
                                                    #{nombre}
                                                </span>
                                            ))}
                                        </div>
                                    ) : null}
                                </section>

                                {paramEntries.length > 0 ? (
                                    <section className="rounded-xl border bg-white p-4 shadow-sm">
                                        <SectionHeading icon={Scale}>Parametrización jurídica</SectionHeading>
                                        <dl className="space-y-3">
                                            {paramEntries.map(([key, value]) => (
                                                <div key={key} className="min-w-0">
                                                    <dt className="text-[11px] text-muted-foreground">
                                                        {PARAM_LABELS[key] ?? key.replace(/_/g, ' ')}
                                                    </dt>
                                                    <dd className="text-sm font-medium break-words">{String(value)}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </section>
                                ) : null}

                                <section className="rounded-xl border bg-white p-4 shadow-sm">
                                    <SectionHeading icon={Hash}>Indexación</SectionHeading>
                                    <dl className="space-y-3">
                                        {doc.categorias?.trim() ? (
                                            <div>
                                                <dt className="text-[11px] text-muted-foreground">Categorías</dt>
                                                <dd className="text-sm break-words">{doc.categorias}</dd>
                                            </div>
                                        ) : null}
                                        {palabras.length > 0 ? (
                                            <div>
                                                <dt className="mb-1.5 text-[11px] text-muted-foreground">
                                                    Palabras clave
                                                </dt>
                                                <dd className="flex flex-wrap gap-1.5">
                                                    {palabras.map((word) => (
                                                        <span
                                                            key={word}
                                                            className="rounded-md border bg-muted/40 px-2.5 py-1 text-xs"
                                                        >
                                                            {word}
                                                        </span>
                                                    ))}
                                                </dd>
                                            </div>
                                        ) : null}
                                        {doc.resumenCorto?.trim() ? (
                                            <div>
                                                <dt className="text-[11px] text-muted-foreground">Resumen corto</dt>
                                                <dd className="text-sm leading-relaxed">{doc.resumenCorto}</dd>
                                            </div>
                                        ) : null}
                                    </dl>
                                    {doc.resumenDescriptivo?.trim() ? (
                                        <div className="mt-3">
                                            <p className="mb-1 text-[11px] text-muted-foreground">
                                                Resumen descriptivo
                                            </p>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap text-neutral-dark/90">
                                                {doc.resumenDescriptivo}
                                            </p>
                                        </div>
                                    ) : null}
                                </section>
                            </div>
                        </div>
                    </aside>
                ) : null}
            </div>
        </div>
    );
}
