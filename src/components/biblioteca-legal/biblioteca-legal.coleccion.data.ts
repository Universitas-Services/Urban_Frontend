import type { LucideIcon } from 'lucide-react';
import { Building2, Construction, FileText, Landmark, Megaphone, Scale, Trees, Users } from 'lucide-react';
import { BIBLIOTECA_LEGAL_CATEGORIES, type BibliotecaLegalCategory } from './biblioteca-legal.data';

export type BibliotecaLegalDocumentStatus = 'vigente' | 'parcialmente-vigente';

export type BibliotecaLegalColeccionDocumento = {
    id: string;
    title: string;
    municipio: string;
    estado: string;
    gaceta: string;
    fecha: string;
    status: BibliotecaLegalDocumentStatus;
    icon: LucideIcon;
};

export type BibliotecaLegalColeccionMeta = {
    total: number;
    perPage: number;
    currentPage: number;
    labelPlural: string;
};

const ORDENANZAS_DOCUMENTOS: BibliotecaLegalColeccionDocumento[] = [
    {
        id: 'ord-1',
        title: 'Ordenanza sobre Uso y Ocupación del Suelo',
        municipio: 'Municipio Chacao',
        estado: 'Estado Miranda',
        gaceta: 'Gaceta Municipal N° 145',
        fecha: '10/03/2023',
        status: 'vigente',
        icon: Building2,
    },
    {
        id: 'ord-2',
        title: 'Ordenanza de Protección Ambiental',
        municipio: 'Municipio Libertador',
        estado: 'Distrito Capital',
        gaceta: 'Gaceta Municipal N° 089',
        fecha: '22/01/2024',
        status: 'vigente',
        icon: Trees,
    },
    {
        id: 'ord-3',
        title: 'Ordenanza de Edificaciones y Construcciones',
        municipio: 'Municipio Maracaibo',
        estado: 'Estado Zulia',
        gaceta: 'Gaceta Municipal N° 312',
        fecha: '15/06/2022',
        status: 'vigente',
        icon: Construction,
    },
    {
        id: 'ord-4',
        title: 'Ordenanza de Participación Ciudadana',
        municipio: 'Municipio Valencia',
        estado: 'Estado Carabobo',
        gaceta: 'Gaceta Municipal N° 201',
        fecha: '08/11/2023',
        status: 'vigente',
        icon: Users,
    },
    {
        id: 'ord-5',
        title: 'Ordenanza de Ruidos y Contaminación Acústica',
        municipio: 'Municipio Baruta',
        estado: 'Estado Miranda',
        gaceta: 'Gaceta Municipal N° 178',
        fecha: '30/04/2023',
        status: 'parcialmente-vigente',
        icon: Megaphone,
    },
    {
        id: 'ord-6',
        title: 'Ordenanza de Zonificación Urbana',
        municipio: 'Municipio San Cristóbal',
        estado: 'Estado Táchira',
        gaceta: 'Gaceta Municipal N° 094',
        fecha: '19/09/2021',
        status: 'vigente',
        icon: Landmark,
    },
    {
        id: 'ord-7',
        title: 'Ordenanza de Patrimonio Histórico y Cultural',
        municipio: 'Municipio Sucre',
        estado: 'Estado Miranda',
        gaceta: 'Gaceta Municipal N° 156',
        fecha: '05/02/2024',
        status: 'vigente',
        icon: Building2,
    },
    {
        id: 'ord-8',
        title: 'Ordenanza de Vialidad y Transporte Urbano',
        municipio: 'Municipio Iribarren',
        estado: 'Estado Lara',
        gaceta: 'Gaceta Municipal N° 267',
        fecha: '14/07/2022',
        status: 'vigente',
        icon: FileText,
    },
    {
        id: 'ord-9',
        title: 'Ordenanza de Áreas Verdes y Espacios Públicos',
        municipio: 'Municipio Girardot',
        estado: 'Estado Aragua',
        gaceta: 'Gaceta Municipal N° 133',
        fecha: '27/12/2023',
        status: 'vigente',
        icon: Trees,
    },
    {
        id: 'ord-10',
        title: 'Ordenanza de Licencias y Permisos de Construcción',
        municipio: 'Municipio Maracay',
        estado: 'Estado Aragua',
        gaceta: 'Gaceta Municipal N° 219',
        fecha: '03/05/2023',
        status: 'vigente',
        icon: Construction,
    },
    {
        id: 'ord-11',
        title: 'Ordenanza de Regularización de Tierras Urbanas',
        municipio: 'Municipio Guacara',
        estado: 'Estado Carabobo',
        gaceta: 'Gaceta Municipal N° 187',
        fecha: '21/08/2022',
        status: 'parcialmente-vigente',
        icon: Scale,
    },
    {
        id: 'ord-12',
        title: 'Ordenanza de Publicidad Exterior y Señalización',
        municipio: 'Municipio El Hatillo',
        estado: 'Estado Miranda',
        gaceta: 'Gaceta Municipal N° 102',
        fecha: '16/10/2023',
        status: 'vigente',
        icon: Megaphone,
    },
];

const COLECCION_LABELS: Record<string, string> = {
    legislacion: 'documentos de legislación',
    ordenanzas: 'ordenanzas',
    'sentencias-nacionales': 'sentencias nacionales',
    'sentencias-internacionales': 'sentencias internacionales',
    doctrina: 'documentos de doctrina',
    'instrumentos-internacionales': 'instrumentos internacionales',
};

const COLECCION_TOTALS: Record<string, number> = {
    legislacion: 186,
    ordenanzas: 248,
    'sentencias-nacionales': 132,
    'sentencias-internacionales': 94,
    doctrina: 167,
    'instrumentos-internacionales': 73,
};

export function getBibliotecaLegalCategoryById(id: string): BibliotecaLegalCategory | undefined {
    return BIBLIOTECA_LEGAL_CATEGORIES.find((category) => category.id === id);
}

export function getBibliotecaLegalColeccionMeta(categoryId: string): BibliotecaLegalColeccionMeta {
    const labelPlural = COLECCION_LABELS[categoryId] ?? 'documentos';
    const total = COLECCION_TOTALS[categoryId] ?? 120;

    return {
        total,
        perPage: 12,
        currentPage: 1,
        labelPlural,
    };
}

export function getBibliotecaLegalColeccionDocumentos(categoryId: string): BibliotecaLegalColeccionDocumento[] {
    if (categoryId === 'ordenanzas') {
        return ORDENANZAS_DOCUMENTOS;
    }

    return ORDENANZAS_DOCUMENTOS.map((documento, index) => ({
        ...documento,
        id: `${categoryId}-${index + 1}`,
        title: documento.title.replace('Ordenanza', 'Documento'),
    }));
}

type BibliotecaLegalColeccionFilters = {
    searchQuery: string;
    estadoNombre: string | null;
    municipioNombre: string | null;
};

export function filterBibliotecaLegalColeccionDocumentos(
    documentos: BibliotecaLegalColeccionDocumento[],
    { searchQuery, estadoNombre, municipioNombre }: BibliotecaLegalColeccionFilters
): BibliotecaLegalColeccionDocumento[] {
    const query = searchQuery.trim().toLowerCase();

    return documentos.filter((documento) => {
        if (estadoNombre) {
            const estadoMatch = documento.estado.toLowerCase().includes(estadoNombre.toLowerCase());
            if (!estadoMatch) return false;
        }

        if (municipioNombre && municipioNombre !== 'all') {
            const municipioMatch = documento.municipio.toLowerCase().includes(municipioNombre.toLowerCase());
            if (!municipioMatch) return false;
        }

        if (!query) return true;

        const haystack = [documento.title, documento.municipio, documento.estado, documento.gaceta]
            .join(' ')
            .toLowerCase();

        return haystack.includes(query);
    });
}
