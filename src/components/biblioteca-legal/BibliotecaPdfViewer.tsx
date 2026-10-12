'use client';

import * as React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ExternalLink, Loader2, Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const pdfOptions = {
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    cMapPacked: true,
};

type BibliotecaPdfViewerProps = {
    url: string;
    title: string;
    className?: string;
};

export function BibliotecaPdfViewer({ url, title, className }: BibliotecaPdfViewerProps) {
    const scrollerRef = React.useRef<HTMLDivElement>(null);
    const [numPages, setNumPages] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const [scale, setScale] = React.useState(1);
    const [pageWidth, setPageWidth] = React.useState(640);
    const [aspect, setAspect] = React.useState(0.72);
    const [failed, setFailed] = React.useState(false);

    React.useEffect(() => {
        const node = scrollerRef.current;
        if (!node) return;

        const measure = () => {
            const availW = Math.max(280, node.clientWidth - 32);
            const availH = Math.max(480, node.clientHeight - 32);
            setPageWidth(Math.min(availW, availH * aspect));
        };
        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(node);
        return () => observer.disconnect();
    }, [aspect, failed]);

    if (failed) {
        return (
            <div className={cn('flex h-full min-h-0 flex-col', className)}>
                <div className="flex shrink-0 items-center justify-between gap-2 border-b bg-white px-3 py-2">
                    <p className="text-xs text-muted-foreground">Vista del navegador</p>
                    <Button type="button" size="sm" variant="outline" asChild>
                        <a href={url} target="_blank" rel="noreferrer">
                            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                            Abrir
                        </a>
                    </Button>
                </div>
                <iframe src={url} title={title} className="min-h-0 w-full flex-1 bg-white" />
            </div>
        );
    }

    return (
        <div className={cn('flex h-full min-h-0 flex-1 flex-col bg-[#1c2430]', className)}>
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#151b24] px-2 py-1.5 text-white">
                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white hover:bg-white/10 hover:text-white"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        aria-label="Página anterior"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[7.5rem] text-center text-xs tabular-nums text-white/90">
                        Pág. {page} de {numPages || '—'}
                    </span>
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white hover:bg-white/10 hover:text-white"
                        disabled={numPages === 0 || page >= numPages}
                        onClick={() => setPage((p) => Math.min(numPages, p + 1))}
                        aria-label="Página siguiente"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white hover:bg-white/10 hover:text-white"
                        disabled={scale <= 0.6}
                        onClick={() => setScale((s) => Math.max(0.6, Number((s - 0.15).toFixed(2))))}
                        aria-label="Alejar"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center text-xs tabular-nums text-white/90">
                        {Math.round(scale * 100)}%
                    </span>
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white hover:bg-white/10 hover:text-white"
                        disabled={scale >= 2.2}
                        onClick={() => setScale((s) => Math.min(2.2, Number((s + 0.15).toFixed(2))))}
                        aria-label="Acercar"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="ml-1 h-8 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                        asChild
                    >
                        <a href={url} target="_blank" rel="noreferrer">
                            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                            Abrir
                        </a>
                    </Button>
                </div>
            </div>
            <div ref={scrollerRef} className="flex min-h-0 flex-1 items-start justify-center overflow-auto px-3 py-4">
                <Document
                    file={url}
                    options={pdfOptions}
                    loading={
                        <div className="flex h-[70vh] items-center justify-center text-muted-foreground">
                            <Loader2 className="h-6 w-6 animate-spin" aria-label="Cargando PDF" />
                        </div>
                    }
                    onLoadSuccess={({ numPages: total }) => {
                        setNumPages(total);
                        setPage(1);
                    }}
                    onLoadError={() => setFailed(true)}
                    className="flex justify-center"
                >
                    <Page
                        pageNumber={page}
                        width={Math.round(pageWidth * scale)}
                        onLoadSuccess={(pdfPage) => {
                            const viewport = pdfPage.getViewport({ scale: 1 });
                            if (viewport.height > 0) {
                                setAspect(viewport.width / viewport.height);
                            }
                        }}
                        renderTextLayer
                        renderAnnotationLayer
                        className="bg-white shadow-2xl"
                        loading={
                            <div className="flex h-64 items-center justify-center">
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                        }
                    />
                </Document>
            </div>
        </div>
    );
}
