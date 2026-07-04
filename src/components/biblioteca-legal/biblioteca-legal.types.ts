export type BibliotecaLegalCategoriaMateria = {
    id: string;
    nombre: string;
};

export type BibliotecaLegalMetadatos = {
    autor?: string | null;
    edicion?: string | null;
    editorial?: string | null;
    anioPublicacion?: number | null;
    nombreRevista?: string | null;
    rango?: string | null;
    numeroGaceta?: string | null;
    ambitoGeografico?: string | null;
    fechaPromulgacion?: string | null;
};

export type BibliotecaLegalDocumento = {
    id: string;
    titulo: string;
    descripcion: string;
    gcpFileName: string;
    fechaPublicacion: string;
    numeroGaceta: string | null;
    municipio: string | null;
    tipoNorma: string | null;
    enteEmisor: string | null;
    pais: string | null;
    resumen: string | null;
    estadoPublicacion: string | null;
    ambitoGeografico: string | null;
    categoriasMateria: BibliotecaLegalCategoriaMateria[];
    categorySlug: string | null;
    metadatos: BibliotecaLegalMetadatos | null;
};

export type BibliotecaLegalPreview = {
    signedUrl: string;
};

export type BibliotecaLegalSortBy = 'recientes' | 'antiguos' | 'alfabetico';

export type BibliotecaLegalMateriaOption = {
    value: string;
    label: string;
};
