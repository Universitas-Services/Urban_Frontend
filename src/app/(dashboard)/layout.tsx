'use client';
import { CopyrightFooter } from '@/components/layout/CopyrightFooter';
import { ReactNode, useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/store/auth.context';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth.service';
import { UserProfile } from '@/types/auth.types';
import { MembershipExpiringModal, ProfileIncompleteModal } from '@/components/Modales';
import { DisruptiveNewsModal } from '@/components/layout/DisruptiveNewsModal';
import { useChat } from '@/store/chat.context';
import { chatService } from '@/lib/services/chat.service';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const { dispatch } = useChat();

    const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
    const [membershipDaysLeft, setMembershipDaysLeft] = useState<number>(0);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.replace('/login');
            } else {
                document.title = 'Consultor IA - GIRS';
            }
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const checkMembershipStatus = async () => {
            if (isAuthenticated) {
                try {
                    const profile = await authService.getFullProfile();

                    const checkProfileFields = () => {
                        // Comprobación de campos nulos o vacíos requeridos
                        const { tipo_usuario, tipoUsuario, nombre_ente, cargo, estatus_normativa_girs } =
                            profile as UserProfile & { tipoUsuario?: string };
                        const assignedTipo = tipoUsuario || tipo_usuario;

                        if (!assignedTipo || !nombre_ente) return true;

                        if (assignedTipo === 'SERVIDOR_PUBLICO') {
                            if (!cargo || !estatus_normativa_girs) return true;
                        }
                        return false;
                    };

                    if (checkProfileFields()) {
                        setIsProfileModalOpen(true);
                    }

                    if (profile.alertaVencimiento) {
                        setMembershipDaysLeft(profile.alertaVencimiento.diasRestantes);
                        // Delay modal appearance for a better user experience
                        timeoutId = setTimeout(() => {
                            setIsMembershipModalOpen(true);
                        }, 2000);
                    }
                } catch (error) {
                    console.error('Failed to fetch profile membership status', error);
                }
            }
        };

        if (!isLoading) {
            checkMembershipStatus();

            if (isAuthenticated) {
                const loadConversations = async () => {
                    try {
                        const convs = await chatService.getConversations();
                        dispatch({ type: 'SET_CONVERSATIONS', payload: convs });
                    } catch (error) {
                        console.error('Failed to fetch conversations', error);
                    }
                };
                loadConversations();
            }
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isAuthenticated, isLoading, dispatch]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex h-[100dvh] items-center justify-center bg-surface-light">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex h-[100dvh] overflow-hidden bg-surface-light text-neutral-dark">
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
