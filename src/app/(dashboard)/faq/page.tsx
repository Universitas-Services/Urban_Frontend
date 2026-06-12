import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FaqPage() {
    // data del pdf con las FAQ
    const faqs = [
        {
            question: '1. ¿Qué es la Plataforma GIRS?',
            answer: 'La Plataforma GIRS es una infraestructura jurídica y técnica especializada en Gestión Integral de Residuos y Desechos Sólidos en Venezuela. Su finalidad es facilitar el acceso a información normativa, técnica y documental relacionada con el sector ambiental y el aseo urbano, integrando herramientas digitales diseñadas específicamente para apoyar procesos de consulta y toma de decisiones.',
        },
        {
            question: '2. ¿Quién desarrolla y administra la Plataforma GIRS?',
            answer: 'La Plataforma GIRS es desarrollada y administrada por Universitas Services, C.A., organización orientada al desarrollo de soluciones jurídicas, tecnológicas, educativas y de investigación aplicadas a distintas áreas de la gestión pública, el derecho y la transformación digital.',
        },
        {
            question: '3. ¿Cuál es el objetivo principal de la Plataforma GIRS?',
            answer: 'La Plataforma GIRS busca contribuir al fortalecimiento institucional de la gestión de residuos sólidos en Venezuela mediante el acceso organizado y centralizado a información especializada. La plataforma procura reducir la dispersión normativa y facilitar herramientas útiles para municipios, operadores, asesores y profesionales del sector.',
        },
        {
            question: '4. ¿Qué es la Biblioteca Legal GIRS?',
            answer: 'Es un repositorio documental especializado que reúne normativa, jurisprudencia, doctrina y documentos técnicos relacionados con residuos sólidos, aseo urbano y economía circular. Su contenido es organizado y estructurado para facilitar procesos de consulta y análisis.',
        },
        {
            question: '5. ¿Qué tipo de documentos puedo encontrar en la plataforma?',
            answer: 'La plataforma incluye leyes nacionales, ordenanzas municipales, decretos tarifarios, sentencias del Tribunal Supremo de Justicia, resoluciones administrativas, planes de gestión, criterios técnicos, doctrina especializada y otros documentos relevantes vinculados a la gestión integral de residuos y desechos sólidos.',
        },
        {
            question: '6. ¿La información contenida en la plataforma es oficial?',
            answer: 'La plataforma recopila y organiza documentos provenientes de fuentes oficiales y públicas. No obstante, corresponde al usuario validar siempre la vigencia y aplicabilidad de cada instrumento jurídico o técnico conforme a las fuentes oficiales competentes.',
        },
        {
            question: '7. ¿Qué es el Consultor IA – GIRS?',
            answer: 'El Consultor IA - GIRS es un agente conversacional especializado diseñado para asistir al usuario en procesos de búsqueda, consulta y localización de información jurídica y técnica relacionada con residuos sólidos y aseo urbano.',
        },
        {
            question: '8. ¿Cómo funciona el Consultor IA - GIRS?',
            answer: 'El sistema opera utilizando exclusivamente la información disponible dentro de la Biblioteca Legal GIRS y sus bases documentales asociadas. Esto permite generar respuestas contextualizadas y fundamentadas en documentos previamente organizados dentro de la plataforma.',
        },
        {
            question: '9. ¿El Consultor IA utiliza información externa de Internet?',
            answer: 'No. El Consultor IA - GIRS no realiza búsquedas abiertas en Internet para responder consultas. Su funcionamiento está limitado a la información documental integrada dentro del ecosistema GIRS.',
        },
        {
            question: '10. ¿Las respuestas del Consultor IA sustituyen asesoría jurídica o técnica?',
            answer: 'No. El Consultor IA es una herramienta de asistencia informativa y apoyo técnico. Las respuestas generadas no constituyen dictámenes vinculantes ni sustituyen la revisión profesional, jurídica o técnica que corresponda en cada caso.',
        },
        {
            question: '11. ¿Quiénes pueden utilizar la Plataforma GIRS?',
            answer: 'La plataforma está dirigida a servidores públicos, municipios, operadores, asesores, abogados, investigadores, empresas y profesionales vinculados a la gestión ambiental, residuos sólidos y aseo urbano en Venezuela.',
        },
        {
            question: '12. ¿Quiénes pueden acceder gratuitamente a la plataforma?',
            answer: 'Los servidores públicos vinculados directamente a áreas relacionadas con ambiente, aseo urbano o gestión integral de residuos sólidos pueden optar al acceso gratuito sujeto a validación y colaboración institucional.',
        },
        {
            question: '13. ¿Qué significa colaboración institucional dentro de GIRS?',
            answer: 'La plataforma promueve mecanismos de cooperación mediante los cuales los servidores públicos pueden contribuir con la actualización del repositorio documental, especialmente a través de la consignación de ordenanzas, decretos, planes y normativa municipal vigente.',
        },
        {
            question: '14. ¿Qué ocurre si un servidor público no colabora con la actualización normativa?',
            answer: 'El acceso gratuito otorgado bajo la modalidad de servidor público puede ser suspendido o revisado si el usuario incumple las condiciones de colaboración establecidas en los Términos y Condiciones de la plataforma.',
        },
        {
            question: '15. ¿Qué es un asesor privado dentro de la plataforma?',
            answer: 'Se considera asesor privado a todo profesional, consultor, empresa o usuario que no cumpla con los criterios definidos para el acceso gratuito como servidor público y que acceda mediante una suscripción paga.',
        },
        {
            question: '16. ¿La plataforma ofrece un período de prueba gratuito?',
            answer: 'Sí. Los asesores privados disponen de un período de prueba gratuito de siete (7) días continuos para conocer las funcionalidades de la plataforma antes de formalizar una suscripción.',
        },
        {
            question: '17. ¿La renovación de la suscripción es automática?',
            answer: 'No. Actualmente las renovaciones deben realizarse manualmente mediante validación de pago por parte de Universitas Services, C.A., conforme a las condiciones operativas establecidas en la plataforma.',
        },
        {
            question: '18. ¿Qué ocurre si no realizo la renovación de mi suscripción?',
            answer: 'Si el pago correspondiente no es validado dentro del ciclo de renovación, el acceso a las funciones premium podrá ser suspendido temporalmente hasta que se confirme la renovación del servicio.',
        },
        {
            question: '19. ¿Puedo solicitar un reembolso de mi suscripción?',
            answer: 'Sí. Los usuarios podrán solicitar un reembolso dentro de los primeros siete (7) días continuos posteriores al pago de la suscripción, conforme a las condiciones y porcentajes establecidos en los Términos y Condiciones.',
        },
        {
            question: '20. ¿Cómo protege GIRS la información de los usuarios?',
            answer: 'La plataforma implementa medidas técnicas, administrativas y organizativas orientadas a proteger la información personal y operativa de los usuarios, incluyendo mecanismos de seguridad, cifrado y control de acceso sobre la infraestructura tecnológica.',
        },
        {
            question: '21. ¿Qué ocurre con mis datos si elimino mi cuenta?',
            answer: 'Cuando el usuario elimina su cuenta, el acceso a la plataforma es deshabilitado. Los datos identificativos son eliminados o desvinculados conforme a los procesos de anonimización y cancelación lógica previstos en la Política de Privacidad.',
        },
        {
            question: '22. ¿La plataforma permite exportar historiales o consultas?',
            answer: 'Actualmente la Plataforma GIRS no dispone de funcionalidades de exportación masiva o portabilidad de historiales de consultas, interacciones o registros generados dentro del sistema.',
        },
        {
            question: '23. ¿Cómo puedo contactar al equipo de soporte?',
            answer: 'El equipo de soporte de la Plataforma GIRS puede ser contactado a través de los canales oficiales habilitados dentro del sistema, incluyendo la atención vía WhatsApp para incidencias técnicas, consultas operativas y gestiones administrativas. También puedes escribir directamente al correo electrónico: contacto@Universitas.legal.',
        },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
            {/* Se cambió max-w-4xl por max-w-7xl para que fluya y respete los márgenes del Sidebar */}
            {/* CARD PARA EL TÍTULO (Estilo página de Inicio) */}
            <div className="bg-white rounded-2xl shadow-sm border border-surface-soft/20 p-6 md:p-8 mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-[#003B4A] mb-2">Preguntas frecuentes</h1>
                <p className="text-[#388E3C] italic font-medium text-[15px] md:text-[16px] mb-2">
                    Respuestas a las dudas más comunes sobre la Plataforma GIRS
                </p>
                <p className="text-neutral-dark/70 italic text-[14px] md:text-[15px] leading-relaxed">
                    Explora nuestro centro de ayuda para conocer más sobre el acceso, los servicios, la Biblioteca Legal
                    y el funcionamiento del Consultor IA.
                </p>
            </div>

            {/* CARD DEL ACORDEÓN */}
            <div className="bg-white rounded-2xl shadow-sm border border-surface-soft/20 p-6 md:p-8">
                <Accordion type="single" collapsible className="w-full space-y-2">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border-surface-soft/30 px-2">
                            <AccordionTrigger className="text-left font-semibold text-neutral-dark hover:text-[#003B4A] transition-colors hover:no-underline py-4">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-neutral-dark/80 leading-relaxed pb-4 pt-1">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}
