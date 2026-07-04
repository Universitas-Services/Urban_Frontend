'use client';

import React, { useState } from 'react';
import { RegisterTermsDialog } from '@/components/auth/RegisterTermsDialog';
import { RegisterPrivacyDialog } from '@/components/auth/RegisterPrivacyDialog';

export function CopyrightFooter() {
    // Estados para controlar cuándo se abren y cierran los modales
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

    return (
        <div className="w-full text-center py-3 mt-auto border-t border-surface-soft/10">
            {/* Texto de Copyright Base */}
            <p className="text-[12px] md:text-[13px] text-neutral-dark/60 font-medium">
                © 2026 Universitas Services, C.A. Todos los derechos reservados.
            </p>

            {/* Enlaces interactivos */}
            <div className="flex flex-wrap justify-center items-center gap-2 mt-2 text-[12px] md:text-[13px] text-primary/80 font-semibold">
                <button
                    onClick={() => setIsTermsOpen(true)}
                    className="hover:text-accent hover:underline transition-colors focus:outline-none"
                >
                    Términos y Condiciones de Uso
                </button>
                <span className="text-neutral-dark/30 select-none">|</span>

                <button
                    onClick={() => setIsPrivacyOpen(true)}
                    className="hover:text-accent hover:underline transition-colors focus:outline-none"
                >
                    Política de Privacidad
                </button>
                <span className="text-neutral-dark/30 select-none">|</span>

                <a
                    href="https://wa.me/584145051716"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent hover:underline transition-colors"
                >
                    Contacto / Soporte
                </a>
            </div>

            <RegisterTermsDialog open={isTermsOpen} onOpenChange={setIsTermsOpen} />

            <RegisterPrivacyDialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen} />
        </div>
    );
}
