'use client';

import { useState } from 'react';
import { Megaphone, Send, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NotificationBell } from '@/components/admin/dashboard/NotificationBell';
import { createNewsAction } from '@/lib/services/admin.service';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner';
import { APP_CONFIG } from '@/config/app.config';

export default function AvisosPage() {
    const { canWrite } = usePermissions();
    const { user } = useAuthStore();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePublish = async () => {
        if (!title.trim() || !message.trim()) {
            toast.error('Por favor, completa el título y el contenido del aviso.');
            return;
        }

        setIsLoading(true);
        try {
            await createNewsAction({
                title,
                content: message,
            });
            toast.success('Aviso publicado correctamente.');
            setTitle('');
            setMessage('');
        } catch (error) {
            console.error('Error al publicar aviso:', error);
            toast.error('Hubo un error al publicar el aviso. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full pt-1 pb-6">
            {/* Header Unificado - Más compacto */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex flex-col">
                    <h1 className="titulos-cards tracking-tight leading-tight whitespace-nowrap mb-0">
                        Publicar Nuevo Aviso Global
                    </h1>
                    <p className="descripcion-cards-small text-xs mt-0.5">
                        Difunde información importante a todos los usuarios de la plataforma.
                    </p>
                </div>

                <div className="flex items-center gap-3 justify-end min-w-[120px]">
                    <NotificationBell />
                    <Avatar className="h-8 w-8 border-2 border-emerald-500 cursor-pointer">
                        <AvatarImage src={user?.avatar ?? undefined} />
                        <AvatarFallback
                            style={{
                                color: 'var(--admin-avatar-text)',
                                backgroundColor: 'var(--admin-avatar-bg)',
                            }}
                        >
                            AD
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-2 items-stretch">
                {/* Formulario de Creación (3 columnas) */}
                {canWrite ? (
                    <div className="lg:col-span-3 flex">
                        <Card
                            className="border-none shadow-sm overflow-hidden flex flex-col w-full"
                            style={{ backgroundColor: 'var(--admin-filter-bg)' }}
                        >
                            <CardHeader className="py-3 px-5 border-b border-slate-200/50">
                                <CardTitle
                                    className="text-sm font-bold flex items-center gap-2"
                                    style={{ color: 'var(--admin-text-title)' }}
                                >
                                    <Megaphone className="h-4 w-4 text-emerald-600" />
                                    Detalles del Mensaje
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3 p-4 flex-1">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                        Título del Anuncio
                                    </label>
                                    <Input
                                        value={title}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                        placeholder="Escribe el título aquí..."
                                        className="bg-white border-none h-9 text-xs font-medium shadow-sm"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5 flex-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                        Contenido del Mensaje
                                    </label>
                                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm flex-1 flex flex-col">
                                        <Textarea
                                            value={message}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                                setMessage(e.target.value)
                                            }
                                            placeholder="Escribe el contenido detallado aquí..."
                                            className="flex-1 min-h-[180px] border-none focus-visible:ring-0 resize-none p-3 text-xs leading-relaxed"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end mt-2">
                                    <Button
                                        onClick={handlePublish}
                                        disabled={isLoading}
                                        className="h-10 px-8 font-bold bg-[var(--primary)] hover:opacity-90 text-white flex items-center gap-2 rounded-lg shadow-md shadow-blue-900/10 text-xs"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Publicando...
                                            </span>
                                        ) : (
                                            <>
                                                <Send className="h-3.5 w-3.5" /> Publicar Aviso
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="lg:col-span-3 flex items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-muted-foreground">
                        Como visualizador solo puedes consultar avisos publicados; no puedes crear nuevos.
                    </div>
                )}

                {/* Vista Previa (2 columnas) */}
                <div className="lg:col-span-2 flex">
                    <Card
                        className="border-none shadow-sm overflow-hidden flex flex-col w-full"
                        style={{ backgroundColor: 'var(--admin-filter-bg)' }}
                    >
                        <CardHeader className="py-3 px-5 border-b border-slate-200/50">
                            <CardTitle
                                className="text-sm font-bold flex items-center gap-2"
                                style={{ color: 'var(--admin-text-title)' }}
                            >
                                <Eye className="h-4 w-4 text-emerald-600" />
                                Vista Previa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex min-h-[400px] flex-1 flex-col items-center justify-center overflow-hidden rounded-b-xl p-6 relative">
                            {/* Modal de Aviso (Escalado para ser más compacto) */}
                            <div className="w-full max-w-[320px] min-h-[320px] bg-white rounded-[32px] shadow-xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-500 z-10 border border-white/50">
                                <div className="p-6 flex flex-col gap-4 flex-1 justify-center">
                                    <h3 className="text-base font-black text-slate-900 leading-tight text-center px-1">
                                        {title || 'TÍTULO DEL AVISO'}
                                    </h3>

                                    <div className="max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                                        <p className="text-[11px] text-slate-700 leading-relaxed text-center">
                                            {message || 'El contenido aparecerá aquí...'}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center gap-1.5 mt-2">
                                        <Avatar className="h-7 w-7 border-2 border-white shadow-sm">
                                            <AvatarImage
                                                src={APP_CONFIG.AGENT_AVATAR_URL}
                                                alt={APP_CONFIG.AGENT_NAME}
                                            />
                                            <AvatarFallback className="bg-slate-100 text-[9px] font-bold text-slate-600">
                                                {APP_CONFIG.AGENT_NAME.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">
                                            Universitas
                                        </span>
                                    </div>
                                </div>

                                <div className="shrink-0 bg-slate-50 p-4">
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        aria-hidden
                                        className="h-10 w-full rounded-xl bg-accent text-xs font-black tracking-widest text-white uppercase shadow-md shadow-accent/10"
                                    >
                                        Aceptar
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 text-center px-4">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest opacity-50">
                                    Vista Previa del Aviso
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
