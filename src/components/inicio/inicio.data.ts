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
    href: '/biblioteca-girs',
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
        'Consulta normativa, leyes orgánicas, resoluciones y documentos de interés para la gestión pública y el ordenamiento territorial.',
    buttonLabel: 'Ver repositorio legal',
    href: '/repositorio-legal',
} as const;

export const INICIO_ACTUALIDAD_DESTACADOS = [
    {
        id: 'ley-ordenacion-territorio',
        category: 'Ley Orgánica',
        title: 'Ley Orgánica para la Ordenación del Territorio',
    },
    {
        id: 'ley-ordenacion-urbanistica',
        category: 'Ley Orgánica',
        title: 'Ley Orgánica de Ordenación Urbanística',
    },
    {
        id: 'reglamento-ley-ordenacion-urbanistica',
        category: 'Reglamento',
        title: 'Reglamento de la Ley Orgánica de Ordenación Urbanística',
    },
] as const;

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
