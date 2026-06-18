'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Users, LogOut, ChevronsUpDown, ChevronRight, MessageSquare, Bell, Menu } from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from '@/components/ui/sidebar';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
import { useAuthStore } from '@/store/auth.store';

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter();
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);
    const { user, logout } = useAuthStore();
    const { state, toggleSidebar } = useSidebar();
    const expanded = state === 'expanded';

    const displayUser = {
        name: user?.nombre ? `${user.nombre} ${user.apellido ?? ''}`.trim() : 'Administrador',
        email: user?.email ?? '',
        avatar: user?.avatar ?? '',
        initials: user?.nombre?.charAt(0) ?? 'A',
    };

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
                        <Link href="/admin" className="relative flex h-14 w-52 items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/asset/icons_11.png"
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
                        Plataforma
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* Opción Inicio */}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Panel principal"
                                    onClick={() => {
                                        // Si ya estamos en el dashboard, disparamos el evento de refresco
                                        if (window.location.pathname === '/admin') {
                                            window.dispatchEvent(new CustomEvent('refresh-dashboard'));
                                        }
                                    }}
                                >
                                    <Link href="/admin">
                                        <LayoutDashboard />
                                        <span>Panel principal</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Opción Gestión de Usuarios (Desplegable) */}
                            <Collapsible asChild defaultOpen className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip="Gestión de usuarios">
                                            <Users />
                                            <span>Gestión de usuarios</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href="/admin/usuarios">
                                                        <span>Listado de usuarios</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href="/admin/usuarios/no-concretados">
                                                        <span>Usuarios no concretados</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>

                            {/* Opción Avisos */}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Avisos">
                                    <Link href="/admin/avisos">
                                        <Bell />
                                        <span>Avisos</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Historial de Chats (Movido al final) */}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Historial de Chats">
                                    <Link href="/admin/chats">
                                        <MessageSquare />
                                        <span>Historial de Chats</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
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
                                        <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
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
                                            <span className="truncate text-xs">{displayUser.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>

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
