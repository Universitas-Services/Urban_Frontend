import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/lib/services/auth.service';
import { useAuth } from '@/store/auth.context';
import { toast } from 'sonner';
import { AlertCircle, Lock, Trash2, Loader2, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UserSettingsModal({ isOpen, onClose }: UserSettingsModalProps) {
    const { logout } = useAuth();
    const router = useRouter();

    const [isDeleting, setIsDeleting] = useState(false);
    const [password, setPassword] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);

    const handleClose = () => {
        // Reset states on close
        setShowConfirm(false);
        setPassword('');
        onClose();
    };

    const handleDeleteAccount = async () => {
        if (!password) {
            toast.error('La contraseña es requerida para eliminar la cuenta.');
            return;
        }

        setIsDeleting(true);
        try {
            await authService.deleteAccount(password);
            toast.success('Tu cuenta ha sido eliminada exitosamente.');
            await logout();
            router.replace('/login');
        } catch (error) {
            console.error('Failed to delete account', error);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errMsg =
                (error as any).response?.data?.message || 'Contraseña incorrecta o error al eliminar cuenta.';
            toast.error(errMsg);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md bg-white border-surface-soft/40 shadow-xl rounded-2xl overflow-hidden p-0 max-h-[90vh]">
                <DialogHeader className="bg-surface-light px-6 py-5 border-b border-surface-soft/40">
                    <DialogTitle className="text-xl font-bold text-neutral-dark">Configuración</DialogTitle>
                    <DialogDescription className="text-neutral-dark/60 text-sm mt-1">
                        Gestiona tus preferencias y la información de tu cuenta.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar">
                    {/* Sección: Peligro / Eliminar Cuenta */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                Zona de Peligro
                            </h3>
                        </div>

                        {!showConfirm ? (
                            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-bold text-red-700 text-sm mb-1">Eliminar Cuenta</h4>
                                    <p className="text-red-700/80 text-xs max-w-[250px]">
                                        Esta acción es irreversible y eliminará de forma permanente tu usuario,
                                        historial y todos tus datos asociados.
                                    </p>
                                </div>
                                <Button
                                    variant="destructive"
                                    onClick={() => setShowConfirm(true)}
                                    className="shrink-0 bg-red-600 hover:bg-red-700 text-white font-bold"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Eliminar
                                </Button>
                            </div>
                        ) : (
                            <div className="bg-red-500/5 border border-red-500/30 rounded-xl p-5 space-y-4 animate-fade-in shadow-inner">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-red-700 text-sm mb-1">Confirmación Requerida</h4>
                                        <p className="text-red-700/80 text-xs">
                                            Por favor ingresa tu contraseña actual para confirmar tu identidad. Esta
                                            acción <span className="font-bold">no se puede deshacer</span>.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-dark/40" />
                                        <Input
                                            type="password"
                                            placeholder="Tu contraseña actual"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10 border-red-500/30 focus-visible:ring-red-500 text-sm h-11"
                                            disabled={isDeleting}
                                        />
                                    </div>

                                    <div className="flex gap-2 justify-end pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setShowConfirm(false);
                                                setPassword('');
                                            }}
                                            disabled={isDeleting}
                                            className="h-10 text-neutral-dark/70 bg-white"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleDeleteAccount}
                                            disabled={isDeleting || !password}
                                            className="h-10 bg-red-600 hover:bg-red-700 text-white font-bold min-w-[120px]"
                                        >
                                            {isDeleting ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                'Eliminar definitivamente'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
