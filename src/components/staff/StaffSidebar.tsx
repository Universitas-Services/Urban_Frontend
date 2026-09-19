'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    LogOut,
    ChevronsUpDown,
    Menu,
    User,
    KeyRound,
    Upload,
    Library,
    AlertCircle,
    Tags,
    ClipboardCheck,
    BookOpen,
    History,
} from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenuBadge,
} from '@/components/ui/sidebar';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { APP_CONFIG } from '@/config/app.config';
import { useAuthStore } from '@/store/auth.store';
import { getDocumentStatsAction, getPendingStatsAction } from '@/lib/services/documents.service';

export function StaffSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);
    const [rechazados, setRechazados] = React.useState(0);
    const [pendientesRevision, setPendientesRevision] = React.useState(0);
    const { user, logout } = useAuthStore();
    const { state, toggleSidebar } = useSidebar();
    const expanded = state === 'expanded';
    const isCurador = user?.role === 'CURADOR';
    const isRevisor = user?.role === 'REVISOR';

    const displayUser = {
        name: user?.nombre ? `${user.nombre} ${user.apellido ?? ''}`.trim() : 'Usuario',
        email: user?.email ?? '',
        role: user?.role ?? '',
        avatar: user?.avatar ?? '',
        initials: user?.nombre?.charAt(0)?.toUpperCase() ?? 'U',
    };

    React.useEffect(() => {
        let cancelled = false;
        if (isCurador) {
            getDocumentStatsAction()
                .then((stats) => {
                    if (!cancelled) setRechazados(stats.rechazados);
                })
                .catch(() => {
                    if (!cancelled) setRechazados(0);
                });
        }
        if (isRevisor) {
            getPendingStatsAction()
                .then((stats) => {
                    if (!cancelled) setPendientesRevision(stats.pendientes);
                })
                .catch(() => {
                    if (!cancelled) setPendientesRevision(0);
                });
        }
        return () => {
            cancelled = true;
        };
    }, [isCurador, isRevisor, pathname]);

    const handleLogout = async () => {
        await logout();
        router.replace('/login');
    };

    return (
        <Sidebar
            collapsible="icon"
            className="border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl md:shadow-none"
            {...props}
        >
            <SidebarHeader className="border-b border-sidebar-border p-0">
                <div className={cn('flex h-[60px] shrink-0 items-center', expanded ? 'p-4' : 'w-full justify-center')}>
                    <button
                        type="button"
                        onClick={toggleSidebar}
                        className={cn(
                            'flex shrink-0 items-center justify-center rounded-md text-sidebar-foreground transition-colors hover:bg-sidebar-accent',
                            expanded ? 'mr-2 p-2' : 'h-10 w-10'
                        )}
                        aria-label="Alternar menú"
                    >
                        <Menu size={24} className="shrink-0" />
                    </button>
                    <div
                        className={cn(
                            'flex flex-1 items-center justify-center transition-all duration-300',
                            expanded ? 'min-w-[192px] pr-12 opacity-100' : 'w-0 overflow-hidden opacity-0'
                        )}
                    >
                        <Link href="/staff" className="relative flex h-14 w-52 items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={APP_CONFIG.SIDEBAR_LOGO_URL}
                                alt="IUS Urbano"
                                className="h-full w-full scale-110 object-contain"
                            />
                        </Link>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[11px] font-semibold tracking-wider text-sidebar-foreground/50">
                        {displayUser.role === 'REVISOR' ? 'Revisor' : 'Curador'}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Mi Panel de Trabajo"
                                    isActive={pathname === '/staff'}
                                >
                                    <Link href="/staff">
                                        <LayoutDashboard />
                                        <span>Mi Panel de Trabajo</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {isCurador && (
                                <>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip="Nueva Carga Legal"
                                            isActive={pathname.startsWith('/staff/carga')}
                                        >
                                            <Link href="/staff/carga">
                                                <Upload />
                                                <span>Nueva Carga Legal</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip="Biblioteca Legal"
                                            isActive={pathname.startsWith('/staff/biblioteca')}
                                        >
                                            <Link href="/staff/biblioteca">
                                                <Library />
                                                <span>Biblioteca Legal (Pipeline)</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip="Etiquetas"
                                            isActive={pathname.startsWith('/staff/etiquetas')}
                                        >
                                            <Link href="/staff/etiquetas">
                                                <Tags />
                                                <span>Etiquetas</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip="Correcciones Pendientes"
                                            isActive={pathname.startsWith('/staff/correcciones')}
                                        >
                                            <Link href="/staff/correcciones">
                                                <AlertCircle />
                                                <span>Correcciones Pendientes</span>
                                            </Link>
                                        </SidebarMenuButton>
                                        {rechazados > 0 && (
                                            <SidebarMenuBadge className="bg-destructive text-destructive-foreground">
                                                {rechazados}
                                            </SidebarMenuBadge>
                                        )}
                                    </SidebarMenuItem>
                                </>
                            )}

                            {isRevisor && (
                                <>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip="Cola de Revisión"
                                            isActive={pathname.startsWith('/staff/revision')}
                                        >
                                            <Link href="/staff/revision">
                                                <ClipboardCheck />
                                                <span>Cola de Revisión</span>
                                            </Link>
                                        </SidebarMenuButton>
                                        {pendientesRevision > 0 && (
                                            <SidebarMenuBadge className="bg-primary text-primary-foreground">
                                                {pendientesRevision}
                                            </SidebarMenuBadge>
                                        )}
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip="Biblioteca publicada"
                                            isActive={pathname.startsWith('/staff/biblioteca-publicados')}
                                        >
                                            <Link href="/staff/biblioteca-publicados">
                                                <BookOpen />
                                                <span>Biblioteca publicada</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip="Mi historial"
                                            isActive={pathname.startsWith('/staff/historial')}
                                        >
                                            <Link href="/staff/historial">
                                                <History />
                                                <span>Mi historial</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    suppressHydrationWarning
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={displayUser.avatar || undefined} alt={displayUser.name} />
                                        <AvatarFallback className="rounded-lg">{displayUser.initials}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{displayUser.name}</span>
                                        <span className="truncate text-xs">{displayUser.email}</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={displayUser.avatar || undefined} alt={displayUser.name} />
                                            <AvatarFallback className="rounded-lg">
                                                {displayUser.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{displayUser.name}</span>
                                            <span className="truncate text-xs text-muted-foreground">
                                                {displayUser.role}
                                            </span>
                                            <span className="truncate text-xs">{displayUser.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => router.push('/staff/perfil')}
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Perfil</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => router.push('/staff/perfil?tab=security')}
                                >
                                    <KeyRound className="mr-2 h-4 w-4" />
                                    <span>Cambiar contraseña</span>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={() => setIsAlertOpen(true)}
                                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Cerrar sesión</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro que deseas cerrar sesión?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Serás redirigido a la pantalla de inicio de sesión.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>No</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleLogout}
                                        className="bg-destructive hover:bg-destructive/90"
                                    >
                                        Sí
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
