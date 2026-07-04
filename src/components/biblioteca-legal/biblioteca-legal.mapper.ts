import { resolveBibliotecaCategorySlug } from './biblioteca-legal.category';
import type {
    BibliotecaLegalCategoriaMateria,
    BibliotecaLegalDocumento,
    BibliotecaLegalMetadatos,
} from './biblioteca-legal.types';

type RawRecord = Record<string, unknown>;

function normalizeKey(key: string): string {
    return key
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function buildCaseInsensitiveLookup(raw: RawRecord): Map<string, unknown> {
    const map = new Map<string, unknown>();

    for (const [key, value] of Object.entries(raw)) {
        map.set(normalizeKey(key), value);
    }

    return map;
}

function readScalar(value: unknown): string | null {
    if (value === null || value === undefined) return null;
    if (typeof value === 'string') return value.trim() || null;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (typeof value === 'object') {
        const record = value as RawRecord;
        for (const key of ['nombre', 'name', 'titulo', 'label', 'value', 'numero', 'text', 'descripcion']) {
            const nested = record[key];
            if (typeof nested === 'string' && nested.trim()) return nested.trim();
            if (typeof nested === 'number') return String(nested);
        }
    }
    return null;
}

function pickField(lookup: Map<string, unknown>, keys: string[]): string | null {
    for (const key of keys) {
        const normalized = normalizeKey(key);
        if (!lookup.has(normalized)) continue;
        const value = readScalar(lookup.get(normalized));
        if (value) return value;
    }
    return null;
}

function flattenDocumentoRecord(raw: unknown): RawRecord | null {
    if (!raw || typeof raw !== 'object') return null;

    let flat: RawRecord = { ...(raw as RawRecord) };

    for (const key of ['documento', 'document', 'item', 'attributes', 'fields', 'payload', 'metadata', 'datos']) {
        const nested = flat[key];
        if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
            flat = { ...flat, ...(nested as RawRecord) };
        }
    }

    return flat;
}

function parseMetadatos(raw: unknown): BibliotecaLegalMetadatos | null {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;

    const record = raw as RawRecord;

    return {
        autor: readScalar(record.autor),
        edicion: readScalar(record.edicion),
        editorial: readScalar(record.editorial),
        anioPublicacion: typeof record.anioPublicacion === 'number' ? record.anioPublicacion : null,
        nombreRevista: readScalar(record.nombreRevista),
        rango: readScalar(record.rango),
        numeroGaceta: readScalar(record.numeroGaceta),
        ambitoGeografico: readScalar(record.ambitoGeografico),
        fechaPromulgacion: readScalar(record.fechaPromulgacion),
    };
}

function parseCategoriasMateria(raw: unknown): BibliotecaLegalCategoriaMateria[] {
    if (!Array.isArray(raw)) return [];

    return raw
        .map((entry) => {
            if (!entry || typeof entry !== 'object') return null;
            const record = entry as RawRecord;
            const id = readScalar(record.id);
            const nombre = readScalar(record.nombre);
            if (!id || !nombre) return null;
            return { id, nombre };
        })
        .filter((entry): entry is BibliotecaLegalCategoriaMateria => entry !== null);
}

function buildDocumento(item: RawRecord, lookup: Map<string, unknown>): BibliotecaLegalDocumento | null {
    const id =
        readScalar(item.id) ??
        readScalar(item._id) ??
        pickField(lookup, ['id', '_id', 'uuid', 'documentoid', 'documento_id', 'documentId']);

    if (!id) return null;

    const coerceNullable = (value: unknown) => readScalar(value);
    const metadatos = parseMetadatos(item.metadatos);
    const resumen = coerceNullable(item.resumen) ?? pickField(lookup, ['resumen', 'summary']);
    const descripcionRaw =
        coerceNullable(item.descripcion) ??
        coerceNullable(item.description) ??
        pickField(lookup, ['descripcion', 'description']) ??
        '';
    const descripcion = descripcionRaw || resumen || '';
    const gcpFileName =
        coerceNullable(item.gcpFileName) ??
        coerceNullable(item.gcp_file_name) ??
        pickField(lookup, ['gcpfilename', 'gcp_file_name', 'filename', 'file_name', 'ruta', 'path']) ??
        '';
    const tipoNorma =
        coerceNullable(item.tipoNorma) ??
        coerceNullable(item.tipo_norma) ??
        pickField(lookup, ['tiponorma', 'tipo_norma', 'tipo']);
    const numeroGaceta =
        coerceNullable(item.numeroGaceta) ??
        coerceNullable(item.numero_gaceta) ??
        coerceNullable(item.gaceta) ??
        metadatos?.numeroGaceta ??
        pickField(lookup, [
            'numerogaceta',
            'numero_gaceta',
            'gaceta',
            'numerogacetaoficial',
            'numero_gaceta_oficial',
            'no_gaceta',
            'gaceta_numero',
        ]);
    const ambitoGeografico = metadatos?.ambitoGeografico ?? null;

    const documento: BibliotecaLegalDocumento = {
        id,
        titulo:
            readScalar(item.titulo) ??
            readScalar(item.title) ??
            pickField(lookup, ['titulo', 'title', 'nombre', 'name']) ??
            'Sin título',
        descripcion,
        gcpFileName,
        fechaPublicacion:
            coerceNullable(item.fechaPublicacion) ??
            coerceNullable(item.fecha_publicacion) ??
            pickField(lookup, ['fechapublicacion', 'fecha_publicacion', 'fecha', 'publishedat', 'published_at']) ??
            '',
        numeroGaceta,
        municipio:
            coerceNullable(item.municipio) ??
            coerceNullable(item.municipioNombre) ??
            coerceNullable(item.municipio_nombre) ??
            pickField(lookup, [
                'municipio',
                'municipionombre',
                'municipio_nombre',
                'nombremunicipio',
                'nombre_municipio',
                'localidad',
                'ciudad',
            ]),
        tipoNorma,
        enteEmisor:
            coerceNullable(item.enteEmisor) ??
            coerceNullable(item.ente_emisor) ??
            metadatos?.autor ??
            pickField(lookup, ['enteemisor', 'ente_emisor', 'emisor']),
        pais: coerceNullable(item.pais) ?? pickField(lookup, ['pais', 'country']),
        resumen,
        estadoPublicacion:
            coerceNullable(item.estado) ??
            coerceNullable(item.estadoPublicacion) ??
            pickField(lookup, ['estado', 'estadopublicacion', 'estado_publicacion']),
        ambitoGeografico,
        categoriasMateria: parseCategoriasMateria(item.categorias),
        categorySlug: null,
        metadatos,
    };

    documento.categorySlug = resolveBibliotecaCategorySlug(documento.gcpFileName, documento.tipoNorma);

    return documento;
}

export function mapRawBibliotecaDocumento(raw: unknown): BibliotecaLegalDocumento | null {
    const item = flattenDocumentoRecord(raw);
    if (!item) return null;

    const lookup = buildCaseInsensitiveLookup(item);
    return buildDocumento(item, lookup);
}

export function normalizeBibliotecaDocumentosResponse(data: unknown): BibliotecaLegalDocumento[] {
    const items = extractDocumentosArray(data);
    return items.map(mapRawBibliotecaDocumento).filter((doc): doc is BibliotecaLegalDocumento => doc !== null);
}

function extractDocumentosArray(data: unknown): unknown[] {
    if (Array.isArray(data)) return data;

    if (!data || typeof data !== 'object') return [];

    const record = data as RawRecord;

    for (const key of ['data', 'documentos', 'items', 'results', 'content', 'records', 'lista']) {
        const value = record[key];
        if (Array.isArray(value)) return value;
        if (value && typeof value === 'object') {
            const nested = extractDocumentosArray(value);
            if (nested.length > 0) return nested;
        }
    }

    return [];
}

export function normalizeBibliotecaPreviewResponse(data: unknown): string {
    if (typeof data === 'string') {
        const trimmed = data.trim();
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            return trimmed;
        }
    }

    if (!data || typeof data !== 'object') {
        throw new Error('Respuesta de previsualización inválida.');
    }

    const record = data as RawRecord;

    for (const key of ['data', 'result', 'payload', 'response']) {
        const nested = record[key];
        if (nested && typeof nested === 'object') {
            try {
                return normalizeBibliotecaPreviewResponse(nested);
            } catch {
                // continue with other keys
            }
        }
    }

    const lookup = buildCaseInsensitiveLookup(record);
    const signedUrl = pickField(lookup, [
        'signedurl',
        'signed_url',
        'signedURL',
        'url',
        'previewurl',
        'preview_url',
        'downloadurl',
        'download_url',
        'urlfirmada',
        'url_firmada',
    ]);

    if (!signedUrl) {
        throw new Error('No se recibió una URL de previsualización válida.');
    }

    return signedUrl;
}
