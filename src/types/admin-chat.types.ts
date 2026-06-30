export interface AdminChatUser {
    id: string;
    name: string;
    avatar: string;
    status: 'online' | 'offline' | 'busy';
    email: string;
}

export interface AdminChatMessage {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
    isMine: boolean;
}

export interface AdminChatConversation {
    id: string;
    user: AdminChatUser;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
}

export interface ApiChatUser {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    nombreCompleto: string;
    telefono: string;
    cargo: string;
    institucion: string;
    totalMensajes: number;
    totalSesiones: number;
    ultimoMensaje: {
        texto: string;
        esDelUsuario: boolean;
        timestamp: string;
    };
    ultimaActividad: string;
    createdAt: string;
}

export interface ApiChatMessage {
    id: string;
    tipo: 'usuario' | 'bot';
    contenido: string;
    timestamp: string;
    sessionId?: string;
    hora?: string;
}

export interface ApiChatDetail {
    userId: string;
    userInfo: {
        email: string;
        nombre: string;
        apellido: string;
        nombreCompleto: string;
        telefono: string;
        cargo: string;
        institucion: string;
    };
    totalMensajes: number;
    totalSesiones: number;
    conversacion: ApiChatMessage[];
    agrupadoPorFecha?: Record<string, ApiChatMessage[]>;
}

export type ChatUser = AdminChatUser;
export type ChatMessage = AdminChatMessage;
export type ChatConversation = AdminChatConversation;
