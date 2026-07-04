'use client';

import { cn } from '@/lib/utils';
import { IoIosAttach, IoIosBriefcase, IoIosClipboard, IoIosDocument } from 'react-icons/io';
import { BsJournalBookmark } from 'react-icons/bs';
import type { LegalDocType } from './repositorio-legal.data';

interface LegalCardProps {
    title: string;
    description?: string;
    type: LegalDocType;
    downloadLink?: string;
    className?: string;
}

const TYPE_CONFIGS: Record<
    LegalDocType,
    {
        Icon: typeof IoIosAttach;
        bgColor: string;
        label: string;
    }
> = {
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
    Reglamento: {
        Icon: IoIosDocument,
        bgColor: 'var(--color-legal-reglamento)',
        label: 'Reglamento',
    },
    Resolución: {
        Icon: IoIosClipboard,
        bgColor: 'var(--color-legal-resolucion)',
        label: 'Resolución',
    },
};

export function LegalCard({ title, description, type, downloadLink, className }: LegalCardProps) {
    const { Icon, bgColor, label } = TYPE_CONFIGS[type];
    const hasDownloadLink = Boolean(downloadLink);

    return (
        <div
            className={cn(
                'flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-full justify-between transition-all hover:shadow-md',
                className
            )}
        >
            <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                    <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-700 shadow-sm"
                        style={{ backgroundColor: bgColor }}
                    >
                        <Icon size={20} />
                    </div>
                    <span
                        className="shrink-0 rounded-lg px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-gray-700/80 whitespace-nowrap"
                        style={{ backgroundColor: bgColor }}
                    >
                        {label}
                    </span>
                </div>

                <div className="space-y-2">
                    <h3 className="titulos-cards-proyecto-ley text-[18px] text-primary text-base leading-snug font-bold">
                        {title}
                    </h3>
                    <p className="descripcion-cards-proyecto-ley text-[11.5px] italic text-gray-500 leading-relaxed">
                        {description || 'Descripción disponible próximamente.'}
                    </p>
                </div>
            </div>

            <div className="mt-4">
                {hasDownloadLink ? (
                    <a
                        href={downloadLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center h-10 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary/10 text-sm"
                    >
                        Descargar
                    </a>
                ) : (
                    <button
                        type="button"
                        disabled
                        className="w-full flex items-center justify-center h-10 bg-gray-200 text-gray-500 font-bold rounded-xl text-sm cursor-not-allowed"
                    >
                        Próximamente
                    </button>
                )}
            </div>
        </div>
    );
}
