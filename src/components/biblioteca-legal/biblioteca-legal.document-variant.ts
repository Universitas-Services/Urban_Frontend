import { formatBibliotecaDisplayValue, formatBibliotecaFecha } from './biblioteca-legal.filters';
import type {
    BibliotecaLegalDocumento,
    BibliotecaLegalDocumentoField,
    BibliotecaLegalDocumentVariant,
} from './biblioteca-legal.types';

const VARIANT_LABELS: Record<BibliotecaLegalDocumentVariant, string> = {
    legislacion: 'Legislación',
    ordenanza: 'Ordenanza',
    'sentencia-nacional': 'Sentencia nacional',
    'sentencia-internacional': 'Sentencia internacional',
    doctrina: 'Doctrina',
    'instrumentos-internacionales': 'Instrumentos internacionales',
    generico: 'Documento',
};

function normalizeTipoNorma(tipoNorma: string | null): string {
    return (tipoNorma ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function formatCategorias(documento: BibliotecaLegalDocumento): string {
    const nombres = documento.categoriasMateria.map((c) => c.nombre.trim()).filter(Boolean);
    return nombres.length > 0 ? nombres.join(', ') : '—';
}

function getFechaOrdenanza(documento: BibliotecaLegalDocumento): string {
    const fecha = documento.fechaPublicacion || documento.metadatos?.fechaPromulgacion || '';
    return formatBibliotecaFecha(fecha);
}

export function resolveBibliotecaDocumentVariant(documento: BibliotecaLegalDocumento): BibliotecaLegalDocumentVariant {
    const tipo = normalizeTipoNorma(documento.tipoNorma);
    const rango = normalizeTipoNorma(documento.metadatos?.rango ?? null);

    if (rango === 'ordenanza') return 'ordenanza';
    if (tipo === 'jurisprudencia' && documento.metadatos?.tribunalInternacional?.trim()) {
        return 'sentencia-internacional';
    }
    if (tipo === 'jurisprudencia' && normalizeTipoNorma(documento.pais) === 'venezuela') {
        return 'sentencia-nacional';
    }
    if (tipo === 'doctrina') return 'doctrina';
    if (tipo === 'instrumentos internacionales') return 'instrumentos-internacionales';
    if (tipo === 'legislacion') return 'legislacion';

    return 'generico';
}

export function getBibliotecaDocumentVariantLabel(variant: BibliotecaLegalDocumentVariant): string {
    return VARIANT_LABELS[variant];
}

export function getBibliotecaDocumentoDisplayTitle(documento: BibliotecaLegalDocumento): string {
    const variant = resolveBibliotecaDocumentVariant(documento);

    if (variant === 'sentencia-nacional') {
        return documento.titulo.trim() || documento.tituloIntegro.trim() || 'Sin título';
    }

    return documento.tituloIntegro.trim() || documento.titulo.trim() || 'Sin título';
}

export function getBibliotecaDocumentoDisplayFields(
    documento: BibliotecaLegalDocumento
): BibliotecaLegalDocumentoField[] {
    const variant = resolveBibliotecaDocumentVariant(documento);
    const title = getBibliotecaDocumentoDisplayTitle(documento);

    switch (variant) {
        case 'ordenanza':
            return [
                { label: 'Título', value: title },
                { label: 'Fecha', value: getFechaOrdenanza(documento) },
                {
                    label: 'Estado',
                    value: formatBibliotecaDisplayValue(documento.metadatos?.estadoGeografico),
                },
                { label: 'Municipio', value: formatBibliotecaDisplayValue(documento.municipio) },
                {
                    label: 'Gaceta municipal',
                    value: formatBibliotecaDisplayValue(documento.metadatos?.numeroGacetaMunicipal),
                },
            ];
        case 'sentencia-nacional':
            return [
                { label: 'Título', value: title },
                { label: 'Fecha', value: formatBibliotecaFecha(documento.fechaPublicacion) },
                { label: 'Tribunal', value: formatBibliotecaDisplayValue(documento.enteEmisor) },
            ];
        case 'sentencia-internacional':
            return [
                { label: 'Título', value: title },
                {
                    label: 'N°',
                    value: formatBibliotecaDisplayValue(documento.metadatos?.numeroSentencia),
                },
                {
                    label: 'Tribunal',
                    value: formatBibliotecaDisplayValue(documento.metadatos?.tribunalInternacional),
                },
            ];
        case 'doctrina':
            return [
                { label: 'Título', value: title },
                {
                    label: 'Año de publicación',
                    value: documento.metadatos?.anioPublicacion ? String(documento.metadatos.anioPublicacion) : '—',
                },
                { label: 'Autor', value: formatBibliotecaDisplayValue(documento.metadatos?.autor) },
            ];
        case 'instrumentos-internacionales':
            return [
                { label: 'Título', value: title },
                { label: 'Fecha', value: formatBibliotecaFecha(documento.fechaPublicacion) },
                { label: 'Emisor', value: formatBibliotecaDisplayValue(documento.enteEmisor) },
                { label: 'Categoría', value: formatCategorias(documento) },
            ];
        case 'legislacion':
            return [
                { label: 'Título', value: title },
                { label: 'Fecha', value: formatBibliotecaFecha(documento.fechaPublicacion) },
                { label: 'Emisor', value: formatBibliotecaDisplayValue(documento.enteEmisor) },
                { label: 'Categoría', value: formatCategorias(documento) },
            ];
        default:
            return [
                { label: 'Título', value: title },
                { label: 'Fecha', value: formatBibliotecaFecha(documento.fechaPublicacion) },
                { label: 'Tipo', value: formatBibliotecaDisplayValue(documento.tipoNorma) },
            ];
    }
}
