import { format, isValid, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { MACRO_TIPO_OPTIONS } from '@/components/staff/documents/document-upload.constants';
import type { Documento } from '@/lib/services/documents.service';
import type { MacroTipoDocumento } from '@/lib/services/documents.types';

export type BibliotecaPublishedField = {
    label: string;
    value: string;
};

const PARAM_LABELS: Record<string, string> = {
    tipo_norma: 'Tipo de norma',
    ente_emisor: 'Ente emisor',
    ambito_territorial: 'Ámbito territorial',
    estado: 'Estado',
    municipio: 'Municipio',
    tipo_tribunal: 'Tipo de tribunal',
    sala_tsj: 'Sala TSJ',
    magistrado_tsj: 'Magistrado',
    tribunal_nacional: 'Tribunal',
    tribunal_municipal: 'Tribunal',
    numero_sentencia: 'N.º de sentencia',
    numero_expediente: 'N.º de expediente',
    tipo_corte: 'Tipo de corte',
    pais: 'País',
    demandante: 'Demandante',
    demandado: 'Demandado',
    autor: 'Autor',
    fecha_publicacion: 'Fecha de publicación',
};

export function getMacroTipoLabel(macroTipo: MacroTipoDocumento | string): string {
    return MACRO_TIPO_OPTIONS.find((m) => m.value === macroTipo)?.label ?? macroTipo;
}

export function formatPublishedFecha(value: string | null | undefined): string {
    if (!value) return '—';
    const parsed = parseISO(value);
    if (!isValid(parsed)) return '—';
    return format(parsed, "d 'de' MMMM yyyy", { locale: es });
}

export function getPublishedDocumentTitle(doc: Documento): string {
    return (doc.tituloBreve || doc.tituloIntegro || 'Sin título').trim();
}

export function getPublishedDocumentSubtitle(doc: Documento): string | null {
    const breve = doc.tituloBreve?.trim();
    const integro = doc.tituloIntegro?.trim();
    if (breve && integro && breve !== integro) return integro;
    return null;
}

export function getPublishedDocumentSummary(doc: Documento): string {
    return (doc.resumenCorto || doc.resumenDescriptivo || '').trim();
}

export function getPublishedEtiquetaNombres(doc: Documento): string[] {
    return (doc.etiquetas ?? []).map((e) => e.etiqueta?.nombre?.trim()).filter((n): n is string => Boolean(n));
}

/** Campos resumidos para la card del listado. */
export function getPublishedCardFields(doc: Documento): BibliotecaPublishedField[] {
    const fields: BibliotecaPublishedField[] = [
        { label: 'Emisor', value: doc.enteEmisor?.trim() || '—' },
        { label: 'Fecha', value: formatPublishedFecha(doc.fechaPublicacion) },
    ];

    const etiquetas = getPublishedEtiquetaNombres(doc);
    if (etiquetas.length > 0) {
        fields.push({ label: 'Etiquetas', value: etiquetas.slice(0, 4).join(', ') });
    }

    return fields;
}

function humanizeParamKey(key: string): string {
    return PARAM_LABELS[key] ?? key.replace(/_/g, ' ');
}

/** Campos completos para el modal de detalle. */
export function getPublishedDetailFields(doc: Documento): BibliotecaPublishedField[] {
    const fields: BibliotecaPublishedField[] = [
        { label: 'Tipo', value: getMacroTipoLabel(doc.macroTipo) },
        { label: 'Título íntegro', value: doc.tituloIntegro?.trim() || '—' },
        { label: 'Título breve', value: doc.tituloBreve?.trim() || '—' },
        { label: 'Ente emisor', value: doc.enteEmisor?.trim() || '—' },
        { label: 'Fecha de publicación', value: formatPublishedFecha(doc.fechaPublicacion) },
    ];

    if (doc.categorias?.trim()) {
        fields.push({ label: 'Categorías', value: doc.categorias.trim() });
    }
    if (doc.palabrasClave?.trim()) {
        fields.push({ label: 'Palabras clave', value: doc.palabrasClave.trim() });
    }

    const etiquetas = getPublishedEtiquetaNombres(doc);
    if (etiquetas.length > 0) {
        fields.push({ label: 'Etiquetas', value: etiquetas.join(', ') });
    }

    const params = doc.parametrosEspecificos || {};
    for (const [key, raw] of Object.entries(params)) {
        if (raw === undefined || raw === null) continue;
        const value = String(raw).trim();
        if (!value) continue;
        // Evitar duplicar ente/fecha si ya están en columnas top-level
        if (key === 'ente_emisor' || key === 'fecha_publicacion') continue;
        fields.push({ label: humanizeParamKey(key), value });
    }

    return fields;
}

export function getPublishedPreviewUrl(doc: Documento): string | null {
    const preview = doc.previewUrl?.trim();
    if (preview) return preview;
    const archivo = doc.archivoUrl?.trim();
    return archivo || null;
}
