'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/store/auth.context';
import { Settings, Key, Trash2, X, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { authService } from '@/lib/services/auth.service';
import { UserProfile } from '@/types/auth.types';
import { toast } from 'sonner';

type Tab = 'edit' | 'security' | 'delete';

const profileSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    apellido: z.string().min(1, 'El apellido es obligatorio'),
    telefono: z.string(),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, 'La contraseña actual es obligatoria'),
        newPassword: z
            .string()
            .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
            .max(50, 'La nueva contraseña es demasiado larga'),
        confirmPassword: z.string().min(1, 'Debes confirmar tu contraseña'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
    const { user, logout, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('edit');
    const [fullProfile, setFullProfile] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    useEffect(() => {
        const fetchFullProfile = async () => {
            setIsLoadingProfile(true);
            try {
                const data = await authService.getFullProfile();
                setFullProfile(data);
            } catch {
                toast.error('Error al cargar la información del perfil.');
            } finally {
                setIsLoadingProfile(false);
            }
        };
        fetchFullProfile();
    }, []);

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        reset: resetProfile,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        values: {
            nombre: fullProfile?.nombre || user?.nombre || '',
            apellido: fullProfile?.apellido || user?.apellido || '',
            telefono: fullProfile?.telefono || user?.telefono || '',
        },
    });
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingProfileMode, setIsEditingProfileMode] = useState(false);

    // Password Hook Form
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset: resetPassword,
        formState: { errors: passwordErrors },
    } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleUpdateProfile = async (data: ProfileFormValues) => {
        setIsEditingProfile(true);
        try {
            const updatedUser = await authService.updateProfile({
                nombre: data.nombre,
                apellido: data.apellido,
                telefono: data.telefono || '',
            });
            updateUser(updatedUser);
            setIsEditingProfileMode(false);
            toast.success('Perfil actualizado correctamente.');
        } catch (error) {
            console.error('Failed to update profile', error);
            const errMsg =
                (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
                'Error al actualizar el perfil.';
            toast.error(errMsg);
        } finally {
            setIsEditingProfile(false);
        }
    };

    const handleChangePassword = async (data: PasswordFormValues) => {
        setIsChangingPassword(true);
        try {
            await authService.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
            toast.success('Contraseña actualizada correctamente.');
            resetPassword();
        } catch (error) {
            console.error('Failed to change password', error);
            const errMsg =
                (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
                'Error al cambiar la contraseña.';
            toast.error(errMsg);
        } finally {
            setIsChangingPassword(false);
        }
    };

    // First modal state
    const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);

    // Second modal state
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const [confirmationPhrase, setConfirmationPhrase] = useState('');
    const [deletePassword, setDeletePassword] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const targetPhrase = 'eliminar mi cuenta';

    const handleFirstModalContinue = () => {
        setIsFirstModalOpen(false);
        setTimeout(() => {
            setIsSecondModalOpen(true);
        }, 150); // slight delay to allow smooth unmount
    };

    const handleFinalDelete = async () => {
        if (confirmationPhrase !== targetPhrase) {
            toast.error('La frase de confirmación no coincide exactamente.');
            return;
        }

        if (!deletePassword) {
            toast.error('La contraseña actual es requerida.');
            return;
        }

        setIsDeleting(true);
        try {
            await authService.deleteAccount(deletePassword);
            toast.success('Tu cuenta ha sido eliminada permanentemente.');
            await logout();
            window.location.href = '/login';
        } catch (error) {
            console.error('Failed to delete account', error);
            const errMsg =
                (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
                'Contraseña incorrecta o error al procesar tu solicitud.';
            toast.error(errMsg);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex-1 overflow-auto custom-scrollbar p-6 bg-[var(--color-dashboard-bg)]">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="mb-2 flex justify-center">
                    <h1 className="text-xl font-bold text-neutral-dark">Gestión de perfil</h1>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-surface-soft overflow-hidden flex flex-col flex-1">
                    {/* Inner Header */}
                    <div className="p-4 border-b border-surface-soft/40">
                        <h2 className="text-lg font-bold text-neutral-dark">Configuración de tu perfil</h2>
                        <p className="text-[13px] text-neutral-dark/60 mt-0.5">
                            Gestiona la información de tu cuenta y tu configuración de seguridad.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row flex-1 min-h-0">
                        {/* Sidebar Navigation */}
                        <div className="w-full md:w-56 border-r border-surface-soft/40 p-2 space-y-0.5">
                            <button
                                onClick={() => setActiveTab('edit')}
                                className={cn(
                                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-colors cursor-pointer text-left',
                                    activeTab === 'edit'
                                        ? 'bg-transparent text-neutral-dark font-bold'
                                        : 'text-neutral-dark/70 hover:bg-surface-soft/10 font-medium'
                                )}
                            >
                                <Settings className="w-4 h-4" />
                                Editar perfil
                            </button>

                            <button
                                onClick={() => setActiveTab('security')}
                                className={cn(
                                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-colors cursor-pointer text-left',
                                    activeTab === 'security'
                                        ? 'bg-transparent text-neutral-dark font-bold'
                                        : 'text-neutral-dark/70 hover:bg-surface-soft/10 font-medium'
                                )}
                            >
                                <Key className="w-4 h-4" />
                                Cambiar contraseña
                            </button>

                            <div className="px-1 pt-1">
                                <button
                                    onClick={() => setActiveTab('delete')}
                                    className={cn(
                                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-colors cursor-pointer text-left',
                                        activeTab === 'delete'
                                            ? 'bg-surface-soft/20 text-status-error font-semibold'
                                            : 'text-neutral-dark/70 hover:bg-surface-soft/10 font-medium hover:text-status-error'
                                    )}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar cuenta
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-5 overflow-y-auto">
                            {activeTab === 'edit' && (
                                <div className="w-full">
                                    <form
                                        onSubmit={handleSubmitProfile(handleUpdateProfile)}
                                        className="w-full rounded-xl border border-surface-soft bg-white overflow-hidden shadow-sm animate-fade-in"
                                    >
                                        <div className="p-4">
                                            <h3 className="text-[14px] font-bold text-neutral-dark mb-0.5">
                                                Información personal
                                            </h3>
                                            <p className="text-neutral-dark/70 text-[12px] leading-relaxed mb-4">
                                                Actualiza tu información personal y detalles de contacto.
                                            </p>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-[12px] font-bold text-neutral-dark mb-1">
                                                        Correo electrónico
                                                    </label>
                                                    <Input
                                                        value={
                                                            isLoadingProfile
                                                                ? 'Cargando...'
                                                                : fullProfile?.email || user?.email || ''
                                                        }
                                                        disabled
                                                        className="border-surface-soft bg-surface/50 text-neutral-dark/70 font-medium h-9 text-[13px]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[12px] font-bold text-neutral-dark mb-1">
                                                        Nombre
                                                    </label>
                                                    <Input
                                                        {...registerProfile('nombre')}
                                                        disabled={!isEditingProfileMode}
                                                        className={cn(
                                                            'border-surface-soft focus-visible:ring-primary/20 focus-visible:border-primary text-neutral-dark font-medium h-9 text-[13px]',
                                                            !isEditingProfileMode
                                                                ? 'bg-surface/50 text-neutral-dark/70'
                                                                : 'bg-surface-light',
                                                            profileErrors.nombre && 'border-red-500'
                                                        )}
                                                    />
                                                    {profileErrors.nombre && (
                                                        <p className="text-red-500 text-[12px] mt-1">
                                                            {profileErrors.nombre.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-[12px] font-bold text-neutral-dark mb-1">
                                                        Apellido
                                                    </label>
                                                    <Input
                                                        {...registerProfile('apellido')}
                                                        disabled={!isEditingProfileMode}
                                                        className={cn(
                                                            'border-surface-soft focus-visible:ring-primary/20 focus-visible:border-primary text-neutral-dark font-medium h-9 text-[13px]',
                                                            !isEditingProfileMode
                                                                ? 'bg-surface/50 text-neutral-dark/70'
                                                                : 'bg-surface-light',
                                                            profileErrors.apellido && 'border-red-500'
                                                        )}
                                                    />
                                                    {profileErrors.apellido && (
                                                        <p className="text-red-500 text-[12px] mt-1">
                                                            {profileErrors.apellido.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-[12px] font-bold text-neutral-dark mb-1">
                                                        Teléfono
                                                    </label>
                                                    <Input
                                                        {...registerProfile('telefono')}
                                                        disabled={!isEditingProfileMode}
                                                        className={cn(
                                                            'border-surface-soft focus-visible:ring-primary/20 focus-visible:border-primary text-neutral-dark font-medium h-9 text-[13px]',
                                                            !isEditingProfileMode
                                                                ? 'bg-surface/50 text-neutral-dark/70'
                                                                : 'bg-surface-light',
                                                            profileErrors.telefono && 'border-red-500'
                                                        )}
                                                    />
                                                    {profileErrors.telefono && (
                                                        <p className="text-red-500 text-[12px] mt-1">
                                                            {profileErrors.telefono.message}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Campos de solo lectura del perfil extendido */}
                                                <div>
                                                    <label className="block text-[12px] font-bold text-neutral-dark mb-1">
                                                        Tipo de usuario
                                                    </label>
                                                    <Input
                                                        value={
                                                            isLoadingProfile
                                                                ? 'Cargando...'
                                                                : fullProfile?.tipo_usuario === 'SERVIDOR_PUBLICO'
                                                                  ? 'Servidor público'
                                                                  : fullProfile?.tipo_usuario === 'ASESOR_PRIVADO'
                                                                    ? 'Asesor privado'
                                                                    : fullProfile?.tipo_usuario || '—'
                                                        }
                                                        disabled
                                                        className="border-surface-soft bg-surface/50 text-neutral-dark/70 font-medium h-9 text-[13px]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[12px] font-bold text-neutral-dark mb-1">
                                                        Ente/Institución a la que es asesor
                                                    </label>
                                                    <Input
                                                        value={
                                                            isLoadingProfile
                                                                ? 'Cargando...'
                                                                : fullProfile?.nombre_ente || '—'
                                                        }
                                                        disabled
                                                        className="border-surface-soft bg-surface/50 text-neutral-dark/70 font-medium h-9 text-[13px]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[12px] font-bold text-neutral-dark mb-1">
                                                        Cargo
                                                    </label>
                                                    <Input
                                                        value={
                                                            isLoadingProfile ? 'Cargando...' : fullProfile?.cargo || '—'
                                                        }
                                                        disabled
                                                        className="border-surface-soft bg-surface/50 text-neutral-dark/70 font-medium h-9 text-[13px]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[12px] font-bold text-neutral-dark mb-1">
                                                        Estatus
                                                    </label>
                                                    <Input
                                                        value={
                                                            isLoadingProfile
                                                                ? 'Cargando...'
                                                                : fullProfile?.estatus_normativa_girs || '—'
                                                        }
                                                        disabled
                                                        className="border-surface-soft bg-surface/50 text-neutral-dark/70 font-medium h-9 text-[13px]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border-t border-surface-soft px-4 py-3 flex justify-end gap-2.5">
                                            {!isEditingProfileMode ? (
                                                <Button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setIsEditingProfileMode(true);
                                                    }}
                                                    className="w-full sm:w-auto px-6 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg h-9 text-[13px] transition-all"
                                                >
                                                    Editar perfil
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setIsEditingProfileMode(false);
                                                            resetProfile({
                                                                nombre: fullProfile?.nombre || user?.nombre || '',
                                                                apellido: fullProfile?.apellido || user?.apellido || '',
                                                                telefono: fullProfile?.telefono || user?.telefono || '',
                                                            });
                                                        }}
                                                        className="w-full sm:w-auto px-6 rounded-lg h-9 text-[13px] font-medium transition-all"
                                                    >
                                                        Cancelar
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        disabled={isEditingProfile}
                                                        className="w-full sm:w-auto px-6 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg h-9 text-[13px] transition-all"
                                                    >
                                                        {isEditingProfile ? 'Guardando...' : 'Guardar cambios'}
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="w-full">
                                    <form
                                        onSubmit={handleSubmitPassword(handleChangePassword)}
                                        className="w-full rounded-xl border border-surface-soft bg-white overflow-hidden shadow-sm animate-fade-in"
                                    >
                                        <div className="p-4">
                                            <h3 className="text-[14px] font-bold text-neutral-dark mb-0.5">
                                                Cambiar contraseña
                                            </h3>
                                            <p className="text-neutral-dark/70 text-[12px] leading-relaxed mb-4">
                                                Para mayor seguridad, te recomendamos usar una contraseña única que no
                                                utilices en otros sitios.
                                            </p>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-[12px] font-bold text-neutral-dark mb-1">
                                                        Contraseña actual
                                                    </label>
                                                    <div className="relative">
                                                        <Input
                                                            type={showCurrentPassword ? 'text' : 'password'}
                                                            {...registerPassword('currentPassword')}
                                                            className={cn(
                                                                'border-surface-soft focus-visible:ring-primary/20 focus-visible:border-primary bg-surface-light text-neutral-dark font-medium h-9 text-[13px] pr-10',
                                                                passwordErrors.currentPassword && 'border-red-500'
                                                            )}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-dark/50 hover:text-neutral-dark"
                                                        >
                                                            {showCurrentPassword ? (
                                                                <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    {passwordErrors.currentPassword && (
                                                        <p className="text-red-500 text-[12px] mt-1">
                                                            {passwordErrors.currentPassword.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-[12px] font-bold text-neutral-dark mb-1">
                                                        Nueva contraseña
                                                    </label>
                                                    <div className="relative">
                                                        <Input
                                                            type={showNewPassword ? 'text' : 'password'}
                                                            {...registerPassword('newPassword')}
                                                            className={cn(
                                                                'border-surface-soft focus-visible:ring-primary/20 focus-visible:border-primary bg-surface-light text-neutral-dark font-medium h-9 text-[13px] pr-10',
                                                                passwordErrors.newPassword && 'border-red-500'
                                                            )}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-dark/50 hover:text-neutral-dark"
                                                        >
                                                            {showNewPassword ? (
                                                                <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    {passwordErrors.newPassword && (
                                                        <p className="text-red-500 text-[12px] mt-1">
                                                            {passwordErrors.newPassword.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-[12px] font-bold text-neutral-dark mb-1">
                                                        Confirmar nueva contraseña
                                                    </label>
                                                    <div className="relative">
                                                        <Input
                                                            type={showConfirmPassword ? 'text' : 'password'}
                                                            {...registerPassword('confirmPassword')}
                                                            className={cn(
                                                                'border-surface-soft focus-visible:ring-primary/20 focus-visible:border-primary bg-surface-light text-neutral-dark font-medium h-9 text-[13px] pr-10',
                                                                passwordErrors.confirmPassword && 'border-red-500'
                                                            )}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-dark/50 hover:text-neutral-dark"
                                                        >
                                                            {showConfirmPassword ? (
                                                                <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    {passwordErrors.confirmPassword && (
                                                        <p className="text-red-500 text-[12px] mt-1">
                                                            {passwordErrors.confirmPassword.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border-t border-surface-soft px-4 py-3 flex justify-end">
                                            <Button
                                                type="submit"
                                                disabled={isChangingPassword}
                                                className="w-full sm:w-auto px-6 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg h-9 text-[13px] transition-all"
                                            >
                                                {isChangingPassword ? 'Actualizando...' : 'Actualizar contraseña'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'delete' && (
                                <div className="w-full">
                                    <div className="w-full rounded-xl border border-red-400 bg-white overflow-hidden shadow-sm">
                                        <div className="p-5">
                                            <h3 className="text-[14px] font-bold text-neutral-dark mb-1">
                                                Eliminar cuenta
                                            </h3>
                                            <p className="text-neutral-dark/70 text-[13px] leading-relaxed">
                                                Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor,
                                                asegúrate de que realmente quieres hacerlo. Toda tu información y actas
                                                guardadas se perderán permanentemente.
                                            </p>
                                        </div>
                                        <div className="border-t border-red-400 px-5 py-3 flex justify-end">
                                            <Button
                                                variant="destructive"
                                                className="w-full sm:w-auto px-6 bg-status-error hover:bg-red-600 text-white font-semibold rounded-lg h-9 text-sm transition-all"
                                                onClick={() => setIsFirstModalOpen(true)}
                                            >
                                                Eliminar cuenta
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* MODAL 1: First Confirmation */}
                <AlertDialog open={isFirstModalOpen} onOpenChange={setIsFirstModalOpen}>
                    <AlertDialogContent className="sm:max-w-md bg-white border border-surface-soft shadow-2xl rounded-2xl p-6">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-neutral-dark text-xl font-bold">
                                ¿Estás absolutamente seguro?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-neutral-dark/70 text-[15px] pt-2 leading-relaxed">
                                Esta acción es irreversible y no se puede deshacer. Esto eliminará permanentemente tu
                                cuenta y todos tus datos de nuestros servidores.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter className="mt-6 gap-3 sm:gap-2">
                            <AlertDialogCancel className="bg-surface hover:bg-surface-soft/30 text-neutral-dark border-transparent font-medium rounded-lg">
                                Cancelar
                            </AlertDialogCancel>
                            <Button
                                variant="destructive"
                                onClick={handleFirstModalContinue}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg"
                            >
                                Continuar con la eliminación
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* MODAL 2: Final Confirmation */}
                <AlertDialog
                    open={isSecondModalOpen}
                    onOpenChange={(open) => {
                        setIsSecondModalOpen(open);
                        if (!open) {
                            setConfirmationPhrase('');
                            setDeletePassword('');
                        }
                    }}
                >
                    <AlertDialogContent className="sm:max-w-md bg-white border border-surface-soft shadow-2xl rounded-3xl p-6 sm:p-8">
                        <div className="absolute top-4 right-4">
                            <AlertDialogCancel className="h-8 w-8 p-0 rounded-full bg-transparent border-transparent hover:bg-surface-soft/30 text-neutral-dark/60">
                                <X className="h-4 w-4" />
                            </AlertDialogCancel>
                        </div>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-neutral-dark text-xl font-bold flex items-center gap-2">
                                Confirmación final requerida
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-neutral-dark/70 text-[15px] pt-1 leading-relaxed">
                                Para confirmar, escribe{' '}
                                <span className="font-bold text-status-error">{targetPhrase}</span> en el campo de abajo
                                y proporciona tu contraseña actual.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <div className="my-5 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-neutral-dark mb-1.5">
                                    Frase de confirmación
                                </label>
                                <Input
                                    value={confirmationPhrase}
                                    onChange={(e) => setConfirmationPhrase(e.target.value)}
                                    className="border-surface-soft focus-visible:ring-red-200 bg-surface-light h-11 text-neutral-dark font-medium"
                                    placeholder=""
                                    disabled={isDeleting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-dark mb-1.5">
                                    Contraseña actual
                                </label>
                                <Input
                                    type="password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    className="border-surface-soft focus-visible:ring-red-200 bg-surface-light h-11 text-neutral-dark font-medium"
                                    disabled={isDeleting}
                                />
                            </div>
                        </div>

                        <AlertDialogFooter className="mt-2">
                            <Button
                                variant="destructive"
                                onClick={handleFinalDelete}
                                disabled={isDeleting || confirmationPhrase !== targetPhrase || !deletePassword}
                                className="w-full bg-status-error hover:bg-red-600 focus:ring-status-error text-white font-bold rounded-xl h-[52px] text-[16px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? 'Eliminando...' : 'Eliminar cuenta permanentemente'}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
