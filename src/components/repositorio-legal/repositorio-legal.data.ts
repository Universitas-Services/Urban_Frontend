export type LegalDocType = 'Ley Orgánica' | 'Ley Ordinaria' | 'Norma General' | 'Reglamento' | 'Resolución';

export type RepositorioLegalDocumento = {
    id: string;
    legalType: LegalDocType;
    title: string;
    description?: string;
    downloadLink?: string;
};

export const REPOSITORIO_LEGAL_INTRO = {
    badge: 'Repositorio legal',
    title: 'Repositorio Legal',
    description:
        'Consulte las normas fundamentales del Derecho Urbanístico venezolano: leyes orgánicas, reformas y reglamentos que sustentan la ordenación del territorio y el desarrollo urbano local.',
};

export const REPOSITORIO_LEGAL_DOCUMENTOS: RepositorioLegalDocumento[] = [
    {
        id: 'ley-ordenacion-territorio',
        legalType: 'Ley Orgánica',
        title: 'Ley Orgánica para la Ordenación del Territorio',
        description:
            'Establece las disposiciones que rigen el proceso de ordenación del territorio nacional, alineándolo con la estrategia de desarrollo económico y social a largo plazo del país.',
        downloadLink: 'https://drive.google.com/file/d/1Kop74m1ziV0_d405wxFYTqeefRqO5PZa/view?usp=sharing',
    },
    {
        id: 'ley-ordenacion-urbanistica',
        legalType: 'Ley Orgánica',
        title: 'Ley Orgánica de Ordenación Urbanística',
        description:
            'Regula el desarrollo urbanístico en Venezuela para asegurar el crecimiento ordenado y armónico de los centros poblados.',
        downloadLink: 'https://drive.google.com/file/d/1xZJjb-4HSGilDVglYV84E45k0oVsVtqO/view',
    },
    {
        id: 'reglamento-ley-ordenacion-urbanistica',
        legalType: 'Reglamento',
        title: 'Reglamento de la Ley Orgánica de Ordenación Urbanística',
        description: 'Desarrolla los principios y normas establecidos en la Ley Orgánica de Ordenación Urbanística.',
        downloadLink: 'https://drive.google.com/file/d/1ThBcxAvFpDKovZj2UDtzXrCU7vgkoKBr/view',
    },
    {
        id: 'reforma-ley-poder-publico-municipal',
        legalType: 'Ley Orgánica',
        title: 'Ley de Reforma Parcial de la Ley Orgánica del Poder Público Municipal',
        description:
            'Regula el desarrollo urbanístico en Venezuela para asegurar el crecimiento ordenado y armónico de los centros poblados.',
        downloadLink: 'https://drive.google.com/file/d/1L3Xf9tKcCpmoWHvVebvgvCDokN4Lk87Y/view?usp=sharing',
    },
];
