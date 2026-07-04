'use client';

import { create } from 'zustand';
import type { Conversation, Message } from '@/types/chat.types';
import { APP_CONFIG } from '@/config/app.config';
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
};

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
    ...initialState,

    loadConversations: async () => {
        if (APP_CONFIG.AGENT_UNDER_CONSTRUCTION) {
            set({ conversations: [] });
            return;
        }

        const conversations = await getConversationsService();
        set({ conversations });
    },

    selectConversation: async (id) => {
        set({ activeConversationId: id, messages: [] });

        if (APP_CONFIG.AGENT_UNDER_CONSTRUCTION) {
            return;
        }

        const messages = await getMessagesService(id);
        set({ messages });
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

            if (APP_CONFIG.AGENT_UNDER_CONSTRUCTION) {
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

            set((s) => ({ messages: [...s.messages, botMessage], isSending: false }));

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
            set({ conversations: updatedConversations });
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
        }));
    },

    toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),

    setConversations: (conversations) => set({ conversations }),

    addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),

    reset: () => set(initialState),

    startNewChat: () => set({ activeConversationId: null, messages: [] }),

    deleteConversation: async (sessionId) => {
        if (!APP_CONFIG.AGENT_UNDER_CONSTRUCTION) {
            await deleteConversationService(sessionId);
        }

        const { activeConversationId, conversations } = get();
        const wasActive = activeConversationId === sessionId;

        set({
            conversations: conversations.filter((c) => c.id !== sessionId),
            ...(wasActive ? { activeConversationId: null, messages: [] } : {}),
        });
    },
}));
