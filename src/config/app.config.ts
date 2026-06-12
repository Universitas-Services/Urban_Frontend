export const APP_CONFIG = {
    PROJECT_NAME: 'GIRS',
    PROJECT_LOGO_URL: '/asset/LOGO UNIVERSITAS LEGAL (BLANCO).png',
    AGENT_NAME: 'GIRS',
    AGENT_DESCRIPTION: '¿En qué puedo ayudarte hoy?',
    AGENT_AVATAR_URL: '/asset/Julio-AI-Fospuca.png',
    API_BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? '',
} as const;
