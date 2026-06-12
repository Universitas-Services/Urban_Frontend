'use client';

import { cn } from '@/lib/utils';
import { IoIosAttach, IoIosBriefcase, IoIosClipboard } from 'react-icons/io';
import { BsJournalBookmark } from 'react-icons/bs';
import { ExternalLink } from 'lucide-react';

interface LegalCardProps {
    title: string;
    description: string;
    publishDate: string;
    gacetaNumber: string;
    gacetaLink: string;
    type: 'Ley Orgánica' | 'Ley Ordinaria' | 'Norma General' | 'Resolución';
    downloadLink: string;
    className?: string;
}

const TYPE_CONFIGS = {
    'Ley Orgánica': {
        Icon: IoIosAttach,
        bgColor: 'var(--color-legal-organica)',
        label: 'Ley Orgánica',
    },
    'Ley Ordinaria': {
        Icon: BsJournalBookmark,
        bgColor: 'var(--color-legal-ordinaria)',
        label: 'Ley Ordinaria',
    },
    'Norma General': {
        Icon: IoIosBriefcase,
        bgColor: 'var(--color-legal-norma)',
        label: 'Norma General',
    },
    Resolución: {
        Icon: IoIosClipboard,
        bgColor: 'var(--color-legal-resolucion)',
        label: 'Resolución',
    },
};

export function LegalCard({
    title,
    description,
    publishDate,
    gacetaNumber,
    gacetaLink,
    type,
    downloadLink,
    className,
}: LegalCardProps) {
    const config = TYPE_CONFIGS[type] || TYPE_CONFIGS['Ley Orgánica'];
    const { Icon, bgColor, label } = config;

    return (
        <div
            className={cn(
                'flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-full justify-between transition-all hover:shadow-md',
                className
            )}
        >
            <div className="flex flex-col gap-3">
                {/* Header: Icon + Type Badge */}
                <div className="flex justify-between items-start">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 shadow-sm"
                        style={{ backgroundColor: bgColor }}
                    >
                        <Icon size={20} />
                    </div>
                    <div
                        className="px-2.5 py-1 rounded-lg text-[9px] font-bold text-gray-700/80 uppercase tracking-widest"
                        style={{ backgroundColor: bgColor }}
                    >
                        {label}
                    </div>
                </div>

                {/* Body: Title + Description */}
                <div className="space-y-2">
                    <h3 className="titulos-cards-proyecto-ley text-[18px] text-[#003d52] text-base leading-snug font-bold">
                        {title}
                    </h3>
                    <p className="descripcion-cards-proyecto-ley text-[11.5px] italic text-gray-500 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>

            <div className="mt-4 space-y-4">
                {/* Separator */}
                <div className="w-full h-[1px] bg-gray-100" />

                {/* Metadata: Date + Gaceta */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-[12px]">
                        <span className="text-gray-400 font-medium">Fecha publicación</span>
                        <span className="text-[#003d52] font-extrabold">{publishDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-[12px]">
                        <span className="text-gray-400 font-medium font-bold">GACETA OFICIAL</span>
                        <a
                            href={gacetaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-0.5 rounded-md text-[9px] font-bold flex items-center gap-1 transition-colors uppercase"
                        >
                            {gacetaNumber}
                            <ExternalLink size={8} />
                        </a>
                    </div>
                </div>

                {/* Action Button */}
                <a
                    href={downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center h-10 bg-[#003d52] hover:bg-[#002f40] text-white font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-[#003d52]/10 text-sm"
                >
                    Descargar
                </a>
            </div>
        </div>
    );
}
