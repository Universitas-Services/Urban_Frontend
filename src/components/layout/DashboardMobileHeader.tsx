'use client';

import { Menu } from 'lucide-react';
import { useChatStore } from '@/store/chat.store';
import { APP_CONFIG } from '@/config/app.config';
import { cn } from '@/lib/utils';

export function DashboardMobileHeader() {
    const { isSidebarOpen, toggleSidebar } = useChatStore();

    return (
        <header
            className={cn(
                'md:hidden sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-surface-soft/40 bg-surface-light/95 px-4 backdrop-blur-sm shadow-sm',
                isSidebarOpen && 'hidden'
            )}
        >
            <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Abrir menú de navegación"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-surface-soft bg-white text-neutral-dark shadow-sm transition-all hover:bg-surface-soft/20 active:scale-95"
            >
                <Menu size={20} />
            </button>
            <p className="min-w-0 flex-1 truncate text-sm font-semibold text-neutral-dark">
                {APP_CONFIG.DOCUMENT_TITLE}
            </p>
        </header>
    );
}
