'use client';

import { useState, useEffect } from 'react';
import { sdkApi } from '@/lib/api/universitas.sdk';
import { MembershipExpiringModal } from '@/components/Modales/MembershipExpiringModal';
import { ProfileIncompleteModal } from '@/components/Modales/ProfileIncompleteModal';
import { FeatureBlockedModal } from '@/components/Modales/FeatureBlockedModal';

export default function SandboxPage() {
    const [activeModal, setActiveModal] = useState<'expiring' | 'profile' | 'blocked' | null>(null);
    const [daysLeft, setDaysLeft] = useState(2);
    const [bcvData, setBcvData] = useState<{ usd: number; eur: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => setActiveModal(null);

    const testSDK = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await sdkApi.economia.getBCV();
            setBcvData(result.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        testSDK();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6 w-full max-w-md">
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold text-[#001D29]">UI Sandbox</h1>
                    <p className="text-sm text-[#4B5E7C]">Panel de pruebas de componentes GIRS</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2 border-t pt-4">
                        <label className="text-xs font-bold text-[#8C9BBA] uppercase tracking-wider">
                            SDK Universidad (BCV)
                        </label>
                        {loading && <p className="text-sm text-gray-500">Cargando...</p>}
                        {error && <p className="text-sm text-red-500">Error: {error}</p>}
                        {bcvData && (
                            <div className="bg-gray-50 p-3 rounded-xl text-sm">
                                <p>
                                    USD: <span className="font-bold">${bcvData.usd}</span>
                                </p>
                                <p>
                                    EUR: <span className="font-bold">€{bcvData.eur}</span>
                                </p>
                            </div>
                        )}
                        <button
                            onClick={testSDK}
                            className="w-full py-2.5 rounded-xl text-sm font-medium bg-[#F4F7FF] text-[#003D52] hover:bg-[#e1e9ff] transition"
                        >
                            Recargar BCV
                        </button>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                        <label className="text-xs font-bold text-[#8C9BBA] uppercase tracking-wider">
                            Estado de Membresía
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setDaysLeft(2);
                                    setActiveModal('expiring');
                                }}
                                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-[#FFF9EB] text-[#D97706] hover:bg-[#fde6b3] transition"
                            >
                                Por vencer (2 días)
                            </button>
                            <button
                                onClick={() => {
                                    setDaysLeft(0);
                                    setActiveModal('expiring');
                                }}
                                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
                            >
                                Vencida (0 días)
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                        <label className="text-xs font-bold text-[#8C9BBA] uppercase tracking-wider">
                            Actualización de Datos
                        </label>
                        <button
                            onClick={() => setActiveModal('profile')}
                            className="w-full py-2.5 rounded-xl text-sm font-medium bg-[#F4F7FF] text-[#003D52] hover:bg-[#e1e9ff] transition"
                        >
                            Ver Perfil Incompleto
                        </button>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                        <label className="text-xs font-bold text-[#8C9BBA] uppercase tracking-wider">
                            Restricciones
                        </label>
                        <button
                            onClick={() => setActiveModal('blocked')}
                            className="w-full py-2.5 rounded-xl text-sm font-medium bg-[#F4F7FF] text-[#003D52] hover:bg-[#e1e9ff] transition"
                        >
                            Ver Función Bloqueada
                        </button>
                    </div>
                </div>
            </div>

            <MembershipExpiringModal isOpen={activeModal === 'expiring'} onClose={handleClose} daysLeft={daysLeft} />

            <ProfileIncompleteModal isOpen={activeModal === 'profile'} onSuccess={handleClose} />

            <FeatureBlockedModal isOpen={activeModal === 'blocked'} onClose={handleClose} errorCode="403_TEST_MODE" />
        </div>
    );
}
