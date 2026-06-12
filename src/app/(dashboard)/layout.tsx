'use client';

import { CopyrightFooter } from '@/components/layout/CopyrightFooter';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/store/auth.store';
import { useChatStore } from '@/store/chat.store';
import { UserProfile } from '@/types/auth.types';
import { MembershipExpiringModal, ProfileIncompleteModal } from '@/components/Modales';
import { DisruptiveNewsModal } from '@/components/layout/DisruptiveNewsModal';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { isLoading, initAuth, isAuthenticated, getFullProfile } = useAuthStore();
    const { loadConversations } = useChatStore();
    const router = useRouter();

    const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
    const [membershipDaysLeft, setMembershipDaysLeft] = useState<number>(0);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // Inicializar sesión desde la cookie al montar
    useEffect(() => {
        initAuth();
    }, [initAuth]);

    // Gate de autenticación: si la sesión termina (logout, expiración), redirigir al login.
    // Centraliza la redirección para todas las salidas, sin parchear cada botón.
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isLoading || !isAuthenticated) return;

        document.title = 'Consultor IA - GIRS';

        let timeoutId: NodeJS.Timeout;

        const checkStatus = async () => {
            try {
                const profile = await getFullProfile();

                const profileIncomplete = checkProfileIncomplete(profile);
                if (profileIncomplete) setIsProfileModalOpen(true);

                if (profile.alertaVencimiento) {
                    setMembershipDaysLeft(profile.alertaVencimiento.diasRestantes);
                    timeoutId = setTimeout(() => setIsMembershipModalOpen(true), 2000);
                }
            } catch (error) {
                console.error('Failed to fetch profile membership status', error);
            }
        };

        checkStatus();
        loadConversations();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isAuthenticated, isLoading, getFullProfile, loadConversations]);

    // Mostrar spinner mientras se verifica la sesión o durante la redirección al login
    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex h-dvh items-center justify-center bg-surface-light">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex h-dvh overflow-hidden bg-surface-light text-neutral-dark">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 relative overflow-y-auto custom-scrollbar">
                <div className="flex-1 flex flex-col">{children}</div>
                <CopyrightFooter />
            </main>

            <MembershipExpiringModal
                isOpen={isMembershipModalOpen}
                onClose={() => setIsMembershipModalOpen(false)}
                daysLeft={membershipDaysLeft}
            />

            <ProfileIncompleteModal isOpen={isProfileModalOpen} onSuccess={() => setIsProfileModalOpen(false)} />

            <DisruptiveNewsModal />
        </div>
    );
}

function checkProfileIncomplete(profile: UserProfile): boolean {
    const { tipo_usuario, nombre_ente, cargo, estatus_normativa_girs } = profile;
    if (!tipo_usuario || !nombre_ente) return true;
    if (tipo_usuario === 'SERVIDOR_PUBLICO') {
        if (!cargo || !estatus_normativa_girs) return true;
    }
    return false;
}
