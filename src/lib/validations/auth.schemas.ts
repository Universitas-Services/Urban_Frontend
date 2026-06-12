import * as z from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Ingresa un correo válido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
});

export const registerSchema = z
    .object({
        name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'Máximo 50 caracteres'),
        lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(50, 'Máximo 50 caracteres'),
        phone: z.string().min(7, 'Teléfono inválido').max(20, 'Teléfono inválido'),
        estado: z.string().min(1, 'Selecciona un estado'),
        municipio: z.string().min(1, 'Selecciona un municipio'),
        tipo_usuario: z.string().min(1, 'Selecciona un tipo de usuario'),
        nombre_ente: z.string().optional(),
        cargo: z.string().optional(),
        estatus_normativa_girs: z.string().optional(),
        email: z.string().email('Ingresa un correo válido'),
        password: z
            .string()
            .min(8, 'Mínimo 8 caracteres')
            .regex(/^(?=.*[A-Z])(?=.*\d)/, 'Debe tener al menos una mayúscula y un número'),
        confirmPassword: z.string(),
        termsAccepted: z.boolean().refine((val) => val === true, 'Debes aceptar los términos y condiciones'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    })
    .refine(
        (data) => {
            if (data.tipo_usuario === 'SERVIDOR_PUBLICO' || data.tipo_usuario === 'ASESOR_PRIVADO') {
                return data.nombre_ente && data.nombre_ente.length > 0;
            }
            return true;
        },
        {
            message: 'Ingresa el nombre del ente/institución',
            path: ['nombre_ente'],
        }
    );

export const forgotPasswordSchema = z
    .object({
        email: z.string().email('Ingresa un correo válido'),
        code: z
            .string()
            .regex(/^\d{6}$/, 'El código debe tener 6 dígitos numéricos')
            .optional()
            .or(z.literal('')),
        password: z
            .string()
            .min(8, 'Mínimo 8 caracteres')
            .regex(/^(?=.*[A-Z])(?=.*\d)/, 'Debe tener al menos una mayúscula y un número')
            .optional()
            .or(z.literal('')),
        confirmPassword: z.string().optional().or(z.literal('')),
    })
    .refine(
        (data) => {
            if (data.password && data.password.length > 0) {
                return data.password === data.confirmPassword;
            }
            return true;
        },
        {
            message: 'Las contraseñas no coinciden',
            path: ['confirmPassword'],
        }
    );
