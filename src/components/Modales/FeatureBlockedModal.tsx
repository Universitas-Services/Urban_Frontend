'use client';

import * as React from 'react';
import { Lock, Headset } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface FeatureBlockedModalProps {
    isOpen: boolean;
    onClose: () => void;
    errorCode?: string;
}

export function FeatureBlockedModal({
    isOpen,
    onClose,
    errorCode = '403_FORBIDDEN_MEMBERSHIP_EXPIRED',
}: FeatureBlockedModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] p-6 gap-4 rounded-3xl" showCloseButton={false}>
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-2xl">
                        <Lock className="w-8 h-8 text-red-500" strokeWidth={2.5} />
                    </div>

                    <DialogHeader className="p-0">
                        <DialogTitle className="font-display text-2xl font-bold text-primary text-center">
                            Función Bloqueada
                        </DialogTitle>
                    </DialogHeader>

                    <div className="bg-surface-light p-4 rounded-xl w-full">
                        <p className="text-gray-dark text-center text-sm leading-relaxed">
                            Esta función está bloqueada. No puedes chatear hasta que se renueve la membresía. Por favor,
                            contacta a soporte para más información.
                        </p>
                    </div>

                    <div className="flex items-center justify-between w-full px-1">
                        <span className="text-[10px] font-bold text-gray-soft tracking-wider uppercase">
                            Código de error
                        </span>
                        <div className="bg-surface-soft px-3 py-1 rounded-md">
                            <span className="text-[10px] font-bold text-gray-dark font-mono">{errorCode}</span>
                        </div>
                    </div>

                    <div className="flex flex-col w-full gap-3 mt-0">
                        <Button className="bg-primary hover:bg-primary-hover text-white rounded-xl h-12 text-base font-semibold transition-all flex items-center justify-center gap-2">
                            <Headset className="w-5 h-5" />
                            Contactar a Soporte
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="text-gray-dark hover:text-primary hover:bg-transparent text-base font-medium transition-all"
                        >
                            Cerrar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
