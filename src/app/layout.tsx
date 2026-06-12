import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/store/auth.context';
import { ChatProvider } from '@/store/chat.context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'IA Agent Platform',
    description: 'Plataforma de agente conversacional con IA',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body
                className={`${inter.className} min-h-[100dvh] bg-surface-light text-neutral-dark selection:bg-accent/20 selection:text-accent overflow-x-hidden`}
            >
                <AuthProvider>
                    <ChatProvider>
                        {children}
                        <Toaster position="top-right" richColors />
                    </ChatProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
