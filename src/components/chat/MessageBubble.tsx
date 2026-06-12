'use client';

import { useEffect, useState } from 'react';
import { Message } from '@/types/chat.types';
import { AgentAvatar } from './AgentAvatar';
import { cn } from '@/lib/utils';
import { APP_CONFIG } from '@/config/app.config';

interface MessageBubbleProps {
    message: Message;
    isLast: boolean;
}

export function MessageBubble({ message, isLast }: MessageBubbleProps) {
    const isAgent = message.role === 'assistant';
    const [displayedText, setDisplayedText] = useState(isAgent && isLast ? '' : message.content);
    const [isTyping, setIsTyping] = useState(isAgent && isLast);

    useEffect(() => {
        if (isAgent && isLast && isTyping) {
            let currentIndex = 1; // start at 1 to show first char, or 0
            const interval = setInterval(() => {
                if (currentIndex <= message.content.length) {
                    setDisplayedText(message.content.substring(0, currentIndex));
                    currentIndex++;
                } else {
                    setIsTyping(false);
                    clearInterval(interval);
                }
            }, 20); // 20ms per character typing effect

            return () => clearInterval(interval);
        }
    }, [message.content, isAgent, isLast, isTyping]);

    const dateObj = new Date(message.createdAt);
    const dateStr = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
    const timestamp = `${dateStr} ${timeStr}`;

    return (
        <div className={cn('flex w-full animate-fade-in group', isAgent ? 'justify-start' : 'justify-end')}>
            <div
                className={cn(
                    'flex max-w-[85%] sm:max-w-[75%] items-end gap-2',
                    isAgent ? 'flex-row' : 'flex-row-reverse'
                )}
            >
                {isAgent && (
                    <div className="shrink-0 mb-1">
                        <AgentAvatar size="sm" />
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    <div
                        className={cn(
                            'p-4 relative max-w-full',
                            isAgent
                                ? 'bg-msg-user-bg text-neutral-dark rounded-[20px] rounded-tl-sm border border-msg-user-border/40'
                                : 'bg-primary text-on-primary rounded-[20px] rounded-tr-sm'
                        )}
                    >
                        <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                            {displayedText}
                            {isTyping && (
                                <span className="inline-block w-1.5 h-4 ml-1 bg-accent animate-pulse align-middle" />
                            )}
                        </p>
                    </div>

                    <div className={cn('flex items-center gap-2', isAgent ? 'justify-start ml-1' : 'justify-end mr-1')}>
                        {isAgent && (
                            <span className="text-[10px] font-medium text-neutral-dark/40 uppercase tracking-wider">
                                {APP_CONFIG.AGENT_NAME}
                            </span>
                        )}
                        <span className="text-xs text-neutral-dark/40">{timestamp}</span>
                        {!isAgent && (
                            <span className="text-[10px] font-medium text-neutral-dark/40 uppercase tracking-wider">
                                TÚ
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
