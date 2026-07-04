export type RegisterTermsDefinition = {
    term: string;
    definition: string;
};

export type RegisterTermsSection = {
    heading: string;
    paragraphs: string[];
    definitions?: RegisterTermsDefinition[];
};

export const REGISTER_TERMS = {
    title: 'TÉRMINOS Y CONDICIONES DE USO DE LA PLATAFORMA IUS URBANO',
    updatedAt: '04 de julio de 2026',
    sections: [
        {
            heading: 'PREÁMBULO',
            paragraphs: [
                'Bienvenido a Ius Urbano, un ecosistema digital de inteligencia jurídica especializado en Derecho Urbanístico, desarrollo urbano local y ordenación urbanística. La plataforma constituye una iniciativa desarrollada conjuntamente por la Asociación Civil Venezolana Instituto de Promoción Integral (AVIPRI) y Universitas Services, C.A. El presente contrato se suscribe en estricto apego a la Constitución de la República Bolivariana de Venezuela, la Ley de Mensajes de Datos y Firmas Electrónicas y la normativa de orden público y comercio electrónico vigente. Al acceder, registrarse o utilizar los servicios, el Usuario manifiesta su consentimiento expreso y aceptación plena de estos Términos y Condiciones.',
            ],
        },
        {
            heading: 'CAPÍTULO I: DEFINICIONES CLAVE',
            paragraphs: [
                'Para la correcta interpretación de este contrato, se establecen las siguientes definiciones:',
            ],
            definitions: [
                {
                    term: 'Plataforma',
                    definition:
                        'Entorno digital basado en la nube, incluyendo software, algoritmos y herramientas de gestión provistas por Ius Urbano.',
                },
                {
                    term: 'Servidor Público',
                    definition:
                        'Persona vinculada laboral o profesionalmente a un órgano público relacionada con la planificación urbana, cuyo acceso se asocia al modelo colaborativo.',
                },
                {
                    term: 'Asesor Privado',
                    definition:
                        'Profesional independiente, firma consultora o empresa que utiliza la plataforma mediante una suscripción vigente.',
                },
                {
                    term: 'Biblioteca Legal',
                    definition:
                        'Repositorio documental especializado integrado por información jurídica organizada y curada por AVIPRI.',
                },
                {
                    term: 'Consultor IA',
                    definition:
                        'Herramienta tecnológica de asistencia basada en inteligencia artificial orientada a facilitar la consulta de la Biblioteca Legal.',
                },
                {
                    term: 'Controlador y Procesador de Datos',
                    definition:
                        'Entidades que deciden sobre el tratamiento de datos y quienes los procesan operativamente para su resguardo.',
                },
            ],
        },
        {
            heading: 'CAPÍTULO II: LICENCIA DE USO Y NATURALEZA DEL SERVICIO',
            paragraphs: [
                'Ius Urbano opera bajo la modalidad de Software como Servicio (Software as a Service – SaaS). Ius Urbano otorga al Usuario una licencia de uso personal, no exclusiva, limitada, intransferible y revocable para acceder a las funcionalidades de la Plataforma. Queda terminantemente prohibida la ingeniería inversa, descompilación, extracción de código fuente, o cualquier intento de vulnerar la arquitectura técnica de la Plataforma.',
            ],
        },
        {
            heading: 'CAPÍTULO III: MODELO COLABORATIVO Y REGISTRO',
            paragraphs: [
                'Ius Urbano se fundamenta en un modelo colaborativo orientado al fortalecimiento permanente de la Biblioteca Legal. Los Servidores Públicos podrán acceder a la plataforma colaborando mediante el suministro de documentos jurídicos, ordenanzas y normativa municipal. La incorporación de cualquier documento a la Biblioteca Legal estará sujeta a procesos internos de revisión, clasificación y validación por parte de AVIPRI. El Usuario es el único responsable de la guarda y custodia de sus credenciales de acceso.',
            ],
        },
        {
            heading: 'CAPÍTULO IV: PROTECCIÓN DE LA BIBLIOTECA LEGAL (ANTI-SCRAPING)',
            paragraphs: [
                'El Usuario reconoce que el valor agregado de la Biblioteca Legal reside en la metodología de recopilación, clasificación y sistematización desarrollada por AVIPRI. En consecuencia, queda prohibida la reproducción sistemática de la estructura documental de la Biblioteca Legal con fines de desarrollar productos o servicios competidores. El Usuario se abstendrá de realizar extracción automatizada de información mediante robots, scripts o técnicas de web scraping.',
            ],
        },
        {
            heading: 'CAPÍTULO V: LIMITACIONES DEL CONSULTOR IA',
            paragraphs: [
                'El Consultor IA opera mediante una arquitectura de Recuperación Aumentada por Generación (Retrieval-Augmented Generation – RAG), recuperando información documental para generar respuestas contextualizadas. El Usuario reconoce expresamente que el Consultor IA no presta asesoría jurídica, no interpreta oficialmente la legislación, no emite dictámenes vinculantes y no sustituye la opinión profesional de abogados o especialistas. Las respuestas emitidas tienen exclusivamente carácter informativo y de apoyo a la investigación. Corresponde exclusivamente al Usuario evaluar la pertinencia y aplicabilidad de la información antes de utilizarla en actuaciones profesionales, administrativas o judiciales.',
            ],
        },
        {
            heading: 'CAPÍTULO VI: AULA CIUDAD Y PROPIEDAD INTELECTUAL',
            paragraphs: [
                'Aula Ciudad constituye el espacio académico integrado mediante el cual se ponen a disposición recursos educativos especializados. Todo el contenido disponible en Aula Ciudad constituye propiedad intelectual de Universitas o de sus respectivos autores. Queda estrictamente prohibido copiar íntegramente el contenido, grabar cursos completos, distribuirlos o comercializarlos sin autorización. Todos los derechos sobre marcas, código fuente, interfaz gráfica y algoritmos de la Plataforma son propiedad exclusiva de Ius Urbano.',
            ],
        },
        {
            heading: 'CAPÍTULO VII: TARIFAS, TASA BCV E IMPUESTOS',
            paragraphs: [
                'Los Asesores Privados accederán a la plataforma mediante el pago de una suscripción mensual de veinte dólares de los Estados Unidos de América (USD 20,00). En estricto apego a la normativa económica vigente, los pagos se realizarán en Bolívares (Bs.) calculados según la tasa oficial del Banco Central de Venezuela (BCV) vigente al momento del pago. Los pagos realizados en moneda extranjera estarán sujetos al Impuesto a las Grandes Transacciones Financieras (IGTF), constatando que las personas naturales o jurídicas que no posean calificación de Sujeto Pasivo Especial gozan de un supuesto de no sujeción tributaria. El Usuario garantiza que la información es lícita y cumple con normativas de origen de fondos y orden público.',
            ],
        },
        {
            heading: 'CAPÍTULO VIII: DERECHO DE RETRACTO LEGAL',
            paragraphs: [
                'De conformidad con las normativas de protección al consumidor, el Usuario podrá ejercer el derecho de retracto dentro de un lapso de siete (7) días hábiles contados a partir de la contratación. En tal caso, se procederá con el reembolso total, siempre y cuando no se haya iniciado el uso efectivo del software.',
            ],
        },
        {
            heading: 'CAPÍTULO IX: ACUERDO DE NIVEL DE SERVICIO (SLA) Y SOPORTE',
            paragraphs: [
                'Ius Urbano garantiza un objetivo de disponibilidad operativa del 99.9%, calculado mensualmente. Si la disponibilidad cae por debajo del objetivo garantizado, la única compensación aplicable será un Crédito de Servicio aplicable a la siguiente factura, el cual no excederá en ningún caso el 15% del canon mensual cobrado. El soporte técnico atenderá mediante correo electrónico con respuestas iniciales en menos de 24 horas hábiles.',
            ],
        },
        {
            heading: 'CAPÍTULO X: ACUERDO DE PROCESAMIENTO DE DATOS (DPA) Y PRIVACIDAD',
            paragraphs: [
                'En cumplimiento del derecho de Habeas Data, Ius Urbano actúa como Controlador de Datos para la información de registro y facturación, y como Procesador de Datos para la información que el Usuario cargue en sus funciones. Ius Urbano implementará medidas técnicas de seguridad (cifrado y resiliencia), garantizará la confidencialidad de su personal y asistirá al Usuario en el cumplimiento de los derechos de acceso, rectificación y supresión. Tras la terminación del servicio, los registros de identificación y logs de acceso se conservarán por un período de diez (10) años por prevención de delitos financieros, destruyéndolos o anonimizándolos una vez vencido el plazo.',
            ],
        },
        {
            heading: 'CAPÍTULO XI: EXCLUSIÓN DE GARANTÍAS Y LIMITACIÓN DE RESPONSABILIDAD',
            paragraphs: [
                'EL USUARIO ACEPTA EXPRESAMENTE QUE EL USO DE LA PLATAFORMA ES BAJO SU PROPIO RIESGO. EL SERVICIO SE PROPORCIONA "TAL CUAL" Y "SEGÚN DISPONIBILIDAD". IUS URBANO NO GARANTIZA QUE LAS FUNCIONALIDADES SATISFAGAN REQUERIMIENTOS ESPECÍFICOS DEL USUARIO O QUE EL ACCESO SEA ININTERRUMPIDO O LIBRE DE ERRORES. EN NINGÚN CASO IUS URBANO SERÁ RESPONSABLE POR DAÑOS INDIRECTOS, LUCRO CESANTE O PÉRDIDA DE DATOS. LA RESPONSABILIDAD FINANCIERA TOTAL DE IUS URBANO FRENTE AL USUARIO ESTARÁ LIMITADA AL MONTO EFECTIVAMENTE PAGADO EN LOS ÚLTIMOS TRES (3) MESES ANTERIORES AL HECHO QUE ORIGINA EL RECLAMO. Adicionalmente, no existirá responsabilidad por eventos de fuerza mayor, tales como interrupciones del suministro eléctrico o fallas generalizadas de Internet.',
            ],
        },
        {
            heading: 'CAPÍTULO XII: COMUNICACIONES ELECTRÓNICAS',
            paragraphs: [
                'Al aceptar estos Términos y Condiciones, el Usuario autoriza expresamente a Ius Urbano a enviar comunicaciones operativas, institucionales, académicas y promocionales a través de correo electrónico, WhatsApp y notificaciones internas. El Usuario podrá solicitar dejar de recibir comunicaciones promocionales mediante los mecanismos dispuestos por la plataforma para tal fin.',
            ],
        },
        {
            heading: 'CAPÍTULO XIII: MODIFICACIONES AL CONTRATO',
            paragraphs: [
                'Ius Urbano podrá modificar estos términos para adecuarlos a nuevas realidades técnicas o legales. Cualquier cambio sustancial será notificado con un (1) mes de preaviso. La utilización continuada de la Plataforma tras dicho plazo constituirá la aceptación tácita de las nuevas reglas contractuales.',
            ],
        },
        {
            heading: 'CAPÍTULO XIV: LEGISLACIÓN APLICABLE Y JURISDICCIÓN',
            paragraphs: [
                'Este contrato se rige exclusivamente por las leyes de la República Bolivariana de Venezuela. Para la resolución de incidencias derivadas de la relación de consumo, las partes se someten a la jurisdicción de los tribunales correspondientes al domicilio del Usuario, garantizando su pleno derecho a la defensa administrativa y judicial.',
            ],
        },
    ] satisfies RegisterTermsSection[],
} as const;
