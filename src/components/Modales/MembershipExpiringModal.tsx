'use client';

import * as React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface MembershipExpiringModalProps {
    isOpen: boolean;
    onClose: () => void;
    daysLeft?: number;
}

export function MembershipExpiringModal({ isOpen, onClose, daysLeft = 2 }: MembershipExpiringModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[440px] p-6 gap-0 rounded-3xl" showCloseButton={false}>
                <div className="flex flex-col items-center">
                    {/* Top Icon Section */}
                    <div
                        className={`flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${daysLeft <= 0 ? 'bg-red-50' : 'bg-[#FFF9EB]'}`}
                    >
                        <AlertTriangle
                            className={`w-8 h-8 ${daysLeft <= 0 ? 'text-red-500' : 'text-[#D97706]'}`}
                            strokeWidth={2.5}
                        />
                    </div>

                    {/* Title */}
                    <DialogHeader className="p-0 mb-3">
                        <DialogTitle className="text-3xl font-bold text-[#001D29] text-center leading-tight">
                            {daysLeft <= 0 ? 'Membresía vencida' : 'Membresía por vencer'}
                        </DialogTitle>
                    </DialogHeader>

                    {/* Description */}
                    <p className="text-[#4B5E7C] text-center text-[15px] leading-relaxed mb-4 px-4">
                        {daysLeft <= 0
                            ? 'Tu membresía ha finalizado. Renueva tu membresía para acceder nuevamente a tu historial de chats y herramientas de investigación.'
                            : `Tu membresía finaliza en ${daysLeft} día(s). Contacta a soporte para extender tu acceso y puedas tener acceso completo a las herramientas y al historial de chats.`}
                    </p>

                    {/* Simulated Progress Bar */}
                    <div className="w-full h-2 bg-[#E9EFFF] rounded-full mb-6 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${daysLeft <= 0 ? 'bg-red-500' : 'bg-[#F59E0B]'}`}
                            style={{ width: daysLeft <= 0 ? '100%' : '85%' }}
                        />
                    </div>

                    {/* Benefits Box */}
                    <div className="bg-[#F4F7FF] p-4 rounded-xl w-full mb-6">
                        <h4 className="text-[#003D52] font-bold text-center text-sm mb-4">
                            Actualiza tu plan ahora para continuar sin interrupciones.
                        </h4>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-[#0EA5E9]" />
                                <span className="text-[#4B5E7C] text-sm font-medium">Acceso completo</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-[#0EA5E9]" />
                                <span className="text-[#4B5E7C] text-sm font-medium">Historial completo de chats</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col w-full gap-3">
                        <Button
                            onClick={() => {
                                const whatsappUrl =
                                    daysLeft <= 0
                                        ? 'https://api.whatsapp.com/send?phone=+584145051716&text=%F0%9F%91%8B%20Hola,%20soy%20usuario%20de%20la%20*Plataforma%20GIRS*%20de%20Universitas%20y%20quiero%20renovar%20mi%20membres%C3%ADa'
                                        : 'https://api.whatsapp.com/send?phone=+584145051716&text=%F0%9F%91%8B%20Hola,%20soy%20usuario%20de%20la%20*Plataforma%20GIRS*%20de%20Universitas,%20mi%20membres%C3%ADa%20est%C3%A1%20por%20vencer%20y%20deseo%20renovarla';
                                window.open(whatsappUrl, '_blank');
                            }}
                            className="bg-[#00b800] hover:bg-[#00484f]/90 text-white rounded-xl h-12 text-base font-semibold shadow-sm transition-all"
                        >
                            Renovar membresía
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="text-[#4B5E7C] hover:text-[#001D29] hover:bg-transparent text-base font-medium transition-all h-10"
                        >
                            Continuar sin renovar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
