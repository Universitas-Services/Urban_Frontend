export const INICIO_HERO = {
    title: '¿Qué es Ius Urbano?',
    subtitle: 'Inteligencia jurídica para las ciudades del futuro',
    description:
        'Ius Urbano es una plataforma de inteligencia jurídica territorial que integra legislación, ordenanzas municipales, jurisprudencia, doctrina y herramientas de inteligencia artificial para fortalecer la toma de decisiones en materia de planificación urbana, gestión municipal y desarrollo territorial.',
    imageSrc: '/asset/home.png',
    imageAlt: 'Panorama urbano Ius Urbano',
} as const;

export const INICIO_BIBLIOTECA = {
    title: 'Biblioteca Legal',
    description: 'El repositorio especializado en Derecho Urbanístico y Ordenación Territorial.',
    accedeLabel: 'Accede a:',
    buttonLabel: 'Ir a Biblioteca Legal',
    href: '/biblioteca-legal',
} as const;

export const INICIO_CONSULTOR_IA = {
    title: 'Consultor IA',
    description: 'Realiza consultas jurídicas en lenguaje natural.',
    descriptionExtended:
        'El asistente analiza la información disponible en la Biblioteca Legal para ayudarte a localizar normas, conceptos, criterios administrativos y referencias documentales relevantes.',
    buttonLabel: 'Consultar IA',
} as const;

export const INICIO_AULA_CIUDAD = {
    title: 'Aula Ciudad',
    subtitle: 'Formación y debate sobre el derecho de las ciudades',
    description:
        'Aula Ciudad es una iniciativa académica de Universitas que promueve el análisis y la discusión del Derecho de la ciudad, y Derecho Urbanístico mediante videoconferencias y seminarios virtuales.',
    descriptionExtended:
        'Explora conferencias, entrevistas y sesiones académicas con especialistas de toda Iberoamérica.',
    buttonLabel: 'Ver Aula Ciudad',
    href: '/proyecto-ley',
} as const;

export const INICIO_BIBLIOTECA_ITEMS = [
    'Legislación nacional',
    'Ordenanzas municipales',
    'Sentencias y jurisprudencia',
    'Doctrina administrativa',
    'Estudios técnicos territoriales',
    'Instrumentos de planificación urbana',
] as const;

export const INICIO_ACTUALIDAD = {
    title: 'Actualidad Jurídica Territorial',
    description:
        'Consulta artículos, publicaciones y documentos de interés para la gestión pública y el ordenamiento territorial.',
    buttonLabel: 'Ver repositorio legal',
    href: '/repositorio-legal',
} as const;

export type InicioActualidadDestacado = {
    id: string;
    category: string;
    title: string;
    pdfPath: string;
};

export const INICIO_ACTUALIDAD_DESTACADOS: InicioActualidadDestacado[] = [
    {
        id: 'ciudades-inteligentes-privacidad',
        category: 'Artículo',
        title: 'Ciudades Inteligentes: El dilema entre privacidad de datos o bien común',
        pdfPath: '/pdfs/ciudades-inteligentes-privacidad-datos.pdf',
    },
    {
        id: 'nuevas-tendencias-derecho-urbanistico-global',
        category: 'Artículo',
        title: 'Las nuevas tendencias del Derecho Urbanístico global en el contexto de la sociedad del riesgo global. ¿Puede hablarse de un Derecho Urbanístico algorítmico, post COVID-19?',
        pdfPath: '/pdfs/nuevas-tendencias-derecho-urbanistico-global.pdf',
    },
    {
        id: 'derecho-urbanistico-inteligencia-artificial',
        category: 'Artículo',
        title: 'El Derecho Urbanístico y la Inteligencia Artificial: ¿Nuevas oportunidades para la ciudad?',
        pdfPath: '/pdfs/derecho-urbanistico-inteligencia-artificial.pdf',
    },
    {
        id: 'norma-urbanistica-plurifuncional',
        category: 'Artículo',
        title: 'La nueva norma urbanística plurifuncional. El fin del paradigma estructural de la monofuncionalidad en el Derecho Urbanístico',
        pdfPath: '/pdfs/norma-urbanistica-plurifuncional.pdf',
    },
];

export const INICIO_CONOCENOS = {
    description: 'Forma parte de nuestra comunidad de conocimiento jurídico territorial.',
    accedeLabel: 'Accede a cursos, investigaciones, publicaciones y actividades académicas especializadas en:',
    redesLabel: 'Redes sociales:',
} as const;

export const INICIO_CONOCENOS_ITEMS = [
    'Derecho Urbanístico',
    'Gestión Municipal',
    'Administración Pública',
    'Control Fiscal',
    'Desarrollo Territorial',
] as const;

export const INICIO_CONOCENOS_REDES = [
    { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/ContratarVe' },
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/universitas.legal/' },
    { id: 'threads', label: 'Threads', href: 'https://www.threads.com/@universitas.legal' },
    { id: 'x', label: 'X', href: 'https://twitter.com/contratarve' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/universitas-legal/' },
] as const;

export type InicioAccent = 'green' | 'blue' | 'gold';

export const INICIO_ACCENT_STYLES: Record<
    InicioAccent,
    {
        iconBox: string;
        icon: string;
        button: string;
        bullet: string;
    }
> = {
    green: {
        iconBox: 'icon-accent-box',
        icon: 'text-accent',
        button: 'bg-accent hover:bg-accent-hover text-on-primary',
        bullet: 'text-accent',
    },
    blue: {
        iconBox: 'bg-primary/10',
        icon: 'text-primary',
        button: 'bg-primary hover:bg-primary-hover text-on-primary',
        bullet: 'text-primary',
    },
    gold: {
        iconBox: 'bg-msg-agent-bg',
        icon: 'text-agent-accent',
        button: 'bg-agent-accent hover:bg-agent-accent-hover text-on-primary',
        bullet: 'text-agent-accent',
    },
};
