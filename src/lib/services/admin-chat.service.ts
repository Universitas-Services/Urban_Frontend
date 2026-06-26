'use server';

import { getAuthHeader } from '@/lib/auth/session';
import type { AdminChatConversation, AdminChatMessage, ApiChatDetail, ApiChatUser } from '@/types/admin-chat.types';

const API = process.env.API_URL;

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const message = Array.isArray(err.message) ? err.message[0] : err.message || err.error || 'Error del servidor';
        throw new Error(message);
    }
    return res.json();
}

export async function getAdminChatConversationsAction(
    page = 1,
    limit = 10,
    search?: string
): Promise<AdminChatConversation[]> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);

    const res = await fetch(`${API}/ai/admin/users?${params}`, {
        headers: await getAuthHeader(),
        cache: 'no-store',
    });

    const data = await handleResponse<
        ApiChatUser[] | { data?: ApiChatUser[]; users?: ApiChatUser[]; items?: ApiChatUser[] }
    >(res);

    const usersData: ApiChatUser[] = Array.isArray(data) ? data : data?.data || data?.users || data?.items || [];

    return usersData.map((apiUser) => ({
        id: apiUser.id,
        user: {
            id: apiUser.id,
            name: apiUser.nombreCompleto || `${apiUser.nombre} ${apiUser.apellido}`.trim(),
            email: apiUser.email,
            avatar: '',
            status: 'offline' as const,
        },
        lastMessage: apiUser.ultimoMensaje?.texto || 'Sin mensajes',
        lastMessageTime: apiUser.ultimoMensaje?.timestamp || apiUser.ultimaActividad,
        unreadCount: 0,
    }));
}

export async function getAdminChatMessagesAction(userId: string): Promise<AdminChatMessage[]> {
    const res = await fetch(`${API}/ai/admin/users/${userId}/conversations`, {
        headers: await getAuthHeader(),
        cache: 'no-store',
    });

    const data = await handleResponse<ApiChatDetail>(res);

    return data.conversacion.map((msg) => ({
        id: msg.id,
        senderId: msg.tipo === 'usuario' ? userId : 'bot',
        content: msg.contenido,
        timestamp: msg.timestamp,
        isMine: msg.tipo === 'bot',
    }));
}
