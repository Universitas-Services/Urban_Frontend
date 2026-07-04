'use client';

import { useState } from 'react';
import { RegisterTermsDialog } from '@/components/auth/RegisterTermsDialog';
import { RegisterPrivacyDialog } from '@/components/auth/RegisterPrivacyDialog';

export default function AcercaDePage() {
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

    return (
        <div className="flex-1 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* ── Un solo card conteniendo todo el contenido ── */}
                <div className="w-full rounded-xl bg-white border border-gray-200/70 shadow-sm p-6 md:p-8 flex flex-col gap-6">
                    {/* Header: logo + título */}
                    <div className="flex items-center gap-5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/asset/LOGO UNIVERSITAS LEGAL.png"
                            alt="Universitas Legal"
                            className="h-14 w-auto object-contain shrink-0"
                        />
                        <div>
                            <h1 className="titulos-cards leading-tight mb-0 text-xl md:text-[23px]">
                                Acerca de la{' '}
                                <span style={{ color: 'var(--color-primary)' }}>Plataforma Ius Urbano</span>
                            </h1>
                        </div>
                    </div>

                    {/* Contenido principal */}
                    <div className="space-y-4">
                        <p className="descripcion-cards leading-relaxed text-justify">
                            Ius Urbano es un ecosistema digital de inteligencia jurídica especializado en Derecho
                            Urbanístico, desarrollo urbano local y ordenación urbanística, desarrollado por Universitas
                            Services, C.A. y la Asociación Civil Venezolana Instituto de Promoción Integral (AVIPRI). Su
                            propósito es facilitar el acceso a información jurídica especializada y apoyar la
                            investigación, la gestión pública y la toma de decisiones.
                        </p>
                        <p className="descripcion-cards leading-relaxed text-justify">
                            La plataforma integra una Biblioteca Legal con legislación nacional, ordenanzas municipales,
                            reglamentos, instrumentos de planificación territorial, jurisprudencia, doctrina y otros
                            documentos jurídicos especializados. Además, incorpora el Consultor IA – Derecho
                            Urbanístico, un asistente basado en inteligencia artificial que responde consultas
                            utilizando exclusivamente la información disponible en la Biblioteca Legal.
                        </p>
                        <p className="descripcion-cards leading-relaxed text-justify">
                            Como parte del ecosistema, Ius Urbano ofrece acceso a Aula Ciudad, un espacio de formación
                            continua con contenidos especializados en Derecho Urbanístico y desarrollo urbano local,
                            complementado con publicaciones y recursos de actualidad jurídica para promover el
                            aprendizaje y la actualización profesional.
                        </p>
                        <p className="descripcion-cards leading-relaxed text-justify">
                            Ius Urbano combina conocimiento jurídico, tecnología e inteligencia artificial para
                            contribuir al fortalecimiento de la seguridad jurídica, la planificación territorial y el
                            desarrollo sostenible de las ciudades.
                        </p>
                    </div>
                    {/* Footer: términos y privacidad */}
                    <div className="flex items-center gap-8 pt-2">
                        <button
                            onClick={() => setIsTermsOpen(true)}
                            className="text-sm text-neutral-dark hover:text-primary underline-offset-2 hover:underline transition-colors cursor-pointer"
                        >
                            Ver términos y condiciones
                        </button>
                        <button
                            onClick={() => setIsPrivacyOpen(true)}
                            className="text-sm text-neutral-dark hover:text-primary underline-offset-2 hover:underline transition-colors cursor-pointer"
                        >
                            Políticas de privacidad
                        </button>
                    </div>
                </div>
            </div>

            <RegisterTermsDialog open={isTermsOpen} onOpenChange={setIsTermsOpen} />

            <RegisterPrivacyDialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen} />
        </div>
    );
}
