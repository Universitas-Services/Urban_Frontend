export type LegalDocType = 'Ley Orgánica' | 'Ley Ordinaria' | 'Norma General' | 'Resolución';

export type RepositorioLegalDocumento = {
    id: string;
    legalType: LegalDocType;
    title: string;
    description?: string;
    publishDate?: string;
    gacetaNumber?: string;
    gacetaLink?: string;
    downloadLink?: string;
};

export const REPOSITORIO_LEGAL_INTRO = {
    badge: 'Marco normativo',
    title: 'Repositorio Legal',
    description:
        'Consulte las normas fundamentales del Derecho Urbanístico venezolano: leyes orgánicas, reformas y reglamentos que sustentan la ordenación del territorio y el desarrollo urbano local.',
};

export const REPOSITORIO_LEGAL_DOCUMENTOS: RepositorioLegalDocumento[] = [
    {
        id: 'ley-ordenacion-territorio',
        legalType: 'Ley Orgánica',
        title: 'Ley Orgánica para la Ordenación del Territorio',
    },
    {
        id: 'ley-ordenacion-urbanistica',
        legalType: 'Ley Orgánica',
        title: 'Ley Orgánica de Ordenación Urbanística',
    },
    {
        id: 'reforma-ley-poder-publico-municipal',
        legalType: 'Ley Ordinaria',
        title: 'Ley de Reforma Parcial de la Ley Orgánica del Poder Público Municipal',
    },
    {
        id: 'reglamento-ley-ordenacion-urbanistica',
        legalType: 'Norma General',
        title: 'Reglamento de la Ley Orgánica de Ordenación Urbanística',
    },
];
