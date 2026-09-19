'use client';

import { ReactNode, useEffect } from 'react';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { StaffSidebar } from '@/components/staff/StaffSidebar';
import { DashboardCityscapeBackground } from '@/components/layout/DashboardCityscapeBackground';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthStore } from '@/store/auth.store';
import { APP_CONFIG } from '@/config/app.config';

export default function StaffLayout({ children }: { children: ReactNode }) {
    const { initAuth } = useAuthStore();

    useEffect(() => {
        initAuth();
        document.title = APP_CONFIG.PROJECT_NAME;
    }, [initAuth]);

    return (
        <RouteGuard allowedRoles={['CURADOR', 'REVISOR']}>
            <div className="relative flex h-dvh overflow-hidden bg-surface-light font-sans text-neutral-dark">
                <DashboardCityscapeBackground />
                <SidebarProvider className="relative z-10 flex h-full min-h-0 w-full bg-transparent">
                    <StaffSidebar />
                    <SidebarInset className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden bg-transparent md:m-0 md:ml-0 md:rounded-none md:shadow-none">
                        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/60 bg-card/80 px-4 backdrop-blur-sm md:hidden">
                            <SidebarTrigger className="-ml-1 text-primary" />
                        </header>
                        <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
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
