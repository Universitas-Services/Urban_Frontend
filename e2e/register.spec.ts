import { test, expect } from '@playwright/test';

test.describe('Flujo de Registro GIRS', () => {
    test('Debería registrar un usuario correctamente (Happy Path)', async ({ page }) => {
        const uniqueEmail = `test_${Date.now()}@example.com`;

        // Añadir intercepción para simular respuesta exitosa del servidor
        await page.route('**/api/auth/register', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true }),
            });
        });

        // 1. Navegar a la página de registro
        await page.goto('/register');
        await expect(page.getByRole('heading', { name: 'Crea tu cuenta' })).toBeVisible();

        // === PASO 1: CREDENCIALES ===
        await page.getByLabel('Correo electrónico').fill(uniqueEmail);
        // Usamos el atributo name para evadir el problema del div relative en el label
        await page.locator('input[name="password"]').fill('Admin1234');
        await page.locator('input[name="confirmPassword"]').fill('Admin1234');
        await page.getByRole('button', { name: 'Siguiente' }).click();

        // === PASO 2: DATOS PERSONALES ===
        await expect(page.getByRole('heading', { name: 'Completa tus datos' })).toBeVisible();
        await expect(page.getByLabel('Nombre')).toBeVisible();

        // Llenar campos de texto básicos
        await page.getByLabel('Nombre').fill('Juan');
        await page.getByLabel('Apellido').fill('Pérez');

        // Llenar teléfono
        const prefixSelect = page.locator('select').first();
        await prefixSelect.selectOption('0412');
        await page.getByPlaceholder('1234567').fill('1234567');

        // Selects de Shadcn (Estado y Municipio)
        const estadoTrigger = page.getByText('Selecciona un estado').first();
        await estadoTrigger.click();
        const firstEstado = page.locator('[role="option"]').first();
        await firstEstado.waitFor({ state: 'visible' });
        await firstEstado.click();

        const municipioTrigger = page.getByText('Selecciona un municipio');
        await municipioTrigger.click();
        const firstMunicipio = page.locator('[role="option"]').first();
        await firstMunicipio.waitFor({ state: 'visible' });
        await firstMunicipio.click();

        // Seleccionar Tipo de Usuario
        const asesorPrivadoCheckbox = page.locator('#asesor-privado');
        await asesorPrivadoCheckbox.check();

        // Llenar Ente/Institución
        const enteInput = page.getByPlaceholder('Ej. Ministerio del Poder Popular...');
        await enteInput.waitFor({ state: 'visible' });
        await enteInput.fill('Ministerio de Prueba');

        // Aceptar términos y condiciones
        const checkboxes = page.locator('input[type="checkbox"]');
        const count = await checkboxes.count();
        const termsCheckbox = checkboxes.nth(count - 1);
        await termsCheckbox.check();

        // Enviar el formulario
        await page.getByRole('button', { name: 'Crear cuenta' }).click();

        // === VERIFICACIONES FINALES ===
        await expect(page.getByText('Te hemos enviado un enlace de activación')).toBeVisible({ timeout: 5000 });
        await expect(page).toHaveURL(/.*\/login/);
    });

    test('Debería mostrar un error si el correo ya está registrado', async ({ page }) => {
        // Interceptamos la petición para simular que el correo ya existe en BD
        await page.route('**/auth/register', async (route) => {
            await route.fulfill({
                status: 409,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'El correo ya está registrado' }),
            });
        });

        // 1. Navegar a la página de registro
        await page.goto('/register');
        await expect(page.getByRole('heading', { name: 'Crea tu cuenta' })).toBeVisible();

        // === PASO 1: CREDENCIALES ===
        await page.getByLabel('Correo electrónico').fill('correo_duplicado@test.com');
        // Corrección de los selectores de contraseña aplicada aquí también
        await page.locator('input[name="password"]').fill('Admin1234');
        await page.locator('input[name="confirmPassword"]').fill('Admin1234');
        await page.getByRole('button', { name: 'Siguiente' }).click();

        // === PASO 2: DATOS PERSONALES ===
        await expect(page.getByRole('heading', { name: 'Completa tus datos' })).toBeVisible();
        await expect(page.getByLabel('Nombre')).toBeVisible();

        // Llenar campos de texto básicos
        await page.getByLabel('Nombre').fill('Test');
        await page.getByLabel('Apellido').fill('User');

        // Llenar teléfono
        const prefixSelect = page.locator('select').first();
        await prefixSelect.selectOption('0412');
        await page.getByPlaceholder('1234567').fill('1234567');

        // Selects de Shadcn (Estado y Municipio)
        const estadoTrigger = page.getByText('Selecciona un estado').first();
        await estadoTrigger.click();
        const firstEstado = page.locator('[role="option"]').first();
        await firstEstado.waitFor({ state: 'visible' });
        await firstEstado.click();

        const municipioTrigger = page.getByText('Selecciona un municipio');
        await municipioTrigger.click();
        const firstMunicipio = page.locator('[role="option"]').first();
        await firstMunicipio.waitFor({ state: 'visible' });
        await firstMunicipio.click();

        // Seleccionar Tipo de Usuario (Corrección aplicada para evitar bloqueo de Zod)
        const asesorPrivadoCheckbox = page.locator('#asesor-privado');
        await asesorPrivadoCheckbox.check();

        // Llenar Ente/Institución
        const enteInput = page.getByPlaceholder('Ej. Ministerio del Poder Popular...');
        await enteInput.waitFor({ state: 'visible' });
        await enteInput.fill('Ministerio de Prueba');

        // Aceptar términos y condiciones
        const checkboxes = page.locator('input[type="checkbox"]');
        const count = await checkboxes.count();
        const termsCheckbox = checkboxes.nth(count - 1);
        await termsCheckbox.check();

        // Enviar el formulario
        await page.getByRole('button', { name: 'Crear cuenta' }).click();

        // === VERIFICACIONES FINALES ===
        await expect(page.getByText('Error al registrar la cuenta')).toBeVisible({ timeout: 5000 });
    });
});
