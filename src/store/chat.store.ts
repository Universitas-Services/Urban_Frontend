'use client';

import { create } from 'zustand';
import type { Conversation, Message } from '@/types/chat.types';
import { APP_CONFIG } from '@/config/app.config';
import { isAgentBlockedForRole } from '@/lib/auth/permissions';
import { useAuthStore } from '@/store/auth.store';
import {
    getConversationsService,
    getMessagesService,
    sendMessageService,
    createConversationService,
    deleteConversationService,
} from '@/lib/services/chat.service';

interface ChatState {
    conversations: Conversation[];
    activeConversationId: string | null;
    messages: Message[];
    isSending: boolean;
    isSidebarOpen: boolean;
    /** Solo anima tipeo en respuestas recién recibidas, no al abrir historial. */
    typingMessageId: string | null;
}

interface ChatActions {
    loadConversations: () => Promise<void>;
    selectConversation: (id: string) => Promise<void>;
    sendMessage: (content: string) => Promise<void>;
    createConversation: () => Promise<void>;
    toggleSidebar: () => void;
    setConversations: (conversations: Conversation[]) => void;
    addMessage: (message: Message) => void;
    reset: () => void;
    startNewChat: () => void;
    deleteConversation: (sessionId: string) => Promise<void>;
}

const initialState: ChatState = {
    conversations: [],
    activeConversationId: null,
    messages: [],
    isSending: false,
    isSidebarOpen: false,
    typingMessageId: null,
};

function isAgentBlocked(): boolean {
    return isAgentBlockedForRole(useAuthStore.getState().user?.role);
}

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
    ...initialState,

    loadConversations: async () => {
        if (isAgentBlocked()) {
            set({ conversations: [] });
            return;
        }

        const conversations = await getConversationsService();
        set({ conversations });
    },

    selectConversation: async (id) => {
        set({ activeConversationId: id, messages: [], typingMessageId: null });

        if (isAgentBlocked()) {
            return;
        }

        const messages = await getMessagesService(id);
        set({ messages, typingMessageId: null });
    },

    sendMessage: async (content) => {
        const { activeConversationId, conversations } = get();
        if (!activeConversationId || !content.trim()) return;

        const optimisticUserMsg: Message = {
            id: `temp-user-${Date.now()}`,
            conversationId: activeConversationId,
            role: 'user',
            content,
            createdAt: new Date().toISOString(),
        };
        set((s) => ({ messages: [...s.messages, optimisticUserMsg], isSending: true }));

        try {
            let botMessage: Message;

            if (isAgentBlocked()) {
                botMessage = {
                    id: `temp-bot-${Date.now()}`,
                    conversationId: activeConversationId,
                    role: 'assistant',
                    content: APP_CONFIG.AGENT_UNDER_CONSTRUCTION_REPLY,
                    createdAt: new Date().toISOString(),
                };
            } else {
                botMessage = await sendMessageService(activeConversationId, content);
            }

            const updatedConversations = conversations.map((c) =>
                c.id === activeConversationId
                    ? {
                          ...c,
                          title: c.messageCount === 0 ? content.slice(0, 48) : c.title,
                          lastMessage: content,
                          lastMessageAt: new Date().toISOString(),
                          messageCount: c.messageCount + 1,
                      }
                    : c
            );
            set((s) => ({
                messages: [...s.messages, botMessage],
                isSending: false,
                typingMessageId: isAgentBlocked() ? null : botMessage.id,
                conversations: updatedConversations,
            }));
        } catch (error) {
            set((s) => ({
                messages: s.messages.filter((m) => m.id !== optimisticUserMsg.id),
                isSending: false,
            }));
            throw error;
        }
    },

    createConversation: async () => {
        const newConversation = await createConversationService();
        set((s) => ({
            conversations: [newConversation, ...s.conversations],
            activeConversationId: newConversation.id,
            messages: [],
            typingMessageId: null,
        }));
    },

    toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),

    setConversations: (conversations) => set({ conversations }),

    addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),

    reset: () => set(initialState),

    startNewChat: () => set({ activeConversationId: null, messages: [], typingMessageId: null }),

    deleteConversation: async (sessionId) => {
        if (!isAgentBlocked()) {
            await deleteConversationService(sessionId);
        }

        const { activeConversationId, conversations } = get();
        const wasActive = activeConversationId === sessionId;

        set({
            conversations: conversations.filter((c) => c.id !== sessionId),
            ...(wasActive ? { activeConversationId: null, messages: [], typingMessageId: null } : {}),
        });
    },
}));
