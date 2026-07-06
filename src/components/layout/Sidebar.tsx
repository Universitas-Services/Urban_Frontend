'use client';

import { useChatStore } from '@/store/chat.store';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';
import { MessageSquare, Settings, LogOut, Menu, User, Headset, HelpCircle, Trash2 } from 'lucide-react';
import { IoMdBook, IoMdInformationCircleOutline } from 'react-icons/io';
import { IoHomeSharp, IoAddCircleOutline, IoPlayCircleOutline } from 'react-icons/io5';
import { FaBalanceScale } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { APP_CONFIG } from '@/config/app.config';
import type { Conversation } from '@/types/chat.types';
import { toast } from 'sonner';

export function Sidebar() {
    const {
        isSidebarOpen,
        toggleSidebar,
        conversations,
        activeConversationId,
        startNewChat,
        selectConversation,
        deleteConversation,
    } = useChatStore();
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const [conversationToDelete, setConversationToDelete] = useState<Conversation | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const checkViewport = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkViewport();
        window.addEventListener('resize', checkViewport);
        return () => window.removeEventListener('resize', checkViewport);
    }, []);

    const handleNewChat = () => {
        startNewChat();
        if (isMobile) toggleSidebar();
        router.push('/chat');
    };

    const handleLogout = async () => {
        await logout();
    };

    const handleConfirmDeleteConversation = async () => {
        if (!conversationToDelete) return;

        setIsDeleting(true);
        try {
            await deleteConversation(conversationToDelete.id);
            toast.success('Conversación eliminada correctamente.');
            setConversationToDelete(null);
        } catch {
            toast.error('No se pudo eliminar la conversación. Intenta de nuevo.');
        } finally {
            setIsDeleting(false);
        }
    };

    const expanded = isSidebarOpen;

    const sidebarContent = (
        <div className="flex min-h-0 flex-1 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
            {/* Header */}
            <div className={cn('flex items-center h-[60px] shrink-0', expanded ? 'p-4' : 'justify-center w-full')}>
                <button
                    onClick={toggleSidebar}
                    aria-label={isSidebarOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
                    className={cn(
                        'flex items-center justify-center rounded-md hover:bg-sidebar-accent transition-colors text-sidebar-foreground shrink-0',
                        expanded ? 'p-2 mr-2' : 'w-10 h-10'
                    )}
                >
                    <Menu size={24} className="shrink-0" />
                </button>
                <div
                    className={cn(
                        'flex-1 flex justify-center items-center transition-all duration-300 pr-12',
                        expanded ? 'opacity-100 min-w-[192px]' : 'opacity-0 w-0 md:hidden'
                    )}
                >
                    <div className="relative flex h-14 w-52 items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={APP_CONFIG.SIDEBAR_LOGO_URL}
                            alt="IUS Urbano"
                            className="h-full w-full scale-110 object-contain"
                        />
                    </div>
                </div>
            </div>

            <div
                className={cn(
                    'flex min-h-0 flex-1 flex-col',
                    isMobile && 'overflow-y-auto custom-scrollbar sidebar-scrollbar'
                )}
            >
                {/* Menú Principal Section */}
                <div className="w-full flex-shrink-0 mt-1">
                    <div
                        className={cn(
                            'mb-1 transition-opacity duration-300',
                            expanded ? 'px-3 opacity-100' : 'opacity-0 hidden'
                        )}
                    >
                        <p className="text-[11px] font-semibold text-sidebar-foreground/50 tracking-wider">
                            Menú principal
                        </p>
                    </div>

                    {/* Home Button */}
                    <div className={cn('shrink-0 mb-0.5', expanded ? 'px-3' : 'w-full flex justify-center')}>
                        {expanded ? (
                            <button
                                onClick={() => router.push('/inicio')}
                                className={cn(
                                    'flex items-center py-1 rounded-lg transition-colors cursor-pointer',
                                    'w-full px-3 text-sidebar-foreground/80 hover:bg-sidebar-accent'
                                )}
                            >
                                <IoHomeSharp size={18} color="currentColor" className="shrink-0" />
                                <span className="font-medium text-[13px] ml-3">Inicio</span>
                            </button>
                        ) : (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => router.push('/inicio')}
                                        className="flex items-center justify-center w-10 h-10 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
                                    >
                                        <IoHomeSharp size={18} color="currentColor" className="shrink-0" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={15.4}>
                                    <p>Inicio</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>

                    {/* Aula Ciudad Button */}
                    <div className={cn('shrink-0 my-0.5', expanded ? 'px-3' : 'w-full flex justify-center')}>
                        {expanded ? (
                            <button
                                onClick={() => router.push('/proyecto-ley')}
                                className="flex items-center py-1 rounded-lg transition-colors cursor-pointer w-full px-3 text-sidebar-foreground/80 hover:bg-sidebar-accent"
                            >
                                <IoPlayCircleOutline size={18} color="currentColor" className="shrink-0" />
                                <span className="font-medium text-[13px] ml-3">Aula Ciudad</span>
                            </button>
                        ) : (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => router.push('/proyecto-ley')}
                                        className="flex items-center justify-center w-10 h-10 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
                                    >
                                        <IoPlayCircleOutline size={18} color="currentColor" className="shrink-0" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={15.4}>
                                    <p>Aula Ciudad</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>

                    {/* Repositorio Legal Button */}
                    <div className={cn('shrink-0 my-0.5', expanded ? 'px-3' : 'w-full flex justify-center')}>
                        {expanded ? (
                            <button
                                onClick={() => router.push('/repositorio-legal')}
                                className="flex items-center py-1 rounded-lg transition-colors cursor-pointer w-full px-3 text-sidebar-foreground/80 hover:bg-sidebar-accent"
                            >
                                <FaBalanceScale size={18} color="currentColor" className="shrink-0" />
                                <span className="font-medium text-[13px] ml-3">Repositorio legal</span>
                            </button>
                        ) : (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => router.push('/repositorio-legal')}
                                        className="flex items-center justify-center w-10 h-10 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
                                    >
                                        <FaBalanceScale size={18} color="currentColor" className="shrink-0" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={15.4}>
                                    <p>Repositorio legal</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>

                    {/* Biblioteca Legal Button */}
                    <div className={cn('shrink-0 my-0.5', expanded ? 'px-3' : 'w-full flex justify-center')}>
                        {expanded ? (
                            <button
                                onClick={() => router.push('/biblioteca-legal')}
                                className="flex items-center py-1 rounded-lg transition-colors cursor-pointer w-full px-3 text-sidebar-foreground/80 hover:bg-sidebar-accent"
                            >
                                <IoMdBook size={18} color="currentColor" className="shrink-0" />
                                <span className="font-medium text-[13px] ml-3">Biblioteca Legal</span>
                            </button>
                        ) : (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => router.push('/biblioteca-legal')}
                                        className="flex items-center justify-center w-10 h-10 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
                                    >
                                        <IoMdBook size={18} color="currentColor" className="shrink-0" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={15.4}>
                                    <p>Biblioteca Legal</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                </div>

                {/* Navigation / History */}
                <div className={cn('flex flex-1 flex-col min-h-0', expanded ? 'px-3' : 'items-center')}>
                    {!expanded ? (
                        <div className="w-full flex justify-center pt-4 text-sidebar-foreground/60 transition-opacity duration-300">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={handleNewChat}
                                        className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors cursor-pointer"
                                    >
                                        <MessageSquare size={18} color="currentColor" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={15.4}>
                                    <p>Historial</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    ) : (
                        <>
                            <div className="shrink-0 mt-1 border-t border-sidebar-border pt-2">
                                <p className="text-[11px] font-semibold text-sidebar-foreground/50 tracking-wider mb-1 px-3">
                                    Consultor IA - Derecho Urbanístico
                                </p>

                                <div className="shrink-0">
                                    <button
                                        onClick={handleNewChat}
                                        className="flex w-full items-center rounded-lg border border-transparent px-3 py-1 text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent cursor-pointer"
                                        title="Iniciar nuevo chat"
                                    >
                                        <IoAddCircleOutline size={18} color="currentColor" className="shrink-0" />
                                        <span className="ml-2.5 overflow-hidden whitespace-nowrap text-[13px] font-medium">
                                            Iniciar nuevo chat
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div
                                className={cn(
                                    'mt-1',
                                    !isMobile && 'min-h-0 flex-1 overflow-y-auto custom-scrollbar sidebar-scrollbar'
                                )}
                            >
                                {(() => {
                                    const validConversations = conversations.filter(
                                        (c) =>
                                            c.title !== 'Nueva conversación' &&
                                            (!('messageCount' in c) || (c.messageCount as number) > 0)
                                    );

                                    const todayDate = new Date();
                                    todayDate.setHours(0, 0, 0, 0);

                                    const yesterdayDate = new Date(todayDate);
                                    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

                                    const startOfWeekDate = new Date(todayDate);
                                    startOfWeekDate.setDate(startOfWeekDate.getDate() - 7);

                                    const grouped = {
                                        Hoy: [] as typeof validConversations,
                                        Ayer: [] as typeof validConversations,
                                        'Esta semana': [] as typeof validConversations,
                                        Anteriores: [] as typeof validConversations,
                                    };

                                    validConversations.forEach((conv) => {
                                        const convDateStr = conv.lastMessageAt;
                                        if (!convDateStr) {
                                            grouped.Anteriores.push(conv);
                                            return;
                                        }

                                        const convDate = new Date(convDateStr);
                                        convDate.setHours(0, 0, 0, 0);

                                        if (convDate.getTime() === todayDate.getTime()) {
                                            grouped.Hoy.push(conv);
                                        } else if (convDate.getTime() === yesterdayDate.getTime()) {
                                            grouped.Ayer.push(conv);
                                        } else if (convDate.getTime() >= startOfWeekDate.getTime()) {
                                            grouped['Esta semana'].push(conv);
                                        } else {
                                            grouped.Anteriores.push(conv);
                                        }
                                    });

                                    const groups = [
                                        { label: 'Hoy', items: grouped.Hoy },
                                        { label: 'Ayer', items: grouped.Ayer },
                                        { label: 'Esta semana', items: grouped['Esta semana'] },
                                        { label: 'Anteriores', items: grouped.Anteriores },
                                    ].filter((g) => g.items.length > 0);

                                    if (groups.length === 0) {
                                        return (
                                            <p className="text-sm px-3 text-sidebar-foreground/40 text-center py-4">
                                                No hay historial
                                            </p>
                                        );
                                    }

                                    return groups.map((group) => (
                                        <div key={group.label} className="mb-2">
                                            <p className="text-xs text-sidebar-foreground/40 px-3 mb-0.5">
                                                {group.label}
                                            </p>
                                            <div className="space-y-0.5">
                                                {group.items.map((conv) => {
                                                    const isActive = conv.id === activeConversationId;
                                                    return (
                                                        <div
                                                            key={conv.id}
                                                            onClick={() => {
                                                                void selectConversation(conv.id);
                                                                if (isMobile) toggleSidebar();
                                                                router.push('/chat');
                                                            }}
                                                            className={cn(
                                                                'group flex items-center justify-between gap-1 px-3 py-1 rounded-lg text-[13px] cursor-pointer transition-colors whitespace-nowrap overflow-hidden',
                                                                isActive
                                                                    ? 'bg-primary/10 border-l-2 border-sidebar-foreground text-sidebar-foreground'
                                                                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent border-l-2 border-transparent'
                                                            )}
                                                        >
                                                            <span
                                                                className={cn(
                                                                    'min-w-0 flex-1 truncate transition-opacity duration-300',
                                                                    expanded ? 'opacity-100' : 'opacity-0'
                                                                )}
                                                            >
                                                                {conv.title}
                                                            </span>
                                                            {expanded ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={(event) => {
                                                                        event.stopPropagation();
                                                                        setConversationToDelete(conv);
                                                                    }}
                                                                    className={cn(
                                                                        'shrink-0 rounded p-1 text-sidebar-foreground/50 transition-opacity hover:bg-red-50 hover:text-red-600',
                                                                        isMobile
                                                                            ? 'opacity-100'
                                                                            : 'opacity-0 group-hover:opacity-100'
                                                                    )}
                                                                    aria-label="Eliminar conversación"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                                                                </button>
                                                            ) : null}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </>
                    )}
                </div>

                {/* Otros Servicios Section */}
                <div className="w-full flex-shrink-0 mb-1 mt-2 pt-2 border-t border-sidebar-border">
                    <div className={cn('shrink-0 mb-0.5', expanded ? 'px-3' : 'w-full flex justify-center')}>
                        {expanded ? (
                            <button
                                onClick={() => router.push('/acerca-de')}
                                className="flex items-center py-1 rounded-lg transition-colors cursor-pointer w-full px-3 text-sidebar-foreground/80 hover:bg-sidebar-accent"
                            >
                                <IoMdInformationCircleOutline
                                    size={18}
                                    color="currentColor"
                                    className="shrink-0 info-flash-icon"
                                />
                                <span className="font-medium text-[13px] ml-3">Acerca de</span>
                            </button>
                        ) : (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => router.push('/acerca-de')}
                                        className="flex items-center justify-center w-10 h-10 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
                                    >
                                        <IoMdInformationCircleOutline
                                            size={18}
                                            color="currentColor"
                                            className="shrink-0 info-flash-icon"
                                        />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={15.4}>
                                    <p>Acerca de</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>

                    {/* FAQ Button */}
                    <div className={cn('shrink-0 my-0.5', expanded ? 'px-3' : 'w-full flex justify-center')}>
                        {expanded ? (
                            <button
                                onClick={() => router.push('/faq')}
                                className="flex items-center py-1 rounded-lg transition-colors cursor-pointer w-full px-3 text-sidebar-foreground/80 hover:bg-sidebar-accent"
                            >
                                <HelpCircle size={18} color="currentColor" className="shrink-0" />
                                <span className="font-medium text-[13px] ml-3">FAQ</span>
                            </button>
                        ) : (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => router.push('/faq')}
                                        className="flex items-center justify-center w-10 h-10 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
                                    >
                                        <HelpCircle size={18} color="currentColor" className="shrink-0" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={15.4}>
                                    <p>FAQ</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>

                    <div className={cn('shrink-0 mb-0', expanded ? 'px-3' : 'w-full flex justify-center')}>
                        {expanded ? (
                            <a
                                href="https://wa.me/584145051716"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center py-1.5 rounded-lg transition-colors border-transparent w-full px-3 text-sidebar-foreground/80 hover:bg-sidebar-accent border cursor-pointer"
                            >
                                <Headset size={18} color="currentColor" className="shrink-0 support-bounce-icon" />
                                <span className="font-medium text-[13px] ml-3">Soporte técnico</span>
                            </a>
                        ) : (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a
                                        href="https://wa.me/584145051716"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-10 h-10 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
                                    >
                                        <Headset
                                            size={18}
                                            color="currentColor"
                                            className="shrink-0 support-bounce-icon"
                                        />
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={15.4}>
                                    <p>Soporte técnico</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Settings / User */}
            <div
                className={cn(
                    'relative mt-auto shrink-0',
                    expanded ? 'px-3 pb-3' : 'flex w-full flex-col items-center',
                    isMobile && 'pb-[max(1rem,env(safe-area-inset-bottom,0px))]'
                )}
            >
                <DropdownMenu>
                    {!expanded ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center justify-center w-9 h-9 rounded-lg outline-none hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors text-sidebar-foreground/60 focus-visible:ring-0">
                                        <Settings size={18} color="currentColor" className="gear-spin-icon" />
                                    </button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={15.4}>
                                <p>Configuración</p>
                            </TooltipContent>
                        </Tooltip>
                    ) : (
                        <DropdownMenuTrigger asChild>
                            <div
                                role="button"
                                className="flex outline-none items-center space-x-3 bg-sidebar-accent hover:bg-primary/12 py-2 px-3 rounded-xl border border-sidebar-border transition-all duration-300 cursor-pointer focus-visible:ring-0"
                            >
                                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-on-primary shrink-0">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="flex-1 overflow-hidden text-left">
                                    <p className="text-[13px] font-medium text-sidebar-foreground truncate">
                                        {user?.name || 'Usuario'}
                                    </p>
                                    <p className="text-[11px] text-sidebar-foreground/60 truncate">
                                        {user?.email || 'test@email.com'}
                                    </p>
                                </div>
                                <Settings size={14} color="currentColor" className="shrink-0 gear-spin-icon" />
                            </div>
                        </DropdownMenuTrigger>
                    )}

                    <DropdownMenuContent
                        side={expanded ? 'top' : 'right'}
                        align="start"
                        sideOffset={18}
                        className="w-[260px] bg-white border-surface-soft/30 shadow-2xl rounded-xl p-0"
                    >
                        {/* User Info Header Block */}
                        <div className="flex items-center gap-3 p-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-dark text-white flex items-center justify-center text-sm font-bold shrink-0">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-neutral-dark truncate leading-tight">
                                    {user?.name || 'Usuario'}
                                </p>
                                <p className="text-sm text-neutral-dark/60 truncate leading-tight">
                                    {user?.email || 'test@email.com'}
                                </p>
                            </div>
                        </div>

                        <DropdownMenuSeparator className="m-0 bg-surface-soft/10" />

                        <div className="p-1">
                            <DropdownMenuItem
                                className="px-3 py-2.5 cursor-pointer text-neutral-dark focus:bg-surface-soft/20 rounded-lg font-medium transition-colors"
                                onClick={() => router.push('/perfil')}
                            >
                                <User className="mr-3 h-[18px] w-[18px]" />
                                Perfil
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-1 bg-surface-soft/10" />

                            <DropdownMenuItem
                                className="px-3 py-2.5 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 rounded-lg font-medium transition-colors"
                                onClick={() => setIsLogoutOpen(true)}
                            >
                                <LogOut className="mr-3 h-[18px] w-[18px]" />
                                Cerrar sesión
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialog
                    open={conversationToDelete !== null}
                    onOpenChange={(open) => {
                        if (!open && !isDeleting) {
                            setConversationToDelete(null);
                        }
                    }}
                >
                    <AlertDialogContent className="sm:max-w-md bg-white border border-surface-soft shadow-2xl rounded-2xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-neutral-dark text-xl font-bold">
                                ¿Eliminar esta conversación?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-neutral-dark/70 mt-2">
                                La conversación se eliminará de tu historial y no podrás recuperarla.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6 gap-2 sm:gap-0">
                            <AlertDialogCancel
                                disabled={isDeleting}
                                className="bg-transparent text-neutral-dark hover:bg-surface-soft/20 border border-surface-soft/60 rounded-lg"
                            >
                                Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={(event) => {
                                    event.preventDefault();
                                    void handleConfirmDeleteConversation();
                                }}
                                disabled={isDeleting}
                                className="bg-red-600 hover:bg-red-700 text-white border-transparent shadow shadow-red-600/20 font-bold rounded-lg disabled:opacity-50"
                            >
                                {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
                    <AlertDialogContent className="sm:max-w-md bg-white border border-surface-soft shadow-2xl rounded-2xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-neutral-dark text-xl font-bold">
                                ¿Cerrar sesión?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-neutral-dark/70 mt-2">
                                Estás a punto de salir de tu cuenta. Necesitarás volver a iniciar sesión para continuar
                                usando el Consultor IA.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6 gap-2 sm:gap-0">
                            <AlertDialogCancel className="bg-transparent text-neutral-dark hover:bg-surface-soft/20 border border-surface-soft/60 rounded-lg">
                                Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white border-transparent shadow shadow-red-600/20 font-bold rounded-lg"
                            >
                                Sí, cerrar sesión
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );

    return (
        <TooltipProvider delayDuration={300}>
            <>
                {isMobile && isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={toggleSidebar}
                    />
                )}

                <aside
                    className={cn(
                        'fixed top-0 left-0 z-50 flex flex-col overflow-hidden transition-all duration-300 ease-in-out shadow-2xl md:relative md:shadow-none border-r border-sidebar-border',
                        isMobile ? 'h-dvh' : 'h-full',
                        isMobile
                            ? isSidebarOpen
                                ? 'translate-x-0 w-72'
                                : '-translate-x-full w-72'
                            : isSidebarOpen
                              ? 'w-[280px]'
                              : 'w-[72px]'
                    )}
                >
                    {sidebarContent}
                </aside>
            </>
        </TooltipProvider>
    );
}
