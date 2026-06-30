import Link from 'next/link';
import { ArrowRight, BookOpen, Building2, Globe, Landmark, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBibliotecaCategoryIconClass, type BibliotecaLegalCategory } from './biblioteca-legal.data';

type BibliotecaLegalCategoryCardProps = {
    category: BibliotecaLegalCategory;
    className?: string;
};

const CATEGORY_ICONS = {
    legislacion: Landmark,
    ordenanzas: Building2,
    'sentencias-nacionales': Scale,
    'sentencias-internacionales': Globe,
    doctrina: BookOpen,
    'instrumentos-internacionales': Globe,
} as const;

export function BibliotecaLegalCategoryCard({ category, className }: BibliotecaLegalCategoryCardProps) {
    const Icon = CATEGORY_ICONS[category.id as keyof typeof CATEGORY_ICONS] ?? BookOpen;
    const iconClassName = getBibliotecaCategoryIconClass(category.accent);

    return (
        <Link href={`/biblioteca-girs/${category.id}`} className={cn('group block h-full', className)}>
            <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200/70 bg-white shadow-sm transition-shadow group-hover:shadow-md">
                <div className="relative h-44 overflow-hidden border-b border-gray-100 bg-surface-soft/30 sm:h-48">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={category.imageSrc}
                        alt={category.imageAlt}
                        className="h-full w-full object-cover object-center"
                        draggable={false}
                    />
                    <div
                        className={cn(
                            'absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-lg shadow-sm',
                            iconClassName
                        )}
                    >
                        <Icon className="h-[18px] w-[18px]" aria-hidden />
                    </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                    <h2 className="titulos-cards-proyecto-ley leading-snug">{category.title}</h2>
                    <p className="descripcion-cards-small mt-2 flex-1 leading-relaxed">{category.description}</p>
                    <span className="biblioteca-category-link mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                        Explorar colección
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                </div>
            </article>
        </Link>
    );
}
