'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Key, Settings } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { getFullProfileService } from '@/lib/services/auth.service';
import type { UserProfile } from '@/types/auth.types';
import { sanitizeLettersOnly, staffPasswordSchema } from '@/lib/validations/staff.schemas';

type Tab = 'edit' | 'security';

const profileSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, 'Mínimo 2 caracteres')
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/, 'Solo letras (sin números ni símbolos)'),
    apellido: z
        .string()
        .trim()
        .min(2, 'Mínimo 2 caracteres')
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/, 'Solo letras (sin números ni símbolos)'),
    telefono: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, 'La contraseña actual es obligatoria'),
        newPassword: staffPasswordSchema,
        confirmPassword: z.string().min(1, 'Debes confirmar tu contraseña'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

type PasswordFormValues = z.infer<typeof passwordSchema>;

function StaffProfileContent() {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') === 'security' ? 'security' : 'edit';
    const [activeTab, setActiveTab] = useState<Tab>(initialTab);

    const { user, updateProfile, changePassword } = useAuthStore();
    const [fullProfile, setFullProfile] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isEditingProfileMode, setIsEditingProfileMode] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const tab = searchParams.get('tab') === 'security' ? 'security' : 'edit';
        // eslint-disable-next-line react-hooks/set-state-in-effect -- sync tab con querystring
        setActiveTab(tab);
    }, [searchParams]);

    useEffect(() => {
        const load = async () => {
            setIsLoadingProfile(true);
            try {
                const profile = await getFullProfileService();
                setFullProfile(profile);
            } catch {
                toast.error('Error al cargar el perfil.');
            } finally {
                setIsLoadingProfile(false);
            }
        };
        load();
    }, []);

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        reset: resetProfile,
        setValue: setProfileValue,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: { nombre: '', apellido: '', telefono: '' },
    });

    useEffect(() => {
        if (!fullProfile) return;
        resetProfile({
            nombre: fullProfile.nombre ?? '',
            apellido: fullProfile.apellido ?? '',
            telefono: fullProfile.telefono ?? '',
        });
    }, [fullProfile, resetProfile]);

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset: resetPassword,
        formState: { errors: passwordErrors },
    } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    });

    const onSaveProfile = async (data: ProfileFormValues) => {
        setIsSavingProfile(true);
        try {
            await updateProfile({
                nombre: data.nombre.trim(),
                apellido: data.apellido.trim(),
                telefono: data.telefono?.trim() || '',
            });
            setFullProfile((prev) =>
                prev
                    ? {
                          ...prev,
                          nombre: data.nombre.trim(),
                          apellido: data.apellido.trim(),
                          telefono: data.telefono?.trim() || '',
                      }
                    : prev
            );
            setIsEditingProfileMode(false);
            toast.success('Perfil actualizado correctamente.');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error al actualizar el perfil.');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const onChangePassword = async (data: PasswordFormValues) => {
        setIsChangingPassword(true);
        try {
            await changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            toast.success('Contraseña actualizada correctamente.');
            resetPassword();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error al cambiar la contraseña.');
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-5xl space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-neutral-dark">Ajustes</h1>
                    <p className="text-sm text-muted-foreground">Perfil y seguridad de tu cuenta.</p>
                </div>
                {user?.role ? <Badge variant="secondary">{user.role}</Badge> : null}
            </div>

            <div className="overflow-hidden rounded-2xl border border-surface-soft bg-white shadow-sm">
                <div className="flex min-h-0 flex-col md:flex-row">
                    <div className="w-full space-y-0.5 border-r border-surface-soft/40 p-2 md:w-56">
                        <button
                            type="button"
                            onClick={() => setActiveTab('edit')}
                            className={cn(
                                'flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] transition-colors',
                                activeTab === 'edit'
                                    ? 'font-bold text-neutral-dark'
                                    : 'font-medium text-neutral-dark/70 hover:bg-surface-soft/10'
                            )}
                        >
                            <Settings className="h-4 w-4" />
                            Perfil
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('security')}
                            className={cn(
                                'flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] transition-colors',
                                activeTab === 'security'
                                    ? 'font-bold text-neutral-dark'
                                    : 'font-medium text-neutral-dark/70 hover:bg-surface-soft/10'
                            )}
                        >
                            <Key className="h-4 w-4" />
                            Cambiar contraseña
                        </button>
                    </div>

                    <div className="flex-1 p-5">
                        {activeTab === 'edit' ? (
                            <form onSubmit={handleSubmitProfile(onSaveProfile)} className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-bold text-neutral-dark">Información personal</h3>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        Actualiza tu nombre y datos de contacto.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-bold">Correo electrónico</label>
                                        <Input
                                            value={
                                                isLoadingProfile
                                                    ? 'Cargando...'
                                                    : fullProfile?.email || user?.email || ''
                                            }
                                            disabled
                                            className="h-9 bg-surface/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-bold">Nombre</label>
                                        <Input
                                            {...registerProfile('nombre')}
                                            disabled={!isEditingProfileMode}
                                            onChange={(e) =>
                                                setProfileValue('nombre', sanitizeLettersOnly(e.target.value), {
                                                    shouldValidate: true,
                                                })
                                            }
                                            className={cn(
                                                'h-9',
                                                !isEditingProfileMode && 'bg-surface/50',
                                                profileErrors.nombre && 'border-red-500'
                                            )}
                                        />
                                        {profileErrors.nombre ? (
                                            <p className="mt-1 text-xs text-red-500">{profileErrors.nombre.message}</p>
                                        ) : null}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-bold">Apellido</label>
                                        <Input
                                            {...registerProfile('apellido')}
                                            disabled={!isEditingProfileMode}
                                            onChange={(e) =>
                                                setProfileValue('apellido', sanitizeLettersOnly(e.target.value), {
                                                    shouldValidate: true,
                                                })
                                            }
                                            className={cn(
                                                'h-9',
                                                !isEditingProfileMode && 'bg-surface/50',
                                                profileErrors.apellido && 'border-red-500'
                                            )}
                                        />
                                        {profileErrors.apellido ? (
                                            <p className="mt-1 text-xs text-red-500">
                                                {profileErrors.apellido.message}
                                            </p>
                                        ) : null}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-bold">Teléfono (opcional)</label>
                                        <Input
                                            {...registerProfile('telefono')}
                                            disabled={!isEditingProfileMode}
                                            className={cn('h-9', !isEditingProfileMode && 'bg-surface/50')}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    {!isEditingProfileMode ? (
                                        <Button type="button" onClick={() => setIsEditingProfileMode(true)}>
                                            Editar
                                        </Button>
                                    ) : (
                                        <>
                                            <Button type="submit" disabled={isSavingProfile}>
                                                {isSavingProfile ? 'Guardando…' : 'Guardar'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setIsEditingProfileMode(false);
                                                    if (fullProfile) {
                                                        resetProfile({
                                                            nombre: fullProfile.nombre ?? '',
                                                            apellido: fullProfile.apellido ?? '',
                                                            telefono: fullProfile.telefono ?? '',
                                                        });
                                                    }
                                                }}
                                            >
                                                Cancelar
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-bold text-neutral-dark">Cambiar contraseña</h3>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        Mínimo 8 caracteres, con una mayúscula y un número.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-bold">Contraseña actual</label>
                                        <div className="relative">
                                            <Input
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                className="h-9 pr-10"
                                                autoComplete="current-password"
                                                {...registerPassword('currentPassword')}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                                onClick={() => setShowCurrentPassword((v) => !v)}
                                                aria-label="Ver contraseña actual"
                                            >
                                                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {passwordErrors.currentPassword ? (
                                            <p className="mt-1 text-xs text-red-500">
                                                {passwordErrors.currentPassword.message}
                                            </p>
                                        ) : null}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-bold">Nueva contraseña</label>
                                        <div className="relative">
                                            <Input
                                                type={showNewPassword ? 'text' : 'password'}
                                                className="h-9 pr-10"
                                                autoComplete="new-password"
                                                {...registerPassword('newPassword')}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                                onClick={() => setShowNewPassword((v) => !v)}
                                                aria-label="Ver nueva contraseña"
                                            >
                                                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {passwordErrors.newPassword ? (
                                            <p className="mt-1 text-xs text-red-500">
                                                {passwordErrors.newPassword.message}
                                            </p>
                                        ) : null}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-bold">Confirmar contraseña</label>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                className="h-9 pr-10"
                                                autoComplete="new-password"
                                                {...registerPassword('confirmPassword')}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                                onClick={() => setShowConfirmPassword((v) => !v)}
                                                aria-label="Ver confirmación"
                                            >
                                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {passwordErrors.confirmPassword ? (
                                            <p className="mt-1 text-xs text-red-500">
                                                {passwordErrors.confirmPassword.message}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>

                                <Button type="submit" disabled={isChangingPassword}>
                                    {isChangingPassword ? 'Actualizando…' : 'Actualizar contraseña'}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function StaffProfilePage() {
    return (
        <Suspense fallback={<p className="text-muted-foreground">Cargando…</p>}>
            <StaffProfileContent />
        </Suspense>
    );
}
