'use client';

import { useRef, useEffect } from 'react';
import { useChatStore } from '@/store/chat.store';
import { APP_CONFIG } from '@/config/app.config';
import { MessageBubble } from './MessageBubble';
import { AgentAvatar } from './AgentAvatar';

export function MessageList() {
    const { messages, activeConversationId } = useChatStore();
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, activeConversationId]);

    // Removed the !activeConversationId explicit check to unify empty states

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24 animate-fade-in relative z-0">
                <div className="flex flex-col items-center max-w-2xl mx-auto w-full mt-[-8vh]">
                    <div className="relative mb-6">
                        <AgentAvatar size="lg" className="shadow-xl ring-[6px] ring-white/60" />
                        <span className="absolute bottom-1 right-1 flex h-4.5 w-4.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--color-status-online) opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-(--color-status-online) border-[3px] border-(--color-chat-bg)"></span>
                        </span>
                    </div>
                    <h2 className="text-[32px] font-bold tracking-tight mb-2 text-center text-neutral-dark">
                        Hola, soy tu <span className="text-(--color-consultant-text)">{APP_CONFIG.DOCUMENT_TITLE}</span>
                    </h2>
                    <p className="text-center text-neutral-dark max-w-150 text-[15px] mx-auto">
                        {APP_CONFIG.AGENT_WELCOME_INTRO}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-0 overflow-y-auto w-full custom-scrollbar relative">
            <div className="w-full mx-auto p-4 sm:p-6 space-y-6">
                {/* Mocked Initial Date Separator */}
                <div className="flex items-center justify-center my-6">
                    <div className="bg-(--color-chat-bg) px-4 py-1.5 rounded-full text-xs font-semibold text-neutral-dark/60 uppercase tracking-widest">
                        Hoy
                    </div>
                </div>

                {messages.map((msg, idx) => (
                    <MessageBubble key={msg.id} message={msg} isLast={idx === messages.length - 1} />
                ))}
                <div ref={bottomRef} className="h-4" />
            </div>
        </div>
    );
}
