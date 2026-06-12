'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Conversation, Message } from '@/types/chat.types';

interface ChatState {
    conversations: Conversation[];
    activeConversationId: string | null;
    messages: Message[];
    isSending: boolean;
    isSidebarOpen: boolean;
}

type ChatAction =
    | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
    | { type: 'SET_ACTIVE'; payload: string | null }
    | { type: 'SET_MESSAGES'; payload: Message[] }
    | { type: 'ADD_MESSAGE'; payload: Message }
    | { type: 'TOGGLE_SIDEBAR' }
    | { type: 'SET_SENDING'; payload: boolean };

const initialState: ChatState = {
    conversations: [],
    activeConversationId: null,
    messages: [],
    isSending: false,
    isSidebarOpen: false,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
    switch (action.type) {
        case 'SET_CONVERSATIONS':
            return { ...state, conversations: action.payload };
        case 'SET_ACTIVE':
            return { ...state, activeConversationId: action.payload };
        case 'SET_MESSAGES':
            return { ...state, messages: action.payload };
        case 'ADD_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };
        case 'TOGGLE_SIDEBAR':
            return { ...state, isSidebarOpen: !state.isSidebarOpen };
        case 'SET_SENDING':
            return { ...state, isSending: action.payload };
        default:
            return state;
    }
}

interface ChatContextProps extends ChatState {
    dispatch: React.Dispatch<ChatAction>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(chatReducer, initialState);

    return <ChatContext.Provider value={{ ...state, dispatch }}>{children}</ChatContext.Provider>;
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
