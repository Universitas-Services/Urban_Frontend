'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { registerSchema } from '@/lib/validations/auth.schemas';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, ArrowRight, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { type Estado, type Municipio } from '@universitas/sdk-global';
import { sdkApi } from '@/lib/api/universitas.sdk';

import { Checkbox } from '@/components/ui/checkbox';
import { useAuthFormStyles } from './auth-context';
import { RegisterTermsDialog } from './RegisterTermsDialog';
import { RegisterPrivacyDialog } from './RegisterPrivacyDialog';

const roleCheckboxClassName =
    'cursor-pointer size-4 border-2 border-neutral-dark/45 bg-white shadow-sm ' +
    'data-[state=checked]:border-auth-accent data-[state=checked]:bg-auth-accent data-[state=checked]:text-on-primary ' +
    'focus-visible:border-auth-accent focus-visible:ring-auth-accent/30';

export function RegisterForm() {
    const [step, setStep] = useState(1);
    const [phonePrefix, setPhonePrefix] = useState('0412');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    const [estados, setEstados] = useState<Estado[]>([]);
    const [municipios, setMunicipios] = useState<Municipio[]>([]);
    const [selectedEstadoId, setSelectedEstadoId] = useState<number | null>(null);
    const [isLoadingEstados, setIsLoadingEstados] = useState(false);
    const [isLoadingMunicipios, setIsLoadingMunicipios] = useState(false);
    const [showEnteFields, setShowEnteFields] = useState(false);
    const [showCargoNormativa, setShowCargoNormativa] = useState(false);
    const { register } = useAuthStore();
    const router = useRouter();
    const s = useAuthFormStyles();

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            lastName: '',
            phone: '',
            estado: '',
            municipio: '',
            tipo_usuario: '',
            nombre_ente: '',
            cargo: '',
            estatus_normativa_girs: '',
            email: '',
            password: '',
            confirmPassword: '',
            termsAccepted: false,
            emailCommunicationsAccepted: false,
        },
    });

    // Estado local del envío — NO el isLoading global (que es el gate de sesión del dashboard)
    const { isSubmitting } = form.formState;

    const passwordValue = form.watch('password');

    // Evaluar fortaleza de la contraseña

    const getPasswordStrength = (pass: string) => {
        let score = 0;
        if (pass.length === 0) return 0;
        if (pass.length > 7) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) Math.min(score++, 3);
        return Math.min(score, 3);
    };

    const strength = getPasswordStrength(passwordValue);

    useEffect(() => {
        const loadEstados = async () => {
            setIsLoadingEstados(true);
            try {
                const response = await sdkApi.territorio.getEstados();
                const data = response.data;
                setEstados(data);
            } catch (error) {
                console.error('Error loading estados:', error);
            } finally {
                setIsLoadingEstados(false);
            }
        };
        loadEstados();
    }, []);

    useEffect(() => {
        const loadMunicipios = async () => {
            if (!selectedEstadoId) {
                setMunicipios([]);
                return;
            }
            setIsLoadingMunicipios(true);
            try {
                const response = await sdkApi.territorio.getMunicipios(selectedEstadoId);
                const data = response.data;
                setMunicipios(data);
            } catch (error) {
                console.error('Error loading municipios:', error);
            } finally {
                setIsLoadingMunicipios(false);
            }
        };
        loadMunicipios();
    }, [selectedEstadoId]);

    const onNextStep = async () => {
        const isValid = await form.trigger(['email', 'password', 'confirmPassword']);
        if (isValid) {
            setStep(2);
        }
    };

    const onPrevStep = () => {
        setStep(1);
    };

    async function onSubmit(values: z.infer<typeof registerSchema>) {
        if (step !== 2) return;
        try {
            const payload = {
                nombre: values.name,
                apellido: values.lastName,
                telefono: values.phone,
                estado: values.estado,
                municipio: values.municipio,
                tipo_usuario: values.tipo_usuario,
                nombre_ente: values.nombre_ente,
                cargo: values.cargo,
                estatus_normativa_girs: values.estatus_normativa_girs,
                email: values.email,
                password: values.password,
            };
            await register(payload);
            toast.success('Te hemos enviado un enlace de activación a tu correo electrónico.');
            router.push('/login?panel=login');
        } catch {
            toast.error('Error al registrar la cuenta');
        }
    }

    return (
        <>
            <div className="w-full animate-fade-in">
                <div className="space-y-4 mb-4">
                    <div className="space-y-1 text-center">
                        <h2 className={s.title}>{step === 1 ? 'Crea tu cuenta' : 'Completa tus datos'}</h2>
                        <p className={s.subtext}>Por favor introduce tus datos para continuar.</p>
                    </div>

                    <div className="flex justify-center items-center space-x-8 sm:space-x-12">
                        <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                            <div
                                className={cn(
                                    'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg font-bold transition-all duration-300',
                                    step === 1 ? s.stepActive : s.stepInactive
                                )}
                            >
                                1
                            </div>
                            <span
                                className={cn(
                                    'text-xs sm:text-sm transition-colors',
                                    step === 1 ? s.stepLabelActive : s.stepLabelInactive
                                )}
                            >
                                Credenciales
                            </span>
                        </div>
                        <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                            <div
                                className={cn(
                                    'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg font-bold transition-all duration-300',
                                    step === 2 ? s.stepActive : s.stepInactive
                                )}
                            >
                                2
                            </div>
                            <span
                                className={cn(
                                    'text-xs sm:text-sm transition-colors',
                                    step === 2 ? s.stepLabelActive : s.stepLabelInactive
                                )}
                            >
                                Datos personales
                            </span>
                        </div>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {step === 1 && (
                            <div className="space-y-4 animate-fade-in">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={s.label}>Correo electrónico</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="nombre@empresa.com"
                                                    className={s.input}
                                                    {...field}
                                                />
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
                                                            'absolute right-3 top-1/2 -translate-y-1/2 hover:text-neutral-dark',
                                                            s.iconMuted
                                                        )}
                                                    >
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </FormControl>

                                            {passwordValue.length > 0 && (
                                                <div className="flex space-x-1 mt-2">
                                                    {[1, 2, 3].map((level) => (
                                                        <div
                                                            key={level}
                                                            className={cn(
                                                                'h-1 w-full rounded-full transition-all flex-1',
                                                                strength >= level
                                                                    ? level === 1
                                                                        ? 'bg-red-500'
                                                                        : level === 2
                                                                          ? 'bg-yellow-500'
                                                                          : 'bg-auth-accent'
                                                                    : 'bg-surface-soft/50'
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            <FormMessage className={cn(s.messageError, 'mt-1')} />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={s.label}>Confirmar contraseña</FormLabel>
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
                                                            'absolute right-3 top-1/2 -translate-y-1/2 hover:text-neutral-dark',
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

                                <Button type="button" onClick={onNextStep} className={cn(s.submitBtn, 'mt-4')}>
                                    Siguiente
                                    <ArrowRight size={18} className="ml-2" />
                                </Button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-5 animate-fade-in">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={s.label}>Nombre</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ejemplo: Juan" className={s.input} {...field} />
                                            </FormControl>
                                            <FormMessage className={s.messageError} />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={s.label}>Apellido</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ejemplo: Pérez" className={s.input} {...field} />
                                            </FormControl>
                                            <FormMessage className={s.messageError} />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={s.label}>Teléfono</FormLabel>
                                            <FormControl>
                                                <div className="flex space-x-2">
                                                    <div className="auth-panel-input flex items-center relative rounded-md pr-2">
                                                        <select
                                                            value={phonePrefix}
                                                            onChange={(e) => {
                                                                const newPrefix = e.target.value;
                                                                setPhonePrefix(newPrefix);
                                                                field.onChange(`${newPrefix}${phoneNumber}`);
                                                            }}
                                                            className="relative z-10 h-11 w-24 cursor-pointer appearance-none border-transparent bg-transparent pl-3 text-neutral-dark focus:outline-none focus:ring-0"
                                                        >
                                                            {['0412', '0414', '0416', '0424', '0426', '0422'].map(
                                                                (p) => (
                                                                    <option key={p} value={p}>
                                                                        {p}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                        <div
                                                            className={cn(
                                                                'pointer-events-none absolute right-3',
                                                                s.iconMuted
                                                            )}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <polyline points="6 9 12 15 18 9"></polyline>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <Input
                                                        placeholder="1234567"
                                                        value={phoneNumber}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(/\D/g, '').slice(0, 7);
                                                            setPhoneNumber(val);
                                                            field.onChange(`${phonePrefix}${val}`);
                                                        }}
                                                        className={cn('flex-1', s.input)}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className={s.messageError} />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-3">
                                    <FormField
                                        control={form.control}
                                        name="estado"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel className={s.label}>Ubicación</FormLabel>
                                                <Select
                                                    onValueChange={(value) => {
                                                        const estadoId = parseInt(value);
                                                        const estadoNombre =
                                                            estados.find((e) => e.id === estadoId)?.nombre ?? value;
                                                        field.onChange(estadoNombre);
                                                        setSelectedEstadoId(estadoId);
                                                        form.setValue('municipio', '');
                                                        setMunicipios([]);
                                                    }}
                                                    defaultValue={selectedEstadoId?.toString() ?? ''}
                                                    value={selectedEstadoId?.toString() ?? ''}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className={s.input} disabled={isLoadingEstados}>
                                                            <SelectValue
                                                                placeholder={
                                                                    isLoadingEstados
                                                                        ? 'Cargando...'
                                                                        : 'Selecciona un estado'
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="z-50">
                                                        {estados.map((estado) => (
                                                            <SelectItem key={estado.id} value={estado.id.toString()}>
                                                                {estado.nombre}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className={s.messageError} />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="municipio"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel className={s.label}>&nbsp;</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    value={field.value}
                                                    disabled={!selectedEstadoId || isLoadingMunicipios}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className={s.input}>
                                                            <SelectValue
                                                                placeholder={
                                                                    isLoadingMunicipios
                                                                        ? 'Cargando...'
                                                                        : 'Selecciona un municipio'
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="z-50">
                                                        {municipios.map((municipio) => (
                                                            <SelectItem key={municipio.id} value={municipio.nombre}>
                                                                {municipio.nombre}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className={s.messageError} />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="tipo_usuario"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="flex gap-40">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id="servidor-publico"
                                                            className={roleCheckboxClassName}
                                                            checked={field.value === 'SERVIDOR_PUBLICO'}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    field.onChange('SERVIDOR_PUBLICO');
                                                                    setShowEnteFields(true);
                                                                    setShowCargoNormativa(true);
                                                                } else {
                                                                    field.onChange('');
                                                                    setShowEnteFields(false);
                                                                    setShowCargoNormativa(false);
                                                                    form.setValue('nombre_ente', '');
                                                                    form.setValue('cargo', '');
                                                                    form.setValue('estatus_normativa_girs', '');
                                                                }
                                                            }}
                                                        />
                                                        <label htmlFor="servidor-publico" className={s.label}>
                                                            Servidor público
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id="asesor-privado"
                                                            className={roleCheckboxClassName}
                                                            checked={field.value === 'ASESOR_PRIVADO'}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    field.onChange('ASESOR_PRIVADO');
                                                                    setShowEnteFields(true);
                                                                    setShowCargoNormativa(false);
                                                                    form.setValue('cargo', '');
                                                                    form.setValue('estatus_normativa_girs', '');
                                                                } else {
                                                                    field.onChange('');
                                                                    setShowEnteFields(false);
                                                                    setShowCargoNormativa(false);
                                                                    form.setValue('nombre_ente', '');
                                                                    form.setValue('cargo', '');
                                                                    form.setValue('estatus_normativa_girs', '');
                                                                }
                                                            }}
                                                        />
                                                        <label htmlFor="asesor-privado" className={s.label}>
                                                            Asesor privado
                                                        </label>
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage className={cn(s.messageError, 'mt-1')} />
                                        </FormItem>
                                    )}
                                />

                                {showEnteFields && (
                                    <div className="space-y-4 animate-fade-in">
                                        <FormField
                                            control={form.control}
                                            name="nombre_ente"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className={s.label}>Ente/Institución</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Ej. Ministerio del Poder Popular..."
                                                            className={s.input}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className={s.messageError} />
                                                </FormItem>
                                            )}
                                        />

                                        {showCargoNormativa && (
                                            <>
                                                <FormField
                                                    control={form.control}
                                                    name="cargo"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className={s.label}>Cargo</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Ej. Director de..."
                                                                    className={s.input}
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage className={s.messageError} />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="estatus_normativa_girs"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className={s.label}>
                                                                ¿Posee tu municipio normativa de Derecho Urbanístico
                                                                actualmente?
                                                            </FormLabel>
                                                            <Select
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger className={s.input}>
                                                                        <SelectValue placeholder="Selecciona una opción" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="VIGENTE">
                                                                        Sí está vigente
                                                                    </SelectItem>
                                                                    <SelectItem value="EN_MORA">
                                                                        No posee / En mora
                                                                    </SelectItem>
                                                                    <SelectItem value="EN_REVISION">
                                                                        En revisión técnica
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage className={s.messageError} />
                                                        </FormItem>
                                                    )}
                                                />
                                            </>
                                        )}
                                    </div>
                                )}

                                <FormField
                                    control={form.control}
                                    name="termsAccepted"
                                    render={({ field }) => (
                                        <FormItem className="relative mt-2 flex flex-row items-start space-y-0 space-x-3 rounded-lg border border-surface-soft/60 p-2">
                                            <FormControl>
                                                <input
                                                    type="checkbox"
                                                    checked={field.value}
                                                    onChange={field.onChange}
                                                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-auth-accent focus:ring-auth-accent cursor-pointer"
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <div className="!mt-0 block text-sm font-medium leading-normal text-neutral-dark/80">
                                                    He leído y acepto los{' '}
                                                    <span
                                                        className="text-auth-accent font-bold cursor-pointer hover:underline"
                                                        onClick={() => setIsTermsOpen(true)}
                                                    >
                                                        Términos y condiciones
                                                    </span>{' '}
                                                    y la{' '}
                                                    <span
                                                        className="text-auth-accent font-bold cursor-pointer hover:underline"
                                                        onClick={() => setIsPrivacyOpen(true)}
                                                    >
                                                        Política de privacidad
                                                    </span>
                                                    .
                                                </div>
                                                <FormMessage
                                                    className={cn(s.messageError, 'mt-1 absolute -bottom-5 left-0')}
                                                />
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="emailCommunicationsAccepted"
                                    render={({ field }) => (
                                        <FormItem className="relative mt-2 flex flex-row items-start space-y-0 space-x-3 rounded-lg border border-surface-soft/60 p-2">
                                            <FormControl>
                                                <input
                                                    id="email-communications"
                                                    type="checkbox"
                                                    checked={Boolean(field.value)}
                                                    onChange={(event) => field.onChange(event.target.checked)}
                                                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-auth-accent focus:ring-auth-accent cursor-pointer"
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <label
                                                    htmlFor="email-communications"
                                                    className="!mt-0 block text-sm font-medium leading-normal text-neutral-dark/80 cursor-pointer"
                                                >
                                                    Acepto recibir comunicaciones por correo electrónico sobre
                                                    novedades, actualizaciones y contenidos de Ius Urbano.
                                                </label>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-3 mt-6 pt-2">
                                    <Button
                                        type="button"
                                        onClick={onPrevStep}
                                        variant="outline"
                                        className="h-12 w-12 shrink-0 rounded-full border border-surface-soft/60 text-primary hover:bg-surface-soft/40"
                                    >
                                        <ChevronLeft size={20} />
                                    </Button>
                                    <Button type="submit" className={cn(s.submitBtn, 'flex-1')} disabled={isSubmitting}>
                                        {isSubmitting ? <Spinner size="sm" className="text-on-primary mr-2" /> : null}
                                        Crear cuenta
                                        {!isSubmitting && <ArrowRight size={18} className="ml-2" />}
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className={cn('border-t pt-6 text-center', s.divider)}>
                            <p className={s.footerText}>
                                ¿Ya tienes una cuenta?{' '}
                                <button
                                    type="button"
                                    onClick={() => router.push('/login?panel=login')}
                                    className="font-bold text-auth-accent hover:underline"
                                >
                                    Iniciar sesión
                                </button>
                            </p>
                        </div>
                    </form>
                </Form>
            </div>

            <RegisterTermsDialog open={isTermsOpen} onOpenChange={setIsTermsOpen} />

            <RegisterPrivacyDialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen} />
        </>
    );
}
