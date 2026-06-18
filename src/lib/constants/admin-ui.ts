/** Tokens visuales del panel admin alineados con la paleta Urban (sin hex sueltos). */

export type AccountStatusStyle = { label: string; color: string; bgColor: string };

export const ACCOUNT_STATUS_CONFIG: Record<string, AccountStatusStyle> = {
    POR_ACTIVAR: {
        label: 'Por Activar',
        color: 'var(--color-agent-accent)',
        bgColor: 'var(--color-msg-agent-bg)',
    },
    PRUEBA_GRATUITA: {
        label: 'Prueba Gratis',
        color: 'var(--color-primary)',
        bgColor: 'var(--color-surface-soft)',
    },
    ACTIVO: {
        label: 'Activo',
        color: 'var(--color-success)',
        bgColor: 'var(--color-accent-light)',
    },
    SUSPENDIDO: {
        label: 'Suspendido',
        color: 'var(--color-status-error)',
        bgColor: 'color-mix(in srgb, var(--color-status-error) 14%, var(--card))',
    },
    POR_PAGAR: {
        label: 'Por Pagar',
        color: 'var(--color-agent-accent)',
        bgColor: 'var(--color-msg-agent-border)',
    },
    POR_RENOVAR: {
        label: 'Por Renovar',
        color: 'var(--color-primary)',
        bgColor: 'var(--secondary)',
    },
    SUSCRITO: {
        label: 'Suscrito',
        color: 'var(--color-territorial)',
        bgColor: 'var(--color-territorial-light)',
    },
};

export const ACCOUNT_STATUS_FALLBACK: AccountStatusStyle = {
    label: 'Desconocido',
    color: 'var(--muted-foreground)',
    bgColor: 'var(--muted)',
};

export function getAccountStatusStyle(estado?: string | null): AccountStatusStyle {
    if (!estado) return ACCOUNT_STATUS_FALLBACK;
    return ACCOUNT_STATUS_CONFIG[estado] ?? { ...ACCOUNT_STATUS_FALLBACK, label: estado };
}

export const ADMIN_KPI_COLORS = {
    primary: { color: 'var(--admin-card-1-text)', bgColor: 'var(--admin-card-1-bg)' },
    territorial: { color: 'var(--color-territorial)', bgColor: 'var(--color-territorial-light)' },
    institutional: { color: 'var(--color-primary)', bgColor: 'var(--color-surface-soft)' },
    success: { color: 'var(--color-success)', bgColor: 'var(--color-accent-light)' },
    warning: { color: 'var(--color-agent-accent)', bgColor: 'var(--color-msg-agent-bg)' },
    danger: {
        color: 'var(--color-status-error)',
        bgColor: 'color-mix(in srgb, var(--color-status-error) 14%, var(--card))',
    },
} as const;

export const ADMIN_CHART_COLORS = {
    bar: 'var(--admin-chart-bar)',
    barHighlight: 'var(--admin-chart-bar-highlight)',
    publicos: 'var(--color-territorial)',
    asesores: 'var(--color-primary)',
} as const;
