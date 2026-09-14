export const APP_CONFIG = {
    DOCUMENT_TITLE: 'Consultor IA - Derecho Urbanístico',
    ADMIN_DOCUMENT_TITLE: 'Panel | Ius Urbano',
    PROJECT_NAME: 'Ius Urbano',
    PROJECT_LOGO_URL: '/asset/LOGO UNIVERSITAS LEGAL (BLANCO).png',
    AUTH_LANDING_LOGO_URL: '/asset/logo_def.png',
    FAVICON_URL: '/asset/icons_12 copia.png',
    SIDEBAR_LOGO_URL: '/asset/Sidebar_def.png',
    AGENT_NAME: 'Consultor IA',
    /** Si es true, bloquea el agente para usuarios comunes (USER). */
    AGENT_UNDER_CONSTRUCTION: false,
    AGENT_WELCOME_INTRO: '¿En qué puedo ayudarte hoy?',
    AGENT_UNDER_CONSTRUCTION_REPLY: 'En proceso de entrenamiento. Aún no puedo responder consultas; vuelve pronto.',
    AGENT_DESCRIPTION: '¿En qué puedo ayudarte hoy?',
    AGENT_AVATAR_URL: '/asset/LOS_URBANOS.png',
    API_BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? '',
} as const;
