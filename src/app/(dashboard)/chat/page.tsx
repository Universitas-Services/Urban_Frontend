'use client';

import { useEffect, useState } from 'react';
import { useChatStore } from '@/store/chat.store';
import { MessageList, ChatInput, AgentAvatar } from '@/components/chat';
import { APP_CONFIG } from '@/config/app.config';
import { FeatureBlockedModal } from '@/components/Modales';

export default function ChatDashboardPage() {
    const { activeConversationId, messages, sendMessage, createConversation, selectConversation, loadConversations } =
        useChatStore();

    const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);

    // Si hay una conversación activa al montar pero sin mensajes, cargarlos
    useEffect(() => {
        if (activeConversationId && messages.length === 0) {
            void selectConversation(activeConversationId);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSendMessage = async (content: string) => {
        const isNew = !activeConversationId;
        if (isNew) {
            await createConversation();
        }
        try {
            await sendMessage(content);
            await loadConversations();
        } catch (error) {
            const err = error as Error & { status?: number };
            if (err.status === 403) {
                setIsBlockedModalOpen(true);
            }
        }
    };

    return (
        <div className="flex-1 overflow-hidden p-4 md:p-6 flex flex-col min-h-0 relative animate-fade-in">
            {/* Main Chat Area */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0 pt-0">
                {messages.length > 0 ? (
                    <div className="flex-1 max-w-5xl mx-auto w-full flex flex-col min-h-0 bg-white shadow-xl md:rounded-[24px] md:mb-3 border border-surface-soft/40">
                        {/* Header for Active Conversation */}
                        <div className="flex items-center px-6 py-4 border-b border-surface-soft/60 bg-white md:rounded-t-[24px] shrink-0 z-10 transition-all">
                            <div className="relative mr-3 flex shrink-0">
                                <AgentAvatar size="sm" className="ring-2 ring-white shadow-sm" />
                                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-(--color-status-online) ring-[1.5px] ring-white shadow-sm"></span>
                            </div>
                            <div className="flex flex-col">
                                <h2 className="font-bold text-neutral-dark text-[17px] leading-tight">
                                    {APP_CONFIG.DOCUMENT_TITLE}
                                </h2>
                                <span className="text-[13px] font-medium text-(--color-status-online)">En línea</span>
                            </div>
                        </div>

                        <MessageList />
                        <ChatInput onSendMessage={handleSendMessage} variant="inline" />
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col min-h-0 w-full relative">
                        <MessageList />
                        <ChatInput onSendMessage={handleSendMessage} variant="floating" />
                    </div>
                )}
            </div>

            <FeatureBlockedModal isOpen={isBlockedModalOpen} onClose={() => setIsBlockedModalOpen(false)} />
        </div>
    );
}
