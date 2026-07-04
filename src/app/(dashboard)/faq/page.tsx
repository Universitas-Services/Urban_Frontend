import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FAQ_INTRO, FAQ_SECTIONS } from './faq.data';

export default function FaqPage() {
    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl shadow-sm border border-surface-soft/20 p-6 md:p-8 mb-6">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-primary mb-2">{FAQ_INTRO.title}</h1>
                <p className="text-accent italic font-medium text-[15px] md:text-[16px] mb-2">{FAQ_INTRO.subtitle}</p>
                <p className="text-neutral-dark/70 italic text-[14px] md:text-[15px] leading-relaxed">
                    {FAQ_INTRO.description}
                </p>
            </div>

            <div className="space-y-6">
                {FAQ_SECTIONS.map((section) => (
                    <div
                        key={section.title}
                        className="bg-white rounded-2xl shadow-sm border border-surface-soft/20 p-6 md:p-8"
                    >
                        <h2 className="titulos-cards-proyecto-ley mb-4 text-lg md:text-xl">{section.title}</h2>
                        <Accordion type="single" collapsible className="w-full space-y-2">
                            {section.items.map((faq) => (
                                <AccordionItem
                                    key={faq.question}
                                    value={faq.question}
                                    className="border-surface-soft/30 px-2"
                                >
                                    <AccordionTrigger className="text-left font-semibold text-neutral-dark hover:text-primary transition-colors hover:no-underline py-4">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-neutral-dark/80 leading-relaxed pb-4 pt-1">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                ))}
            </div>
        </div>
    );
}
