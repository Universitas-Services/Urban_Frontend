'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    FileUp,
    Loader2,
    Plus,
    Check,
    Scale,
    Landmark,
    Globe2,
    Gavel,
    Earth,
    BookOpen,
    ExternalLink,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Estado, Municipio } from '@universitas/sdk-global';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DatePicker } from '@/components/ui/date-picker';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sdkApi } from '@/lib/api/universitas.sdk';
import {
    getTribunalesByEstado,
    getTribunalesByMunicipio,
    type TribunalTerritorio,
} from '@/lib/api/territorio-tribunales';
import { type Documento, type MacroTipoDocumento, type UploadDocumentMetadata } from '@/lib/services/documents.service';
import { correctDocumentDirect, uploadDocumentDirect } from '@/lib/services/documents-upload.client';
import { EtiquetasPicker } from './EtiquetasPicker';
import { PaisCidhSelect } from './PaisCidhSelect';
import { TribunalSelect } from './TribunalSelect';
import { WorldCountrySelect } from './WorldCountrySelect';
import {
    AMBITOS_TERRITORIALES,
    MACRO_TIPO_OPTIONS,
    MAX_DOCUMENT_PDF_BYTES,
    MAX_DOCUMENT_PDF_LABEL,
    formatFileSize,
    SALAS_TSJ,
    TIPOS_CORTE,
    TIPOS_DOCTRINA,
    TIPOS_NORMA_INSTRUMENTO,
    TIPOS_NORMA_LEGISLACION,
    TIPOS_TRIBUNAL,
} from './document-upload.constants';
import { getFriendlyErrorMessage } from '@/lib/utils/friendly-error';

const STEPS = ['Macro tipo', 'Tipificación', 'Archivo PDF', 'Indexación'] as const;

const MACRO_TIPO_ICONS: Record<MacroTipoDocumento, LucideIcon> = {
    LEGISLACION: Scale,
    ORDENANZA: Landmark,
    INSTRUMENTO_INTERNACIONAL: Globe2,
    SENTENCIA: Gavel,
    SENTENCIA_INTERNACIONAL: Earth,
    DOCTRINA: BookOpen,
};

type Params = Record<string, string>;

export type DocumentUploadFormProps = {
    mode?: 'create' | 'edit';
    initialDocumento?: Documento;
};

function paramsFromDocumento(doc: Documento): Params {
    const raw = doc.parametrosEspecificos || {};
    const out: Params = {};
    for (const [k, v] of Object.entries(raw)) {
        if (v === null || v === undefined) continue;
        out[k] = String(v);
    }
    if (doc.fechaPublicacion && !out.fecha_publicacion) {
        out.fecha_publicacion = doc.fechaPublicacion.slice(0, 10);
    }
    return out;
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium">
                {label}
                {required ? <span className="text-destructive"> *</span> : null}
            </Label>
            {children}
        </div>
    );
}

export function DocumentUploadForm({ mode = 'create', initialDocumento }: DocumentUploadFormProps) {
    const router = useRouter();
    const isEdit = mode === 'edit' && !!initialDocumento;
    const [step, setStep] = React.useState(isEdit ? 1 : 0);
    const [submitting, setSubmitting] = React.useState(false);

    const [macroTipo, setMacroTipo] = React.useState<MacroTipoDocumento | ''>(initialDocumento?.macroTipo ?? '');
    const [tituloIntegro, setTituloIntegro] = React.useState(initialDocumento?.tituloIntegro ?? '');
    const [tituloBreve, setTituloBreve] = React.useState(initialDocumento?.tituloBreve ?? '');
    const [params, setParams] = React.useState<Params>(() =>
        initialDocumento ? paramsFromDocumento(initialDocumento) : {}
    );
    const [customList, setCustomList] = React.useState<Record<string, string[]>>({});
    const [customInput, setCustomInput] = React.useState<Record<string, string>>({});

    const [file, setFile] = React.useState<File | null>(null);
    const [noLegible, setNoLegible] = React.useState(initialDocumento?.legibilidadPdf === 'SOLO_IMAGEN');
    const [dragOver, setDragOver] = React.useState(false);

    const [categorias, setCategorias] = React.useState(initialDocumento?.categorias ?? '');
    const [etiquetaIds, setEtiquetaIds] = React.useState<string[]>(
        () => initialDocumento?.etiquetas?.map((e) => e.etiqueta.id) ?? []
    );
    const [resumenDescriptivo, setResumenDescriptivo] = React.useState(initialDocumento?.resumenDescriptivo ?? '');
    const [resumenCorto, setResumenCorto] = React.useState(initialDocumento?.resumenCorto ?? '');
    const [palabrasClave, setPalabrasClave] = React.useState(initialDocumento?.palabrasClave ?? '');

    const [estados, setEstados] = React.useState<Estado[]>([]);
    const [municipios, setMunicipios] = React.useState<Municipio[]>([]);
    const [tribunalesEstado, setTribunalesEstado] = React.useState<TribunalTerritorio[]>([]);
    const [tribunalesMunicipio, setTribunalesMunicipio] = React.useState<TribunalTerritorio[]>([]);
    const [loadingTribunalesEstado, setLoadingTribunalesEstado] = React.useState(false);
    const [loadingTribunalesMunicipio, setLoadingTribunalesMunicipio] = React.useState(false);

    const setParam = (key: string, value: string) => {
        setParams((prev) => ({ ...prev, [key]: value }));
    };

    React.useEffect(() => {
        sdkApi.territorio
            .getEstados()
            .then((res) => setEstados(res.data ?? []))
            .catch(() => setEstados([]));
    }, []);

    React.useEffect(() => {
        const estadoNombre = params.estado;
        if (!estadoNombre) return;
        const estado = estados.find((e) => e.nombre === estadoNombre);
        if (!estado) return;
        let cancelled = false;
        sdkApi.territorio
            .getMunicipios(estado.id)
            .then((res) => {
                if (!cancelled) setMunicipios(res.data ?? []);
            })
            .catch(() => {
                if (!cancelled) setMunicipios([]);
            });
        return () => {
            cancelled = true;
        };
    }, [params.estado, estados]);

    // Tribunales estadales (Tribunales Nacionales) por estado
    React.useEffect(() => {
        if (params.tipo_tribunal !== 'Tribunales Nacionales' || !params.estado) return;
        const estado = estados.find((e) => e.nombre === params.estado);
        if (!estado) return;

        let cancelled = false;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- loading al iniciar fetch de tribunales
        setLoadingTribunalesEstado(true);
        getTribunalesByEstado(estado.id)
            .then((data) => {
                if (!cancelled) setTribunalesEstado(data);
            })
            .catch(() => {
                if (!cancelled) {
                    setTribunalesEstado([]);
                    toast.error('No se pudieron cargar los tribunales del estado');
                }
            })
            .finally(() => {
                if (!cancelled) setLoadingTribunalesEstado(false);
            });

        return () => {
            cancelled = true;
        };
    }, [params.tipo_tribunal, params.estado, estados]);

    // Tribunales municipales por municipio
    React.useEffect(() => {
        if (params.tipo_tribunal !== 'Tribunales Municipales' || !params.municipio) return;
        const municipio = municipios.find((m) => m.nombre === params.municipio);
        if (!municipio) return;

        let cancelled = false;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- loading al iniciar fetch de tribunales
        setLoadingTribunalesMunicipio(true);
        getTribunalesByMunicipio(municipio.id)
            .then((data) => {
                if (!cancelled) setTribunalesMunicipio(data);
            })
            .catch(() => {
                if (!cancelled) {
                    setTribunalesMunicipio([]);
                    toast.error('No se pudieron cargar los tribunales del municipio');
                }
            })
            .finally(() => {
                if (!cancelled) setLoadingTribunalesMunicipio(false);
            });

        return () => {
            cancelled = true;
        };
    }, [params.tipo_tribunal, params.municipio, municipios]);

    const municipiosDisponibles = params.estado ? municipios : [];
    const tribunalesEstadoDisponibles =
        params.tipo_tribunal === 'Tribunales Nacionales' && params.estado ? tribunalesEstado : [];
    const tribunalesMunicipioDisponibles =
        params.tipo_tribunal === 'Tribunales Municipales' && params.municipio ? tribunalesMunicipio : [];

    const addCustomOption = (key: string) => {
        const value = (customInput[key] || '').trim();
        if (!value) return;
        setCustomList((prev) => ({
            ...prev,
            [key]: [...(prev[key] || []), value],
        }));
        setParam(key, value);
        setCustomInput((prev) => ({ ...prev, [key]: '' }));
    };

    const onFilePicked = (picked: File | null) => {
        if (!picked) return;
        if (picked.type !== 'application/pdf') {
            toast.error('Solo se permiten archivos PDF.');
            return;
        }
        if (picked.size > MAX_DOCUMENT_PDF_BYTES) {
            toast.error(
                `El PDF supera el límite de ${MAX_DOCUMENT_PDF_LABEL} (archivo: ${formatFileSize(picked.size)}).`
            );
            return;
        }
        setFile(picked);
    };

    const validateStep = (): boolean => {
        if (step === 0 && !macroTipo) {
            toast.error('Selecciona un macro tipo.');
            return false;
        }
        if (step === 1) {
            if (!tituloIntegro.trim() || !tituloBreve.trim()) {
                toast.error('Completa título íntegro y título breve.');
                return false;
            }
            if (macroTipo === 'LEGISLACION' && !params.tipo_norma) {
                toast.error('Selecciona el tipo de norma.');
                return false;
            }
            if (macroTipo === 'ORDENANZA' && !params.ente_emisor) {
                toast.error('Indica el ente emisor.');
                return false;
            }
            if (macroTipo === 'SENTENCIA' && !params.tipo_tribunal) {
                toast.error('Selecciona el tipo de tribunal.');
                return false;
            }
            if (macroTipo === 'SENTENCIA' && params.tipo_tribunal === 'TSJ' && !params.sala_tsj) {
                toast.error('Selecciona la sala del TSJ.');
                return false;
            }
            if (
                macroTipo === 'SENTENCIA' &&
                (params.tipo_tribunal === 'Tribunales Nacionales' ||
                    params.tipo_tribunal === 'Tribunales Municipales') &&
                !params.estado
            ) {
                toast.error('Selecciona el estado.');
                return false;
            }
            if (
                macroTipo === 'SENTENCIA' &&
                params.tipo_tribunal === 'Tribunales Nacionales' &&
                !params.tribunal_nacional
            ) {
                toast.error('Selecciona el tribunal nacional.');
                return false;
            }
            if (macroTipo === 'SENTENCIA' && params.tipo_tribunal === 'Tribunales Municipales') {
                if (!params.municipio) {
                    toast.error('Selecciona el municipio.');
                    return false;
                }
                if (!params.tribunal_municipal) {
                    toast.error('Selecciona el tribunal municipal.');
                    return false;
                }
            }
            if (macroTipo === 'SENTENCIA_INTERNACIONAL' && !params.tipo_corte) {
                toast.error('Selecciona el tipo de corte.');
                return false;
            }
            if (macroTipo === 'DOCTRINA' && !params.tipo_doctrina) {
                toast.error('Selecciona el tipo de doctrina.');
                return false;
            }
        }
        if (step === 2 && !isEdit && !file) {
            toast.error('Adjunta el archivo PDF.');
            return false;
        }
        if (step === 3 && resumenDescriptivo.trim().length < 20) {
            toast.error('El resumen descriptivo debe tener al menos 20 caracteres.');
            return false;
        }
        return true;
    };

    const resolveEnteEmisor = (): string => {
        if (params.ente_emisor?.trim()) return params.ente_emisor.trim();
        if (params.autor?.trim()) return params.autor.trim();
        if (params.tipo_corte?.trim()) return params.tipo_corte.trim();
        if (params.sala_tsj?.trim()) return params.sala_tsj.trim();
        if (params.tribunal_nacional?.trim()) return params.tribunal_nacional.trim();
        if (params.tribunal_municipal?.trim()) return params.tribunal_municipal.trim();
        return 'SIN_ENTE';
    };

    const handleSubmit = async () => {
        if (!validateStep() || !macroTipo) return;
        if (!isEdit && !file) return;
        setSubmitting(true);
        try {
            const metadata: UploadDocumentMetadata = {
                macroTipo,
                tituloIntegro: tituloIntegro.trim(),
                tituloBreve: tituloBreve.trim(),
                parametrosEspecificos: { ...params },
                enteEmisor: resolveEnteEmisor(),
                fechaPublicacion: params.fecha_publicacion || null,
                categorias: categorias.trim() || undefined,
                etiquetaIds: etiquetaIds.length ? etiquetaIds : undefined,
                resumenDescriptivo: resumenDescriptivo.trim(),
                resumenCorto: resumenCorto.trim() || undefined,
                palabrasClave: palabrasClave.trim() || undefined,
                noLegible,
            };

            const formData = new FormData();
            formData.append('metadata', JSON.stringify(metadata));
            if (file) {
                formData.append('archivo', file);
            }

            if (isEdit && initialDocumento) {
                await correctDocumentDirect(initialDocumento.id, formData);
                toast.success('Documento corregido y reenviado a revisión.');
                router.push('/staff/correcciones');
            } else {
                const doc = await uploadDocumentDirect(formData);
                toast.success('Documento enviado a revisión.');
                router.push(`/staff/documentos/${doc.id}`);
            }
        } catch (error) {
            toast.error(
                getFriendlyErrorMessage(
                    error,
                    isEdit
                        ? 'No se pudo corregir el documento. Revisa los datos e intenta de nuevo.'
                        : `No se pudo subir el documento. Verifica el PDF (máx. ${MAX_DOCUMENT_PDF_LABEL}) e intenta de nuevo.`
                )
            );
        } finally {
            setSubmitting(false);
        }
    };

    const next = () => {
        if (!validateStep()) return;
        if (step === STEPS.length - 1) {
            void handleSubmit();
            return;
        }
        setStep((s) => s + 1);
    };

    const back = () => setStep((s) => Math.max(0, s - 1));

    const selectWithAdd = (key: string, options: string[], placeholder: string, addLabel = 'Agregar') => {
        const extras = customList[key] || [];
        const all = [...options, ...extras];
        return (
            <div className="space-y-2">
                <Select value={params[key] || ''} onValueChange={(v) => setParam(key, v)}>
                    <SelectTrigger>
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {all.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                                {opt}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="flex gap-2">
                    <Input
                        placeholder={addLabel}
                        value={customInput[key] || ''}
                        onChange={(e) => setCustomInput((prev) => ({ ...prev, [key]: e.target.value }))}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={() => addCustomOption(key)}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    };

    const renderTipificacion = () => {
        if (!macroTipo) return null;

        const commonTitles = (
            <>
                <Field label={macroTipo.startsWith('SENTENCIA') ? 'Caso' : 'Título íntegro'} required>
                    <Input
                        value={tituloIntegro}
                        onChange={(e) => setTituloIntegro(e.target.value)}
                        placeholder="Título completo del documento"
                    />
                </Field>
                <Field label="Título breve" required>
                    <Input
                        value={tituloBreve}
                        onChange={(e) => setTituloBreve(e.target.value)}
                        placeholder="Título corto"
                    />
                </Field>
            </>
        );

        switch (macroTipo) {
            case 'LEGISLACION':
                return (
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Tipo de norma" required>
                            <Select value={params.tipo_norma || ''} onValueChange={(v) => setParam('tipo_norma', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TIPOS_NORMA_LEGISLACION.map((opt) => (
                                        <SelectItem key={opt} value={opt}>
                                            {opt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        {commonTitles}
                        <Field label="Ente emisor" required>
                            <Input
                                value={params.ente_emisor || ''}
                                onChange={(e) => setParam('ente_emisor', e.target.value)}
                            />
                        </Field>
                        <Field label="Fecha de publicación">
                            <DatePicker
                                value={params.fecha_publicacion || ''}
                                onChange={(v) => setParam('fecha_publicacion', v)}
                            />
                        </Field>
                        <Field label="Número de gaceta">
                            <Input
                                value={params.numero_gaceta || ''}
                                onChange={(e) => setParam('numero_gaceta', e.target.value)}
                            />
                        </Field>
                        <Field label="Ámbito territorial">
                            <Select
                                value={params.ambito_territorial || ''}
                                onValueChange={(v) => setParam('ambito_territorial', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona" />
                                </SelectTrigger>
                                <SelectContent>
                                    {AMBITOS_TERRITORIALES.map((opt) => (
                                        <SelectItem key={opt} value={opt}>
                                            {opt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>
                );
            case 'ORDENANZA':
                return (
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Ente emisor" required>
                            {selectWithAdd(
                                'ente_emisor',
                                ['Consejo Municipal'],
                                'Selecciona o agrega',
                                'Otro ente emisor'
                            )}
                        </Field>
                        {commonTitles}
                        <Field label="Estado">
                            <Select
                                value={params.estado || ''}
                                onValueChange={(v) => {
                                    setParam('estado', v);
                                    setParam('municipio', '');
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    {estados.map((e) => (
                                        <SelectItem key={e.id} value={e.nombre}>
                                            {e.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Municipio">
                            <Select
                                value={params.municipio || ''}
                                onValueChange={(v) => setParam('municipio', v)}
                                disabled={!params.estado}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona municipio" />
                                </SelectTrigger>
                                <SelectContent>
                                    {municipiosDisponibles.map((m) => (
                                        <SelectItem key={m.id} value={m.nombre}>
                                            {m.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Fecha de publicación">
                            <DatePicker
                                value={params.fecha_publicacion || ''}
                                onChange={(v) => setParam('fecha_publicacion', v)}
                            />
                        </Field>
                        <Field label="Número de gaceta">
                            <Input
                                value={params.numero_gaceta || ''}
                                onChange={(e) => setParam('numero_gaceta', e.target.value)}
                            />
                        </Field>
                    </div>
                );
            case 'INSTRUMENTO_INTERNACIONAL':
                return (
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Tipo de norma" required>
                            {selectWithAdd(
                                'tipo_norma',
                                TIPOS_NORMA_INSTRUMENTO,
                                'Selecciona o agrega',
                                'Agregar tipo de norma'
                            )}
                        </Field>
                        {commonTitles}
                        <Field label="Organismo emisor" required>
                            <Input
                                value={params.ente_emisor || ''}
                                onChange={(e) => setParam('ente_emisor', e.target.value)}
                            />
                        </Field>
                        <Field label="Fecha de entrada en vigor">
                            <DatePicker
                                value={params.fecha_publicacion || ''}
                                onChange={(v) => setParam('fecha_publicacion', v)}
                            />
                        </Field>
                        <Field label="Detalles de aprobación">
                            <Input
                                value={params.detalles_aprobacion || ''}
                                onChange={(e) => setParam('detalles_aprobacion', e.target.value)}
                            />
                        </Field>
                    </div>
                );
            case 'SENTENCIA':
                return (
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Tipo de tribunal" required>
                            <Select
                                value={params.tipo_tribunal || ''}
                                onValueChange={(v) => {
                                    setParams((prev) => ({
                                        ...prev,
                                        tipo_tribunal: v,
                                        sala_tsj: '',
                                        estado: '',
                                        municipio: '',
                                        tribunal_nacional: '',
                                        tribunal_municipal: '',
                                    }));
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TIPOS_TRIBUNAL.map((opt) => (
                                        <SelectItem key={opt} value={opt}>
                                            {opt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        {params.tipo_tribunal === 'TSJ' && (
                            <>
                                <Field label="Sala" required>
                                    <Select
                                        value={params.sala_tsj || ''}
                                        onValueChange={(v) => setParam('sala_tsj', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona sala" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SALAS_TSJ.map((opt) => (
                                                <SelectItem key={opt} value={opt}>
                                                    {opt}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field label="Magistrado del TSJ">
                                    <Input
                                        value={params.magistrado_tsj || ''}
                                        onChange={(e) => setParam('magistrado_tsj', e.target.value)}
                                    />
                                </Field>
                            </>
                        )}
                        {(params.tipo_tribunal === 'Tribunales Nacionales' ||
                            params.tipo_tribunal === 'Tribunales Municipales') && (
                            <Field label="Estado" required>
                                <Select
                                    value={params.estado || ''}
                                    onValueChange={(v) => {
                                        setParams((prev) => ({
                                            ...prev,
                                            estado: v,
                                            municipio: '',
                                            tribunal_nacional: '',
                                            tribunal_municipal: '',
                                        }));
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {estados.map((e) => (
                                            <SelectItem key={e.id} value={e.nombre}>
                                                {e.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        )}
                        {params.tipo_tribunal === 'Tribunales Municipales' && (
                            <Field label="Municipio" required>
                                <Select
                                    value={params.municipio || ''}
                                    onValueChange={(v) => {
                                        setParams((prev) => ({
                                            ...prev,
                                            municipio: v,
                                            tribunal_municipal: '',
                                        }));
                                    }}
                                    disabled={!params.estado}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona municipio" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {municipiosDisponibles.map((m) => (
                                            <SelectItem key={m.id} value={m.nombre}>
                                                {m.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        )}
                        {params.tipo_tribunal === 'Tribunales Nacionales' && (
                            <Field label="Tribunal nacional" required>
                                <TribunalSelect
                                    value={params.tribunal_nacional || ''}
                                    onChange={(nombre) => setParam('tribunal_nacional', nombre)}
                                    tribunales={tribunalesEstadoDisponibles}
                                    loading={loadingTribunalesEstado}
                                    disabled={!params.estado}
                                    placeholder={
                                        params.estado ? 'Selecciona un tribunal' : 'Selecciona primero un estado'
                                    }
                                    emptyMessage="No hay tribunales estadales para este estado"
                                />
                            </Field>
                        )}
                        {params.tipo_tribunal === 'Tribunales Municipales' && (
                            <Field label="Tribunal municipal" required>
                                <TribunalSelect
                                    value={params.tribunal_municipal || ''}
                                    onChange={(nombre) => setParam('tribunal_municipal', nombre)}
                                    tribunales={tribunalesMunicipioDisponibles}
                                    loading={loadingTribunalesMunicipio}
                                    disabled={!params.municipio}
                                    placeholder={
                                        params.municipio ? 'Selecciona un tribunal' : 'Selecciona primero un municipio'
                                    }
                                    emptyMessage="No hay tribunales municipales para este municipio"
                                />
                            </Field>
                        )}
                        {commonTitles}
                        <Field label="Fecha de publicación">
                            <DatePicker
                                value={params.fecha_publicacion || ''}
                                onChange={(v) => setParam('fecha_publicacion', v)}
                            />
                        </Field>
                        <Field label="Número de sentencia">
                            <Input
                                value={params.numero_sentencia || ''}
                                onChange={(e) => setParam('numero_sentencia', e.target.value)}
                            />
                        </Field>
                        <Field label="Número de expediente">
                            <Input
                                value={params.numero_expediente || ''}
                                onChange={(e) => setParam('numero_expediente', e.target.value)}
                            />
                        </Field>
                    </div>
                );
            case 'SENTENCIA_INTERNACIONAL':
                return (
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Tipo de corte" required>
                            {selectWithAdd('tipo_corte', TIPOS_CORTE, 'Selecciona o agrega', 'Agregar corte')}
                        </Field>
                        {params.tipo_corte === 'Corte Interamericana de Derechos Humanos' && (
                            <Field label="País">
                                <PaisCidhSelect
                                    value={params.pais || ''}
                                    onChange={(v) => setParam('pais', v)}
                                    extras={customList.pais || []}
                                    customInput={customInput.pais || ''}
                                    onCustomInputChange={(v) => setCustomInput((prev) => ({ ...prev, pais: v }))}
                                    onAddCustom={() => addCustomOption('pais')}
                                />
                            </Field>
                        )}
                        {commonTitles}
                        <Field label="Demandante">
                            <Input
                                value={params.demandante || ''}
                                onChange={(e) => setParam('demandante', e.target.value)}
                            />
                        </Field>
                        <Field label="Demandado">
                            <Input
                                value={params.demandado || ''}
                                onChange={(e) => setParam('demandado', e.target.value)}
                            />
                        </Field>
                        <Field label="Fecha de publicación">
                            <DatePicker
                                value={params.fecha_publicacion || ''}
                                onChange={(v) => setParam('fecha_publicacion', v)}
                            />
                        </Field>
                        <Field label="Número de sentencia">
                            <Input
                                value={params.numero_sentencia || ''}
                                onChange={(e) => setParam('numero_sentencia', e.target.value)}
                            />
                        </Field>
                    </div>
                );
            case 'DOCTRINA':
                return (
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Tipo de doctrina" required>
                            <Select
                                value={params.tipo_doctrina || ''}
                                onValueChange={(v) => setParam('tipo_doctrina', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TIPOS_DOCTRINA.map((opt) => (
                                        <SelectItem key={opt} value={opt}>
                                            {opt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        {commonTitles}
                        <Field label="Autor o autores" required>
                            <Input value={params.autor || ''} onChange={(e) => setParam('autor', e.target.value)} />
                        </Field>
                        <Field label="País">
                            <WorldCountrySelect
                                value={params.pais || ''}
                                onChange={(v) => setParam('pais', v)}
                                placeholder="País de publicación"
                            />
                        </Field>
                        <Field label="Edición / Volúmenes">
                            <Input
                                value={params.edicion_volumenes || ''}
                                onChange={(e) => setParam('edicion_volumenes', e.target.value)}
                            />
                        </Field>
                        <Field label="Editorial">
                            <Input
                                value={params.editorial || ''}
                                onChange={(e) => setParam('editorial', e.target.value)}
                            />
                        </Field>
                        <Field label="Fecha de publicación">
                            <DatePicker
                                value={params.fecha_publicacion || ''}
                                onChange={(v) => setParam('fecha_publicacion', v)}
                            />
                        </Field>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold text-neutral-dark">
                    {isEdit ? 'Corregir documento' : 'Nueva carga legal'}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {isEdit
                        ? 'Edita la tipificación, el PDF si hace falta y la indexación; luego reenvía a revisión.'
                        : 'Completa tipificación, PDF e indexación para enviarlo a revisión.'}
                </p>
            </div>

            <nav aria-label="Progreso" className="overflow-hidden rounded-lg border bg-card p-3">
                <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {STEPS.map((label, idx) => {
                        const active = idx === step;
                        const done = idx < step;
                        return (
                            <li
                                key={label}
                                className={cn(
                                    'flex items-center gap-2 rounded-md px-2 py-2 text-sm',
                                    active && 'bg-primary/10 text-primary',
                                    done && 'text-primary',
                                    !active && !done && 'text-muted-foreground'
                                )}
                            >
                                <span
                                    className={cn(
                                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                                        active && 'bg-primary text-primary-foreground',
                                        done && 'bg-primary/20 text-primary',
                                        !active && !done && 'bg-muted'
                                    )}
                                >
                                    {done ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                                </span>
                                <span className="font-medium leading-tight">{label}</span>
                            </li>
                        );
                    })}
                </ol>
            </nav>

            <div className="rounded-lg border bg-card p-5 sm:p-6">
                {step === 0 && (
                    <div className="space-y-4">
                        <h2 className="text-base font-semibold">¿Qué tipo de documento cargas?</h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {MACRO_TIPO_OPTIONS.map((opt) => {
                                const selected = macroTipo === opt.value;
                                const Icon = MACRO_TIPO_ICONS[opt.value];
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            setMacroTipo(opt.value);
                                            setParams({});
                                            setTituloIntegro('');
                                            setTituloBreve('');
                                        }}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg border px-4 py-4 text-left transition',
                                            selected
                                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                : 'border-border hover:border-primary/40 hover:bg-muted/40'
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'flex size-10 shrink-0 items-center justify-center rounded-lg',
                                                selected
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground'
                                            )}
                                        >
                                            <Icon className="size-5" aria-hidden />
                                        </span>
                                        <span className="min-w-0">
                                            <p className="font-medium leading-snug">{opt.label}</p>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-base font-semibold">Tipificación</h2>
                            <p className="text-sm text-muted-foreground">
                                {MACRO_TIPO_OPTIONS.find((m) => m.value === macroTipo)?.label}
                            </p>
                        </div>
                        {renderTipificacion()}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-base font-semibold">Archivo PDF</h2>
                            <p className="text-sm text-muted-foreground">
                                {isEdit
                                    ? `Puedes mantener el PDF actual o subir uno nuevo (máx. ${MAX_DOCUMENT_PDF_LABEL}).`
                                    : `Arrastra el archivo o selecciónalo. Solo PDF, máximo ${MAX_DOCUMENT_PDF_LABEL}.`}
                            </p>
                        </div>
                        {isEdit && initialDocumento && (
                            <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/20 px-4 py-3">
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium">PDF actual</p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {initialDocumento.archivoPath.split('/').pop()}
                                    </p>
                                </div>
                                <Button asChild type="button" variant="outline" size="sm">
                                    <a
                                        href={initialDocumento.previewUrl || initialDocumento.archivoUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <ExternalLink className="mr-2 h-3.5 w-3.5" />
                                        Ver PDF
                                    </a>
                                </Button>
                            </div>
                        )}
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragOver(true);
                            }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setDragOver(false);
                                onFilePicked(e.dataTransfer.files?.[0] ?? null);
                            }}
                            className={cn(
                                'flex min-h-52 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-4 py-10 text-center transition-colors',
                                dragOver ? 'border-primary bg-primary/5' : 'border-border bg-muted/20'
                            )}
                            onClick={() => document.getElementById('pdf-input')?.click()}
                        >
                            <div className="rounded-full bg-primary/10 p-3">
                                <FileUp className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">
                                    {isEdit ? 'Arrastra un PDF nuevo (opcional)' : 'Arrastra el PDF aquí'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    o haz clic para explorar · máximo {MAX_DOCUMENT_PDF_LABEL}
                                </p>
                            </div>
                            {file && (
                                <Badge variant="secondary" className="max-w-full truncate px-3 py-1">
                                    {file.name} · {formatFileSize(file.size)}
                                </Badge>
                            )}
                            {!file && isEdit && (
                                <Badge variant="outline" className="px-3 py-1">
                                    Se mantendrá el PDF actual
                                </Badge>
                            )}
                            <input
                                id="pdf-input"
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) => onFilePicked(e.target.files?.[0] ?? null)}
                            />
                        </div>
                        <div className="flex items-center gap-2 rounded-md border bg-muted/20 px-3 py-2">
                            <Checkbox
                                id="no-legible"
                                checked={noLegible}
                                onCheckedChange={(v) => setNoLegible(v === true)}
                            />
                            <Label htmlFor="no-legible" className="text-sm font-normal">
                                PDF no legible (solo imagen / requiere OCR)
                            </Label>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-5">
                        <div>
                            <h2 className="text-base font-semibold">Indexación</h2>
                            <p className="text-sm text-muted-foreground">
                                Facilita la búsqueda posterior. Puedes buscar etiquetas existentes o crear nuevas sin
                                salir de este paso.
                            </p>
                        </div>
                        <Field label="Categorías">
                            <Textarea
                                value={categorias}
                                onChange={(e) => setCategorias(e.target.value)}
                                placeholder="Temas o categorías en texto libre"
                                rows={2}
                            />
                        </Field>
                        <Field label="Etiquetas">
                            <EtiquetasPicker value={etiquetaIds} onChange={setEtiquetaIds} />
                        </Field>
                        <Field label="Resumen descriptivo" required>
                            <Textarea
                                value={resumenDescriptivo}
                                onChange={(e) => setResumenDescriptivo(e.target.value)}
                                placeholder="Mínimo 20 caracteres"
                                rows={4}
                            />
                        </Field>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Resumen corto">
                                <Textarea
                                    value={resumenCorto}
                                    onChange={(e) => setResumenCorto(e.target.value)}
                                    rows={2}
                                />
                            </Field>
                            <Field label="Palabras clave (SEO)">
                                <Input
                                    value={palabrasClave}
                                    onChange={(e) => setPalabrasClave(e.target.value)}
                                    placeholder="palabra1, palabra2…"
                                />
                            </Field>
                        </div>
                    </div>
                )}
            </div>

            <div className="sticky bottom-0 z-10 -mx-1 flex justify-between gap-3 border-t bg-surface-light/90 px-1 py-3 backdrop-blur">
                <Button type="button" variant="outline" onClick={back} disabled={step === 0 || submitting}>
                    Atrás
                </Button>
                <Button type="button" onClick={next} disabled={submitting}>
                    {submitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {isEdit ? 'Guardando…' : 'Enviando…'}
                        </>
                    ) : step === STEPS.length - 1 ? (
                        isEdit ? (
                            'Guardar y reenviar a revisión'
                        ) : (
                            'Enviar a revisión'
                        )
                    ) : (
                        'Continuar'
                    )}
                </Button>
            </div>
        </div>
    );
}
