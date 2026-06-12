'use server';

import type { Conversation, Message } from '@/types/chat.types';
import { getAuthHeader } from '@/lib/auth/session';

const API = process.env.API_URL;

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const message = Array.isArray(err.message) ? err.message[0] : err.message || err.error || 'Error del servidor';
        const httpError = new Error(message) as Error & { status: number };
        httpError.status = res.status;
        throw httpError;
    }
    return res.json();
}

// ─── Conversaciones ───────────────────────────────────────────────────────────

export async function getConversationsService(): Promise<Conversation[]> {
    try {
        const res = await fetch(`${API}/ai/conversations`, {
            headers: await getAuthHeader(),
            cache: 'no-store',
        });

        if (!res.ok) return [];

        const data = await res.json();

        let rawData: Conversation[] = data?.conversacion;

        if (!rawData && data?.agrupadoPorFecha) {
            rawData = (Object.values(data.agrupadoPorFecha) as Conversation[][]).flat();
        }

        return Array.isArray(rawData) ? rawData : [];
    } catch {
        return [];
    }
}

export async function getMessagesService(conversationId: string): Promise<Message[]> {
    try {
        const res = await fetch(`${API}/ai/conversations/${conversationId}`, {
            headers: await getAuthHeader(),
            cache: 'no-store',
        });

        if (!res.ok) return [];

        const data = await res.json();
        const rawMessages = data?.mensajes ?? (Array.isArray(data) ? data : []);

        const messages: Message[] = [];

        interface RawPair {
            id?: string;
            userMessage?: string;
            botResponse?: string;
            createdAt?: string;
        }

        rawMessages.forEach((pair: RawPair) => {
            const baseTime = new Date(pair.createdAt || Date.now());
            const botTime = new Date(baseTime.getTime() + 1000);

            if (pair.userMessage) {
                messages.push({
                    id: `${pair.id || crypto.randomUUID()}-user`,
                    conversationId,
                    role: 'user',
                    content: pair.userMessage,
                    createdAt: baseTime.toISOString(),
                });
            }

            if (pair.botResponse) {
                messages.push({
                    id: `${pair.id || crypto.randomUUID()}-bot`,
                    conversationId,
                    role: 'assistant',
                    content: pair.botResponse,
                    createdAt: botTime.toISOString(),
                });
            }
        });

        return messages;
    } catch {
        return [];
    }
}

export async function sendMessageService(sessionId: string, message: string): Promise<Message> {
    const res = await fetch(`${API}/ai/message`, {
        method: 'POST',
        headers: await getAuthHeader(),
        body: JSON.stringify({ sessionId, message }),
        cache: 'no-store',
    });

    const reply = await handleResponse<{
        respuesta?: string;
        response?: string;
        message?: string;
        sessionId?: string;
        timestamp?: string;
    }>(res);

    const content = reply.respuesta || reply.response || reply.message || '...';

    return {
        id: crypto.randomUUID(),
        conversationId: reply.sessionId ?? sessionId,
        role: 'assistant',
        content,
        createdAt: reply.timestamp ?? new Date().toISOString(),
    };
}

export async function createConversationService(): Promise<Conversation> {
    return {
        id: crypto.randomUUID(),
        title: 'Nueva conversación',
        lastMessage: '',
        lastMessageAt: new Date().toISOString(),
        messageCount: 0,
    };
}
