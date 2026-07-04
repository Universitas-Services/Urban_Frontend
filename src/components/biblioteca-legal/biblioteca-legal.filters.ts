import type {
    BibliotecaLegalDocumento,
    BibliotecaLegalMateriaOption,
    BibliotecaLegalSortBy,
} from './biblioteca-legal.types';

type BibliotecaLegalDocumentosFilters = {
    searchQuery: string;
    estadoNombre: string | null;
    municipioNombre: string | null;
    selectedMateria: string;
};

export function formatBibliotecaFecha(fechaPublicacion: string): string {
    if (!fechaPublicacion?.trim()) return '—';

    const parsed = new Date(fechaPublicacion);
    if (Number.isNaN(parsed.getTime())) {
        return fechaPublicacion;
    }

    return parsed.toLocaleDateString('es-VE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

export function formatBibliotecaDisplayValue(value: string | null | undefined): string {
    return value?.trim() ? value.trim() : '—';
}

export function getBibliotecaDocumentoDescripcion(documento: BibliotecaLegalDocumento): string {
    return documento.descripcion.trim() || documento.resumen?.trim() || '';
}

export function getBibliotecaDocumentoReferencia(documento: BibliotecaLegalDocumento): string {
    if (documento.numeroGaceta?.trim()) {
        return `Gaceta N° ${documento.numeroGaceta.trim()}`;
    }
    if (documento.metadatos?.rango?.trim()) {
        return documento.metadatos.rango.trim();
    }
    if (documento.metadatos?.editorial?.trim()) {
        return documento.metadatos.editorial.trim();
    }
    if (documento.metadatos?.nombreRevista?.trim()) {
        return documento.metadatos.nombreRevista.trim();
    }
    if (documento.ambitoGeografico?.trim()) {
        return documento.ambitoGeografico.trim();
    }
    if (documento.pais?.trim()) {
        return documento.pais.trim();
    }
    if (documento.municipio?.trim()) {
        return documento.municipio.trim();
    }
    if (documento.categoriasMateria[0]?.nombre?.trim()) {
        return documento.categoriasMateria[0].nombre.trim();
    }
    return '—';
}

function getTerritorioHaystack(documento: BibliotecaLegalDocumento): string {
    return [documento.municipio, documento.pais, documento.ambitoGeografico].filter(Boolean).join(' ').toLowerCase();
}

export function extractMateriaOptions(documentos: BibliotecaLegalDocumento[]): BibliotecaLegalMateriaOption[] {
    const seen = new Map<string, string>();

    for (const documento of documentos) {
        for (const categoria of documento.categoriasMateria) {
            if (!seen.has(categoria.id)) {
                seen.set(categoria.id, categoria.nombre);
            }
        }
    }

    return Array.from(seen.entries())
        .map(([value, label]) => ({ value, label }))
        .sort((a, b) => a.label.localeCompare(b.label, 'es'));
}

export function filterBibliotecaLegalDocumentos(
    documentos: BibliotecaLegalDocumento[],
    { searchQuery, estadoNombre, municipioNombre, selectedMateria }: BibliotecaLegalDocumentosFilters
): BibliotecaLegalDocumento[] {
    const query = searchQuery.trim().toLowerCase();

    return documentos.filter((documento) => {
        if (selectedMateria !== 'todas') {
            const hasMateria = documento.categoriasMateria.some((c) => c.id === selectedMateria);
            if (!hasMateria) return false;
        }

        if (estadoNombre) {
            const territorioHaystack = getTerritorioHaystack(documento);
            const estadoMatch = territorioHaystack.includes(estadoNombre.toLowerCase());
            if (!estadoMatch) return false;
        }

        if (municipioNombre && municipioNombre !== 'all' && documento.municipio) {
            const municipioMatch = documento.municipio.toLowerCase().includes(municipioNombre.toLowerCase());
            if (!municipioMatch) return false;
        }

        if (!query) return true;

        const haystack = [
            documento.titulo,
            documento.descripcion,
            documento.resumen,
            documento.tipoNorma,
            documento.enteEmisor,
            documento.numeroGaceta,
            documento.metadatos?.rango,
            documento.metadatos?.editorial,
            documento.metadatos?.nombreRevista,
            documento.pais,
            documento.ambitoGeografico,
            documento.municipio,
            getBibliotecaDocumentoReferencia(documento),
            ...documento.categoriasMateria.map((c) => c.nombre),
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        return haystack.includes(query);
    });
}

export function sortBibliotecaDocumentos(
    documentos: BibliotecaLegalDocumento[],
    sortBy: BibliotecaLegalSortBy
): BibliotecaLegalDocumento[] {
    const sorted = [...documentos];

    if (sortBy === 'alfabetico') {
        return sorted.sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'));
    }

    return sorted.sort((a, b) => {
        const dateA = new Date(a.fechaPublicacion).getTime();
        const dateB = new Date(b.fechaPublicacion).getTime();
        const safeA = Number.isNaN(dateA) ? 0 : dateA;
        const safeB = Number.isNaN(dateB) ? 0 : dateB;
        return sortBy === 'recientes' ? safeB - safeA : safeA - safeB;
    });
}
