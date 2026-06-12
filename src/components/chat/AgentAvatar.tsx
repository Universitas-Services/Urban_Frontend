'use client';

import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_CONFIG } from '@/config/app.config';
import Image from 'next/image';

interface AgentAvatarProps {
    size?: 'sm' | 'lg';
    className?: string;
}

export function AgentAvatar({ size = 'sm', className }: AgentAvatarProps) {
    const isLarge = size === 'lg';
    const sizeClasses = isLarge ? 'w-[120px] h-[120px]' : 'w-8 h-8';
    const iconSize = isLarge ? 48 : 20;

    return (
        <div
            className={cn(
                'rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center relative overflow-hidden shrink-0 shadow-lg',
                sizeClasses,
                className
            )}
        >
            {APP_CONFIG.AGENT_AVATAR_URL ? (
                <Image src={APP_CONFIG.AGENT_AVATAR_URL} alt={APP_CONFIG.AGENT_NAME} fill className="object-cover" />
            ) : (
                <Sparkles size={iconSize} className="text-on-primary" />
            )}
        </div>
    );
}
