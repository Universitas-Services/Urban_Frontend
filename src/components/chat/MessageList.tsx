'use client';

import { useRef, useEffect } from 'react';
import { useChat } from '@/store/chat.context';
import { MessageBubble } from './MessageBubble';
import { AgentAvatar } from './AgentAvatar';

export function MessageList() {
    const { messages, activeConversationId } = useChat();
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
                        <span className="absolute bottom-1 right-1 flex h-[18px] w-[18px]">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-status-online)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-[18px] w-[18px] bg-[var(--color-status-online)] border-[3px] border-[var(--color-chat-bg)]"></span>
                        </span>
                    </div>
                    <h2 className="text-[32px] font-bold tracking-tight mb-2 text-center text-neutral-dark">
                        Hola, soy tu <span className="text-[var(--color-consultant-text)]">Consultor IA GIRS</span>
                    </h2>
                    <p className="text-center text-neutral-dark max-w-[600px] text-[15px] mx-auto">
                        Soy un agente IA experto en Gestión Integral de Residuos Sólidos - GIRS. Estoy aquí para
                        resolver tus dudas técnicas, apoyarte en la planificación y asegurar el cumplimiento normativo.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar relative">
            <div className="w-full mx-auto p-4 sm:p-6 space-y-6">
                {/* Mocked Initial Date Separator */}
                <div className="flex items-center justify-center my-6">
                    <div className="bg-[var(--color-chat-bg)] px-4 py-1.5 rounded-full text-xs font-semibold text-neutral-dark/60 uppercase tracking-widest">
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
