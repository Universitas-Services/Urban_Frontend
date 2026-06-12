'use client';

import { useEffect, useState } from 'react';
import { useChat } from '@/store/chat.context';
import { chatService } from '@/lib/services/chat.service';
import { MessageList, ChatInput, AgentAvatar } from '@/components/chat';
import { Menu } from 'lucide-react';
import { APP_CONFIG } from '@/config/app.config';
import { FeatureBlockedModal } from '@/components/Modales';

export default function ChatDashboardPage() {
    const { dispatch, activeConversationId, conversations, messages } = useChat();

    const [isLoading, setIsLoading] = useState(true);
    const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);

    useEffect(() => {
        // We set loading to false here to allow the component to render
        // as the actual fetching of conversations is now done at the DashboardLayout level
        setIsLoading(false);
    }, [dispatch]);

    // Fetch messages when active conversation changes
    useEffect(() => {
        const fetchMessages = async () => {
            if (!activeConversationId) {
                dispatch({ type: 'SET_MESSAGES', payload: [] });
                return;
            }

            try {
                const msgs = await chatService.getMessages(activeConversationId);
                dispatch({ type: 'SET_MESSAGES', payload: msgs });
            } catch (error) {
                console.error('Error fetching messages', error);
            }
        };

        fetchMessages();
    }, [activeConversationId, dispatch]);

    const handleSendMessage = async (content: string) => {
        let currentTargetId = activeConversationId;
        let isNew = false;

        if (!currentTargetId) {
            // Generate temporary client-side uuid
            const newConv = await chatService.createConversation();
            currentTargetId = newConv.id;
            isNew = true;
            // Add to sidebar optimistically (title will be Nueva Conversación)
            dispatch({ type: 'SET_CONVERSATIONS', payload: [newConv, ...conversations] });
            // Clear current message list to prepare for new session
            dispatch({ type: 'SET_MESSAGES', payload: [] });
        }

        dispatch({ type: 'SET_SENDING', payload: true });

        // Optimistic UI for User Msg
        const optimisticMsg = {
            id: `optimistic_${Date.now()}`,
            conversationId: currentTargetId,
            content,
            role: 'user' as const,
            createdAt: new Date().toISOString(),
        };
        dispatch({ type: 'ADD_MESSAGE', payload: optimisticMsg });

        try {
            // Real target backend integration (POST /ai/message)
            const aiMsg = await chatService.sendMessage(currentTargetId, content);

            if (isNew) {
                // As requested: execute the 3rd endpoint right after the first message is processed
                const msgs = await chatService.getMessages(currentTargetId);
                dispatch({ type: 'SET_MESSAGES', payload: msgs });

                // Fetch the grouped conversations again so the sidebar updates its real title and bot reply
                const updatedConvs = await chatService.getConversations();
                dispatch({ type: 'SET_CONVERSATIONS', payload: updatedConvs });

                // Finally set it active, which connects everything without conflicting with optimistic msgs
                dispatch({ type: 'SET_ACTIVE', payload: currentTargetId });
            } else {
                dispatch({ type: 'ADD_MESSAGE', payload: aiMsg });
            }
        } catch (error) {
            console.error('Failed to send target message', error);
            const err = error as { response?: { status?: number } };
            if (err?.response?.status === 403) {
                // Revertimos el mensaje optimista tomando el estado 'messages' inicial de la función
                dispatch({ type: 'SET_MESSAGES', payload: messages });
                setIsBlockedModalOpen(true);
            }
        } finally {
            dispatch({ type: 'SET_SENDING', payload: false });
        }
    };

    return (
        <div className="flex-1 overflow-auto custom-scrollbar p-6 bg-[var(--color-dashboard-bg)] flex flex-col relative animate-fade-in">
            {/* Mobile Header */}
            <div className="md:hidden sticky top-0 z-10 flex items-center p-4 bg-surface-light/95 backdrop-blur-sm border-b border-surface-soft/40 shadow-sm">
                <button
                    onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
                    className="p-2 mr-3 bg-white rounded-lg border border-surface-soft shadow-sm hover:bg-surface-soft/20 active:scale-95 transition-all text-neutral-dark"
                >
                    <Menu size={20} />
                </button>
                <div className="flex flex-col">
                    <h1 className="font-semibold text-neutral-dark text-base">{APP_CONFIG.AGENT_NAME}</h1>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        <span className="text-[10px] uppercase font-bold text-accent tracking-wider">En línea</span>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 overflow-hidden flex flex-col pt-0">
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="w-12 h-12 bg-surface-soft/40 rounded-full mb-4"></div>
                            <div className="h-4 w-32 bg-surface-soft/40 rounded mb-2"></div>
                            <div className="h-3 w-48 bg-surface-soft/40 rounded"></div>
                        </div>
                    </div>
                ) : messages.length > 0 ? (
                    <div className="flex-1 max-w-5xl mx-auto w-full flex flex-col bg-white shadow-xl md:rounded-[24px] overflow-hidden md:mt-4 md:mb-6 border border-surface-soft/40">
                        {/* Header for Active Conversation inside the White Card */}
                        <div className="flex items-center px-6 py-4 border-b border-surface-soft/60 bg-white shrink-0 z-10 transition-all">
                            <div className="relative mr-3 flex shrink-0">
                                <AgentAvatar size="sm" className="ring-2 ring-white shadow-sm" />
                                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-[var(--color-status-online)] ring-[1.5px] ring-white shadow-sm"></span>
                            </div>
                            <div className="flex flex-col">
                                <h2 className="font-bold text-neutral-dark text-[17px] leading-tight">
                                    {APP_CONFIG.AGENT_NAME} - Consultor IA
                                </h2>
                                <span className="text-[13px] font-medium text-[var(--color-status-online)]">
                                    En línea
                                </span>
                            </div>
                        </div>

                        <MessageList />
                        <ChatInput onSendMessage={handleSendMessage} variant="inline" />
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col w-full relative">
                        <MessageList />
                        <ChatInput onSendMessage={handleSendMessage} variant="floating" />
                    </div>
                )}
            </div>

            <FeatureBlockedModal isOpen={isBlockedModalOpen} onClose={() => setIsBlockedModalOpen(false)} />
        </div>
    );
}
