import type { ReactNode } from 'react';

const URL_REGEX = /(https?:\/\/[^\s<]+[^\s<.,;:!?)\]}"'])/g;

export function linkifyText(text: string): ReactNode[] {
    const parts = text.split(URL_REGEX);

    return parts.map((part, index) => {
        if (/^https?:\/\//.test(part)) {
            return (
                <a
                    key={`${part}-${index}`}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
                >
                    {part}
                </a>
            );
        }

        return part;
    });
}
