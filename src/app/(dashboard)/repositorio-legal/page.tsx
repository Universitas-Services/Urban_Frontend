'use client';

import { LegalCard } from '@/components/repositorio-legal/LegalCard';
import {
    REPOSITORIO_LEGAL_DOCUMENTOS,
    REPOSITORIO_LEGAL_INTRO,
} from '@/components/repositorio-legal/repositorio-legal.data';
import { FaBalanceScale } from 'react-icons/fa';

export default function RepositorioLegalPage() {
    return (
        <div className="flex-1 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="rounded-xl bg-white border border-gray-200/70 shadow-sm p-6 md:p-8 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-accent etiquetas font-bold">
                        <FaBalanceScale size={18} />
                        <span>{REPOSITORIO_LEGAL_INTRO.badge}</span>
                    </div>

                    <div className="space-y-3">
                        <h1 className="titulos-cards text-3xl md:text-[34px] leading-tight mb-0">
                            {REPOSITORIO_LEGAL_INTRO.title}
                        </h1>
                        <p className="descripcion-cards text-base md:text-[17px] leading-relaxed max-w-3xl">
                            {REPOSITORIO_LEGAL_INTRO.description}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-6">
                    {REPOSITORIO_LEGAL_DOCUMENTOS.map((documento) => (
                        <div
                            key={documento.id}
                            className="h-full transition-transform duration-300 hover:-translate-y-1"
                        >
                            <LegalCard
                                type={documento.legalType}
                                title={documento.title}
                                description={documento.description}
                                downloadLink={documento.downloadLink}
                                className="h-full flex flex-col"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
