'use client';

import * as React from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, ClipboardCheck, Clock, FileText, Tags, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getDocumentStatsAction, getPendingStatsAction, type DocumentStats } from '@/lib/services/documents.service';
import { useAuthStore } from '@/store/auth.store';

function StatCard({
    title,
    value,
    icon: Icon,
    href,
}: {
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    href?: string;
}) {
    const content = (
        <div className="rounded-lg border bg-card p-5 transition hover:border-primary/40">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="mt-2 text-3xl font-semibold text-neutral-dark">{value}</p>
                </div>
                <div className="rounded-md bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
            </div>
        </div>
    );
    return href ? <Link href={href}>{content}</Link> : content;
}

export default function StaffHomePage() {
    const { user } = useAuthStore();
    const isCurador = user?.role === 'CURADOR';
    const isRevisor = user?.role === 'REVISOR';
    const [stats, setStats] = React.useState<DocumentStats | null>(null);
    const [pendientes, setPendientes] = React.useState<number | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let cancelled = false;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- loading al montar dashboard staff
        setLoading(true);

        if (isCurador) {
            getDocumentStatsAction()
                .then((data) => {
                    if (!cancelled) setStats(data);
                })
                .catch(() => {
                    if (!cancelled) setStats(null);
                })
                .finally(() => {
                    if (!cancelled) setLoading(false);
                });
        } else if (isRevisor) {
            getPendingStatsAction()
                .then((data) => {
                    if (!cancelled) setPendientes(data.pendientes);
                })
                .catch(() => {
                    if (!cancelled) setPendientes(null);
                })
                .finally(() => {
                    if (!cancelled) setLoading(false);
                });
        } else {
            setLoading(false);
        }

        return () => {
            cancelled = true;
        };
    }, [isCurador, isRevisor]);

    if (isRevisor) {
        return (
            <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-dark">Mi panel de trabajo</h1>
                        <p className="text-sm text-muted-foreground">Documentos pendientes de revisión en la cola.</p>
                    </div>
                    <Button asChild>
                        <Link href="/staff/revision">
                            <ClipboardCheck className="mr-2 h-4 w-4" />
                            Ir a la cola
                        </Link>
                    </Button>
                </div>

                {loading && <p className="text-sm text-muted-foreground">Cargando métricas…</p>}

                {pendientes !== null && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <StatCard
                            title="Pendientes de revisión"
                            value={pendientes}
                            icon={Clock}
                            href="/staff/revision"
                        />
                    </div>
                )}
            </div>
        );
    }

    if (!isCurador) {
        return (
            <div className="flex flex-col gap-3">
                <h1 className="text-2xl font-semibold text-neutral-dark">Mi panel</h1>
                <p className="text-sm text-muted-foreground">Gestiona tu perfil y contraseña desde el menú.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-dark">Mi panel de trabajo</h1>
                    <p className="text-sm text-muted-foreground">Resumen de tus cargas en el pipeline de documentos.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/staff/etiquetas">
                            <Tags className="mr-2 h-4 w-4" />
                            Etiquetas
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/staff/carga">
                            <Upload className="mr-2 h-4 w-4" />
                            Nueva carga
                        </Link>
                    </Button>
                </div>
            </div>

            {loading && <p className="text-sm text-muted-foreground">Cargando métricas…</p>}

            {stats && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Subidos" value={stats.total} icon={FileText} href="/staff/biblioteca" />
                    <StatCard
                        title="Pendientes"
                        value={stats.pendientes}
                        icon={Clock}
                        href="/staff/biblioteca?estado=PENDIENTE_REVISION"
                    />
                    <StatCard
                        title="Rechazados"
                        value={stats.rechazados}
                        icon={AlertCircle}
                        href="/staff/correcciones"
                    />
                    <StatCard
                        title="Publicados"
                        value={stats.publicados}
                        icon={CheckCircle2}
                        href="/staff/biblioteca?estado=PUBLICADO"
                    />
                </div>
            )}
        </div>
    );
}
