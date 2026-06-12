'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useChat } from '@/store/chat.context';

export function ChatInput({
    onSendMessage,
    variant = 'floating',
}: {
    onSendMessage: (msg: string) => void;
    variant?: 'floating' | 'inline';
}) {
    const [content, setContent] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { isSending } = useChat();

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 144)}px`;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (content.trim() && !isSending) {
                handleSubmit();
            }
        }
    };

    const handleSubmit = () => {
        if (!content.trim() || isSending) return;
        onSendMessage(content.trim());
        setContent('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.focus();
        }
    };

    useEffect(() => {
        if (!isSending && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isSending]);

    if (variant === 'floating') {
        return (
            <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center pb-6">
                <div className="w-full max-w-3xl px-4 mx-auto">
                    <div className="relative bg-white border border-surface-soft/60 rounded-full flex items-center min-h-[56px] pl-4 pr-2">
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            placeholder="Escribe un mensaje..."
                            disabled={isSending}
                            className="flex-1 bg-transparent border-none focus:outline-none outline-none focus:ring-0 focus-visible:ring-0 resize-none max-h-[144px] py-4 text-[15px] text-neutral-dark placeholder:text-neutral-dark/40 font-medium"
                            rows={1}
                        />
                        <div className="shrink-0 ml-2 py-1.5 flex items-center">
                            <Button
                                size="icon"
                                disabled={!content.trim() || isSending}
                                onClick={handleSubmit}
                                className="w-10 h-10 rounded-full bg-surface-soft/50 text-neutral-dark opacity-50 hover:bg-accent hover:text-white hover:opacity-100 disabled:bg-surface-soft disabled:text-neutral-dark/30 transition-all active:scale-95"
                            >
                                {isSending ? (
                                    <Spinner size="icon" />
                                ) : (
                                    <Send size={16} className="translate-x-[-1px] translate-y-[1px]" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 bg-white shrink-0 z-10 rounded-b-[24px]">
            <div className="w-full">
                <div className="relative bg-surface-light border border-surface-soft rounded-xl flex items-center min-h-[56px] px-2 shadow-sm">
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Escribe un mensaje..."
                        disabled={isSending}
                        className="flex-1 bg-transparent border-none focus:outline-none outline-none focus:ring-0 focus-visible:ring-0 resize-none max-h-[144px] py-4 px-3 text-[15px] text-neutral-dark placeholder:text-neutral-dark/40 font-medium"
                        rows={1}
                    />
                    <div className="shrink-0 ml-2 py-1.5 flex items-center">
                        <Button
                            size="icon"
                            disabled={!content.trim() || isSending}
                            onClick={handleSubmit}
                            className="w-11 h-11 rounded-full bg-[var(--color-gray-soft)] text-white hover:bg-[var(--color-gray-dark)] disabled:bg-surface-soft disabled:text-neutral-dark/30 transition-all active:scale-95"
                        >
                            {isSending ? (
                                <Spinner size="icon" />
                            ) : (
                                <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
