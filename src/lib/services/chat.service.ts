'use server';

import type { Conversation, Message } from '@/types/chat.types';
import { getAuthHeader } from '@/lib/auth/session';

const API = process.env.API_URL;

interface RawApiMessage {
    id?: string;
    tipo?: string;
    contenido?: string;
    timestamp?: string;
    sessionId?: string;
}

interface RawMessagePair {
    id?: string;
    userMessage?: string;
    botResponse?: string;
    createdAt?: string;
}

function extractRawApiMessages(data: unknown): RawApiMessage[] {
    if (!data || typeof data !== 'object') return [];

    const payload = data as {
        conversacion?: RawApiMessage[];
        agrupadoPorFecha?: Record<string, RawApiMessage[]>;
        mensajes?: RawApiMessage[] | RawMessagePair[];
    };

    if (Array.isArray(payload.conversacion)) {
        return payload.conversacion;
    }

    if (payload.agrupadoPorFecha) {
        return Object.values(payload.agrupadoPorFecha).flat();
    }

    if (Array.isArray(payload.mensajes)) {
        return payload.mensajes as RawApiMessage[];
    }

    if (Array.isArray(data)) {
        return data as RawApiMessage[];
    }

    return [];
}

function truncateTitle(text: string, maxLength = 48): string {
    const normalized = text.trim();
    if (normalized.length <= maxLength) return normalized;
    return `${normalized.slice(0, maxLength).trim()}…`;
}

function mapApiMessagesToConversations(messages: RawApiMessage[]): Conversation[] {
    const sessions = new Map<string, RawApiMessage[]>();

    for (const message of messages) {
        const sessionId = message.sessionId;
        if (!sessionId) continue;

        const sessionMessages = sessions.get(sessionId) ?? [];
        sessionMessages.push(message);
        sessions.set(sessionId, sessionMessages);
    }

    const conversations: Conversation[] = [];

    for (const [sessionId, sessionMessages] of sessions) {
        const sortedMessages = [...sessionMessages].sort(
            (a, b) => new Date(a.timestamp ?? 0).getTime() - new Date(b.timestamp ?? 0).getTime()
        );

        const userMessages = sortedMessages.filter((message) => message.tipo === 'usuario');
        if (userMessages.length === 0) continue;

        const firstUserMessage = userMessages[0];
        const lastMessage = sortedMessages[sortedMessages.length - 1];

        conversations.push({
            id: sessionId,
            title: truncateTitle(firstUserMessage.contenido ?? 'Conversación'),
            lastMessage: lastMessage.contenido ?? '',
            lastMessageAt: lastMessage.timestamp ?? new Date().toISOString(),
            messageCount: userMessages.length,
        });
    }

    return conversations.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
}

function mapFlatApiMessagesToMessages(messages: RawApiMessage[], conversationId: string): Message[] {
    return [...messages]
        .filter((message) => !message.sessionId || message.sessionId === conversationId)
        .sort((a, b) => new Date(a.timestamp ?? 0).getTime() - new Date(b.timestamp ?? 0).getTime())
        .map((message) => ({
            id: message.id ?? crypto.randomUUID(),
            conversationId: message.sessionId ?? conversationId,
            role: message.tipo === 'usuario' ? 'user' : 'assistant',
            content: message.contenido ?? '',
            createdAt: message.timestamp ?? new Date().toISOString(),
        }));
}

function mapPairedApiMessagesToMessages(pairs: RawMessagePair[], conversationId: string): Message[] {
    const messages: Message[] = [];

    pairs.forEach((pair) => {
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
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const message = Array.isArray(err.message) ? err.message[0] : err.message || err.error || 'Error del servidor';
        const httpError = new Error(message) as Error & { status: number };
        httpError.status = res.status;
        throw httpError;
    }
    if (res.status === 204) return undefined as T;
    const text = await res.text();
    if (!text) return undefined as T;
    return JSON.parse(text) as T;
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
        const rawMessages = extractRawApiMessages(data);

        return mapApiMessagesToConversations(rawMessages);
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
        const rawMessages = extractRawApiMessages(data);

        if (rawMessages.some((message) => message.tipo && message.contenido !== undefined)) {
            return mapFlatApiMessagesToMessages(rawMessages, conversationId);
        }

        const pairedMessages = (data as { mensajes?: RawMessagePair[] })?.mensajes ?? [];
        if (Array.isArray(pairedMessages) && pairedMessages.length > 0) {
            return mapPairedApiMessagesToMessages(pairedMessages, conversationId);
        }

        return [];
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

export async function deleteConversationService(sessionId: string): Promise<void> {
    const res = await fetch(`${API}/ai/conversations/${sessionId}`, {
        method: 'DELETE',
        headers: await getAuthHeader(),
        cache: 'no-store',
    });

    await handleResponse<void>(res);
}
