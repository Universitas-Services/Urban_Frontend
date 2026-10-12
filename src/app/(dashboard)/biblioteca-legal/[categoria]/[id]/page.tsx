import { notFound } from 'next/navigation';
import { BibliotecaLegalDocumentDetailContent, getBibliotecaLegalCategoryById } from '@/components/biblioteca-legal';

type BibliotecaLegalDocumentDetailPageProps = {
    params: Promise<{ categoria: string; id: string }>;
};

export default async function BibliotecaLegalDocumentDetailPage({ params }: BibliotecaLegalDocumentDetailPageProps) {
    const { categoria, id } = await params;
    const category = getBibliotecaLegalCategoryById(categoria);

    if (!category || !id?.trim()) {
        notFound();
    }

    return (
        <BibliotecaLegalDocumentDetailContent
            documentId={id.trim()}
            categoryId={category.id}
            categoryTitle={category.title}
        />
    );
}
