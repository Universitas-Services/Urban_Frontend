'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus, Search, Trash2, Pencil, Eye, EyeOff, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import type { PaginationMeta } from '@/types/admin.types';
import type { StaffRole } from '@/types/roles';
import {
    createStaffUserAction,
    deleteStaffUserAction,
    getStaffUsersAction,
    type StaffUser,
} from '@/lib/services/staff.service';
import {
    createStaffSchema,
    generateStaffPassword,
    sanitizeLettersOnly,
    type CreateStaffFormValues,
} from '@/lib/validations/staff.schemas';

export default function AdminStaffPage() {
    const { canWrite } = usePermissions();
    const router = useRouter();

    const [users, setUsers] = useState<StaffUser[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [roleFilter, setRoleFilter] = useState<string>('ALL');
    const [search, setSearch] = useState('');
    const [tempSearch, setTempSearch] = useState('');

    const [createOpen, setCreateOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const form = useForm<CreateStaffFormValues>({
        resolver: zodResolver(createStaffSchema),
        defaultValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: '',
            role: 'CURADOR',
        },
    });

    const fetchStaff = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getStaffUsersAction({
                page,
                limit: 10,
                search: search || undefined,
                role: roleFilter === 'ALL' ? undefined : (roleFilter as StaffRole),
            });
            setUsers(response.data);
            setMeta(response.meta);
        } catch (error) {
            console.error(error);
            toast.error('No se pudo cargar el listado de staff.');
        } finally {
            setLoading(false);
        }
    }, [page, search, roleFilter]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- carga del listado al filtrar/paginar
        fetchStaff();
    }, [fetchStaff]);

    const openCreateDialog = () => {
        form.reset({
            nombre: '',
            apellido: '',
            email: '',
            password: '',
            role: 'CURADOR',
        });
        setShowPassword(false);
        setCreateOpen(true);
    };

    const handleCreate = form.handleSubmit(async (values) => {
        setCreating(true);
        try {
            await createStaffUserAction({
                nombre: values.nombre.trim(),
                apellido: values.apellido.trim(),
                email: values.email.trim(),
                password: values.password,
                role: values.role,
            });
            toast.success('Usuario creado correctamente.');
            setCreateOpen(false);
            form.reset();
            setPage(1);
            await fetchStaff();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error al crear usuario.');
        } finally {
            setCreating(false);
        }
    });

    const handleGeneratePassword = () => {
        const password = generateStaffPassword();
        form.setValue('password', password, { shouldValidate: true, shouldDirty: true });
        setShowPassword(true);
        toast.success('Contraseña generada. Cópiala antes de cerrar.');
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await deleteStaffUserAction(deleteId);
            toast.success('Usuario eliminado.');
            setDeleteId(null);
            await fetchStaff();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error al eliminar.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-dark">Curadores y Revisores</h1>
                    <p className="text-sm text-muted-foreground">
                        Gestiona las cuentas que cargan y revisan documentos legales.
                    </p>
                </div>
                {canWrite ? (
                    <Button onClick={openCreateDialog}>
                        <Plus className="mr-2 h-4 w-4" />
                        Crear usuario
                    </Button>
                ) : null}
            </div>

            <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-[220px] flex-1">
                    <Label htmlFor="staff-search">Buscar</Label>
                    <div className="mt-1 flex gap-2">
                        <Input
                            id="staff-search"
                            placeholder="Email, nombre o apellido"
                            value={tempSearch}
                            onChange={(e) => setTempSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setPage(1);
                                    setSearch(tempSearch.trim());
                                }
                            }}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setPage(1);
                                setSearch(tempSearch.trim());
                            }}
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="w-[180px]">
                    <Label>Rol</Label>
                    <Select
                        value={roleFilter}
                        onValueChange={(value) => {
                            setPage(1);
                            setRoleFilter(value);
                        }}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Todos</SelectItem>
                            <SelectItem value="CURADOR">Curador</SelectItem>
                            <SelectItem value="REVISOR">Revisor</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Nombre</TableHead>
                            <TableHead className="text-center">Email</TableHead>
                            <TableHead className="text-center">Rol</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                            <TableHead className="text-center">Creado</TableHead>
                            <TableHead className="w-[100px] text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                                    Cargando…
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                                    No hay usuarios staff.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="text-center font-medium">
                                        {user.nombre} {user.apellido}
                                    </TableCell>
                                    <TableCell className="text-center">{user.email}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <Badge variant={user.role === 'CURADOR' ? 'default' : 'secondary'}>
                                                {user.role}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <Badge variant={user.isActive ? 'outline' : 'destructive'}>
                                                {user.isActive ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: es })}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => router.push(`/admin/staff/${user.id}`)}
                                                aria-label="Ver detalle"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            {canWrite ? (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => setDeleteId(user.id)}
                                                    aria-label="Eliminar"
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            ) : null}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {meta && meta.totalPages > 1 ? (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Página {meta.currentPage} de {meta.totalPages} ({meta.totalItems} total)
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            disabled={page >= meta.totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            ) : null}

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Crear Curador o Revisor</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={handleCreate} className="grid gap-3 py-2">
                            <FormField
                                control={form.control}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ana"
                                                autoComplete="given-name"
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
                                                placeholder="Pérez"
                                                autoComplete="family-name"
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
                                            <Input
                                                type="email"
                                                placeholder="ana@ejemplo.com"
                                                autoComplete="email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contraseña</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    className="pr-20"
                                                    autoComplete="new-password"
                                                    {...field}
                                                />
                                                <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword((v) => !v)}
                                                        className="rounded p-1 text-muted-foreground hover:text-foreground"
                                                        aria-label={
                                                            showPassword ? 'Ocultar contraseña' : 'Ver contraseña'
                                                        }
                                                    >
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
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
                                        <p className="text-xs text-muted-foreground">
                                            Mínimo 8 caracteres, una mayúscula y un número.
                                        </p>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rol</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
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
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={creating}>
                                    {creating ? 'Creando…' : 'Crear'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar usuario staff</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción desactiva la cuenta y libera el email. No se puede deshacer fácilmente.
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

            <p className="sr-only">
                <Link href="/admin">Volver al panel</Link>
            </p>
        </div>
    );
}
