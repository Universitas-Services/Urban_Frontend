import type { Metadata } from 'next';
import { Inter, EB_Garamond } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { APP_CONFIG } from '@/config/app.config';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const ebGaramond = EB_Garamond({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    style: ['normal', 'italic'],
    variable: '--font-eb-garamond',
});

export const metadata: Metadata = {
    title: {
        default: APP_CONFIG.PROJECT_NAME,
        template: `%s | ${APP_CONFIG.PROJECT_NAME}`,
    },
    description: 'Plataforma de consultoría experta en Gestión Integral de Residuos Sólidos',
    icons: {
        icon: APP_CONFIG.FAVICON_URL,
        apple: APP_CONFIG.FAVICON_URL,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body
                className={`${inter.variable} ${ebGaramond.variable} font-sans min-h-[100dvh] bg-surface-light text-neutral-dark selection:bg-accent/20 selection:text-accent overflow-x-hidden`}
            >
                {children}
                <Toaster position="top-right" richColors />
            </body>
        </html>
    );
}
