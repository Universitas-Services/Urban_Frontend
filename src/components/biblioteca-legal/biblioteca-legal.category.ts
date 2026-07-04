import { BIBLIOTECA_LEGAL_CATEGORIES } from './biblioteca-legal.data';
import type { BibliotecaLegalDocumento } from './biblioteca-legal.types';

const VALID_CATEGORY_IDS = new Set(BIBLIOTECA_LEGAL_CATEGORIES.map((c) => c.id));

const TIPO_NORMA_TO_SLUG: Record<string, string> = {
    legislacion: 'legislacion',
    legislación: 'legislacion',
    ordenanza: 'ordenanzas',
    ordenanzas: 'ordenanzas',
    doctrina: 'doctrina',
    'sentencias nacionales': 'sentencias-nacionales',
    'sentencia nacional': 'sentencias-nacionales',
    'sentencias internacionales': 'sentencias-internacionales',
    'sentencia internacional': 'sentencias-internacionales',
    'instrumentos internacionales': 'instrumentos-internacionales',
    'instrumento internacional': 'instrumentos-internacionales',
};

function normalizeSlug(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function isValidCategorySlug(slug: string): boolean {
    return VALID_CATEGORY_IDS.has(slug);
}

export function resolveBibliotecaCategorySlug(gcpFileName: string, tipoNorma: string | null): string | null {
    const pathMatch = gcpFileName.match(/derecho-urbanistico\/([^/]+)/i);
    if (pathMatch) {
        const segment = normalizeSlug(pathMatch[1]);
        if (isValidCategorySlug(segment)) {
            return segment;
        }
    }

    if (tipoNorma) {
        const normalized = normalizeSlug(tipoNorma);
        const mapped = TIPO_NORMA_TO_SLUG[normalized];
        if (mapped && isValidCategorySlug(mapped)) {
            return mapped;
        }
    }

    return null;
}

export function filterDocumentosByCategory(
    documentos: BibliotecaLegalDocumento[],
    categoryId: string
): BibliotecaLegalDocumento[] {
    return documentos.filter((doc) => doc.categorySlug === categoryId);
}

export function countDocumentosByCategory(documentos: BibliotecaLegalDocumento[]): Record<string, number> {
    const counts: Record<string, number> = {};

    for (const category of BIBLIOTECA_LEGAL_CATEGORIES) {
        counts[category.id] = 0;
    }

    for (const doc of documentos) {
        if (doc.categorySlug && counts[doc.categorySlug] !== undefined) {
            counts[doc.categorySlug] += 1;
        }
    }

    return counts;
}
