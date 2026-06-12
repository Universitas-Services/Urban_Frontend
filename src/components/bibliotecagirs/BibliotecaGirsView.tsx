'use client';

import { BibliotecaGirsCard } from './BibliotecaGirsCard';
import { BookOpen, ArrowRight } from 'lucide-react';

export function BibliotecaGirsView() {
    return (
        <div className="flex-1 overflow-auto custom-scrollbar p-6 bg-[var(--color-dashboard-bg)]">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-[#00b800]" />
                        <span className="text-[#00b800] font-medium text-sm tracking-wider uppercase">
                            Documentación Técnica
                        </span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#003d52]">Biblioteca GIRS</h1>
                    <div className="w-50 h-0.5 bg-[#003d52]"></div>
                    <p className="text-neutral-500 italic max-w-3xl leading-relaxed">
                        Acceda al repositorio centralizado de conocimientos normativos y doctrinales para la Gestión
                        Integral de Residuos Sólidos. Una arquitectura de información diseñada para la soberanía técnica
                        legal.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <BibliotecaGirsCard
                        title="Legislación"
                        tagLabel="NACIONAL"
                        tagBgColor="bg-blue-100"
                        tagTextColor="text-blue-700"
                        imageSrc="/bibliotecagirs/legislacionn.png"
                        description="Compendio especializado de leyes orgánicas, leyes especiales, decretos y resoluciones que rigen la materia ambiental, la organización municipal y la tributación vinculada al servicio de aseo urbano."
                        href="https://universitas.legal/biblioteca-girs-legislacion/"
                    />
                    <BibliotecaGirsCard
                        title="Ordenanzas"
                        tagLabel="LOCAL"
                        tagBgColor="bg-green-100"
                        tagTextColor="text-green-700"
                        imageSrc="/bibliotecagirs/ordenanzass.png"
                        description="Compendio especializado de los instrumentos dictados por los Concejos Municipales que regulan el servicio local de aseo urbano, los regímenes tarifarios, la participación ciudadana y el control ambiental territorial."
                        href="https://universitas.legal/biblioteca-girs-ordenanzas/"
                    />
                    <BibliotecaGirsCard
                        title="Sentencias"
                        tagLabel="JUDICIAL"
                        tagBgColor="bg-slate-200"
                        tagTextColor="text-slate-600"
                        imageSrc="/bibliotecagirs/sentenciass.png"
                        description="Compendio especializado de fallos dictados por el Tribunal Supremo de Justicia que interpretan la normativa del aseo urbano, los regímenes tarifarios y los contratos de concesión municipal."
                        href="https://universitas.legal/biblioteca-girs-sentencias/"
                    />
                    <BibliotecaGirsCard
                        title="Doctrina administrativa"
                        tagLabel="ADMINISTRATIVO"
                        tagBgColor="bg-fuchsia-100"
                        tagTextColor="text-fuchsia-700"
                        imageSrc="/bibliotecagirs/doctrinas_administrativass.png"
                        description="Compendio especializado de informes de control fiscal, auditorías ambientales y dictámenes emitidos por los órganos del Estado sobre la gestión operativa del servicio de aseo urbano."
                        href="https://universitas.legal/biblioteca-girs-doctrina-administrativa/"
                    />
                    <BibliotecaGirsCard
                        title="Doctrina"
                        tagLabel="ACADÉMICO"
                        tagBgColor="bg-orange-100"
                        tagTextColor="text-orange-700"
                        imageSrc="/bibliotecagirs/doctrinass.png"
                        description="Compendio especializado de artículos académicos, ensayos e investigaciones que analizan críticamente los fundamentos teóricos, las competencias municipales y los debates tributarios en el manejo de residuos sólidos."
                        href="https://universitas.legal/biblioteca-girs-doctrina/"
                    />

                    {/* Especial Promo Card */}
                    <div className="flex flex-col bg-[#003d52] text-white rounded-xl shadow-sm border border-[#003d52] overflow-hidden p-8 justify-between">
                        <div>
                            <h3 className="text-2xl font-semibold mb-2 leading-tight">Conoce el anteproyecto de Ley</h3>
                            <div className="w-50 h-0.5 bg-white mb-4"></div>
                            <p className="text-white/80 italic text-sm leading-relaxed mb-6">
                                Propuesta legislativa de vanguardia orientada a sustituir el modelo tradicional de
                                disposición final por un sistema integral enfocado en la economía circular.
                            </p>
                        </div>
                        <a
                            href="https://drive.google.com/file/d/1SuWQpzY8ik0tgykwrEt3UkFNhtqnLGUT/view?usp=drive_link"
                            target="_blank"
                            className="w-full inline-flex items-center justify-center px-6 py-2.5 bg-[#00b800] hover:bg-[#009900] transition-colors text-white font-medium rounded-lg text-sm group mt-auto"
                        >
                            Saber más
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
