'use client';

import * as React from 'react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { authService } from '@/lib/services/auth.service';
import { Loader2, UserPen, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileIncompleteModalProps {
    isOpen: boolean;
    onSuccess: () => void;
}

export function ProfileIncompleteModal({ isOpen, onSuccess }: ProfileIncompleteModalProps) {
    const [tipoUsuario, setTipoUsuario] = useState<string>('');
    const [nombreEnte, setNombreEnte] = useState<string>('');
    const [cargo, setCargo] = useState<string>('');
    const [estatusNormativa, setEstatusNormativa] = useState<string>('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!tipoUsuario) {
            toast.error('Debe seleccionar el tipo de usuario');
            return;
        }
        if (!nombreEnte) {
            toast.error('Debe ingresar el Ente/Institución');
            return;
        }
        if (tipoUsuario === 'SERVIDOR_PUBLICO') {
            if (!cargo) {
                toast.error('Debe ingresar su Cargo');
                return;
            }
            if (!estatusNormativa) {
                toast.error('Debe seleccionar el estatus de la normativa');
                return;
            }
        }

        setIsSubmitting(true);
        try {
            await authService.updateProfile({
                tipoUsuario: tipoUsuario,
                nombre_ente: nombreEnte,
                ...(tipoUsuario === 'SERVIDOR_PUBLICO' && {
                    cargo: cargo,
                    estatus_normativa_girs: estatusNormativa,
                }),
            });

            toast.success('Perfil completado correctamente');
            onSuccess();
        } catch (error) {
            console.error('Error al actualizar el perfil', error);
            const err = error as { response?: { data?: { message?: string } } };
            const errorMessage = err.response?.data?.message || 'Ocurrió un error al guardar los datos.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent
                className="sm:max-w-[480px] p-6 max-h-[95vh] overflow-y-auto rounded-[24px]"
                showCloseButton={false}
            >
                <div className="flex flex-col items-center w-full mb-4 relative z-10">
                    <div className="flex items-center justify-center w-12 h-10 rounded-xl bg-[#124C5A] mb-3">
                        <UserPen className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <DialogHeader className="p-0">
                        <DialogTitle className="text-[20px] sm:text-[22px] font-bold text-[#002D3A] text-center leading-tight">
                            Indica la siguiente información para continuar:
                        </DialogTitle>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5 relative z-20">
                        <Label htmlFor="tipoUsuario" className="text-[#475569] font-bold text-sm">
                            Tipo de usuario <span className="text-red-500">*</span>
                        </Label>
                        <Select value={tipoUsuario} onValueChange={setTipoUsuario}>
                            <SelectTrigger
                                id="tipoUsuario"
                                className="w-full rounded-md bg-[#F4F7FE] border-transparent h-10 px-4 focus:ring-[#124C5A]"
                            >
                                <SelectValue placeholder="Selecciona una opción" />
                            </SelectTrigger>
                            <SelectContent className="rounded-md">
                                <SelectItem value="SERVIDOR_PUBLICO">Servidor público</SelectItem>
                                <SelectItem value="ASESOR_PRIVADO">Asesor privado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {tipoUsuario && (
                        <div className="space-y-1.5 animate-in fade-in zoom-in duration-300">
                            <Label htmlFor="nombreEnte" className="text-[#475569] font-bold text-sm">
                                {tipoUsuario === 'ASESOR_PRIVADO'
                                    ? 'Ente/Institución a la que es asesor'
                                    : 'Ente/Institución'}
                            </Label>
                            <Input
                                id="nombreEnte"
                                placeholder="Nombre de la institución"
                                value={nombreEnte}
                                onChange={(e) => setNombreEnte(e.target.value)}
                                className="rounded-md bg-[#F4F7FE] border-transparent h-10 px-4 focus-visible:ring-[#124C5A]"
                            />
                        </div>
                    )}

                    {tipoUsuario === 'SERVIDOR_PUBLICO' && (
                        <>
                            <div className="space-y-1.5 animate-in fade-in zoom-in duration-300 delay-100">
                                <Label htmlFor="cargo" className="text-[#475569] font-bold text-sm">
                                    Cargo
                                </Label>
                                <Input
                                    id="cargo"
                                    placeholder="Tu cargo actual"
                                    value={cargo}
                                    onChange={(e) => setCargo(e.target.value)}
                                    className="rounded-md bg-[#F4F7FE] border-transparent h-10 px-4 focus-visible:ring-[#124C5A]"
                                />
                            </div>

                            <div className="space-y-1.5 animate-in fade-in zoom-in duration-300 delay-150 relative z-30">
                                <Label htmlFor="estatusNormativa" className="text-[#475569] font-bold text-sm">
                                    ¿Posee tu ente normativa GIRS actualmente?
                                </Label>
                                <Select value={estatusNormativa} onValueChange={setEstatusNormativa}>
                                    <SelectTrigger
                                        id="estatusNormativa"
                                        className="w-full rounded-md bg-[#F4F7FE] border-transparent h-10 px-4 focus:ring-[#124C5A]"
                                    >
                                        <SelectValue placeholder="Selecciona el estado normativo" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-md">
                                        <SelectItem value="VIGENTE">Sí está vigente</SelectItem>
                                        <SelectItem value="EN_MORA">No posee / En mora</SelectItem>
                                        <SelectItem value="EN_REVISION">En revisión / En mora</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={isSubmitting || !tipoUsuario}
                            className="w-full bg-[#124C5A] hover:bg-[#0E3A45] text-white rounded-md h-11 text-base font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    Guardar Información <ArrowRight className="w-5 h-5 ml-1" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
