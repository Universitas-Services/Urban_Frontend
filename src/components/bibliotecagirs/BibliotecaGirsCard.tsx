import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface BibliotecaGirsCardProps {
    className?: string;
    imageSrc?: string;
    tagLabel: string;
    tagBgColor?: string;
    tagTextColor?: string;
    title: string;
    description: string;
    href?: string;
}

export function BibliotecaGirsCard({
    className,
    imageSrc,
    tagLabel,
    tagBgColor = 'bg-blue-100',
    tagTextColor = 'text-blue-600',
    title,
    description,
    href = '#',
}: BibliotecaGirsCardProps) {
    return (
        <div
            className={cn(
                'flex flex-col bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden',
                className
            )}
        >
            {/* Image Placeholder */}
            <div className="w-full h-48 bg-neutral-200 relative">
                {imageSrc ? (
                    <Image src={imageSrc} alt={title} fill className="object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <span>Imagen</span>
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                {/* Header (Title + Tag) */}
                <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="titulos-cards text-lg leading-tight flex-1">{title}</h3>
                    <span className={cn('etiquetas px-0 py-1 rounded whitespace-nowrap', tagBgColor, tagTextColor)}>
                        {tagLabel}
                    </span>
                </div>

                {/* Description */}
                <p className="descripcion-cards flex-grow">{description}</p>

                {/* Divider */}
                <hr className="my-4 border-neutral-200" />

                {/* Button */}
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-[#003d52] hover:bg-[#002f40] transition-colors text-white font-medium rounded-lg text-sm group"
                >
                    Ver más
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
            </div>
        </div>
    );
}
