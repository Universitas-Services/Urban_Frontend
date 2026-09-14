export const TIPO_USUARIO = {
    SERVIDOR_PUBLICO: 'SERVIDOR_PUBLICO',
    ASESOR_PRIVADO: 'ASESOR_PRIVADO',
    CIUDADANO: 'CIUDADANO',
} as const;

export type TipoUsuario = (typeof TIPO_USUARIO)[keyof typeof TIPO_USUARIO];

/** Misma lógica de prueba/pago/días que asesor privado */
export function isTipoSuscripcion(tipo: string | null | undefined): boolean {
    return tipo === TIPO_USUARIO.ASESOR_PRIVADO || tipo === TIPO_USUARIO.CIUDADANO;
}

export function labelTipoUsuario(tipo: string | null | undefined): string {
    switch (tipo) {
        case TIPO_USUARIO.SERVIDOR_PUBLICO:
            return 'Servidor Público';
        case TIPO_USUARIO.ASESOR_PRIVADO:
            return 'Asesor';
        case TIPO_USUARIO.CIUDADANO:
            return 'Ciudadano';
        default:
            return tipo || '—';
    }
}
