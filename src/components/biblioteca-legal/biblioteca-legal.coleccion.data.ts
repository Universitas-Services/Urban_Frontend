import { BIBLIOTECA_LEGAL_CATEGORIES, type BibliotecaLegalCategory } from './biblioteca-legal.data';

export function getBibliotecaLegalCategoryById(id: string): BibliotecaLegalCategory | undefined {
    return BIBLIOTECA_LEGAL_CATEGORIES.find((category) => category.id === id);
}
