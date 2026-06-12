'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth.context';

export default function AuthLayout({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace('/inicio');
        }
    }, [isAuthenticated, isLoading, router]);

    return (
        <div className="min-h-screen bg-white flex">
            <div className="w-full flex flex-col md:flex-row min-h-screen md:h-screen">
                {/* Panel Izquierdo (Móvil y Desktop) */}
                <div className="flex md:w-[45%] bg-primary flex-col items-center justify-center p-8 lg:p-12 relative text-on-primary shrink-0 min-h-[300px] md:min-h-full">
                    <div className="flex flex-col items-center justify-center z-10 space-y-6 text-center">
                        <div className="w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center mb-4 bg-white rounded-full border-4 border-primary overflow-hidden shadow-2xl relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/asset/Julio-AI-Fospuca.png"
                                alt="Consultor IA GIRS"
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <p className="text-on-primary/90 max-w-sm text-[15px] font-medium leading-relaxed">
                            Consultoría experta en Gestión Integral de Residuos Sólidos.
                        </p>
                    </div>
                    {/* NUEVO: Copyright fijado al fondo del panel azul */}
                    <div className="absolute bottom-6 left-0 w-full px-4 text-center z-10">
                        <p className="text-[11px] md:text-[12px] text-on-primary/60 font-medium">
                            © 2026 Universitas Services, C.A. Todos los derechos reservados.
                        </p>
                    </div>
                </div>

                {/* Panel Derecho (Formularios) */}
                <div className="w-full md:w-[55%] bg-white flex flex-col px-6 sm:px-10 lg:px-14 py-8 md:py-4 md:overflow-y-auto custom-scrollbar">
                    <div className="m-auto w-full max-w-md py-4 sm:py-6">{children}</div>
                </div>
            </div>
        </div>
    );
}
