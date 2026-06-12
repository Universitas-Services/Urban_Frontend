'use client';

import { useChat } from '@/store/chat.context';
import { useAuth } from '@/store/auth.context';
import { cn } from '@/lib/utils';
import { MessageSquare, Settings, LogOut, Menu, X, User, Headset, HelpCircle } from 'lucide-react';
import { IoMdBook, IoMdInformationCircleOutline } from 'react-icons/io';
import { IoHomeSharp, IoAddCircleOutline } from 'react-icons/io5';
import { FaGavel, FaBalanceScale } from 'react-icons/fa';
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

export function Sidebar() {
    const { isSidebarOpen, dispatch, conversations, activeConversationId } = useChat();
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);

    useEffect(() => {
        const checkViewport = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkViewport();
        window.addEventListener('resize', checkViewport);
        return () => window.removeEventListener('resize', checkViewport);
    }, []);

    const toggleSidebar = () => dispatch({ type: 'TOGGLE_SIDEBAR' });
    const handleNewChat = () => {
        dispatch({ type: 'SET_ACTIVE', payload: null });
        if (isMobile) toggleSidebar();
        router.push('/chat');
    };

    const handleLogout = async () => {
        await logout();
    };

    const expanded = isSidebarOpen;

    const sidebarContent = (
        <div className="flex flex-col h-full bg-primary text-on-primary border-r border-surface-soft/10">
            {/* Header */}
            <div className={cn('flex items-center h-[60px] shrink-0', expanded ? 'p-4' : 'justify-center w-full')}>
                <button
                    onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
                    className={cn(
                        'flex items-center justify-center rounded-md hover:bg-surface-soft/10 transition-colors text-on-primary shrink-0',
                        expanded ? 'p-2 mr-2' : 'w-10 h-10'
                    )}
                >
                    <Menu size={24} color="var(--color-white)" />
                </button>
                <div
                    className={cn(
                        'flex-1 flex justify-center items-center transition-all duration-300 pr-12',
                        expanded ? 'opacity-100 min-w-[192px]' : 'opacity-0 w-0 md:hidden'
                    )}
                >
                    <div className="relative h-12 w-48 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/asset/LOGO UNIVERSITAS LEGAL (BLANCO).png"
                            alt="Universitas Legal"
                            className="object-contain w-full h-full"
                        />
                    </div>
                </div>
            </div>

            {/* Menú Principal Section */}
            <div className="w-full flex-shrink-0 mt-2">
                <div
                    className={cn(
                        'mb-2 transition-opacity duration-300',
                        expanded ? 'px-3 opacity-100' : 'opacity-0 hidden'
                    )}
                >
                    <p className="text-[11px] font-semibold text-on-primary/50 tracking-wider">Menú principal</p>
                </div>

                {/* Home Button */}
                <div className={cn('shrink-0 mb-0.5', expanded ? 'px-3' : 'w-full flex justify-center')}>
                    {expanded ? (
                        <button
                            onClick={() => router.push('/inicio')}
                            className={cn(
                                'flex items-center py-1.5 rounded-lg transition-colors cursor-pointer',
                                'w-full px-3 text-on-primary/80 hover:bg-surface-soft/10'
                            )}
                        >
                            <IoHomeSharp size={18} color="var(--color-white)" className="shrink-0" />
                            <span className="font-medium text-[13px] ml-3">Inicio</span>
                        </button>
                    ) : (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => router.push('/inicio')}
                                    className="flex items-center justify-center w-10 h-10 rounded-lg text-on-primary/70 hover:text-on-primary hover:bg-surface-soft/10 transition-colors cursor-pointer"
                                >
                                    <IoHomeSharp size={18} color="var(--color-white)" className="shrink-0" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={15.4}>
                                <p>Inicio</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>

                {/* Proyecto Ley Button */}
                <div className={cn('shrink-0 my-0.5', expanded ? 'px-3' : 'w-full flex justify-center')}>
                    {expanded ? (
                        <button
                            onClick={() => router.push('/proyecto-ley')}
                            className="flex items-center py-1.5 rounded-lg transition-colors cursor-pointer w-full px-3 text-on-primary/80 hover:bg-surface-soft/10"
                        >
                            <FaGavel size={18} color="var(--color-white)" className="shrink-0 gavel-icon" />
                            <span className="font-medium text-[13px] ml-3">Proyecto ley</span>
                        </button>
                    ) : (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => router.push('/proyecto-ley')}
                                    className="flex items-center justify-center w-10 h-10 rounded-lg text-on-primary/70 hover:text-on-primary hover:bg-surface-soft/10 transition-colors cursor-pointer"
                                >
                                    <FaGavel size={18} color="var(--color-white)" className="shrink-0 gavel-icon" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={15.4}>
                                <p>Proyecto ley</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>

                {/* Repositorio Legal Button */}
                <div className={cn('shrink-0 my-0.5', expanded ? 'px-3' : 'w-full flex justify-center')}>
                    {expanded ? (
                        <button
                            onClick={() => router.push('/repositorio-legal')}
                            className="flex items-center py-1.5 rounded-lg transition-colors cursor-pointer w-full px-3 text-on-primary/80 hover:bg-surface-soft/10"
                        >
                            <FaBalanceScale size={18} color="var(--color-white)" className="shrink-0" />
                            <span className="font-medium text-[13px] ml-3">Repositorio legal</span>
                        </button>
                    ) : (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => router.push('/repositorio-legal')}
                                    className="flex items-center justify-center w-10 h-10 rounded-lg text-on-primary/70 hover:text-on-primary hover:bg-surface-soft/10 transition-colors cursor-pointer"
                                >
                                    <FaBalanceScale size={18} color="var(--color-white)" className="shrink-0" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={15.4}>
                                <p>Repositorio legal</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>

                {/* Biblioteca GIRS Button */}
                <div className={cn('shrink-0 my-0.5', expanded ? 'px-3' : 'w-full flex justify-center')}>
                    {expanded ? (
                        <button
                            onClick={() => router.push('/biblioteca-girs')}
                            className="flex items-center py-1.5 rounded-lg transition-colors cursor-pointer w-full px-3 text-on-primary/80 hover:bg-surface-soft/10"
                        >
                            <IoMdBook size={18} color="var(--color-white)" className="shrink-0" />
                            <span className="font-medium text-[13px] ml-3">Biblioteca GIRS</span>
                        </button>
                    ) : (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => router.push('/biblioteca-girs')}
                                    className="flex items-center justify-center w-10 h-10 rounded-lg text-on-primary/70 hover:text-on-primary hover:bg-surface-soft/10 transition-colors cursor-pointer"
                                >
                                    <IoMdBook size={18} color="var(--color-white)" className="shrink-0" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={15.4}>
                                <p>Biblioteca GIRS</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </div>

            {/* Navigation / History */}
            <div
                className={cn(
                    'flex-1 py-2 custom-scrollbar',
                    expanded ? 'overflow-y-auto px-3' : 'flex flex-col items-center'
                )}
            >
                {!expanded ? (
                    <div className="w-full flex justify-center pt-4 text-on-primary/60 transition-opacity duration-300">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={handleNewChat}
                                    className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-surface-soft/10 hover:text-on-primary transition-colors cursor-pointer"
                                >
                                    <MessageSquare size={18} color="var(--color-white)" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={15.4}>
                                <p>Historial</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                ) : (
                    <div className="space-y-6 mt-2 transition-opacity duration-300">
                        <div>
                            <p className="text-[11px] font-semibold text-on-primary/50 tracking-wider mb-2 px-3 pt-4 border-t border-surface-soft/10">
                                Consultor GIRS IA
                            </p>

                            {/* New Chat Button */}
                            <div className={cn('shrink-0 mb-1', expanded ? '' : 'w-full flex justify-center')}>
                                <button
                                    onClick={handleNewChat}
                                    className={cn(
                                        'flex items-center py-1.5 rounded-lg transition-colors border-transparent cursor-pointer',
                                        expanded
                                            ? 'w-full px-3 text-on-primary/80 hover:bg-surface-soft/10 border'
                                            : 'w-10 h-10 justify-center text-on-primary/70 hover:text-on-primary hover:bg-surface-soft/10'
                                    )}
                                    title="Iniciar nuevo chat"
                                >
                                    <IoAddCircleOutline size={20} color="var(--color-white)" className="shrink-0" />
                                    <span
                                        className={cn(
                                            'font-medium text-[13px] transition-all duration-300 whitespace-nowrap overflow-hidden',
                                            expanded ? 'ml-3 opacity-100' : 'opacity-0 w-0 hidden'
                                        )}
                                    >
                                        Iniciar nuevo chat
                                    </span>
                                </button>
                            </div>

                            {/* Filter out empty/new chats with no messages from history */}
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
                                        <p className="text-sm px-3 text-on-primary/40 text-center py-4">
                                            No hay historial
                                        </p>
                                    );
                                }

                                return groups.map((group) => (
                                    <div key={group.label} className="mb-4">
                                        <p className="text-xs text-on-primary/40 px-3 mb-1">{group.label}</p>
                                        <div className="space-y-0.5">
                                            {group.items.map((conv) => {
                                                const isActive = conv.id === activeConversationId;
                                                return (
                                                    <div
                                                        key={conv.id}
                                                        onClick={() => {
                                                            dispatch({ type: 'SET_ACTIVE', payload: conv.id });
                                                            if (isMobile) toggleSidebar();
                                                            router.push('/chat');
                                                        }}
                                                        className={cn(
                                                            'group flex items-center justify-between px-3 py-1.5 rounded-lg text-[13px] cursor-pointer transition-colors whitespace-nowrap overflow-hidden',
                                                            isActive
                                                                ? 'bg-accent/20 border-l-2 border-accent text-on-primary'
                                                                : 'text-on-primary/80 hover:bg-on-primary/10 border-l-2 border-transparent'
                                                        )}
                                                    >
                                                        <span
                                                            className={cn(
                                                                'truncate transition-opacity duration-300',
                                                                expanded ? 'opacity-100' : 'opacity-0'
                                                            )}
                                                        >
                                                            {conv.title}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                )}
            </div>

            {/* Otros Servicios Section */}
            <div className="w-full flex-shrink-0 mb-2 mt-4 pt-4 border-t border-surface-soft/10">
                <div className={cn('shrink-0 mb-0.5', expanded ? 'px-3' : 'w-full flex justify-center')}>
                    {expanded ? (
                        <button
                            onClick={() => router.push('/acerca-de')}
                            className="flex items-center py-1.5 rounded-lg transition-colors cursor-pointer w-full px-3 text-on-primary/80 hover:bg-surface-soft/10"
                        >
                            <IoMdInformationCircleOutline
                                size={18}
                                color="var(--color-white)"
                                className="shrink-0 info-flash-icon"
                            />
                            <span className="font-medium text-[13px] ml-3">Acerca de</span>
                        </button>
                    ) : (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => router.push('/acerca-de')}
                                    className="flex items-center justify-center w-10 h-10 rounded-lg text-on-primary/70 hover:text-on-primary hover:bg-surface-soft/10 transition-colors cursor-pointer"
                                >
                                    <IoMdInformationCircleOutline
                                        size={18}
                                        color="var(--color-white)"
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
                            className="flex items-center py-1.5 rounded-lg transition-colors cursor-pointer w-full px-3 text-on-primary/80 hover:bg-surface-soft/10"
                        >
                            <HelpCircle size={18} color="var(--color-white)" className="shrink-0" />
                            <span className="font-medium text-[13px] ml-3">FAQ</span>
                        </button>
                    ) : (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => router.push('/faq')}
                                    className="flex items-center justify-center w-10 h-10 rounded-lg text-on-primary/70 hover:text-on-primary hover:bg-surface-soft/10 transition-colors cursor-pointer"
                                >
                                    <HelpCircle size={18} color="var(--color-white)" className="shrink-0" />
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
                            className="flex items-center py-1.5 rounded-lg transition-colors border-transparent w-full px-3 text-on-primary/80 hover:bg-surface-soft/10 border cursor-pointer"
                        >
                            <Headset size={18} color="var(--color-white)" className="shrink-0 support-bounce-icon" />
                            <span className="font-medium text-[13px] ml-3">Soporte técnico</span>
                        </a>
                    ) : (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <a
                                    href="https://wa.me/584145051716"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10 rounded-lg text-on-primary/70 hover:text-on-primary hover:bg-surface-soft/10 transition-colors cursor-pointer"
                                >
                                    <Headset
                                        size={18}
                                        color="var(--color-white)"
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

            {/* Footer Settings / User */}
            <div
                className={cn(
                    'shrink-0 pb-3 relative mt-auto',
                    expanded ? 'px-3' : 'w-full flex flex-col items-center'
                )}
            >
                <DropdownMenu>
                    {!expanded ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center justify-center w-9 h-9 rounded-lg outline-none hover:bg-surface-soft/10 hover:text-on-primary transition-colors text-on-primary/60 focus-visible:ring-0">
                                        <Settings size={18} color="var(--color-white)" className="gear-spin-icon" />
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
                                className="flex outline-none items-center space-x-3 bg-surface-soft/10 hover:bg-surface-soft/20 py-2 px-3 rounded-xl border border-surface-soft/5 transition-all duration-300 cursor-pointer focus-visible:ring-0"
                            >
                                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-on-primary shrink-0">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="flex-1 overflow-hidden text-left">
                                    <p className="text-[13px] font-medium text-on-primary truncate">
                                        {user?.name || 'Usuario'}
                                    </p>
                                    <p className="text-[11px] text-on-primary/60 truncate">
                                        {user?.email || 'test@email.com'}
                                    </p>
                                </div>
                                <Settings size={14} color="var(--color-white)" className="shrink-0 gear-spin-icon" />
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
                        'fixed md:relative top-0 left-0 z-50 h-full transition-all duration-300 ease-in-out shadow-2xl md:shadow-none border-r border-surface-soft/10',
                        isMobile
                            ? isSidebarOpen
                                ? 'translate-x-0 w-72'
                                : '-translate-x-full w-72'
                            : isSidebarOpen
                              ? 'w-[280px]'
                              : 'w-[72px]'
                    )}
                >
                    {isMobile && isSidebarOpen && (
                        <button
                            onClick={handleNewChat}
                            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-surface-soft/10 hover:text-on-primary transition-colors"
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <MessageSquare size={18} color="var(--color-white)" />
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={15.4}>
                                    <p>Historial</p>
                                </TooltipContent>
                            </Tooltip>
                        </button>
                    )}
                    {sidebarContent}
                </aside>
            </>
        </TooltipProvider>
    );
}
