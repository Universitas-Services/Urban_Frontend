'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { forgotPasswordSchema } from '@/lib/validations/auth.schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Mail, ArrowRight, Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { authService } from '@/lib/services/auth.service';
import { useRouter } from 'next/navigation';

export function ForgotPasswordForm() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '', code: '', password: '', confirmPassword: '' },
    });

    const emailValue = form.watch('email');

    async function onNextStep1() {
        const isValid = await form.trigger(['email']);
        if (!isValid) return;

        setIsSubmitting(true);
        try {
            await authService.forgotPassword(emailValue);
            toast.success('Código enviado a tu correo');
            setStep(2);
        } catch (error) {
            toast.error('Error al enviar el código');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function onNextStep2() {
        const isValid = await form.trigger(['code']);
        if (!isValid) return;

        setIsSubmitting(true);
        try {
            const code = form.getValues('code') || '';
            await authService.verifyOtp(emailValue, code);
            toast.success('Código verificado correctamente');
            setStep(3);
        } catch (error) {
            toast.error('Código inválido o expirado');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
        if (step !== 3) return;
        setIsSubmitting(true);
        try {
            await authService.resetPassword(values.email, values.password || '');
            toast.success('Contraseña actualizada exitosamente');
            router.push('/login');
        } catch (error) {
            toast.error('Error al actualizar contraseña');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full animate-fade-in relative overflow-hidden">
            <div className="flex justify-center mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/asset/LOGO UNIVERSITAS LEGAL.png"
                    alt="Universitas Legal Logo"
                    className="h-14 sm:h-16 w-auto object-contain drop-shadow-sm"
                />
            </div>
            <div className="space-y-1 mb-5 text-center">
                <h2 className="text-3xl font-bold text-primary">Recuperar contraseña</h2>
                <p className="text-neutral-dark/60 text-sm">
                    {step === 1 && 'Ingresa tu correo para recibir un código.'}
                    {step === 2 && 'Ingresa el código numérico de 6 dígitos.'}
                    {step === 3 && 'Crea tu nueva contraseña segura.'}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary font-bold text-sm">
                                            Correo electrónico
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-dark/40">
                                                    <Mail size={18} />
                                                </div>
                                                <Input
                                                    placeholder="nombre@empresa.com"
                                                    className="pl-10 bg-surface-light border-transparent focus:border-accent focus:ring-accent text-neutral-dark h-11"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-500 font-medium text-xs" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="button"
                                onClick={onNextStep1}
                                className="w-full bg-accent hover:bg-accent/90 text-on-primary active:scale-95 transition-all text-base h-12 rounded-full font-bold shadow-lg shadow-accent/20"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Spinner size="sm" className="text-on-primary mr-2" /> : null}
                                Siguiente
                                {!isSubmitting && <ArrowRight size={18} className="ml-2" />}
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary font-bold text-sm text-center block">
                                            Código de verificación
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-dark/40">
                                                    <KeyRound size={18} />
                                                </div>
                                                <Input
                                                    placeholder="123456"
                                                    maxLength={6}
                                                    className="pl-10 text-center tracking-widest text-lg font-bold bg-surface-light border-transparent focus:border-accent focus:ring-accent text-neutral-dark h-14"
                                                    {...field}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        field.onChange(val);
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-500 font-medium text-xs text-center" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="button"
                                onClick={onNextStep2}
                                className="w-full bg-accent hover:bg-accent/90 text-on-primary active:scale-95 transition-all text-base h-12 rounded-full font-bold shadow-lg shadow-accent/20"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Spinner size="sm" className="text-on-primary mr-2" /> : null}
                                Verificar Código
                                {!isSubmitting && <ShieldCheck size={18} className="ml-2" />}
                            </Button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary font-bold text-sm">
                                            Nueva contraseña
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    className="bg-surface-light border-transparent focus:border-accent focus:ring-accent pr-10 text-neutral-dark h-11"
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

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary font-bold text-sm">
                                            Confirmar nueva contraseña
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    className="bg-surface-light border-transparent focus:border-accent focus:ring-accent pr-10 text-neutral-dark h-11"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-dark/60 hover:text-neutral-dark"
                                                >
                                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-500 font-medium text-xs" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full bg-accent hover:bg-accent/90 text-on-primary active:scale-95 transition-all text-base h-12 rounded-full font-bold shadow-lg shadow-accent/20"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Spinner size="sm" className="text-on-primary mr-2" /> : null}
                                Guardar contraseña
                            </Button>
                        </div>
                    )}
                </form>
            </Form>

            <div className="pt-6 border-t border-surface-soft/30 text-center mt-6">
                <Link href="/login" className="text-sm text-accent hover:underline font-bold">
                    Volver al inicio de sesión
                </Link>
            </div>
        </div>
    );
}
