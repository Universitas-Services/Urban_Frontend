import { notFound } from 'next/navigation';
import { BibliotecaLegalColeccionPageContent, getBibliotecaLegalCategoryById } from '@/components/biblioteca-legal';

type BibliotecaLegalColeccionPageProps = {
    params: Promise<{ categoria: string }>;
};

export default async function BibliotecaLegalColeccionPage({ params }: BibliotecaLegalColeccionPageProps) {
    const { categoria } = await params;
    const category = getBibliotecaLegalCategoryById(categoria);

    if (!category) {
        notFound();
    }

    return <BibliotecaLegalColeccionPageContent category={category} />;
}
