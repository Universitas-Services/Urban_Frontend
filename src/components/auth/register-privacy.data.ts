export type RegisterPrivacyDefinition = {
    term: string;
    definition: string;
};

export type RegisterPrivacySection = {
    heading: string;
    paragraphs: string[];
    definitions?: RegisterPrivacyDefinition[];
};

export const REGISTER_PRIVACY = {
    title: 'POLÍTICA DE PRIVACIDAD Y TRATAMIENTO DE DATOS DE IUS URBANO',
    updatedAt: '04 de julio de 2026',
    sections: [
        {
            heading: '1. RESPONSABLE DEL TRATAMIENTO',
            paragraphs: [
                'El ecosistema digital Ius Urbano, operado conjuntamente por la Asociación Civil Venezolana Instituto de Promoción Integral (AVIPRI) y Universitas Services, C.A., actúa bajo el principio constitucional de protección al honor, la vida privada y la intimidad.',
                'A los efectos legales, Universitas Services, C.A. actúa como el principal Responsable y Controlador de los datos de registro de los usuarios. Toda comunicación, solicitud o reclamo en materia de privacidad debe dirigirse al correo electrónico oficial: contacto@universitas.legal.',
            ],
        },
        {
            heading: '2. ROLES DE TRATAMIENTO (ESTÁNDAR SAAS)',
            paragraphs: [
                'De acuerdo con los estándares internacionales de servicios en la nube (SaaS), Ius Urbano ejerce dos roles fundamentales:',
            ],
            definitions: [
                {
                    term: 'Como Controlador de Datos',
                    definition:
                        'Decide sobre la recopilación de los datos básicos de registro, contacto y facturación del Usuario para la administración de las cuentas.',
                },
                {
                    term: 'Como Procesador de Datos',
                    definition:
                        'Actúa como mero procesador tecnológico de los documentos, consultas (prompts) y normativas que el Usuario carga o interactúa dentro de la plataforma y el Consultor IA, procesándolos exclusivamente bajo las instrucciones del Usuario.',
                },
            ],
        },
        {
            heading: '3. DATOS RECOPILADOS Y FINALIDAD',
            paragraphs: [
                'Para garantizar la prestación del servicio, Ius Urbano recopila únicamente los datos estrictamente necesarios:',
            ],
            definitions: [
                {
                    term: 'Datos de Identificación y Contacto',
                    definition:
                        'Nombre, apellido, profesión, institución de adscripción (para validar el rol de Servidor Público) y correo electrónico. Se utilizan para crear la cuenta, asignar el rol correspondiente y enviar notificaciones operativas y legales del sistema.',
                },
                {
                    term: 'Datos de Facturación y Pagos',
                    definition:
                        'Para los Asesores Privados, los pagos de suscripción se realizan mediante transferencias bancarias, pago móvil o divisas, y son validados manualmente por el equipo de Universitas a través de canales oficiales como WhatsApp. La plataforma no almacena números de tarjetas de crédito ni utiliza pasarelas de pago automáticas de terceros que procesen información financiera sensible.',
                },
            ],
        },
        {
            heading: '4. AUSENCIA DE COOKIES Y RASTREADORES (TRACKING)',
            paragraphs: [
                'Ius Urbano respeta el principio de minimización de datos. Actualmente, la Plataforma no utiliza cookies de rastreo comercial, ni emplea herramientas de analítica de tráfico (como Google Analytics, píxeles de Meta, etc.) para monitorear el comportamiento del usuario con fines publicitarios. Cualquier información temporal de sesión gestionada por el navegador se utiliza exclusivamente con fines funcionales para mantener el inicio de sesión seguro y expira al cerrar la sesión.',
            ],
        },
        {
            heading: '5. INFRAESTRUCTURA TECNOLÓGICA Y SUBPROCESADORES (GEMINI ENTERPRISE)',
            paragraphs: [
                'Para ofrecer el servicio del Consultor IA, Ius Urbano utiliza infraestructura de nube de primer nivel, apoyándose en subprocesadores tecnológicos bajo estrictos acuerdos de confidencialidad:',
                'Google Cloud Platform (GCP) y Gemini Enterprise: El alojamiento de la plataforma y el motor de inteligencia artificial operan bajo el ecosistema empresarial de Google.',
                'Privacidad de las consultas (Prompts): Al utilizar tecnología Enterprise, Ius Urbano garantiza que las consultas legales, documentos y datos ingresados por el Usuario al Consultor IA se procesan en una instancia segura y no son utilizados por Google para entrenar sus modelos de inteligencia artificial públicos ni son compartidos con terceros.',
            ],
        },
        {
            heading: '6. RETENCIÓN DE DATOS Y SEUDONIMIZACIÓN',
            paragraphs: ['Ius Urbano aplicará los siguientes criterios de conservación de la información:'],
            definitions: [
                {
                    term: 'Retención por Compliance',
                    definition:
                        'Tras la terminación de la relación contractual (cierre de cuenta), los datos de identificación, facturación y registros de acceso (logs) serán conservados por un plazo máximo de diez (10) años, exclusivamente para dar cumplimiento a obligaciones legales frente a las normativas de prevención de ilícitos financieros vigentes en la República Bolivariana de Venezuela, tras lo cual serán destruidos.',
                },
                {
                    term: 'Auditoría y Cancelación Lógica',
                    definition:
                        'Al cerrar la cuenta, el sistema ejecuta una cancelación lógica (soft delete). Las interacciones técnicas previas con el Consultor IA permanecerán en la base de datos sometidas a un proceso de anonimización y seudonimización, desvinculándolas de la identidad del Usuario, con el único fin de auditar la integridad del sistema y mejorar la precisión técnica del modelo.',
                },
            ],
        },
        {
            heading: '7. EJERCICIO DE LOS DERECHOS ARCO (HABEAS DATA)',
            paragraphs: [
                'En estricto apego al artículo 28 de la Constitución Nacional, el Usuario tiene el derecho constitucional de acceder a su información, conocer su uso, y solicitar su actualización, rectificación o destrucción. Para ejercer sus derechos ARCO (Acceso, Rectificación, Cancelación y Oposición), el Usuario solo debe enviar una solicitud formal desde su correo registrado a contacto@universitas.legal indicando su petición. Universitas Services, C.A. se compromete a procesar la solicitud en los plazos razonables dictados por la buena fe y la práctica legal.',
            ],
        },
        {
            heading: '8. ACTUALIZACIONES DE LA POLÍTICA',
            paragraphs: [
                'Ius Urbano se reserva el derecho de modificar esta Política de Privacidad frente a implementaciones de nuevas tecnologías (como la futura incorporación de cookies funcionales o analíticas) o cambios legales. Cualquier modificación sustancial será notificada al correo electrónico del Usuario con treinta (30) días de antelación.',
            ],
        },
    ] satisfies RegisterPrivacySection[],
} as const;
