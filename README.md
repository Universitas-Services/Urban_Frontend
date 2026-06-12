# IA Agent Platform

Una aplicación web estática (mockeada) de agente conversacional con IA, construida con Next.js 14, Tailwind CSS, Shadcn UI y TypeScript.

## Características

- UI/UX Premium siguiendo el diseño especificado.
- Paleta de colores exacta: Petróleo, Verde vibrante, Fondos neutros y claros.
- Módulos de Autenticación (Login, Registro, Recuperar contraseña) con validaciones usando Zod.
- Dashboard conversacional con Sidebar colapsable responsivo.
- Efectos de escritura tipo máquina de escribir ("typewriter") para los mensajes del agente.
- Simulación de endpoints usando servicios asíncronos con retrasos (delay/sleep).
- Componentes accesibles usando Shadcn UI.

## Requisitos Previos

- Node.js 18+ recomendado.s

## Instalación y Configuración

1.  Abre la terminal en la raíz del proyecto.s
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
4.  Abre `http://localhost:3000` en tu navegador.
    Serás redirigido automáticamente al login.

### Variables de entorno (Opcional)

Hay una constante en `src/config/app.config.ts` que busca un API URL (`NEXT_PUBLIC_API_URL`). Para efectos de esta demo estática no es requerido.

### Personalización de Logos / Avatar

Los logos y el avatar se deben referenciar en `src/config/app.config.ts`.
Si no están definidos, la aplicación usará íconos vectoriales modernos (Lucide React) por defecto.
Para reemplazar, simplemente asigna una URL a las constantes `PROJECT_LOGO_URL` o `AGENT_AVATAR_URL` y la UI los renderizará usando `<Image />` de Next.js.
