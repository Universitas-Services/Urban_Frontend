export const APP_CONFIG = {
    DOCUMENT_TITLE: 'Consultor IA - Derecho Urbanístico',
    ADMIN_DOCUMENT_TITLE: 'Panel - Consultor IA - Derecho Urbanístico',
    PROJECT_NAME: 'Ius Urbano',
    PROJECT_LOGO_URL: '/asset/LOGO UNIVERSITAS LEGAL (BLANCO).png',
    AUTH_LANDING_LOGO_URL: '/asset/icons_12 copia 3.png',
    FAVICON_URL: '/asset/icons_12 copia.png',
    SIDEBAR_LOGO_URL: '/asset/Historico_12 copia 5.png',
    AGENT_NAME: 'Consultor IA',
    AGENT_WELCOME_INTRO:
        'Soy un agente IA experto en Derecho Urbanístico. Estoy aquí para resolver tus dudas jurídicas, apoyarte en la planificación territorial y asegurar el cumplimiento normativo.',
    AGENT_DESCRIPTION: '¿En qué puedo ayudarte hoy?',
    AGENT_AVATAR_URL: '/asset/LOS_URBANOS.png',
    API_BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? '',
} as const;
