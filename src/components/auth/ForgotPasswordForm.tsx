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
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { forgotPasswordService, verifyOtpService, resetPasswordService } from '@/lib/services/auth.service';
import { useRouter } from 'next/navigation';
import { useAuthFormStyles } from './auth-context';
import { cn } from '@/lib/utils';

const stepLabels = ['Correo', 'Código', 'Nueva clave'];

export function ForgotPasswordForm() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const s = useAuthFormStyles();

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
            await forgotPasswordService(emailValue);
            toast.success('Código enviado a tu correo');
            setStep(2);
        } catch {
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
            await verifyOtpService(emailValue, code);
            toast.success('Código verificado correctamente');
            setStep(3);
        } catch {
            toast.error('Código inválido o expirado');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
        if (step !== 3) return;
        setIsSubmitting(true);
        try {
            await resetPasswordService(values.email, values.password || '');
            toast.success('Contraseña actualizada exitosamente');
            router.push('/login?panel=login');
        } catch {
            toast.error('Error al actualizar contraseña');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="relative w-full animate-fade-in overflow-hidden">
            <div className="mb-5 space-y-1 text-center">
                <h2 className={cn(s.title, 'text-3xl')}>Recuperar contraseña</h2>
                <p className={s.subtext}>
                    {step === 1 && 'Ingresa tu correo para recibir un código.'}
                    {step === 2 && 'Ingresa el código numérico de 6 dígitos.'}
                    {step === 3 && 'Crea tu nueva contraseña segura.'}
                </p>
            </div>

            <div className="mb-6 flex items-center justify-center gap-4">
                {stepLabels.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive = step === stepNumber;
                    const isDone = step > stepNumber;
                    return (
                        <div key={label} className="flex flex-col items-center gap-1">
                            <div
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors',
                                    isActive || isDone ? s.stepActive : s.stepInactive
                                )}
                            >
                                {stepNumber}
                            </div>
                            <span
                                className={cn(
                                    'text-[11px] font-medium',
                                    isActive ? s.stepLabelActive : s.stepLabelInactive
                                )}
                            >
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    {step === 1 && (
                        <div className="animate-fade-in space-y-6">
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
                                                        'absolute left-3 top-1/2 -translate-y-1/2',
                                                        s.iconMuted
                                                    )}
                                                >
                                                    <Mail size={18} />
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

                            <Button type="button" onClick={onNextStep1} className={s.submitBtn} disabled={isSubmitting}>
                                {isSubmitting ? <Spinner size="sm" className="text-on-primary mr-2" /> : null}
                                Siguiente
                                {!isSubmitting && <ArrowRight size={18} className="ml-2" />}
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in space-y-6">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={cn(s.label, 'block text-center')}>
                                            Código de verificación
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <div
                                                    className={cn(
                                                        'absolute left-3 top-1/2 -translate-y-1/2',
                                                        s.iconMuted
                                                    )}
                                                >
                                                    <KeyRound size={18} />
                                                </div>
                                                <Input
                                                    placeholder="123456"
                                                    maxLength={6}
                                                    className={cn(
                                                        s.inputWithPl10,
                                                        'h-14 text-center text-lg font-bold tracking-widest'
                                                    )}
                                                    {...field}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        field.onChange(val);
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className={cn(s.messageError, 'text-center')} />
                                    </FormItem>
                                )}
                            />

                            <Button type="button" onClick={onNextStep2} className={s.submitBtn} disabled={isSubmitting}>
                                {isSubmitting ? <Spinner size="sm" className="text-on-primary mr-2" /> : null}
                                Verificar código
                                {!isSubmitting && <ShieldCheck size={18} className="ml-2" />}
                            </Button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-fade-in space-y-6">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={s.label}>Nueva contraseña</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    className={s.inputWithPr10}
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className={cn(
                                                        'absolute right-3 top-1/2 -translate-y-1/2',
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

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={s.label}>Confirmar nueva contraseña</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    className={s.inputWithPr10}
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className={cn(
                                                        'absolute right-3 top-1/2 -translate-y-1/2',
                                                        s.iconMuted
                                                    )}
                                                >
                                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className={s.messageError} />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className={s.submitBtn} disabled={isSubmitting}>
                                {isSubmitting ? <Spinner size="sm" className="text-on-primary mr-2" /> : null}
                                Guardar contraseña
                            </Button>
                        </div>
                    )}
                </form>
            </Form>

            <div className={cn('mt-6 border-t pt-6 text-center', s.divider)}>
                <button
                    type="button"
                    onClick={() => router.push('/login?panel=login')}
                    className="text-sm font-bold text-auth-accent hover:underline"
                >
                    Volver al inicio de sesión
                </button>
            </div>
        </div>
    );
}
