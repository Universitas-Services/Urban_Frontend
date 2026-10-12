'use server';

/**
 * @deprecated Preferir `getPublishedDocumentsAction` / `getDocumentByIdAction`
 * desde `@/lib/services/documents.service`. Este módulo solo reexpone wrappers
 * para no romper imports residuales.
 */

import {
    getDocumentByIdAction,
    getPublishedDocumentsAction,
    type DocumentsListResponse,
    type Documento,
    type DocumentsQueryParams,
} from '@/lib/services/documents.service';

export type BibliotecaLegalPublishedQuery = DocumentsQueryParams;

export async function getBibliotecaLegalPublishedDocuments(
    params?: BibliotecaLegalPublishedQuery
): Promise<DocumentsListResponse> {
    return getPublishedDocumentsAction(params);
}

export async function getBibliotecaLegalDocumentById(id: string): Promise<Documento> {
    return getDocumentByIdAction(id);
}
