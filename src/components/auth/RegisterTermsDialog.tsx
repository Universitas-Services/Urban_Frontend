'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { REGISTER_TERMS } from './register-terms.data';

type RegisterTermsDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function RegisterTermsDialog({ open, onOpenChange }: RegisterTermsDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col p-6 sm:p-8 bg-white border-none rounded-3xl shadow-2xl">
                <DialogHeader className="shrink-0 mb-4">
                    <DialogTitle className="text-2xl font-bold text-neutral-dark">{REGISTER_TERMS.title}</DialogTitle>
                    <DialogDescription className="text-[14px] font-semibold text-neutral-dark/70 pt-1">
                        Última actualización: {REGISTER_TERMS.updatedAt}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar text-[15px] leading-relaxed text-neutral-dark/80 space-y-5">
                    {REGISTER_TERMS.sections.map((section) => (
                        <div key={section.heading} className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-2">{section.heading}</h4>
                            {section.paragraphs.map((paragraph) => (
                                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                            ))}
                            {section.definitions ? (
                                <ul className="list-disc pl-5 space-y-1">
                                    {section.definitions.map((item) => (
                                        <li key={item.term}>
                                            <strong>{item.term}:</strong> {item.definition}
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>
                    ))}
                </div>

                <div className="shrink-0 pt-6 mt-2 border-t border-surface-soft/20">
                    <Button
                        variant="secondary"
                        className="w-full h-12 rounded-xl bg-surface-soft/20 hover:bg-surface-soft/40 text-neutral-dark font-bold text-base transition-colors"
                        onClick={() => onOpenChange(false)}
                    >
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
