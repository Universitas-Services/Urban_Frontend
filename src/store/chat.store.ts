'use client';

import { create } from 'zustand';
import type { Conversation, Message } from '@/types/chat.types';
import {
    getConversationsService,
    getMessagesService,
    sendMessageService,
    createConversationService,
} from '@/lib/services/chat.service';

interface ChatState {
    conversations: Conversation[];
    activeConversationId: string | null;
    messages: Message[];
    isSending: boolean;
    isSidebarOpen: boolean;
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
}

const initialState: ChatState = {
    conversations: [],
    activeConversationId: null,
    messages: [],
    isSending: false,
    isSidebarOpen: false,
};

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
    ...initialState,

    loadConversations: async () => {
        const conversations = await getConversationsService();
        set({ conversations });
    },

    selectConversation: async (id) => {
        set({ activeConversationId: id, messages: [] });
        const messages = await getMessagesService(id);
        set({ messages });
    },

    sendMessage: async (content) => {
        const { activeConversationId, conversations } = get();
        if (!activeConversationId || !content.trim()) return;

        // Optimistic UI — agregar el mensaje del usuario inmediatamente
        const optimisticUserMsg: Message = {
            id: `temp-user-${Date.now()}`,
            conversationId: activeConversationId,
            role: 'user',
            content,
            createdAt: new Date().toISOString(),
        };
        set((s) => ({ messages: [...s.messages, optimisticUserMsg], isSending: true }));

        try {
            const botMessage = await sendMessageService(activeConversationId, content);
            set((s) => ({ messages: [...s.messages, botMessage], isSending: false }));

            // Actualizar el lastMessage de la conversación activa en la lista
            const updatedConversations = conversations.map((c) =>
                c.id === activeConversationId
                    ? {
                          ...c,
                          lastMessage: content,
                          lastMessageAt: new Date().toISOString(),
                          messageCount: c.messageCount + 1,
                      }
                    : c
            );
            set({ conversations: updatedConversations });
        } catch (error) {
            // Revertir el optimistic update si falla
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
        }));
    },

    toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),

    setConversations: (conversations) => set({ conversations }),

    addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),

    reset: () => set(initialState),

    startNewChat: () => set({ activeConversationId: null, messages: [] }),
}));
