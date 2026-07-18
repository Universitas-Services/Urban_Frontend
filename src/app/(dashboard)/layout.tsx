'use client';

import { CopyrightFooter } from '@/components/layout/CopyrightFooter';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/store/auth.store';
import { useChatStore } from '@/store/chat.store';
import { UserProfile } from '@/types/auth.types';
import { MembershipExpiringModal, ProfileIncompleteModal } from '@/components/Modales';
import { DisruptiveNewsModal } from '@/components/layout/DisruptiveNewsModal';
import { DashboardCityscapeBackground } from '@/components/layout/DashboardCityscapeBackground';
import { DashboardMobileHeader } from '@/components/layout/DashboardMobileHeader';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { getHomeByRole } from '@/lib/constants/routes';
import { canAccessAdminArea, isAdminVisualizador } from '@/lib/auth/permissions';
import { APP_CONFIG } from '@/config/app.config';
import type { UserRole } from '@/types/roles';

const USER_ONLY_ROLES: UserRole[] = ['USER'];
const CHAT_VISUALIZADOR_ROLES: UserRole[] = ['USER', 'ADMIN_VISUALIZADOR'];

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { isLoading, initAuth, isAuthenticated, getFullProfile, user } = useAuthStore();
    const { loadConversations } = useChatStore();
    const router = useRouter();
    const pathname = usePathname();

    const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
    const [membershipDaysLeft, setMembershipDaysLeft] = useState<number>(0);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const role = user?.role;
    const isVisualizadorOnChat = isAdminVisualizador(role) && pathname === '/chat';
    const allowedRoles = useMemo(
        () => (isVisualizadorOnChat ? CHAT_VISUALIZADOR_ROLES : USER_ONLY_ROLES),
        [isVisualizadorOnChat]
    );

    // Inicializar sesión desde la cookie al montar
    useEffect(() => {
        initAuth();
    }, [initAuth]);

    // Gate de autenticación: si la sesión termina (logout, expiración), redirigir al login.
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    // Roles de área admin van a /admin, excepto visualizador en /chat
    useEffect(() => {
        if (isLoading || !isAuthenticated) return;
        if (!canAccessAdminArea(role)) return;
        if (isVisualizadorOnChat) return;
        router.replace(getHomeByRole(role ?? 'USER'));
    }, [isLoading, isAuthenticated, role, isVisualizadorOnChat, router]);

    useEffect(() => {
        if (isLoading || !isAuthenticated) return;
        if (canAccessAdminArea(role) && !isVisualizadorOnChat) return;

        document.title = APP_CONFIG.PROJECT_NAME;

        let timeoutId: NodeJS.Timeout;

        const checkStatus = async () => {
            // Visualizador en chat: solo carga conversaciones, sin modales de perfil/membresía de usuario
            if (isVisualizadorOnChat) {
                await loadConversations();
                return;
            }

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

            await loadConversations();
        };

        void checkStatus();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isAuthenticated, isLoading, role, isVisualizadorOnChat, getFullProfile, loadConversations]);

    // Mostrar spinner mientras se verifica la sesión o durante la redirección al login
    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex h-dvh items-center justify-center bg-surface-light">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <RouteGuard allowedRoles={allowedRoles}>
            <div className="relative flex h-dvh overflow-hidden bg-surface-light text-neutral-dark">
                <DashboardCityscapeBackground />
                <Sidebar />
                <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
                    <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
                        <DashboardMobileHeader />
                        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto custom-scrollbar">
                            <div className="flex min-h-0 flex-1 flex-col">{children}</div>
                        </div>
                        <CopyrightFooter />
                    </main>
                </div>

                {!isVisualizadorOnChat ? (
                    <>
                        <MembershipExpiringModal
                            isOpen={isMembershipModalOpen}
                            onClose={() => setIsMembershipModalOpen(false)}
                            daysLeft={membershipDaysLeft}
                        />

                        <ProfileIncompleteModal
                            isOpen={isProfileModalOpen}
                            onSuccess={() => setIsProfileModalOpen(false)}
                        />

                        <DisruptiveNewsModal />
                    </>
                ) : null}
            </div>
        </RouteGuard>
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
