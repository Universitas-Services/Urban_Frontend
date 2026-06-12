export interface User {
    id: string;
    email: string;
    nombre?: string;
    apellido?: string;
    telefono?: string;
    name?: string; // Derived full name
    avatar?: string | null;
    createdAt?: string;
    role?: string;
    hasUnreadNews?: boolean;
    latestNews?: {
        id: string;
        title: string;
        content: string;
        createdAt: string;
    } | null;
}

export interface UserProfile {
    id: string;
    email: string;
    nombre: string | null;
    apellido: string | null;
    telefono: string | null;
    role: string;
    isEmailVerified: boolean;
    isActive: boolean;
    estado: string | null;
    municipio: string | null;
    tipo_usuario: string | null;
    nombre_ente: string | null;
    cargo: string | null;
    estatus_normativa_girs: string | null;
    profileCompleted: boolean;
    estadoCuenta?: string;
    alertaVencimiento?: {
        mensaje: string;
        diasRestantes: number;
    } | null;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    nombre: string;
    apellido?: string;
    telefono?: string;
    estado?: string;
    municipio?: string;
    tipo_usuario?: string;
    nombre_ente?: string;
    cargo?: string;
    estatus_normativa_girs?: string;
    email: string;
    password: string;
}

export interface UpdateProfileInput {
    nombre?: string;
    apellido?: string;
    telefono?: string;
    tipoUsuario?: string;
    nombre_ente?: string;
    cargo?: string;
    estatus_normativa_girs?: string;
}

export interface ChangePasswordInput {
    currentPassword?: string;
    newPassword?: string;
}
