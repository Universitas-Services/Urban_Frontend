'use client';

import { DocumentUploadForm } from '@/components/staff/documents/DocumentUploadForm';
import { RouteGuard } from '@/components/auth/RouteGuard';

export default function StaffCargaPage() {
    return (
        <RouteGuard allowedRoles={['CURADOR']}>
            <DocumentUploadForm />
        </RouteGuard>
    );
}
