export type FaqItem = {
    question: string;
    answer: string;
};

export type FaqSection = {
    title: string;
    items: FaqItem[];
};

export const FAQ_INTRO = {
    title: 'Preguntas frecuentes',
    subtitle: 'Respuestas a las dudas más comunes sobre Ius Urbano',
    description:
        'Explora nuestro centro de ayuda para conocer más sobre el acceso, los servicios, la Biblioteca Legal y el funcionamiento del Consultor IA.',
};

export const FAQ_SECTIONS: FaqSection[] = [
    {
        title: 'Información general',
        items: [
            {
                question: '1. ¿Qué es Ius Urbano?',
                answer: 'Ius Urbano es un ecosistema digital de inteligencia jurídica especializado en Derecho Urbanístico, desarrollo urbano local y ordenación urbanística. La plataforma integra una Biblioteca Legal especializada, un Consultor IA basado en inteligencia artificial, un Repositorio Legal y recursos académicos que facilitan la investigación, el acceso a información jurídica y la actualización profesional.',
            },
            {
                question: '2. ¿Cuál es el objetivo de Ius Urbano?',
                answer: 'El objetivo de Ius Urbano es facilitar el acceso organizado al conocimiento jurídico relacionado con el Derecho Urbanístico, reduciendo los tiempos de investigación y ofreciendo herramientas que apoyen la consulta normativa, la formación especializada y la toma de decisiones.',
            },
        ],
    },
    {
        title: 'Biblioteca Legal',
        items: [
            {
                question: '3. ¿Qué es la Biblioteca Legal?',
                answer: 'La Biblioteca Legal es el repositorio documental especializado de Ius Urbano. Reúne legislación nacional, ordenanzas municipales, reglamentos, instrumentos de planificación territorial, jurisprudencia, doctrina, doctrina administrativa, proyectos normativos y otros documentos jurídicos relacionados con el Derecho Urbanístico.',
            },
            {
                question: '4. ¿La información disponible en la Biblioteca Legal es oficial?',
                answer: 'La Biblioteca Legal recopila y organiza información proveniente de fuentes jurídicas confiables y oficiales cuando corresponda. Sin embargo, Ius Urbano constituye una herramienta de consulta documental y no reemplaza la consulta directa de las publicaciones oficiales cuando una actuación administrativa o judicial requiera verificar el texto vigente de una norma.',
            },
            {
                question: '5. ¿Con qué frecuencia se actualiza la Biblioteca Legal?',
                answer: 'La Biblioteca Legal se encuentra en constante proceso de actualización mediante actividades de investigación, recopilación y revisión documental realizadas por AVIPRI. No obstante, la incorporación de nuevas normas o documentos puede requerir procesos de validación y organización antes de estar disponible para los usuarios.',
            },
            {
                question: '6. ¿Puedo descargar los documentos disponibles?',
                answer: 'Sí. Cuando el documento lo permita, la plataforma ofrecerá opciones para visualizarlo o descargarlo. Algunos contenidos podrán estar sujetos a restricciones de acceso según el tipo de usuario o las condiciones de la suscripción.',
            },
            {
                question: '7. ¿La Biblioteca Legal reemplaza la Gaceta Oficial o los repositorios oficiales?',
                answer: 'No. La Biblioteca Legal es una herramienta diseñada para facilitar la consulta y organización de información jurídica especializada. Aunque recopila documentos provenientes de fuentes confiables, no sustituye los medios oficiales de publicación establecidos por la legislación venezolana.',
            },
            {
                question: '8. ¿Puedo sugerir la incorporación de nuevos documentos a la Biblioteca Legal?',
                answer: 'Sí. Los usuarios pueden proponer la incorporación de normativa, ordenanzas u otros documentos relacionados con el Derecho Urbanístico. Todas las propuestas serán evaluadas por el equipo de curaduría antes de su eventual incorporación a la Biblioteca Legal.',
            },
            {
                question: '9. ¿Qué ocurre si encuentro un documento desactualizado o con información incorrecta?',
                answer: 'Si identifica un documento desactualizado, incompleto o considera que existe algún error, puede comunicarlo al equipo de soporte mediante los canales oficiales. La observación será revisada y, de ser procedente, se realizarán las actualizaciones correspondientes.',
            },
        ],
    },
    {
        title: 'Consultor IA – Derecho Urbanístico',
        items: [
            {
                question: '10. ¿Qué es el Consultor IA – Derecho Urbanístico?',
                answer: 'El Consultor IA – Derecho Urbanístico es un asistente conversacional basado en inteligencia artificial, diseñado para facilitar la consulta de información jurídica especializada. Sus respuestas se fundamentan exclusivamente en la información disponible en la Biblioteca Legal de Ius Urbano.',
            },
            {
                question: '11. ¿Cómo funciona el Consultor IA?',
                answer: 'Cuando el usuario realiza una consulta, el Consultor IA localiza la información más relevante dentro de la Biblioteca Legal y genera una respuesta fundamentada utilizando únicamente ese contenido. Su funcionamiento se basa en una arquitectura de Recuperación Aumentada por Generación (RAG), orientada a mejorar la precisión y la trazabilidad de las respuestas.',
            },
            {
                question: '12. ¿El Consultor IA utiliza información de Internet?',
                answer: 'No. El Consultor IA no realiza búsquedas en Internet ni consulta fuentes externas en tiempo real. Sus respuestas se generan exclusivamente a partir de la información previamente incorporada y validada dentro de la Biblioteca Legal de Ius Urbano.',
            },
            {
                question:
                    '13. ¿Las respuestas del Consultor IA sustituyen el criterio de un profesional o de una autoridad competente?',
                answer: 'No. El Consultor IA es una herramienta de apoyo para la investigación jurídica y la consulta documental. Sus respuestas tienen carácter informativo y no sustituyen el análisis que corresponda realizar por profesionales especializados ni las decisiones adoptadas por las autoridades competentes.',
            },
            {
                question: '14. ¿Se almacenan mis conversaciones con el Consultor IA?',
                answer: 'Sí. Las conversaciones pueden almacenarse para mantener el historial de consultas del usuario, mejorar la experiencia de uso, brindar soporte técnico y contribuir a la mejora continua de la plataforma, de conformidad con la Política de Privacidad y Protección de Datos Personales.',
            },
            {
                question: '15. ¿Puedo cargar documentos o imágenes para que el Consultor IA los analice?',
                answer: 'No. En su versión actual, el Consultor IA únicamente procesa consultas realizadas mediante texto. La plataforma no admite la carga de documentos, imágenes, planos, archivos PDF u otros archivos para su análisis.',
            },
        ],
    },
    {
        title: 'Acceso y perfiles',
        items: [
            {
                question: '16. ¿Cuál es la diferencia entre un Servidor Público y un Asesor Privado?',
                answer: 'Los Servidores Públicos pueden acceder a la plataforma bajo el modelo colaborativo establecido por Ius Urbano, contribuyendo al fortalecimiento de la Biblioteca Legal mediante el aporte de información jurídica relevante. Los Asesores Privados acceden mediante una suscripción y disfrutan de las funcionalidades disponibles durante la vigencia de su plan.',
            },
            {
                question: '17. ¿Puedo modificar la información de mi perfil?',
                answer: 'Sí. Desde la sección Mi Perfil podrá actualizar la información personal disponible, así como modificar su contraseña y otros datos autorizados por la plataforma.',
            },
            {
                question: '18. ¿Puedo tener más de una cuenta?',
                answer: 'No es recomendable. Cada usuario debe mantener una única cuenta asociada a su correo electrónico principal. Si necesita modificar algún dato de acceso, puede actualizarlo desde su perfil o solicitar asistencia al equipo de soporte.',
            },
            {
                question: '19. ¿Qué sucede si mi cuenta permanece inactiva durante mucho tiempo?',
                answer: 'Las cuentas inactivas podrán mantenerse activas, limitar algunas funcionalidades o ser sometidas a procesos de revisión conforme a las políticas internas de la plataforma. En caso de requerirse alguna acción por parte del usuario, Ius Urbano lo notificará previamente mediante los canales de contacto registrados.',
            },
        ],
    },
    {
        title: 'Suscripciones y servicios',
        items: [
            {
                question: '20. ¿Cuál es el costo de la suscripción para Asesores Privados?',
                answer: 'La suscripción mensual tiene un costo de USD 20,00 o su equivalente en bolívares al tipo de cambio oficial aplicable para la fecha del pago. El precio no incluye los impuestos que resulten legalmente aplicables.',
            },
            {
                question: '21. ¿Qué incluye la suscripción?',
                answer: 'La suscripción permite acceder a las funcionalidades disponibles para los Asesores Privados durante su vigencia, incluyendo la Biblioteca Legal, el Consultor IA – Derecho Urbanístico y los demás servicios habilitados para este tipo de usuario. El alcance podrá ampliarse conforme evolucione la plataforma.',
            },
            {
                question: '22. ¿Qué ocurre cuando finaliza mi período de prueba?',
                answer: 'Una vez concluido el período de prueba, deberá contratar una suscripción para continuar utilizando las funcionalidades que requieran acceso premium. Si no realiza la renovación, podrá mantenerse el acceso únicamente a los servicios que la plataforma ofrezca de forma abierta.',
            },
            {
                question: '23. ¿La suscripción se renueva automáticamente?',
                answer: 'No. En la versión actual de Ius Urbano las renovaciones no son automáticas. Antes del vencimiento de la suscripción recibirá una notificación para realizar el proceso de renovación y mantener el acceso a los servicios contratados.',
            },
            {
                question: '24. ¿Qué sucede si no renuevo mi suscripción?',
                answer: 'Si la suscripción vence y no es renovada, el acceso a las funcionalidades premium será suspendido. No obstante, la cuenta permanecerá registrada y podrá reactivarse una vez se confirme el pago correspondiente.',
            },
        ],
    },
    {
        title: 'Aula Ciudad',
        items: [
            {
                question: '25. ¿Qué es Aula Ciudad?',
                answer: 'Aula Ciudad es el espacio académico integrado a Ius Urbano donde Universitas reúne cursos, conferencias, seminarios y otros recursos formativos especializados en Derecho Urbanístico, Derecho a la Ciudad y desarrollo urbano local.',
            },
            {
                question: '26. ¿Necesito crear otra cuenta para acceder a Aula Ciudad?',
                answer: 'No. El acceso a Aula Ciudad se realiza desde Ius Urbano. Dependiendo de la actividad académica, algunos contenidos podrán requerir inscripción adicional o condiciones específicas de acceso.',
            },
            {
                question: '27. ¿Todos los cursos de Aula Ciudad son gratuitos?',
                answer: 'No necesariamente. Aula Ciudad puede ofrecer actividades gratuitas y otras sujetas a inscripción o pago, de acuerdo con la naturaleza de cada programa académico.',
            },
            {
                question: '28. ¿Aula Ciudad reemplaza a la Biblioteca Legal?',
                answer: 'No. Ambos módulos cumplen funciones diferentes. La Biblioteca Legal está orientada a la consulta documental e investigación jurídica, mientras que Aula Ciudad ofrece contenidos académicos para apoyar la formación y actualización profesional.',
            },
        ],
    },
    {
        title: 'Soporte técnico y privacidad',
        items: [
            {
                question: '29. ¿Cómo puedo contactar al equipo de soporte?',
                answer: 'Puede comunicarse con el equipo de soporte utilizando los canales oficiales publicados en la plataforma, incluyendo el formulario de contacto, el correo electrónico institucional o WhatsApp, según corresponda.',
            },
            {
                question: '30. ¿Qué tipo de ayuda ofrece el soporte técnico?',
                answer: 'El soporte técnico atiende consultas relacionadas con el acceso a la plataforma, recuperación de cuentas, funcionamiento de los servicios, incidencias técnicas y reportes de errores. No presta servicios de consultoría jurídica ni responde consultas sobre el contenido del Derecho Urbanístico.',
            },
            {
                question: '31. ¿Cómo protege Ius Urbano mis datos personales?',
                answer: 'Ius Urbano implementa medidas técnicas, administrativas y organizativas para proteger la información personal de sus usuarios. El tratamiento de los datos se realiza conforme a la Política de Privacidad y Protección de Datos Personales publicada en la plataforma.',
            },
            {
                question: '32. ¿Cómo puedo actualizar mis datos personales?',
                answer: 'Puede modificar la información disponible desde la sección Mi Perfil. Si necesita actualizar datos que no puedan editarse directamente, podrá solicitar asistencia al equipo de soporte.',
            },
            {
                question: '33. ¿Cómo puedo eliminar mi cuenta?',
                answer: 'Puede solicitar la eliminación de su cuenta mediante los canales oficiales de atención. La solicitud será procesada conforme a los Términos y Condiciones y a la Política de Privacidad, respetando las obligaciones legales y los procedimientos internos de conservación y anonimización de datos.',
            },
            {
                question: '34. ¿Dónde puedo consultar los Términos y Condiciones y la Política de Privacidad?',
                answer: 'Ambos documentos se encuentran disponibles de forma permanente dentro de Ius Urbano y pueden consultarse desde el pie de página de la plataforma o desde las opciones correspondientes del menú principal.',
            },
        ],
    },
    {
        title: 'Uso de la plataforma',
        items: [
            {
                question: '35. ¿Qué navegadores son compatibles con Ius Urbano?',
                answer: 'Ius Urbano está diseñado para funcionar con las versiones más recientes de los principales navegadores web, como Google Chrome, Microsoft Edge, Mozilla Firefox y Safari. Para obtener la mejor experiencia, se recomienda mantener el navegador actualizado.',
            },
            {
                question: '36. ¿Puedo utilizar Ius Urbano desde un teléfono móvil o una tableta?',
                answer: 'Sí. La plataforma cuenta con una interfaz adaptable que permite acceder a sus principales funcionalidades desde computadoras, tabletas y teléfonos móviles con conexión a Internet.',
            },
            {
                question: '37. ¿Necesito instalar algún programa para utilizar la plataforma?',
                answer: 'No. Ius Urbano funciona completamente desde el navegador web y no requiere la instalación de programas adicionales.',
            },
            {
                question: '38. ¿Qué hago si encuentro un error o deseo sugerir una mejora?',
                answer: 'Puede reportar cualquier incidencia o enviar sugerencias utilizando los canales oficiales de soporte. Todas las observaciones son evaluadas por el equipo de desarrollo y contribuyen a la mejora continua de la plataforma.',
            },
            {
                question: '39. ¿Cómo puedo mantenerme informado sobre nuevas funcionalidades y contenidos?',
                answer: 'Ius Urbano informa sobre nuevas herramientas, actualizaciones de la Biblioteca Legal, actividades de Aula Ciudad, publicaciones y eventos mediante correo electrónico, WhatsApp y otros canales oficiales de comunicación, de conformidad con los Términos y Condiciones y la Política de Privacidad.',
            },
        ],
    },
];
