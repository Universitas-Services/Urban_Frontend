'use server';

import { getAuthHeader } from '@/lib/auth/session';
import type { DashboardMetrics } from '@/types/admin.types';

const API = process.env.API_URL;

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const message = Array.isArray(err.message) ? err.message[0] : err.message || err.error || 'Error del servidor';
        throw new Error(message);
    }
    return res.json();
}

export async function getDashboardMetricsAction(): Promise<DashboardMetrics> {
    const res = await fetch(`${API}/admin/metrics/dashboard?t=${Date.now()}`, {
        headers: await getAuthHeader(),
        cache: 'no-store',
    });
    return handleResponse<DashboardMetrics>(res);
}
