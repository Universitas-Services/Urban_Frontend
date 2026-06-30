'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chat.store';
import { INICIO_ACCENT_STYLES, type InicioAccent } from './inicio.data';

type InicioNewChatButtonProps = {
    label: string;
    accent: InicioAccent;
};

export function InicioNewChatButton({ label, accent }: InicioNewChatButtonProps) {
    const router = useRouter();
    const startNewChat = useChatStore((s) => s.startNewChat);
    const styles = INICIO_ACCENT_STYLES[accent];

    const handleClick = () => {
        startNewChat();
        router.push('/chat');
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={cn(
                'inline-flex h-8 items-center justify-center rounded-lg px-5 text-xs font-semibold transition-colors',
                styles.button
            )}
        >
            {label}
        </button>
    );
}
