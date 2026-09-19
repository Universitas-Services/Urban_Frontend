import type { MacroTipoDocumento } from '@/lib/services/documents.service';

export const MACRO_TIPO_OPTIONS: { value: MacroTipoDocumento; label: string }[] = [
    { value: 'LEGISLACION', label: 'Legislación' },
    { value: 'ORDENANZA', label: 'Ordenanzas' },
    { value: 'INSTRUMENTO_INTERNACIONAL', label: 'Instrumentos internacionales' },
    { value: 'SENTENCIA', label: 'Sentencias' },
    { value: 'SENTENCIA_INTERNACIONAL', label: 'Sentencias internacionales' },
    { value: 'DOCTRINA', label: 'Doctrina' },
];

export const TIPOS_NORMA_LEGISLACION = [
    'Ley especial',
    'Ley orgánica',
    'Ley ordinaria',
    'Código',
    'Decreto ley',
    'Reglamento',
    'Norma general',
    'Ley constitucional',
    'Resolución',
    'Providencia',
    'Decreto',
];

export const TIPOS_NORMA_INSTRUMENTO = ['Pacto', 'Carta', 'Resolución', 'Convención', 'Declaración'];

export const AMBITOS_TERRITORIALES = ['Nacional', 'Estadal'];

export const TIPOS_TRIBUNAL = ['TSJ', 'Tribunales Nacionales', 'Tribunales Municipales'];

export const SALAS_TSJ = [
    'Sala Plena',
    'Sala Constitucional',
    'Sala Político - Administrativo',
    'Sala Electoral',
    'Sala de Casación Civil',
    'Sala de Casación Penal',
    'Sala de Casación Social',
];

export const TIPOS_CORTE = [
    'Corte Interamericana de Derechos Humanos',
    'Tribunal Europeo de Derechos Humanos',
    'Tribunal Supremo de Justicia Español',
    'Corte Constitucional de Colombia',
    'Consejo de Estado de Bogotá',
];

export const PAISES_CIDH = [
    'Venezuela',
    'Colombia',
    'Perú',
    'Ecuador',
    'Chile',
    'México',
    'Panamá',
    'Guatemala',
    'Costa Rica',
    'Nicaragua',
] as const;

/** ISO 3166-1 alpha-2 para banderas (country-flag-icons). */
export const PAISES_CIDH_ISO: Record<(typeof PAISES_CIDH)[number], string> = {
    Venezuela: 'VE',
    Colombia: 'CO',
    Perú: 'PE',
    Ecuador: 'EC',
    Chile: 'CL',
    México: 'MX',
    Panamá: 'PA',
    Guatemala: 'GT',
    'Costa Rica': 'CR',
    Nicaragua: 'NI',
};

export const TIPOS_DOCTRINA = [
    'Libro',
    'Ensayo',
    'Ponencia',
    'Artículo científico',
    'Artículo de opinión',
    'Revista',
    'Dossier',
    'Dictamen',
    'Pronunciamiento',
    'Investigaciones académicas',
];

export const ESTADO_LABELS: Record<string, string> = {
    PENDIENTE_REVISION: 'Pendiente de revisión',
    PUBLICADO: 'Publicado',
    RECHAZADO: 'Observado / Rechazado',
};

/** Límite de PDF alineado con multer en el backend (50 MB). */
export const MAX_DOCUMENT_PDF_BYTES = 50 * 1024 * 1024;
export const MAX_DOCUMENT_PDF_LABEL = '50 MB';

export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
