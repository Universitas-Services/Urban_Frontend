'use client';

import { useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { DashboardCityscapeBackground } from '@/components/layout/DashboardCityscapeBackground';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthStore } from '@/store/auth.store';
import { usePermissions } from '@/hooks/usePermissions';
import { APP_CONFIG } from '@/config/app.config';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { initAuth } = useAuthStore();
    const { isAdminVisualizador } = usePermissions();

    useEffect(() => {
        initAuth();
        document.title = APP_CONFIG.ADMIN_DOCUMENT_TITLE;
    }, [initAuth]);

    return (
        <RouteGuard allowedRoles={['ADMIN', 'ADMIN_VISUALIZADOR']}>
            <div className="admin-area relative flex h-dvh overflow-hidden bg-surface-light font-sans text-neutral-dark">
                <DashboardCityscapeBackground />
                <SidebarProvider className="relative z-10 flex h-full min-h-0 w-full bg-transparent">
                    <AdminSidebar />
                    <SidebarInset className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden bg-transparent md:m-0 md:ml-0 md:rounded-none md:shadow-none">
                        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/60 bg-card/80 px-4 backdrop-blur-sm md:hidden">
                            <SidebarTrigger className="-ml-1 text-primary" />
                        </header>
                        <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
                            {isAdminVisualizador && (
                                <div className="flex shrink-0 justify-end px-4 pt-4">
                                    <span className="rounded-md bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                                        Modo visualizador — solo lectura
                                    </span>
                                </div>
                            )}
                            <div className="custom-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto">
                                <div className="flex min-h-0 flex-1 flex-col gap-4 p-4">{children}</div>
                            </div>
                        </main>
                    </SidebarInset>
                </SidebarProvider>
            </div>
        </RouteGuard>
    );
}
