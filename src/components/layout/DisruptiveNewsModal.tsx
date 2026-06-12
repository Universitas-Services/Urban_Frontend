'use client';

import React, { useState } from 'react';
import { useAuth } from '@/store/auth.context';
import { authService } from '@/lib/services/auth.service';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

export function DisruptiveNewsModal() {
    const { user, updateUser } = useAuth();
    const router = useRouter();
    const [isClosed, setIsClosed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isOpen = Boolean(user?.hasUnreadNews && user?.latestNews && !isClosed);

    if (!isOpen || !user?.latestNews) return null;

    const { title, content } = user.latestNews;

    const handleAccept = async () => {
        setIsLoading(true);
        try {
            await authService.acceptNews();
            // Update local user state so it disappears instantly
            updateUser({
                ...user,
                hasUnreadNews: false,
            });
            setIsClosed(true);
            router.push('/acerca-de');
        } catch (error) {
            console.error('Error accepting news', error);
            toast.error('Hubo un error al aceptar el aviso. Intente nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" />

            {/* Modal Content */}
            <div className="relative w-full max-w-[320px] min-h-[320px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-300">
                <div className="p-6 flex flex-col gap-4 flex-1 justify-center">
                    <h2 className="text-base font-black text-slate-900 text-center">{title}</h2>

                    <div className="text-[11px] text-slate-700 leading-relaxed text-center max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                        {content}
                    </div>

                    <div className="flex flex-col items-center gap-1.5 mt-2">
                        <Avatar className="h-7 w-7 border-2 border-white shadow-sm">
                            <AvatarImage src="/asset/Julio-AI-Fospuca.png" alt="Universitas" />
                            <AvatarFallback className="text-[9px] font-bold bg-slate-100 text-slate-600">
                                UN
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                            Universitas
                        </span>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 shrink-0">
                    <button
                        onClick={handleAccept}
                        disabled={isLoading}
                        className="w-full h-10 rounded-xl bg-[#00B800] text-white font-black text-xs tracking-widest uppercase shadow-md shadow-green-900/10 hover:bg-[#009900] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'CARGANDO...' : 'ACEPTAR'}
                    </button>
                </div>
            </div>
        </div>
    );
}
