'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { loginSchema } from '@/lib/validations/auth.schemas';
import { useAuth } from '@/store/auth.context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading } = useAuth();
    const router = useRouter();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        try {
            await login(values);
            toast.success('¡Bienvenido!');
            router.replace('/inicio');
        } catch (error) {
            toast.error((error as Error).message || 'Credenciales incorrectas');
        }
    }

    return (
        <div className="w-full animate-fade-in">
            <div className="flex justify-center mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/asset/LOGO UNIVERSITAS LEGAL.png"
                    alt="Universitas Legal Logo"
                    className="h-14 sm:h-16 w-auto object-contain drop-shadow-sm"
                />
            </div>
            <div className="space-y-1 text-center mb-6">
                <h2 className="text-3xl font-bold text-primary">Bienvenido</h2>
                <p className="text-neutral-dark/60 text-sm">Ingresa tus credenciales para continuar</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-primary font-bold text-sm">Correo electrónico</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-dark/40">
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
                                            className="bg-surface-light border-transparent focus:border-accent focus:ring-accent pl-10 text-neutral-dark h-11"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-red-500 font-medium text-xs" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-primary font-bold text-sm">Contraseña</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-dark/40">
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
                                            className="bg-surface-light border-transparent focus:border-accent focus:ring-accent pl-10 pr-10 text-neutral-dark h-11"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-dark/60 hover:text-neutral-dark"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-red-500 font-medium text-xs" />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-between items-center px-1">
                        <label className="flex items-center space-x-2 text-sm text-neutral-dark/60 cursor-pointer">
                            <input
                                type="checkbox"
                                className="rounded border-neutral-bg text-accent focus:ring-accent"
                            />
                            <span>Recordarme</span>
                        </label>
                        <Link href="/forgot-password" className="text-sm text-accent hover:underline font-medium">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent/90 text-on-primary active:scale-95 transition-all text-base h-12 rounded-full font-bold shadow-lg shadow-accent/20"
                        disabled={isLoading}
                    >
                        {isLoading ? <Spinner size="sm" className="text-on-primary mr-2" /> : null}
                        Ingresar
                        {!isLoading && <ArrowRight size={18} className="ml-2" />}
                    </Button>

                    <div className="pt-6 border-t border-surface-soft/30 text-center">
                        <p className="text-sm text-neutral-dark/60">
                            ¿No tienes una cuenta?{' '}
                            <Link href="/register" className="text-accent hover:underline font-bold">
                                Regístrate
                            </Link>
                        </p>
                    </div>
                </form>
            </Form>
        </div>
    );
}
