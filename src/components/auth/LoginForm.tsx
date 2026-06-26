'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { loginSchema } from '@/lib/validations/auth.schemas';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { useAuthFormStyles } from './auth-context';
import { cn } from '@/lib/utils';
import { getHomeByRole } from '@/lib/constants/routes';

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuthStore();
    const router = useRouter();
    const s = useAuthFormStyles();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const { isSubmitting } = form.formState;

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        try {
            await login(values);
            const loggedInUser = useAuthStore.getState().user;
            toast.success('¡Bienvenido!');
            router.replace(getHomeByRole(loggedInUser?.role ?? 'USER'));
        } catch (error) {
            toast.error((error as Error).message || 'Credenciales incorrectas');
        }
    }

    return (
        <div className="w-full animate-fade-in">
            <div className="mb-6 space-y-1 text-center">
                <h2 className={cn(s.title, 'text-3xl')}>Iniciar sesión</h2>
                <p className={s.subtext}>Ingresa tus credenciales para continuar</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={s.label}>Correo electrónico</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <div
                                            className={cn(
                                                'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3',
                                                s.iconMuted
                                            )}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                            </svg>
                                        </div>
                                        <Input
                                            placeholder="nombre@empresa.com"
                                            className={s.inputWithPl10}
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className={s.messageError} />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={s.label}>Contraseña</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <div
                                            className={cn(
                                                'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3',
                                                s.iconMuted
                                            )}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                            </svg>
                                        </div>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            className={s.inputWithPx10}
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className={cn(
                                                'absolute right-3 top-1/2 -translate-y-1/2 hover:text-white',
                                                s.iconMuted
                                            )}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage className={s.messageError} />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center justify-between px-1">
                        <label className={cn('flex cursor-pointer items-center space-x-2', s.checkboxLabel)}>
                            <input
                                type="checkbox"
                                className="rounded border-white/30 text-auth-accent focus:ring-auth-accent"
                            />
                            <span>Recordarme</span>
                        </label>
                        <button type="button" onClick={() => router.push('/forgot-password')} className={s.link}>
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>

                    <Button type="submit" className={s.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? <Spinner size="sm" className="text-on-primary mr-2" /> : null}
                        Ingresar
                        {!isSubmitting && <ArrowRight size={18} className="ml-2" />}
                    </Button>

                    <div className={cn('border-t pt-6 text-center', s.divider)}>
                        <p className={s.footerText}>
                            ¿No tienes una cuenta?{' '}
                            <button
                                type="button"
                                onClick={() => router.push('/register')}
                                className="font-bold text-auth-accent hover:underline"
                            >
                                Regístrate
                            </button>
                        </p>
                    </div>
                </form>
            </Form>
        </div>
    );
}
