import type { UserRole as AuthUserRole } from '@/types/roles';

export type AdminAccountRole = AuthUserRole | 'PAID_USER';

export interface AdminUserProfile {
    id: string;
    nombreEnte: string;
    cargo: string;
    plazoEntregaActa: string | null;
    estatusNormativaGirs: string;
    userId: string;
}

export interface AdminManagedUser {
    id: string;
    email: string;
    nombre: string;
    apellido: string | null;
    role: AdminAccountRole;
    telefono: string | null;
    estado: string | null;
    municipio: string | null;
    tipoUsuario: string | null;
    isEmailVerified: boolean;
    isActive: boolean;
    profileCompleted: boolean;
    createdAt: string;
    updatedAt: string;
    estadoCuenta: string;
    diasRestantes?: number;
    isExpired?: boolean;
    profile?: AdminUserProfile;
}

export interface PaginationMeta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface UsersResponse {
    data: AdminManagedUser[];
    meta: PaginationMeta;
}

export interface GetUsersParams {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
    isActive?: string;
    estado?: string;
    municipio?: string;
    tipoUsuario?: string;
    estadoCuenta?: string;
}

export interface CRMNote {
    id: string;
    userId: string;
    content: string;
    etiqueta: string | null;
    adminId: string;
    adminNombre: string;
    createdAt: string;
    updatedAt: string;
}

export interface CRMNotesResponse {
    usuario: {
        id: string;
        nombre: string;
        apellido: string | null;
        email: string;
        tipoUsuario: string;
    };
    data: CRMNote[];
    meta: PaginationMeta;
}

export interface AbandonedRegistration {
    id: string;
    email: string;
    nombre: string;
    apellido: string | null;
    telefono: string | null;
    tipoUsuario: string | null;
    registeredAt: string;
    deletedAt: string;
    notes?: CRMNote[];
}

export interface AbandonedRegistrationsResponse {
    data: AbandonedRegistration[];
    meta: PaginationMeta;
}

export interface DashboardMetrics {
    users: {
        total: number;
        active: number;
        inactive: number;
        verified: number;
        admins: number;
        byRole: { role: string; count: number }[];
        byEstadoCuenta: { estado: string; count: number }[];
    };
    chat: {
        totalMessages: number;
        totalSessions: number;
    };
    analytics: {
        porTipousuario: {
            servidoresPublicos: number;
            asesoresPrivados: number;
        };
        cuentasSuscritasActivas: number;
        suspensionesRecientes: number;
        crecimientoHoy: number;
        usuariosNoVerificados: number;
        comparativa: {
            semanal: { actual: number; anterior: number };
            mensual: { actual: number; anterior: number };
        };
        graficoCrecimiento: { etiqueta: string; cantidad: number }[];
    };
    alertas: {
        proximosAVencer: {
            id: string;
            email: string;
            nombre: string;
            apellido: string;
            tipoUsuario: string;
            createdAt: string;
        }[];
        cantidadVencimientos: number;
    };
    recentUsers: {
        id: string;
        email: string;
        nombre: string;
        apellido: string;
        tipoUsuario: string;
        estadoCuenta: string;
        createdAt: string;
    }[];
}

/** Alias para componentes migrados del admin */
export type User = AdminManagedUser;
