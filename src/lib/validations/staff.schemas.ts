import * as z from 'zod';

/** Solo letras (con acentos) y espacios; elimina números/símbolos al escribir. */
export function sanitizeLettersOnly(value: string): string {
    return value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, '');
}

const nameOnlyLetters = z
    .string()
    .trim()
    .min(2, 'Debe tener al menos 2 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/, 'Solo letras (sin números ni símbolos)');

/** Misma regla que el registro y el DTO de staff del backend */
export const staffPasswordSchema = z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/^(?=.*[A-Z])(?=.*\d)/, 'Debe tener al menos una mayúscula y un número');

export const createStaffSchema = z.object({
    nombre: nameOnlyLetters,
    apellido: nameOnlyLetters,
    email: z.string().trim().email('Ingresa un correo válido'),
    password: staffPasswordSchema,
    role: z.enum(['CURADOR', 'REVISOR'], {
        error: 'Selecciona un rol',
    }),
});

export const updateStaffSchema = z.object({
    nombre: nameOnlyLetters,
    apellido: nameOnlyLetters,
    email: z.string().trim().email('Ingresa un correo válido'),
    password: z
        .string()
        .optional()
        .or(z.literal(''))
        .refine(
            (value) => !value || (value.length >= 8 && /^(?=.*[A-Z])(?=.*\d)/.test(value)),
            'Mínimo 8 caracteres, con mayúscula y número'
        ),
    role: z.enum(['CURADOR', 'REVISOR']),
    isActive: z.boolean(),
});

export type CreateStaffFormValues = z.infer<typeof createStaffSchema>;
export type UpdateStaffFormValues = z.infer<typeof updateStaffSchema>;

/**
 * Genera una contraseña que cumple: ≥8 chars, al menos 1 mayúscula y 1 número.
 */
export function generateStaffPassword(length = 12): string {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghijkmnopqrstuvwxyz';
    const digits = '23456789';
    const all = upper + lower + digits;

    const pick = (alphabet: string) => alphabet[Math.floor(Math.random() * alphabet.length)];

    const chars = [pick(upper), pick(digits), pick(lower)];
    while (chars.length < length) {
        chars.push(pick(all));
    }

    for (let i = chars.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    return chars.join('');
}
