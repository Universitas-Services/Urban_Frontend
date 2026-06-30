import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { BibliotecaLegalDocumento } from './biblioteca-legal.types';

type BibliotecaLegalDocumentCardProps = {
    documento: BibliotecaLegalDocumento;
    onPreview: (documento: BibliotecaLegalDocumento) => void;
    className?: string;
};

export function BibliotecaLegalDocumentCard({ documento, onPreview, className }: BibliotecaLegalDocumentCardProps) {
    const fechaFormateada = documento.fechaPublicacion
        ? format(new Date(documento.fechaPublicacion), "d 'de' MMMM yyyy", { locale: es })
        : null;

    return (
        <article
            className={cn(
                'flex flex-col rounded-xl border border-gray-200/70 bg-white shadow-sm overflow-hidden',
                className
            )}
        >
            <div className="flex h-36 items-center justify-center bg-surface-soft/50 border-b border-gray-100">
                <div className="icon-accent-box flex h-14 w-14 items-center justify-center rounded-xl">
                    <FileText className="h-7 w-7 text-accent" />
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="titulos-cards-proyecto-ley mb-2 line-clamp-2 leading-snug">{documento.titulo}</h3>
                <p className="descripcion-cards-small mb-4 line-clamp-4 flex-1 leading-snug">{documento.descripcion}</p>

                {fechaFormateada ? (
                    <p className="mb-4 text-[11px] font-medium text-gray-soft">
                        Publicado: <span className="text-primary">{fechaFormateada}</span>
                    </p>
                ) : null}

                <Button
                    type="button"
                    onClick={() => onPreview(documento)}
                    className="mt-auto w-full bg-primary hover:bg-primary-hover text-on-primary"
                >
                    Ver documento
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </article>
    );
}
