import { Conversation, Message } from '@/types/chat.types';
import { api } from '@/lib/api/axios.instance';

export const chatService = {
    getConversations: async (): Promise<Conversation[]> => {
        try {
            const response = await api.get('/ai/conversations');

            // The backend returns an array in response.data.conversacion
            // OR an object in response.data.agrupadoPorFecha
            let rawData = response.data?.conversacion;

            if (!rawData && response.data?.agrupadoPorFecha) {
                // Flatten the grouped object into a single array
                rawData = Object.values(response.data.agrupadoPorFecha).flat();
            }

            if (!Array.isArray(rawData)) {
                return [];
            }

            interface RawConversationMessage {
                sessionId?: string;
                tipo?: string;
                role?: string;
                contenido?: string;
                message?: string;
                content?: string;
                timestamp?: string;
                createdAt?: string;
            }

            // We need to extract unique conversations based on sessionId
            // because the backend returns individual messages here.
            const uniqueSessions = new Map<string, Conversation>();
            rawData.forEach((msg: RawConversationMessage) => {
                const isUserMessage = msg.tipo === 'usuario' || msg.tipo === 'user';
                const messageText = msg.contenido || 'Sin mensajes';

                if (msg.sessionId) {
                    if (!uniqueSessions.has(msg.sessionId)) {
                        // First time seeing this session, initialize with this message
                        uniqueSessions.set(msg.sessionId, {
                            id: msg.sessionId,
                            title: isUserMessage
                                ? messageText.substring(0, 30) + (messageText.length > 30 ? '...' : '')
                                : 'Nueva Conversación',
                            lastMessage: messageText,
                            lastMessageAt: msg.timestamp || new Date().toISOString(),
                            messageCount: 1,
                        });
                    } else {
                        // We already have this session, update it if this message is newer
                        const existing = uniqueSessions.get(msg.sessionId)!;
                        const msgDate = new Date(msg.timestamp || 0).getTime();
                        const existingDate = new Date(existing.lastMessageAt).getTime();

                        // If we find an older message and the current title is generic, update title to the first user question
                        if (msgDate < existingDate && isUserMessage && existing.title === 'Nueva Conversación') {
                            existing.title = messageText.substring(0, 30) + (messageText.length > 30 ? '...' : '');
                        }

                        // If this message is newer, it becomes the last message
                        if (msgDate > existingDate) {
                            if (!isUserMessage || existing.lastMessage === 'Sin mensajes') {
                                existing.lastMessage = messageText;
                            }
                            existing.lastMessageAt = msg.timestamp || new Date().toISOString();

                            // Also try to grab a better title if it's the newest user message and we don't have one
                            if (isUserMessage && existing.title === 'Nueva Conversación') {
                                existing.title = messageText.substring(0, 30) + (messageText.length > 30 ? '...' : '');
                            }
                        }

                        existing.messageCount += 1;
                    }
                }
            });

            // Sort by latest message first
            const grouped = Array.from(uniqueSessions.values());
            return grouped.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
        } catch (error) {
            const err = error as { response?: { status?: number } };
            // Evitamos imprimir en consola si es error 403 (suspensión) para no detonar el Overlay de Next.js
            if (err?.response?.status !== 403 && err?.response?.status !== 401) {
                console.error('Error fetching conversations:', error);
            }
            return [];
        }
    },

    getMessages: async (id: string): Promise<Message[]> => {
        try {
            const response = await api.get(`/ai/conversations/${id}`);
            // The backend returns an array of { userMessage, botResponse, createdAt } objects
            const rawMessages = response.data?.mensajes || (Array.isArray(response.data) ? response.data : []);

            const messages: Message[] = [];

            interface RawMessagePair {
                id?: string;
                userMessage?: string;
                botResponse?: string;
                createdAt?: string;
            }

            rawMessages.forEach((pair: RawMessagePair) => {
                // Determine base timestamp
                const baseTime = new Date(pair.createdAt || Date.now());
                const botTime = new Date(baseTime.getTime() + 1000); // add 1 sec for bot to preserve UI order

                // 1. Add User Message
                if (pair.userMessage) {
                    messages.push({
                        id: `${pair.id || crypto.randomUUID()}-user`,
                        conversationId: id,
                        role: 'user',
                        content: pair.userMessage,
                        createdAt: baseTime.toISOString(),
                    });
                }

                // 2. Add Bot Response
                if (pair.botResponse) {
                    messages.push({
                        id: `${pair.id || crypto.randomUUID()}-bot`,
                        conversationId: id,
                        role: 'assistant',
                        content: pair.botResponse,
                        createdAt: botTime.toISOString(),
                    });
                }
            });

            return messages;
        } catch (error) {
            const err = error as { response?: { status?: number } };
            if (err?.response?.status !== 403 && err?.response?.status !== 401) {
                console.error('Error fetching messages for session', id, error);
            }
            return [];
        }
    },

    sendMessage: async (id: string, content: string): Promise<Message> => {
        // Send the user message payload
        const response = await api.post('/ai/message', {
            sessionId: id,
            message: content,
        });

        const reply = response.data;

        // The user says new messages get "..." meaning our current actualReplyContent parsing
        // fails to find the right property. Let's make it very robust.
        let actualReplyContent = '...';

        if (typeof reply === 'string') {
            actualReplyContent = reply;
        } else if (reply) {
            actualReplyContent =
                reply.respuesta ||
                reply.response ||
                reply.message ||
                reply.botResponse ||
                reply.content ||
                reply.contenido ||
                (typeof reply.data === 'string' ? reply.data : '...');
        }

        return {
            id: crypto.randomUUID(), // Bot reply ID
            conversationId: typeof reply === 'object' && reply?.sessionId ? reply.sessionId : id,
            role: 'assistant',
            content: actualReplyContent,
            createdAt: typeof reply === 'object' && reply?.timestamp ? reply.timestamp : new Date().toISOString(),
        };
    },

    createConversation: async (): Promise<Conversation> => {
        // Generate a real client-side UUID for the new session
        // until the first message is sent which persists it on the backend
        const newId = crypto.randomUUID();
        return {
            id: newId,
            title: 'Nueva conversación',
            lastMessage: '',
            lastMessageAt: new Date().toISOString(),
            messageCount: 0,
        };
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deleteConversation: async (_id: string): Promise<void> => {
        // Not implemented in backend user scope currently, no-op
        return Promise.resolve();
    },
};
