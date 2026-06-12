'use client';

import { LegalCard } from '@/components/repositorio-legal/LegalCard';
import { FaBalanceScale } from 'react-icons/fa';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

// Data real de 12 tarjetas
type LegalDocType = 'Ley Orgánica' | 'Ley Ordinaria' | 'Norma General' | 'Resolución';

interface LegalCardData {
    type: 'technical';
    legalType: LegalDocType;
    title: string;
    description: string;
    publishDate: string;
    gacetaNumber: string;
    gacetaLink: string;
    downloadLink: string;
}

const BASE_CARDS: LegalCardData[] = [
    {
        type: 'technical',
        legalType: 'Ley Orgánica',
        title: 'Ley Orgánica del Ambiente',
        description:
            'Establece los principios rectores para la gestión ambiental bajo el marco del desarrollo sustentable, garantizando a la población un ambiente seguro, sano y ecológicamente equilibrado.',
        publishDate: '22 de diciembre de 2006',
        gacetaNumber: 'GOE -N° 5.833',
        gacetaLink: 'https://drive.google.com/file/d/1VZBQPvdQR1ZyScIaHTVPEdynlpNo7hZ4/view?usp=drive_link',
        downloadLink: 'https://drive.google.com/file/d/19-MpbcuR7-LF_bL_R2ty4XQSP0s7bt2h/view?usp=drive_link',
    },
    {
        type: 'technical',
        legalType: 'Ley Orgánica',
        title: 'Ley Orgánica del Poder Público Municipal',
        description:
            'Desarrolla los principios constitucionales relativos a la autonomía, organización, funcionamiento y control de los municipios, garantizando la participación protagónica de los ciudadanos.',
        publishDate: '28 de diciembre de 2010',
        gacetaNumber: 'GOE -N° 6.015',
        gacetaLink: 'https://drive.google.com/file/d/1tYS_b6EXpWm5IaNkfnwTNBTxgSp2UPZA/view?usp=drive_link',
        downloadLink: 'https://drive.google.com/file/d/1qDP5f5q2hPr6mEPa3lXP5g1H-m9nXeh8/view?usp=drive_link',
    },
    {
        type: 'technical',
        legalType: 'Ley Orgánica',
        title: 'Ley Orgánica de Coordinación y Armonización de las Potestades Tributarias de los Estados y Municipios',
        description:
            'Establece principios, parámetros, limitaciones y alícuotas máximas para optimizar el sistema tributario, reducir la evasión fiscal y evitar la doble tributación.',
        publishDate: '10 de agosto de 2023',
        gacetaNumber: 'GOE -N° 6.755',
        gacetaLink: 'https://drive.google.com/file/d/1jlT8ZCwgXA2vRje_uDvTD-YzW8u_4IM-/view?usp=sharing',
        downloadLink: 'https://drive.google.com/file/d/1jlT8ZCwgXA2vRje_uDvTD-YzW8u_4IM-/view?usp=drive_link',
    },
    {
        type: 'technical',
        legalType: 'Ley Ordinaria',
        title: 'Ley de Gestión Integral de la Basura',
        description:
            'Establece el marco regulatorio para reducir la generación de basura y garantizar que su recolección, aprovechamiento y disposición final sean sanitarias y ambientalmente seguras.',
        publishDate: '30 de diciembre de 2010',
        gacetaNumber: 'GOE -N° 6.017',
        gacetaLink: 'https://drive.google.com/file/d/1y7AgNDUD6cOnPHuL86exNP7xebVz089b/view?usp=sharing',
        downloadLink: 'https://drive.google.com/file/d/1dbw0fHWiMF1w3ERJ5MS648ziO6Kz80Z1/view?usp=drive_link',
    },
    {
        type: 'technical',
        legalType: 'Ley Ordinaria',
        title: 'Ley Penal del Ambiente',
        description:
            'Tiene por objeto tipificar como delito los hechos atentatorios contra los recursos naturales y el ambiente para imponer las respectivas sanciones penales.',
        publishDate: '02 de mayo de 2012',
        gacetaNumber: 'GO N° 39.913',
        gacetaLink: 'https://drive.google.com/file/d/1GrM4At2NQXehJEt6govg-EW8eg_OS3Ns/view?usp=drive_link',
        downloadLink: 'https://drive.google.com/file/d/1lODbvockyxdQawZTTtEEpA8RIWQn12Mu/view?usp=sharing',
    },
    {
        type: 'technical',
        legalType: 'Ley Ordinaria',
        title: 'Ley sobre Sustancias, Materiales y Desechos Peligrosos',
        description:
            'Establece la protección de la salud y el ambiente frente a los impactos negativos de estos elementos, regulando aquellas sustancias de origen nacional o importados.',
        publishDate: '13 de noviembre de 2001',
        gacetaNumber: 'GOE -N° 5.554',
        gacetaLink: 'https://drive.google.com/file/d/1ESoSKbcXdKSEl6tW-5vrAbRypvRf5YnW/view?usp=drive_link',
        downloadLink: 'https://drive.google.com/file/d/1t21QzQ323U7ZTaEeYvctFpQh95hwsQVV/view?usp=drive_link',
    },
    {
        type: 'technical',
        legalType: 'Ley Ordinaria',
        title: 'Ley de Residuos y Desechos Sólidos',
        description:
            'Aplica un régimen jurídico para la producción y gestión responsable de los residuos, considerando evitar situaciones de riesgo para la salud humana y calidad ambiental.',
        publishDate: '18 de noviembre de 2004',
        gacetaNumber: 'GO N° 38.068',
        gacetaLink: 'https://drive.google.com/file/d/1Q5jNuBQZROcpMxpnapx7bRJFdw2vfYjn/view?usp=drive_link',
        downloadLink: 'https://drive.google.com/file/d/1n8MdNbRIJe0WeEx9WjGXkYVTWUu27LRO/view?usp=drive_link',
    },
    {
        type: 'technical',
        legalType: 'Norma General',
        title: 'Normas para el Control de la Recuperación de Materiales Peligrosos y el Manejo de los Desechos Peligrosos',
        description:
            'Regula de manera estricta los procesos de recuperación de materiales y el manejo de desechos que presenten condiciones peligrosas para la salud y el ambiente.',
        publishDate: '03 de agosto de 1998',
        gacetaNumber: 'GOE -N° 5.245',
        gacetaLink: 'https://drive.google.com/file/d/15tCMkzydeNgzKfYtj8xzt_Az4XjVQOhH/view?usp=drive_link',
        downloadLink: 'https://drive.google.com/file/d/15tCMkzydeNgzKfYtj8xzt_Az4XjVQOhH/view?usp=drive_link',
    },
    {
        type: 'technical',
        legalType: 'Norma General',
        title: 'Normas para el Manejo de los Desechos Sólidos de Origen Doméstico, Comercial, Industrial, o de cualquier otra naturaleza que no sean peligrosos',
        description:
            'Regula las operaciones de manejo de estos residuos para prevenir riesgos sanitarios y ambientales.',
        publishDate: '27 de abril de 1992',
        gacetaNumber: 'GOE -N° 4.418',
        gacetaLink: 'https://drive.google.com/file/d/1HbY_erzGOEfsU4AHfXu9gZukAZ1ffhOx/view?usp=drive_link',
        downloadLink: 'https://drive.google.com/file/d/1HbY_erzGOEfsU4AHfXu9gZukAZ1ffhOx/view?usp=drive_link',
    },
    {
        type: 'technical',
        legalType: 'Norma General',
        title: 'Normas para la Clasificación y Manejo de Desechos en Establecimientos de Salud',
        description:
            'Establece las condiciones operativas para el manejo de los residuos generados en establecimientos de salud, previniendo la contaminación e infección microbiana en usuarios.',
        publishDate: '27 de abril de 1992',
        gacetaNumber: 'GOE -N° 4.418',
        gacetaLink: 'https://drive.google.com/file/d/1d3COnxXgljcQLTq1pxsWs-9zDB-3rkKX/view?usp=drive_link',
        downloadLink: 'https://drive.google.com/file/d/1d3COnxXgljcQLTq1pxsWs-9zDB-3rkKX/view?usp=drive_link',
    },
    {
        type: 'technical',
        legalType: 'Norma General',
        title: 'Normas Sanitarias para Proyecto y Operación de un Relleno Sanitario de Residuos Sólidos',
        description:
            'Somete a estricta vigilancia de la autoridad sanitaria el diseño, ejecución y funcionamiento de los sitios de disposición final públicos o privados.',
        publishDate: '22 de noviembre de 1990',
        gacetaNumber: 'GO N° 34.600',
        gacetaLink: 'https://drive.google.com/file/d/1X-biZiyZN7P9TGhd_km7MTpxP3WrgXLW/view?usp=sharing',
        downloadLink: 'https://drive.google.com/file/d/1X-biZiyZN7P9TGhd_km7MTpxP3WrgXLW/view?usp=drive_link',
    },
    {
        type: 'technical',
        legalType: 'Resolución',
        title: 'Requisitos para la Autorización de Manejadores y Registro de Generadores de Desechos',
        description:
            'Detalla los procedimientos e instrumentos requeridos que deben cumplir las personas naturales y jurídicas para la inscripción y el registro de los generadores de desechos ante la autoridad ambiental.',
        publishDate: '26 de agosto de 2014',
        gacetaNumber: 'GO N° 40.483',
        gacetaLink: 'https://drive.google.com/file/d/1fP5UeHay7adQ_gw94oC2r-kT9KubJ5ny/view?usp=drive_link',
        downloadLink: 'https://drive.google.com/file/d/1UPxhF68Qo4CniO4-dAxL8u8tlL7rrEbf/view?usp=drive_link',
    },
];

export default function RepositorioLegalPage() {
    return (
        <div className="flex-1 overflow-auto custom-scrollbar p-6 bg-[var(--color-dashboard-bg)]">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* ── Card de Información ── */}
                <div className="rounded-xl bg-white border border-gray-200/70 shadow-sm p-6 md:p-8 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-[var(--color-icon-green)] etiquetas font-bold">
                        <FaBalanceScale size={18} />
                        <span>Base de Conocimiento</span>
                    </div>

                    <div className="space-y-3">
                        <h1 className="titulos-cards text-3xl md:text-[34px] leading-tight mb-0">Repositorio Legal</h1>
                        <p className="descripcion-cards text-base md:text-[17px] leading-relaxed max-w-3xl">
                            Acceda a nuestro Repositorio Legal para consultar las leyes orgánicas, leyes especiales y
                            decretos nacionales que rigen la Gestión Integral de Residuos Sólidos (GIRS).
                        </p>
                    </div>
                </div>

                {/* ── Sección de Carrusel ── */}
                <div className="relative px-8 md:px-12 pb-6 mt-4">
                    <Carousel
                        opts={{
                            align: 'start',
                            loop: true,
                            slidesToScroll: 1,
                            watchDrag: false,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {BASE_CARDS.map((card, idx) => (
                                <CarouselItem key={idx} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                                    <div className="h-full transition-transform duration-300 hover:-translate-y-1 p-1">
                                        {card.type === 'technical' ? (
                                            <LegalCard
                                                type={card.legalType}
                                                title={card.title}
                                                description={card.description || ''}
                                                publishDate={card.publishDate || ''}
                                                gacetaNumber={card.gacetaNumber || ''}
                                                gacetaLink={card.gacetaLink || ''}
                                                downloadLink={card.downloadLink || ''}
                                                className="h-full flex flex-col"
                                            />
                                        ) : null}
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute -left-10 md:-left-16 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 text-gray-400 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40 hover:bg-white" />
                        <CarouselNext className="absolute -right-10 md:-right-16 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 text-gray-400 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40 hover:bg-white" />
                    </Carousel>
                </div>
            </div>
        </div>
    );
}
