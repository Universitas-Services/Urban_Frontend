export const BIBLIOTECA_LEGAL_HERO = {
    title: 'Biblioteca Legal',
    subtitle: 'Derecho Urbanístico',
    description:
        'La Biblioteca Legal de Ius Urbano reúne legislación, ordenanzas, jurisprudencia, doctrina e instrumentos internacionales cuidadosamente organizados para facilitar la investigación, el análisis y la toma de decisiones en materia de Derecho Urbanístico y gestión territorial.',
    imageSrc: '/asset/Biblioteca-legal.png',
    imageAlt: 'Panorama urbano Biblioteca Legal',
} as const;

export type BibliotecaLegalCategoryAccent = 'green' | 'blue' | 'territorial' | 'orange' | 'primary-deep';

export type BibliotecaLegalCategory = {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    accent: BibliotecaLegalCategoryAccent;
};

export const BIBLIOTECA_LEGAL_CATEGORY_ACCENTS: Record<BibliotecaLegalCategoryAccent, string> = {
    green: 'biblioteca-category-icon biblioteca-category-icon--green',
    blue: 'biblioteca-category-icon biblioteca-category-icon--blue',
    territorial: 'biblioteca-category-icon biblioteca-category-icon--territorial',
    orange: 'biblioteca-category-icon biblioteca-category-icon--orange',
    'primary-deep': 'biblioteca-category-icon biblioteca-category-icon--primary-deep',
};

export function getBibliotecaCategoryIconClass(accent: BibliotecaLegalCategoryAccent): string {
    return BIBLIOTECA_LEGAL_CATEGORY_ACCENTS[accent];
}

export const BIBLIOTECA_LEGAL_CATEGORIES: BibliotecaLegalCategory[] = [
    {
        id: 'legislacion',
        title: 'Legislación',
        description:
            'Normativa nacional que regula las materias relacionadas con el Derecho Urbanístico, incluyendo leyes, decretos y demás disposiciones de alcance nacional.',
        imageSrc: '/asset/legislacion.png',
        imageAlt: 'Ilustración de legislación nacional',
        accent: 'green',
    },
    {
        id: 'ordenanzas',
        title: 'Ordenanzas',
        description:
            'Ordenanzas municipales que regulan el desarrollo urbano, el ordenamiento territorial y otras materias propias de la competencia local.',
        imageSrc: '/asset/ordenanzas.png',
        imageAlt: 'Ilustración de ordenanzas municipales',
        accent: 'green',
    },
    {
        id: 'sentencias-nacionales',
        title: 'Sentencias Nacionales',
        description:
            'Jurisprudencia emitida por el Tribunal Supremo de Justicia y demás tribunales nacionales en materias vinculadas al Derecho Urbanístico.',
        imageSrc: '/asset/Sentencias-nacionales.png',
        imageAlt: 'Ilustración de sentencias nacionales',
        accent: 'blue',
    },
    {
        id: 'sentencias-internacionales',
        title: 'Sentencias Internacionales',
        description:
            'Decisiones y opiniones de tribunales y organismos internacionales en materia de derecho urbano y derechos humanos.',
        imageSrc: '/asset/sentencias-internacionales.png',
        imageAlt: 'Ilustración de sentencias internacionales',
        accent: 'territorial',
    },
    {
        id: 'doctrina',
        title: 'Doctrina',
        description:
            'Artículos, libros y estudios especializados sobre el Derecho Urbanístico, la gestión pública territorial y el desarrollo urbano.',
        imageSrc: '/asset/doctrina.png',
        imageAlt: 'Ilustración de doctrina jurídica',
        accent: 'orange',
    },
    {
        id: 'instrumentos-internacionales',
        title: 'Instrumentos Internacionales',
        description:
            'Tratados, convenios y otros instrumentos internacionales aplicables al desarrollo urbano sostenible y la gestión territorial.',
        imageSrc: '/asset/instrumentos-internacionales.png',
        imageAlt: 'Ilustración de instrumentos internacionales',
        accent: 'primary-deep',
    },
];
