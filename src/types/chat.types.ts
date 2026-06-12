export type MessageRole = 'user' | 'assistant';

export interface Message {
    id: string;
    conversationId: string;
    role: MessageRole;
    content: string;
    createdAt: string;
}

export interface Conversation {
    id: string;
    title: string;
    lastMessage: string;
    lastMessageAt: string;
    messageCount: number;
}
