import { BIBLIOTECA_LEGAL_CATEGORIES } from './biblioteca-legal.data';
import { BibliotecaLegalHero } from './BibliotecaLegalHero';
import { BibliotecaLegalCategoryCard } from './BibliotecaLegalCategoryCard';

export function BibliotecaLegalPageContent() {
    return (
        <div className="flex-1 p-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 md:gap-6">
                <BibliotecaLegalHero />

                <section
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
                    aria-label="Categorías de la Biblioteca Legal"
                >
                    {BIBLIOTECA_LEGAL_CATEGORIES.map((category) => (
                        <BibliotecaLegalCategoryCard key={category.id} category={category} />
                    ))}
                </section>
            </div>
        </div>
    );
}
