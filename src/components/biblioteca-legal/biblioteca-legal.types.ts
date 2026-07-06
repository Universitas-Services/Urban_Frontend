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
    numeroGacetaMunicipal?: string | null;
    ambitoGeografico?: string | null;
    fechaPromulgacion?: string | null;
    estadoGeografico?: string | null;
    municipio?: string | null;
    sala?: string | null;
    fechaSentencia?: string | null;
    numeroSentencia?: string | null;
    tribunalInternacional?: string | null;
    organismoInternacional?: string | null;
};

export type BibliotecaLegalDocumentVariant =
    | 'legislacion'
    | 'ordenanza'
    | 'sentencia-nacional'
    | 'sentencia-internacional'
    | 'doctrina'
    | 'instrumentos-internacionales'
    | 'generico';

export type BibliotecaLegalDocumentoField = {
    label: string;
    value: string;
};

export type BibliotecaLegalDocumento = {
    id: string;
    titulo: string;
    tituloIntegro: string;
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

export type BibliotecaLegalDocumentosQuery = {
    search?: string;
    page?: number;
    limit?: number;
};

export type BibliotecaLegalDocumentosResponse = {
    items: BibliotecaLegalDocumento[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type BibliotecaLegalPreview = {
    signedUrl: string;
};

export type BibliotecaLegalSortBy = 'recientes' | 'antiguos' | 'alfabetico';

export type BibliotecaLegalMateriaOption = {
    value: string;
    label: string;
};
