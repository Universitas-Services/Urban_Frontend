import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['600', '700'],
    variable: '--font-cormorant',
});

export const metadata: Metadata = {
    title: 'Consultor IA - GIRS',
    description: 'Plataforma de consultoría experta en Gestión Integral de Residuos Sólidos',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body
                className={`${inter.variable} ${cormorant.variable} font-sans min-h-[100dvh] bg-surface-light text-neutral-dark selection:bg-accent/20 selection:text-accent overflow-x-hidden`}
            >
                {children}
                <Toaster position="top-right" richColors />
            </body>
        </html>
    );
}
