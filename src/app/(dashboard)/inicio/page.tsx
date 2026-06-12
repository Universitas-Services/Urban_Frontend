'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FaInstagram, FaLinkedin, FaTwitter, FaXTwitter, FaFacebook, FaBook, FaGavel } from 'react-icons/fa6';
import { BsChatRight } from 'react-icons/bs';

export default function InicioPage() {
    const router = useRouter();

    const handleIniciarConsulta = () => {
        router.push('/chat');
    };

    const handleMasInformacion = () => {
        window.open('https://agora.universitasfundacion.com/', '_blank');
    };

    return (
        <div className="flex-1 overflow-auto custom-scrollbar p-6 bg-[var(--color-dashboard-bg)]">
            {/* Contenedor principal — se centra verticalmente y permite scroll si no cabe */}
            <div className="max-w-6xl mx-auto space-y-6">
                {/* ── Card 1: ¿Qué es la Plataforma GIRS? ── */}
                <div className="rounded-xl bg-white border border-gray-200/70 text-gray-800 px-4 py-2 shadow-sm">
                    <h1 className="titulos-cards mb-0 tracking-tight leading-tight mb-2">
                        ¿Qué es la Plataforma GIRS?
                    </h1>
                    <p className="text-xs md:text-[0.8rem] font-semibold italic text-[var(--color-btn-green)] mb-2 leading-snug">
                        Tu infraestructura jurídica y técnica para la Gestión Integral de Residuos Sólidos (GIRS)
                    </p>
                    <p className="descripcion-cards leading-snug">
                        La Plataforma GIRS es el sistema más completo de Venezuela para la gestión de residuos sólidos,
                        integrando normativa, criterios técnicos, estudios tarifarios y herramientas inteligentes que
                        fortalecen la toma de decisiones municipales.
                    </p>
                </div>

                {/* ── Card 2: Dos tarjetas lado a lado ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {/* Biblioteca Legal */}
                    <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm px-4 py-2 flex flex-col justify-between relative">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: '#BEDABE' }}
                                >
                                    <FaBook className="w-3.5 h-3.5" style={{ color: '#00B800' }} />
                                </div>
                                <h2 className="titulos-cards leading-tight">Biblioteca legal - GIRS</h2>
                            </div>

                            <p className="descripcion-cards mb-1 leading-[22px]">
                                El repositorio jurídico más completo del país en materia de residuos sólidos.
                            </p>
                        </div>

                        <div className="border-t border-gray-100 pt-1">
                            <p className="descripcion-cards-small mb-0.5 leading-[25px]">Accede a:</p>
                            <ul className="descripcion-cards-small space-y-0 list-disc list-inside leading-[25px]">
                                <li>Leyes nacionales</li>
                                <li>Ordenanzas municipales</li>
                                <li>Sentencias del TSJ</li>
                                <li>Estudios técnicos de tarifas</li>
                                <li>Documentos históricos y criterios especializados</li>
                            </ul>
                        </div>

                        <Button
                            onClick={() => router.push('/biblioteca-girs')}
                            className="absolute bottom-2 right-2 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg px-5 h-8 text-xs transition-all active:scale-95 cursor-pointer"
                        >
                            Ir a biblioteca
                        </Button>
                    </div>

                    {/* Consultor IA */}
                    <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm px-4 py-2 flex flex-col justify-between relative">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: '#BEDABE' }}
                                >
                                    <BsChatRight className="w-3.5 h-3.5" style={{ color: '#00B800' }} />
                                </div>
                                <h2 className="titulos-cards leading-tight">Consultor IA – GIRS</h2>
                            </div>

                            <p className="descripcion-cards leading-snug mb-7">
                                Es un agente IA conversacional especializado en normativa de residuos sólidos. El
                                Consultor responde preguntas y aclaran conceptos jurídicos usando exclusivamente la
                                Biblioteca Digital GIRS.
                            </p>

                            <p className="descripcion-cards leading-none mb-2 text-sm line-clamp-2">
                                Trabajamos para hacerlo mejor: si notas un error, repórtalo al equipo de soporte.
                            </p>
                        </div>

                        <Button
                            onClick={() => router.push('/chat')}
                            className="absolute bottom-2 right-2 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg px-5 h-8 text-xs transition-all active:scale-95 cursor-pointer"
                        >
                            Consulta aquí
                        </Button>
                    </div>
                </div>

                {/* ── Card: Anteproyecto de Ley ── */}
                <div className="rounded-xl bg-white border border-gray-200/70 text-gray-800 px-4 pt-4 pb-2 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: '#BEDABE' }}
                            >
                                <FaGavel className="w-3.5 h-3.5" style={{ color: '#00B800' }} />
                            </div>
                            <h2 className="titulos-cards mb-0 leading-tight">Anteproyecto de Ley Orgánica GIRS</h2>
                        </div>

                        <p className="descripcion-cards leading-snug mt-2">
                            Propuesta legislativa de vanguardia que impulsa el modelo de Economía Circular en Venezuela.
                            Conoce el marco normativo diseñado para transformar la disposición final de residuos en un
                            sistema sustentable y moderno.
                        </p>

                        <div className="flex justify-end mt-4">
                            <Button
                                onClick={() => router.push('/proyecto-ley')}
                                className="bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg px-5 h-8 text-xs transition-all active:scale-95 w-fit cursor-pointer"
                            >
                                Ver proyecto
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ── Card 3: Conócenos ── */}
                <div className="rounded-xl bg-white border border-gray-200/70 text-gray-800 px-4 pt-4 pb-12 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="titulos-cards mb-0 leading-tight">Conócenos</h2>

                        <p className="descripcion-cards leading-none mb-2 line-clamp-2">
                            Forma parte de nuestra comunidad. Accede a todos nuestros cursos sobre diversos temas de la
                            Administración Pública. Infórmate de temas de interés en nuestro medio digital, Ágora.
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            {/* Social Icons */}
                            <div className="flex items-center gap-3.5 text-primary">
                                <a
                                    href="https://www.instagram.com/universitas.legal/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:opacity-80 transition-all hover:scale-110"
                                    title="Instagram"
                                >
                                    <FaInstagram size={27} />
                                </a>
                                <a
                                    href="https://twitter.com/contratosve"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:opacity-80 transition-all hover:scale-110"
                                    title="Twitter"
                                >
                                    <FaTwitter size={27} />
                                </a>
                                <a
                                    href="https://twitter.com/contratarve"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:opacity-80 transition-all hover:scale-110"
                                    title="X"
                                >
                                    <FaXTwitter size={27} />
                                </a>
                                <a
                                    href="https://www.linkedin.com/company/universitas-legal/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:opacity-80 transition-all hover:scale-110"
                                    title="LinkedIn"
                                >
                                    <FaLinkedin size={27} />
                                </a>
                                <a
                                    href="https://www.facebook.com/contratacionespublicas"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:opacity-80 transition-all hover:scale-110"
                                    title="Facebook"
                                >
                                    <FaFacebook size={27} />
                                </a>
                            </div>

                            <Button
                                onClick={handleMasInformacion}
                                className="bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg px-5 h-8 text-xs transition-all active:scale-95 w-fit cursor-pointer"
                            >
                                Más Información
                            </Button>
                        </div>
                    </div>
                    {/* Ola / Wave SVG en la parte inferior */}
                    <svg
                        className="absolute bottom-0 left-0 w-full z-0 h-[40px] object-cover pointer-events-none"
                        viewBox="0 0 1440 320"
                        preserveAspectRatio="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill="#00b800"
                            fillOpacity="1"
                            d="M0,160L80,144C160,128,320,96,480,101.3C640,107,800,149,960,165.3C1120,181,1280,171,1360,165.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
                        ></path>
                    </svg>
                </div>
            </div>
        </div>
    );
}
