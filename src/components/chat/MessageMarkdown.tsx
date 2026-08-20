'use client';

import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

type MessageMarkdownProps = {
    content: string;
    className?: string;
};

export function MessageMarkdown({ content, className }: MessageMarkdownProps) {
    return (
        <div className={cn('text-[15px] leading-relaxed break-words', className)}>
            <ReactMarkdown
                components={{
                    p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    ul: ({ children }) => (
                        <ul className="mb-3 list-disc space-y-2 pl-5 last:mb-0 marker:text-current">{children}</ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="mb-3 list-decimal space-y-2 pl-5 last:mb-0 marker:font-semibold marker:text-current">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => <li className="pl-0.5 leading-relaxed">{children}</li>,
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium underline underline-offset-2 opacity-90 hover:opacity-100"
                        >
                            {children}
                        </a>
                    ),
                    h1: ({ children }) => <h1 className="mb-2 text-lg font-bold last:mb-0">{children}</h1>,
                    h2: ({ children }) => <h2 className="mb-2 text-base font-bold last:mb-0">{children}</h2>,
                    h3: ({ children }) => <h3 className="mb-2 text-[15px] font-bold last:mb-0">{children}</h3>,
                    code: ({ children }) => (
                        <code className="rounded bg-black/5 px-1 py-0.5 text-[13px] font-mono">{children}</code>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote className="mb-3 border-l-2 border-current/30 pl-3 opacity-90 last:mb-0">
                            {children}
                        </blockquote>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
