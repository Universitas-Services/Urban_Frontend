'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, Eye, EyeOff, KeyRound } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { usePermissions } from '@/hooks/usePermissions';
import {
    deleteStaffUserAction,
    getStaffUserByIdAction,
    updateStaffUserAction,
    type StaffUser,
} from '@/lib/services/staff.service';
import {
    generateStaffPassword,
    sanitizeLettersOnly,
    updateStaffSchema,
    type UpdateStaffFormValues,
} from '@/lib/validations/staff.schemas';

export default function AdminStaffDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const { canWrite } = usePermissions();

    const [user, setUser] = useState<StaffUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<UpdateStaffFormValues>({
        resolver: zodResolver(updateStaffSchema),
        defaultValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: '',
            role: 'CURADOR',
            isActive: true,
        },
    });

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await getStaffUserByIdAction(params.id);
                setUser(data);
                form.reset({
                    nombre: data.nombre,
                    apellido: data.apellido ?? '',
                    email: data.email,
                    password: '',
                    role: data.role,
                    isActive: data.isActive,
                });
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'No se pudo cargar el usuario.');
                router.replace('/admin/staff');
            } finally {
                setLoading(false);
            }
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- load once per id
    }, [params.id, router]);

    const handleSave = form.handleSubmit(async (values) => {
        if (!canWrite) return;
        setSaving(true);
        try {
            const updated = await updateStaffUserAction(params.id, {
                nombre: values.nombre.trim(),
                apellido: values.apellido.trim(),
                email: values.email.trim(),
                role: values.role,
                isActive: values.isActive,
                ...(values.password && values.password.trim().length > 0 ? { password: values.password.trim() } : {}),
            });
            setUser(updated);
            form.setValue('password', '');
            setShowPassword(false);
            toast.success('Usuario actualizado.');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error al actualizar.');
        } finally {
            setSaving(false);
        }
    });

    const handleGeneratePassword = () => {
        const password = generateStaffPassword();
        form.setValue('password', password, { shouldValidate: true, shouldDirty: true });
        setShowPassword(true);
        toast.success('Contraseña generada. Cópiala antes de guardar.');
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteStaffUserAction(params.id);
            toast.success('Usuario eliminado.');
            router.replace('/admin/staff');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error al eliminar.');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <p className="text-muted-foreground">Cargando…</p>;
    }

    if (!user) return null;

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/staff">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-dark">
                        {user.nombre} {user.apellido}
                    </h1>
                    <div className="mt-1 flex gap-2">
                        <Badge>{user.role}</Badge>
                        <Badge variant={user.isActive ? 'outline' : 'destructive'}>
                            {user.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                    </div>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={handleSave} className="grid gap-4 rounded-lg border bg-card p-6">
                    <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={!canWrite}
                                        {...field}
                                        onChange={(e) => field.onChange(sanitizeLettersOnly(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="apellido"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Apellido</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={!canWrite}
                                        {...field}
                                        onChange={(e) => field.onChange(sanitizeLettersOnly(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" disabled={!canWrite} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rol</FormLabel>
                                <Select value={field.value} disabled={!canWrite} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="CURADOR">Curador</SelectItem>
                                        <SelectItem value="REVISOR">Revisor</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado</FormLabel>
                                <Select
                                    value={field.value ? 'true' : 'false'}
                                    disabled={!canWrite}
                                    onValueChange={(value) => field.onChange(value === 'true')}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="true">Activo</SelectItem>
                                        <SelectItem value="false">Inactivo</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {canWrite ? (
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nueva contraseña (opcional)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Dejar vacío para no cambiar"
                                                className="pr-10"
                                                autoComplete="new-password"
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((v) => !v)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                                                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="mt-1"
                                        onClick={handleGeneratePassword}
                                    >
                                        <KeyRound className="mr-2 h-4 w-4" />
                                        Generar clave
                                    </Button>
                                </FormItem>
                            )}
                        />
                    ) : null}

                    {canWrite ? (
                        <div className="flex flex-wrap gap-2 pt-2">
                            <Button type="submit" disabled={saving}>
                                {saving ? 'Guardando…' : 'Guardar cambios'}
                            </Button>
                            <Button type="button" variant="destructive" onClick={() => setDeleteOpen(true)}>
                                Eliminar
                            </Button>
                        </div>
                    ) : null}
                </form>
            </Form>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar usuario staff</AlertDialogTitle>
                        <AlertDialogDescription>
                            Se desactivará la cuenta y se liberará el email.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                            {deleting ? 'Eliminando…' : 'Eliminar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
