'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export function CopyrightFooter() {
    // Estados para controlar cuándo se abren y cierran los modales
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

    return (
        <div className="w-full text-center py-3 mt-auto border-t border-surface-soft/10">
            {/* Texto de Copyright Base */}
            <p className="text-[12px] md:text-[13px] text-neutral-dark/60 font-medium">
                © 2026 Universitas Services, C.A. Todos los derechos reservados.
            </p>

            {/* Enlaces interactivos */}
            <div className="flex flex-wrap justify-center items-center gap-2 mt-2 text-[12px] md:text-[13px] text-[#003B4A]/80 font-semibold">
                <button
                    onClick={() => setIsTermsOpen(true)}
                    className="hover:text-[#388E3C] hover:underline transition-colors focus:outline-none"
                >
                    Términos y Condiciones de Uso
                </button>
                <span className="text-neutral-dark/30 select-none">|</span>

                <button
                    onClick={() => setIsPrivacyOpen(true)}
                    className="hover:text-[#388E3C] hover:underline transition-colors focus:outline-none"
                >
                    Política de Privacidad
                </button>
                <span className="text-neutral-dark/30 select-none">|</span>

                <a
                    href="https://wa.me/584145051716"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#388E3C] hover:underline transition-colors"
                >
                    Contacto / Soporte
                </a>
            </div>

            {/* ── Modal: Términos y Condiciones ── */}
            <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
                <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col p-6 sm:p-8 bg-white border-none rounded-3xl shadow-2xl">
                    <DialogHeader className="shrink-0 mb-4 text-left">
                        <DialogTitle className="text-2xl font-bold text-neutral-dark">
                            TÉRMINOS Y CONDICIONES DE USO DE LA PLATAFORMA GIRS
                        </DialogTitle>
                        <DialogDescription className="text-[14px] font-semibold text-neutral-dark/70 pt-1">
                            Última actualización: 11 de mayo de 2026
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar text-[15px] leading-relaxed text-neutral-dark/80 space-y-5 text-left">
                        {/* Secciones de Términos */}
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-2">
                                1. Aceptación y consentimiento electrónico
                            </h4>
                            <p>
                                El presente documento constituye un contrato legalmente vinculante entre Universitas
                                Services, C.A. y el usuario. Al hacer clic en el botón de &quot;Acepto&quot;,
                                registrarse o utilizar la Plataforma GIRS, el usuario declara haber leído, comprendido y
                                aceptado en su totalidad estos Términos y Condiciones. Dicha acción de aceptación
                                electrónica tiene la misma validez legal y eficacia probatoria que una firma autógrafa
                                física, de conformidad con la normativa venezolana sobre Mensajes de Datos y Firmas
                                Electrónicas. Universitas conservará los registros electrónicos de dicha aceptación como
                                prueba del consentimiento.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-4">2. Definiciones</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    <strong>Plataforma GIRS:</strong> Ecosistema digital especializado en Gestión
                                    Integral de Residuos Sólidos, propiedad exclusiva de Universitas Services, C.A..
                                </li>
                                <li>
                                    <strong>Biblioteca legal GIRS:</strong> Repositorio estructurado de documentos
                                    públicos (ordenanzas, decretos, planes y modelos jurídicos) auditados y curados por
                                    Universitas.
                                </li>
                                <li>
                                    <strong>Consultor IA - GIRS:</strong> Agente conversacional basado en inteligencia
                                    artificial (arquitectura RAG) que interactúa con la biblioteca para asistir al
                                    usuario.
                                </li>
                                <li>
                                    <strong>Servidor público:</strong> Usuario vinculado activamente a entes del Estado
                                    con competencia directa en el área ambiental, gestión integral de residuos y
                                    desechos sólidos, aseo urbano o afines (por ejemplo, Alcaldes, Síndicos Municipales,
                                    directores de ambiente). Su acceso es gratuito y está sujeto al principio de
                                    sinergia y colaboración institucional.
                                </li>
                                <li>
                                    <strong>Asesor privado:</strong> Usuario profesional, corporativo o particular que
                                    no cumple con los requisitos del Servidor Público y que accede a las funcionalidades
                                    de la plataforma mediante el pago de una suscripción mensual.
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-4">
                                3. Condiciones de acceso, sinergia institucional y suscripciones
                            </h4>
                            <p>
                                <strong>3.1. Registro y veracidad:</strong> El Usuario se obliga a suministrar
                                información veraz, actual y completa durante el proceso de registro, seleccionando el
                                rol que corresponda estrictamente a su realidad profesional.
                                <br />
                                <br />
                                <strong>3.2. Autenticación y verificación de cuenta:</strong> A los fines de garantizar
                                la seguridad del sistema y comprobar la titularidad y exactitud del correo electrónico
                                suministrado, una vez completado el formulario de registro, la Plataforma GIRS remitirá
                                automáticamente un mensaje de datos con un enlace o código de verificación (token) al
                                correo del Usuario. Por estrictas medidas de ciberseguridad y control de acceso, este
                                token de autenticación tendrá una vigencia perentoria de dos (2) minutos. Si el Usuario
                                no ejecuta la validación dentro de este lapso, el enlace caducará de forma irreversible,
                                el intento de registro quedará anulado y el Usuario deberá completar nuevamente el
                                formulario desde el inicio.
                                <br />
                                <br />
                                <strong>3.3 Acceso para servidores públicos:</strong> El acceso gratuito bajo la figura
                                de &quot;Servidor público&quot; está estrictamente reservado para aquellos funcionarios
                                activos en áreas afines al ambiente o a la gestión de residuos sólidos. Si Universitas
                                detecta que el usuario pertenece a un ente, órgano o departamento sin competencia en la
                                materia (como, a título enunciativo, un consultor jurídico del SAIME, un funcionario
                                tributario ajeno al aseo, entre otros), su cuenta será reclasificada inmediatamente al
                                rol de &quot;Asesor privado&quot; y su acceso quedará suspendido hasta que formalice el
                                pago de la suscripción. Asimismo, la gratuidad del servicio para el servidor público
                                está condicionada a la sinergia y colaboración efectiva. Para mantener su acceso, el
                                Servidor Público se obliga a compartir y consignar en la plataforma la normativa GIRS
                                vigente y oficial de su respectivo municipio (incluyendo, pero sin limitarse a:
                                ordenanzas, decretos de tarifas, planes de gestión y resoluciones). El incumplimiento en
                                la entrega de esta normativa facultará a Universitas para suspender la cuenta o
                                reclasificarla al plan de pago.
                                <br />
                                <br />
                                <strong>3.4 Acceso para asesores privados:</strong> Para el asesor privado, el servicio
                                incluye un período de prueba gratuito de siete (7) días continuos. Finalizado el periodo
                                de prueba, el acceso continuado a las funciones premium estará sujeto a la facturación
                                del ciclo de suscripción mensual, el cual tiene un costo fijo referencial de Veinte
                                Dólares de los Estados Unidos de América ($20,00 USD). Dado que las transacciones
                                financieras se procesan de forma externa a la plataforma, la renovación de la
                                suscripción no es automática. Para mantener el acceso ininterrumpido a su cuenta, el
                                Asesor Privado asume la obligación de realizar el pago manual y reportar el comprobante
                                a Universitas Services, C.A. antes de la fecha de corte de su ciclo mensual. En caso de
                                no recibirse la confirmación del pago en la fecha correspondiente, el acceso a las
                                funciones premium quedará temporalmente suspendido hasta la validación de la renovación.
                                <br />
                                <br />
                                <strong>3.5 Derecho de retracto y política de reembolso:</strong> Se reconoce
                                expresamente el derecho irrenunciable del usuario a retractarse del contrato.
                                Independientemente del tiempo que transcurra entre la finalización del período de prueba
                                gratuito y la formalización del pago de la suscripción, si el Asesor Privado decide
                                cancelar su suscripción premium dentro de los primeros siete (7) días continuos contados
                                a partir de la fecha de su pago efectivo, Universitas procesará un reembolso equivalente
                                al setenta por ciento (70%) del monto pagado. Universitas retendrá el treinta por ciento
                                (30%) restante por concepto de gastos administrativos, operativos y de habilitación
                                tecnológica del servicio. Transcurrido este lapso inamovible de siete (7) días desde la
                                fecha de pago, la venta se considerará definitiva; en consecuencia, no se procesarán
                                devoluciones ni se emitirán reembolsos parciales o totales por períodos de suscripción
                                no utilizados.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-4">
                                4. Pagos, facturación e impuestos (IVA e IGTF)
                            </h4>
                            <p>
                                Las tarifas de la suscripción aplicables al asesor privado se expresarán de forma clara
                                en la Plataforma. En estricto cumplimiento del artículo 128 de la Ley del Banco Central
                                de Venezuela, el costo fijo mensual de Veinte Dólares de los Estados Unidos de América
                                ($20,00 USD) se establece exclusivamente como moneda de cuenta referencial. Los pagos se
                                realizarán en su equivalente en Bolívares (moneda de curso legal), calculados a la tasa
                                de cambio oficial publicada por el Banco Central de Venezuela (BCV) vigente para la
                                fecha efectiva en la que el usuario realice la transferencia o transacción.
                                <br />
                                <br />
                                <strong>4.1 Impuesto al Valor Agregado (IVA) y facturación:</strong> El precio
                                referencial de la suscripción no incluye el Impuesto al Valor Agregado. En consecuencia,
                                a toda facturación se le sumará el dieciséis por ciento (16%) correspondiente a la
                                alícuota general del IVA. Universitas Services, C.A. emitirá la respectiva factura
                                fiscal cumpliendo con las normativas del SENIAT, reflejando el monto en divisas, su
                                equivalente en bolívares y la tasa del BCV aplicada. En caso de que el Usuario califique
                                como Sujeto Pasivo Especial y practique retenciones de IVA, se obliga a remitir a
                                Universitas el comprobante de retención digital correspondiente en los plazos de ley; el
                                incumplimiento en la entrega de este comprobante impedirá que el pago se considere
                                válidamente liquidado y podrá suspender la renovación del servicio.
                                <br />
                                <br />
                                <strong>4.2 Impuesto a las Grandes Transacciones Financieras (IGTF):</strong> Dado que
                                Universitas Services, C.A. está calificada como Sujeto Pasivo Especial ante el SENIAT,
                                funge legalmente como Agente de Percepción del IGTF. En consecuencia, si el usuario
                                decide realizar el pago de su factura directamente en divisas en efectivo o en
                                criptoactivos (operaciones fuera del sistema bancario nacional), acepta y se obliga a
                                asumir el pago del recargo adicional del tres por ciento (3%) correspondiente a dicho
                                impuesto. Este recargo será percibido por Universitas y se reflejará de forma
                                estrictamente separada en la factura fiscal, sin formar parte integral del precio del
                                servicio. Los pagos efectuados en Bolívares quedan exentos de este recargo según la
                                normativa vigente.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-4">
                                5. Propiedad intelectual, licencias y uso de inteligencia artificial
                            </h4>
                            <p>
                                <strong>5.1. Titularidad del sistema y arquitectura:</strong> Universitas Services, C.A.
                                mantiene la titularidad, derechos de autor y propiedad exclusiva sobre la Plataforma
                                GIRS, su código fuente, la arquitectura de procesamiento y recuperación de información
                                (RAG), el diseño y configuración de los flujos del agente conversacional, la interfaz de
                                usuario, así como la estructura, organización y curaduría de las bases de datos
                                desarrolladas por su equipo técnico. El Usuario reconoce y acepta que el &quot;Consultor
                                IA - GIRS&quot; opera utilizando infraestructura, modelos fundacionales y motores de
                                procesamiento de lenguaje natural proveídos por terceros (incluyendo, pero sin limitarse
                                a, Google Cloud Platform, Vertex AI y Dialogflow CX). Los algoritmos base de estas
                                tecnologías de inteligencia artificial pertenecen a sus respectivos titulares y
                                Universitas no reclama derecho de propiedad sobre los mismos.
                                <br />
                                <br />
                                <strong>5.2. Contenido de la Biblioteca Legal GIRS:</strong> La Biblioteca Legal GIRS
                                está compuesta por un acervo documental amplio y en constante actualización que incluye,
                                a título enunciativo mas no limitativo: leyes, ordenanzas municipales, decretos
                                (incluyendo los de tarifas), gacetas oficiales, resoluciones, planes de gestión,
                                doctrina, jurisprudencia y cualquier otra información técnica o jurídica relevante en la
                                materia. Los textos normativos y documentos de dominio público pertenecen a sus
                                respectivos entes emisores, y la doctrina u obras técnicas a sus respectivos autores.
                                Universitas no reclama derechos de autor sobre el contenido original de dichos
                                documentos, limitándose exclusivamente a su recopilación, sistematización, auditoría y
                                puesta a disposición dentro de la plataforma.
                                <br />
                                <br />
                                <strong>5.3. Licencia de uso y restricciones:</strong> Se otorga al Usuario una licencia
                                personal, limitada, no exclusiva, revocable e intransferible para acceder a la
                                Plataforma, utilizar el Consultor IA - GIRS y consultar el contenido de la Biblioteca
                                Legal GIRS para sus propios fines profesionales o de gestión. Queda estrictamente
                                prohibido realizar ingeniería inversa, descompilar el software, extraer información de
                                la biblioteca o de la base de datos de forma masiva o automatizada (scraping), y
                                comercializar, distribuir o revender el acceso a la plataforma, a la biblioteca o a los
                                resultados generados por el Consultor IA como un servicio independiente.
                                <br />
                                <br />
                                <strong>5.4. Derechos sobre la inteligencia artificial (entradas y salidas):</strong> El
                                Usuario conserva todos los derechos, título e interés sobre la información, consultas o
                                instrucciones (prompts o Inputs) que ingrese al Consultor IA. Universitas otorga al
                                Usuario el derecho a utilizar comercialmente los resultados o respuestas generadas
                                (outputs) por la inteligencia artificial a partir de la información de la biblioteca.
                                Sin embargo, dada la naturaleza del aprendizaje automático, el Usuario reconoce y acepta
                                que los resultados generados no son exclusivos, y que el Consultor IA podría generar
                                respuestas idénticas o sustancialmente similares para otros usuarios que realicen
                                consultas semejantes.
                                <br />
                                <br />
                                <strong>5.5. Retroalimentación (Feedback):</strong> Cualquier sugerencia, idea,
                                solicitud de mejora o comentario que el Usuario proporcione voluntariamente sobre el
                                funcionamiento de la Plataforma GIRS, será considerado no confidencial. El Usuario
                                otorga a Universitas una licencia perpetua, irrevocable, mundial y gratuita para
                                utilizar, modificar o incorporar dicha retroalimentación en el desarrollo y mejora
                                comercial del software, sin que ello genere obligación o derecho a compensación alguna
                                para el Usuario.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-4">
                                6. Reglas de conducta y usos prohibidos (política de uso aceptable)
                            </h4>
                            <p>
                                El Usuario se compromete a utilizar la Plataforma GIRS, la Biblioteca Legal y el
                                Consultor IA de buena fe, conforme a la moral y al ordenamiento jurídico. Queda
                                estrictamente prohibido utilizar la plataforma para los siguientes fines o incurrir en
                                las siguientes conductas:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    <strong>Actividades ilícitas y fraude:</strong> Utilizar la plataforma o los
                                    servicios para llevar a cabo actividades ilegales, fraudes, piratería o para
                                    vulnerar los derechos de terceros.
                                </li>
                                <li>
                                    <strong>Extracción automatizada (Scraping):</strong> Utilizar sistemas
                                    automatizados, bots, crawling o herramientas de scraping para recopilar, visualizar,
                                    extraer o copiar masivamente la información, normativas o modelos alojados en la
                                    plataforma.
                                </li>
                                <li>
                                    <strong>Seguridad y códigos maliciosos:</strong> Cargar, transmitir o distribuir
                                    virus, malware, troyanos o cualquier otro componente informático dañino. Asimismo,
                                    queda prohibido intentar eludir, interferir o vulnerar las medidas de seguridad del
                                    sistema, o generar un uso excesivo que degrade o sobrecargue el servicio para otros
                                    clientes.
                                </li>
                                <li>
                                    <strong>Contenido ofensivo e indebido:</strong> Ingresar consultas (prompts) al
                                    Consultor IA o utilizar la plataforma para generar y distribuir contenidos de
                                    carácter ofensivo, discriminatorio, obsceno, abusivo, amenazador o que inciten a la
                                    violencia.
                                </li>
                                <li>
                                    <strong>Alteración de derechos:</strong> Eliminar, alterar u ocultar cualquier aviso
                                    sobre derechos de autor, marcas comerciales u otros avisos de propiedad intelectual
                                    presentes en la plataforma o en los documentos generados.
                                </li>
                                <li>
                                    <strong>Uso no autorizado de cuentas:</strong> Compartir credenciales de acceso
                                    (usuario y contraseña) con terceros no autorizados o intentar eludir los límites de
                                    usuarios permitidos en el plan de suscripción.
                                </li>
                            </ul>
                            <p>
                                <strong>6.1 Consecuencias del incumplimiento y suspensión de cuenta:</strong>{' '}
                                Universitas Services, C.A. se reserva el derecho de investigar cualquier presunta
                                violación a estas normas de uso. En caso de detectar un incumplimiento o un riesgo
                                creíble para la plataforma, Universitas podrá suspender de forma inmediata la cuenta, o
                                rescindirla y eliminarla de manera definitiva. En el supuesto de una terminación
                                justificada por incumplimiento de esta cláusula, el Usuario perderá el derecho a
                                cualquier tipo de reembolso o crédito de servicio por los periodos pagados y no
                                utilizados.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-4">
                                7. Acuerdos de Nivel de Servicio y soporte técnico
                            </h4>
                            <p>
                                <strong>7.1. Nivel de disponibilidad del servicio:</strong> Un Acuerdo de Nivel de
                                Servicio designa los estándares mínimos de rendimiento de la plataforma. Universitas
                                Services, C.A. se compromete a realizar sus mejores esfuerzos técnicos y comerciales
                                para garantizar que la Plataforma GIRS y el Consultor IA mantengan un nivel de
                                disponibilidad (tiempo de actividad) del noventa y nueve coma cinco por ciento (99.5%),
                                medido sobre una base mensual.
                                <br />
                                <br />
                                <strong>7.2. Exclusiones del tiempo de inactividad:</strong> A los efectos del cálculo
                                del porcentaje de disponibilidad mensual, no se considerarán como &quot;tiempo de
                                inactividad&quot; o falla del servicio aquellas interrupciones atribuibles a las
                                siguientes causas:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    <strong>Ventanas de mantenimiento programado:</strong> Interrupciones por
                                    mantenimiento preventivo del sistema que hayan sido notificadas al Usuario con
                                    antelación.
                                </li>
                                <li>
                                    <strong>Fuerza mayor y entorno nacional:</strong> Fallas, fluctuaciones o cortes en
                                    el Sistema Eléctrico Nacional (SEN) de Venezuela, interrupciones generales en las
                                    redes de telecomunicaciones, o cualquier otro evento de caso fortuito que escape del
                                    control razonable de Universitas.
                                </li>
                                <li>
                                    <strong>Terceros proveedores:</strong> Interrupciones derivadas de la caída o fallas
                                    en la infraestructura de terceros proveedores de los cuales depende la plataforma
                                    (tales como fallas en los servidores de Google Cloud Platform, Vertex AI o
                                    Dialogflow CX).
                                </li>
                            </ul>
                            <p>
                                <strong>7.3. Canales de soporte técnico y tiempos de respuesta:</strong> Universitas
                                brindará asistencia técnica rápida y atención al usuario a través de su línea oficial de
                                WhatsApp habilitada en la plataforma, así como mediante los canales internos del
                                sistema. Los tiempos de respuesta exigidos dependerán del nivel de severidad de la
                                incidencia técnica:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    <strong>Incidencias Críticas:</strong> Inaccesibilidad total a la plataforma o caída
                                    completa del Consultor IA. El tiempo de respuesta objetivo será de ocho (8) horas
                                    hábiles.
                                </li>
                                <li>
                                    <strong>Incidencias Normales:</strong> Fallas menores, dudas de configuración o
                                    errores no inhabilitantes. El tiempo de respuesta objetivo será de veinticuatro (24)
                                    horas hábiles
                                </li>
                            </ul>
                            <p>
                                <strong>7.4. Compensaciones y créditos de Servicio:</strong> Si Universitas no cumple
                                con el nivel de disponibilidad garantizado en un mes calendario, el Asesor Privado
                                (usuario con suscripción paga) tendrá derecho a solicitar una compensación en forma de
                                &quot;Créditos de Servicio&quot;, los cuales se aplicarán como un descuento porcentual
                                en su siguiente ciclo de facturación. El Usuario reconoce y acepta expresamente que la
                                emisión de estos Créditos de Servicio constituye el único y exclusivo remedio
                                compensatorio por cualquier falla de disponibilidad o rendimiento de la plataforma,
                                renunciando a exigir indemnizaciones adicionales. <strong>Excepción:</strong> Dado que
                                el Servidor Público accede a la plataforma de forma gratuita, no tendrá derecho a
                                reclamar compensaciones monetarias ni créditos de servicio por interrupciones en el
                                sistema.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-4">
                                8. Naturaleza del servicio y límites de responsabilidad
                            </h4>
                            <p>
                                <strong>8.1. Naturaleza asistencial e informativa:</strong> El Usuario reconoce y acepta
                                expresamente que el &quot;Consultor IA - GIRS&quot; es una herramienta tecnológica de
                                asistencia diseñada para la localización, estructuración y análisis preliminar de
                                normativas. Las respuestas y documentos generados por la plataforma tienen un fin
                                estrictamente informativo y no constituyen bajo ninguna circunstancia un dictamen
                                jurídico vinculante, un acto administrativo, ni sustituyen la asesoría legal, técnica o
                                profesional especializada.
                                <br />
                                <br />
                                <strong>8.2. Precisión y deber de validación (riesgo de inexactitud):</strong> Dada la
                                naturaleza probabilística y de aprendizaje automático de la inteligencia artificial, el
                                Consultor IA podría generar ocasionalmente respuestas inexactas, incompletas,
                                incongruentes o que no reflejen el estado vigente de la normativa (fenómeno técnico
                                conocido como generación de información ficticia o inexacta). Por consiguiente, es
                                responsabilidad exclusiva e ineludible del Usuario validar y contrastar de forma
                                independiente cualquier respuesta generada por la Inteligencia Artificial frente al
                                texto oficial y original contenido en la Biblioteca Legal GIRS, antes de tomar
                                decisiones operativas, administrativas, o antes de suscribir documentos legales.
                                <br />
                                <br />
                                <strong>8.3. Prestación del servicio &quot;Tal Cual&quot;:</strong> La Plataforma GIRS y
                                todos sus componentes se proporcionan en el estado en que se encuentran (&quot;tal
                                cual&quot; y según disponibilidad). Universitas Services, C.A. no otorga garantías
                                adicionales expresas o implícitas sobre la idoneidad del servicio para lograr un
                                propósito particular del Usuario, ni garantiza que los resultados generados por la IA
                                estén libres de errores de interpretación.
                                <br />
                                <br />
                                <strong>8.4. Límite máximo de responsabilidad:</strong> En la máxima medida permitida
                                por el ordenamiento jurídico venezolano, Universitas Services, C.A., sus directivos o
                                empleados, no serán responsables por daños indirectos, lucro cesante, pérdida de datos,
                                pérdida de oportunidades de negocio o sanciones administrativas que el Usuario pueda
                                sufrir como consecuencia del uso o de la imposibilidad de uso de la plataforma o de la
                                confianza depositada en las respuestas del Consultor IA. Para el caso de los Asesores
                                Privados, la responsabilidad total, máxima y acumulada de Universitas frente a cualquier
                                reclamo comprobado relacionado con la prestación del servicio, quedará limitada
                                estrictamente al monto total pagado por el Usuario por concepto de suscripción durante
                                los doce (12) meses inmediatamente anteriores al evento que origine el reclamo.
                                <br />
                                <br />
                                <strong>8.5. Excepciones al límite de responsabilidad:</strong> Las limitaciones
                                establecidas en esta cláusula no excluirán la responsabilidad de Universitas Services,
                                C.A. en aquellos supuestos en los que las leyes venezolanas de estricto orden público lo
                                prohíban expresamente, tales como daños causados por dolo (intención) o culpa grave
                                debidamente comprobada en tribunales.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-4">
                                9. Terminación, cierre de cuenta y retención técnica de datos
                            </h4>
                            <p>
                                <strong>9.1. Causales de terminación:</strong> El presente acuerdo podrá darse por
                                terminado, revocando en consecuencia el acceso a la Plataforma GIRS, bajo las siguientes
                                circunstancias:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    <strong>Por voluntad del Usuario:</strong> Mediante la eliminación autónoma de su
                                    cuenta desde el panel de configuración de su perfil.
                                </li>
                                <li>
                                    <strong>Por incumplimiento:</strong> Universitas Services, C.A. se reserva el
                                    derecho de terminación unilateral por causa justificada, aplicable de forma
                                    inmediata si el Asesor Privado incurre en mora recurrente; si el Servidor Público
                                    incumple con su obligación de consignar la normativa municipal; o si cualquier
                                    usuario vulnera de manera grave las Reglas de Conducta y Política de Uso Aceptable
                                    (Cláusula 6).
                                </li>
                            </ul>
                            <p>
                                <strong>9.2. Procedimiento de cierre de cuenta y ausencia de exportación:</strong>{' '}
                                Cuando el Usuario decida terminar su relación con Universitas, podrá hacerlo ingresando
                                a su perfil de usuario y seleccionando la opción de eliminar su cuenta. Al ejecutar esta
                                acción, el sistema eliminará de forma inmediata y permanente su acceso a la plataforma.
                                El Usuario reconoce y acepta expresamente que la Plataforma GIRS no ofrece
                                funcionalidades, herramientas ni derechos para la exportación, extracción o descarga de
                                sus consultas, historiales o datos generados durante el uso del servicio.
                                <br />
                                <br />
                                <strong>
                                    9.3. Eliminación segura, anonimización y cancelación lógica (soft delete):
                                </strong>{' '}
                                Una vez ejecutada la eliminación de la cuenta por parte del Usuario, Universitas
                                inhabilitará el acceso de manera definitiva. Sin embargo, dada la arquitectura del
                                sistema y del Consultor IA, el Usuario reconoce y acepta que la Plataforma GIRS ejecuta
                                un proceso técnico de cancelación lógica (soft delete). A fin de no alterar el correcto
                                funcionamiento y la integridad referencial de la base de datos de la plataforma, así
                                como para permitir el reentrenamiento supervisado de la inteligencia artificial, los
                                historiales de interacción técnica se conservarán bajo un estricto proceso de
                                anonimización. Mediante este proceso, los registros quedarán desvinculados de cualquier
                                dato personal que permita identificar al Usuario. Universitas garantiza contractualmente
                                que esta data anonimizada no será utilizada para la identificación activa de personas ni
                                compartida para fines comerciales o de marketing
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-4">
                                10. Ley aplicable, resolución de Controversias y jurisdicción
                            </h4>
                            <p>
                                <strong>10.1. Ley aplicable:</strong> El presente acuerdo, así como su interpretación,
                                ejecución, validez y cumplimiento, se regirán e interpretarán de manera exclusiva y
                                estricta bajo el ordenamiento jurídico de la República Bolivariana de Venezuela.
                                <br />
                                <br />
                                <strong>10.2. Fase de conciliación amistosa virtual:</strong> En el espíritu de la buena
                                fe comercial, el Usuario y Universitas Services, C.A. acuerdan que cualquier
                                divergencia, controversia o reclamo que pudiera surgir con ocasión del uso de la
                                Plataforma GIRS o la interpretación de estos Términos y Condiciones, deberá resolverse
                                inicialmente mediante negociaciones directas. Para ello, las partes se obligan a agotar
                                una fase de conciliación amistosa de forma virtual por un lapso perentorio de treinta
                                (30) días continuos, contados a partir de la notificación formal y por escrito del
                                reclamo enviada al correo electrónico oficial de Universitas.
                                <br />
                                <br />
                                <strong>10.3. Jurisdicción y domicilio especial:</strong> En caso de que la controversia
                                no pueda ser resuelta de manera amistosa y extrajudicial una vez agotado el lapso de
                                treinta (30) días continuos de la fase de conciliación, las partes eligen como domicilio
                                especial, único y excluyente a la ciudad de Barquisimeto, Estado Lara. En consecuencia,
                                las partes se someten de manera expresa e irrenunciable a la jurisdicción de los
                                tribunales ordinarios competentes de dicha circunscripción judicial.
                                <br />
                                <br />
                                <strong>10.4. Exclusión de arbitraje obligatorio:</strong> En estricto apego al artículo
                                6 de la Ley de Arbitraje Comercial de Venezuela que rige los contratos de adhesión, el
                                presente documento no impone la utilización obligatoria de la jurisdicción arbitral.
                                Cualquier intención futura de someter una controversia a arbitraje deberá constar
                                obligatoriamente en un acuerdo escrito, expreso e independiente a estos Términos y
                                Condiciones.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-4">
                                11. Información de contacto, soporte y notificaciones electrónicas
                            </h4>
                            <p>
                                <strong>11.1. Domicilio legal y correo oficial:</strong> A todos los efectos legales y
                                administrativos derivados de los presentes Términos y Condiciones, Universitas Services,
                                C.A. fija su domicilio principal en la ciudad de Barquisimeto, Estado Lara, República
                                Bolivariana de Venezuela. El canal principal, formal y oficial de comunicación con la
                                empresa será a través de la dirección de correo electrónico: contacto@Universitas.legal.
                                <br />
                                <br />
                                <strong>11.2. Validez de las notificaciones electrónicas:</strong> En estricto apego al
                                principio de equivalencia funcional establecido en la Ley sobre Mensajes de Datos y
                                Firmas Electrónicas, los mensajes de datos tendrán la misma eficacia probatoria que la
                                ley otorga a los documentos escritos. Las partes acuerdan expresamente que todas las
                                notificaciones formales, avisos, facturaciones, advertencias de suspensión y
                                comunicaciones vinculantes relacionadas con la prestación del servicio se realizarán por
                                escrito a través del correo electrónico oficial o notificaciones en el panel de la
                                Plataforma GIRS.
                                <br />
                                <br />
                                <strong>11.3. Momento de recepción y obligación de actualización:</strong> El Usuario
                                asume la responsabilidad exclusiva de registrar y mantener actualizada una dirección de
                                correo electrónico válida. Toda notificación enviada por Universitas se considerará
                                formalmente entregada y válidamente notificada en el momento en que el mensaje de datos
                                ingrese al sistema de información (bandeja de entrada) del Usuario, independientemente
                                de si este lo lee de forma inmediata o si el mensaje es filtrado por sus sistemas de
                                correo no deseado (spam).
                                <br />
                                <br />
                                <strong>
                                    11.4. Uso de WhatsApp para gestión administrativa, financiera y soporte:
                                </strong>{' '}
                                En virtud del principio de equivalencia funcional de los mensajes de datos, el Usuario
                                reconoce y acepta que la línea corporativa de WhatsApp de Universitas operará como un
                                canal oficial y válido para las siguientes gestiones:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    <strong>Asesores privados:</strong> Envío y recepción de comprobantes de pago
                                    (transferencias, pago móvil o divisas) para la habilitación, renovación o gestión de
                                    acceso a la suscripción premium.
                                </li>
                                <li>
                                    <strong>Servidores públicos:</strong> Consignación e intercambio de la normativa
                                    municipal y documentos oficiales requeridos por Universitas para el otorgamiento,
                                    extensión y mantenimiento del acceso gratuito a la plataforma.
                                </li>
                                <li>
                                    <strong>Soporte técnico:</strong> Atención inmediata, resolución de dudas operativas
                                    y reporte de incidencias técnicas (conforme a la Cláusula 7.3).
                                </li>
                            </ul>
                            <p>
                                <strong>11.5. Condiciones de validación de las gestiones vía WhatsApp:</strong> Toda
                                gestión administrativa canalizada a través de WhatsApp estará sujeta a los procesos de
                                verificación interna de Universitas. En el caso de los pagos reportados por los Asesores
                                Privados, la simple remisión de un comprobante electrónico o captura de pantalla no
                                garantiza la habilitación inmediata de la cuenta; Universitas se reserva el derecho de
                                validar la efectiva liquidación de los fondos en sus cuentas bancarias antes de otorgar
                                el acceso. En el caso de los Servidores Públicos, Universitas se reserva el derecho de
                                rechazar aquellos documentos o normativas enviadas por WhatsApp que resulten ilegibles,
                                incompletas o que no cumplan con los estándares de calidad exigidos para la Biblioteca
                                Legal GIRS, pudiendo suspender el acceso gratuito hasta que la información sea
                                subsanada. <strong>Excepción:</strong> Las notificaciones formales de reclamos legales,
                                disputas por incumplimiento o terminación definitiva del contrato deberán canalizarse
                                obligatoriamente a través del correo electrónico oficial señalado en la Cláusula 11.1.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-4">12. Disposiciones generales</h4>
                            <p>
                                <strong>12.1. Modificaciones al contrato:</strong> Universitas Services, C.A. se reserva
                                el derecho de modificar, actualizar o sustituir los presentes Términos y Condiciones
                                para adaptarlos a cambios legislativos, operativos o tecnológicos. En el caso de
                                modificaciones que afecten las condiciones de facturación, tarifas o aspectos
                                sustanciales del servicio, Universitas informará al Usuario con una antelación mínima de
                                treinta (30) días continuos a través del correo electrónico oficial o mediante un aviso
                                destacado en la plataforma. Si el Usuario no acepta las nuevas condiciones, tendrá el
                                derecho de rescindir el contrato y cancelar su cuenta. El uso continuado de la
                                Plataforma GIRS posterior a la entrada en vigencia de las modificaciones se considerará
                                como una aceptación tácita de los nuevos términos.
                                <br />
                                <br />
                                <strong>12.2. Capacidad legal y representación:</strong> El sitio y los servicios de la
                                Plataforma GIRS están dirigidos exclusivamente a personas con capacidad legal para
                                contratar. El Usuario declara y garantiza ser mayor de edad (18 años) y, en caso de
                                actuar en nombre de una institución pública, alcaldía o empresa privada, declara contar
                                con la autoridad, nombramiento y facultades legales suficientes para obligar a dicha
                                entidad bajo los presentes términos.
                                <br />
                                <br />
                                <strong>12.3. Integración con la Política de Privacidad:</strong> El presente documento
                                se complementa de forma inescindible con la Política de Privacidad de la Plataforma
                                GIRS. Al aceptar estos Términos y Condiciones, el Usuario declara haber leído,
                                comprendido y aceptado también las políticas de recolección, uso, seudonimización y
                                tratamiento de sus datos personales.
                            </p>
                        </div>
                    </div>

                    <div className="shrink-0 pt-6 mt-2 border-t border-surface-soft/20">
                        <Button
                            variant="secondary"
                            className="w-full h-12 rounded-xl bg-surface-soft/20 hover:bg-surface-soft/40 text-neutral-dark font-bold text-base transition-colors"
                            onClick={() => setIsTermsOpen(false)}
                        >
                            Cerrar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ── Modal: Política de Privacidad ── */}
            <Dialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen}>
                <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col p-6 sm:p-8 bg-white border-none rounded-3xl shadow-2xl">
                    <DialogHeader className="shrink-0 mb-4 text-left">
                        <DialogTitle className="text-2xl font-bold text-neutral-dark">
                            Política de Privacidad y Protección de Datos Personales
                        </DialogTitle>
                        <DialogDescription className="text-[14px] font-semibold text-neutral-dark/70 pt-1">
                            Última actualización: 11 de mayo de 2026
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar text-[15px] leading-relaxed text-neutral-dark/80 space-y-5 text-left">
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-2">
                                1. Identidad del responsable del tratamiento
                            </h4>
                            <p>
                                La entidad responsable de la recolección, resguardo y tratamiento de los datos
                                personales generados a través de la Plataforma GIRS es Universitas Services, C.A., con
                                domicilio legal en la ciudad de Barquisimeto, Estado Lara, República Bolivariana de
                                Venezuela. Todo requerimiento relacionado con la presente política deberá ser canalizado
                                a través del correo electrónico oficial: contacto@Universitas.legal.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-4">
                                2. Información y datos personales que recopilamos
                            </h4>
                            <p>
                                Para garantizar el correcto funcionamiento de la plataforma en su modalidad de Software
                                as a Service (SaaS) y del &quot;Consultor IA&quot;, Universitas recopila diferentes
                                categorías de información, siempre bajo el principio de minimización y estricta
                                necesidad:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    <strong>Datos de registro y perfil:</strong> Nombre y apellido, dirección de correo
                                    electrónico, institución a la que pertenece (para Servidores Públicos) y
                                    credenciales de acceso.
                                </li>
                                <li>
                                    <strong>Datos de Interacción con la IA:</strong> Exclusivamente los textos,
                                    consultas e instrucciones (prompts) que el Usuario ingrese voluntariamente mediante
                                    el chat del Consultor IA. El Usuario reconoce que la interacción con el Consultor IA
                                    es estrictamente textual; la plataforma no permite ni procesa la carga de archivos,
                                    imágenes o documentos adjuntos hacia el motor de inteligencia artificial.
                                </li>
                                <li>
                                    <strong>Datos administrativos y financieros:</strong> Números de teléfono móvil al
                                    contactar a nuestra línea oficial de soporte vía WhatsApp, así como los datos
                                    contenidos en los comprobantes de pago, transferencias o facturación enviados por
                                    los Asesores Privados.
                                </li>
                                <li>
                                    <strong>Datos técnicos y de navegación:</strong> Direcciones IP, tipo de navegador,
                                    sistema operativo, tiempo de sesión y registros de actividad dentro de la
                                    plataforma, recopilados de forma automática para garantizar la seguridad del sistema
                                    y prevenir fraudes.
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-4">
                                3. Finalidad del tratamiento de los datos
                            </h4>
                            <p>
                                Los datos personales recabados serán tratados de forma lícita, leal y transparente, con
                                los siguientes propósitos exclusivos:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    <strong>Prestación del servicio:</strong> Crear y gestionar la cuenta del Usuario,
                                    habilitar el acceso a la Biblioteca Legal GIRS y permitir el funcionamiento del
                                    Consultor IA.
                                </li>
                                <li>
                                    <strong>Gestión administrativa:</strong> Procesar la validación de pagos, gestionar
                                    la renovación de suscripciones y verificar la entrega de normativa municipal exigida
                                    a los Servidores Públicos.
                                </li>
                                <li>
                                    <strong>Soporte técnico:</strong> Atender consultas, resolver incidencias y brindar
                                    asistencia inmediata a través de nuestros canales habilitados (incluyendo WhatsApp).
                                </li>
                                <li>
                                    <strong>Mejora continua y entrenamiento de IA:</strong> Utilizar los historiales de
                                    consulta de forma estrictamente anonimizada (desvinculados de la identidad del
                                    usuario) para el reentrenamiento, auditoría y mejora del motor de Inteligencia
                                    Artificial.
                                </li>
                                <li>
                                    <strong>Comunicaciones oficiales:</strong> Enviar notificaciones sobre
                                    actualizaciones de la plataforma, cambios en los términos de servicio, alertas de
                                    seguridad o facturación.
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-4">4. Bases legales y principios rectores</h4>
                            <p>
                                El tratamiento de datos personales en la Plataforma GIRS se rige por los preceptos de la
                                Constitución de la República Bolivariana de Venezuela y la jurisprudencia vinculante del
                                Tribunal Supremo de Justicia. Universitas se compromete a respetar los principios de
                                autonomía de la voluntad (consentimiento libre e informado), legalidad, finalidad,
                                temporalidad, exactitud y seguridad técnica de la información. El uso continuo de la
                                plataforma y el registro de la cuenta constituyen el consentimiento expreso e inequívoco
                                del Usuario para el tratamiento de sus datos conforme a esta Política.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-4">
                                5. Derechos ARCO y acción de hábeas data
                            </h4>
                            <p>
                                De conformidad con el artículo 28 de la Constitución Nacional, el Usuario goza del
                                derecho constitucional a la autodeterminación informativa. En tal sentido, Universitas
                                garantiza el ejercicio de los Derechos ARCO (Acceso, Rectificación, Cancelación y
                                Oposición):
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    <strong>Acceso y rectificación:</strong> El Usuario puede acceder, conocer y
                                    modificar los datos personales básicos asociados a su cuenta directamente desde su
                                    panel de perfil.
                                </li>
                                <li>
                                    <strong>Cancelación (supresión):</strong> El Usuario podrá solicitar la eliminación
                                    de su cuenta y de sus datos identificativos.
                                </li>
                                <li>
                                    <strong>Oposición:</strong> El Usuario podrá oponerse en cualquier momento a recibir
                                    comunicaciones comerciales o de marketing. Para ejercer formalmente cualquiera de
                                    estos derechos frente a eventuales incidencias, el Usuario deberá enviar una
                                    solicitud por escrito al correo electrónico contacto@Universitas.legal, adjuntando
                                    prueba de su identidad.
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-4">
                                6. Retención técnica, cancelación lógica (soft delete) y anonimización
                            </h4>
                            <p>
                                De acuerdo con nuestros{' '}
                                <button
                                    onClick={() => {
                                        setIsPrivacyOpen(false);
                                        setIsTermsOpen(true);
                                    }}
                                    className="text-[#388E3C] hover:underline font-bold"
                                >
                                    Términos y Condiciones
                                </button>
                                , la Plataforma GIRS no ofrece opciones de exportación o portabilidad de datos masivos.
                                Cuando el Usuario ejerza su derecho de Cancelación eliminando su cuenta, Universitas
                                procederá a inhabilitar su acceso inmediatamente. Sin embargo, para preservar la
                                integridad de la arquitectura de Inteligencia Artificial, los datos transaccionales y
                                los historiales de consultas (prompts) serán sometidos a un proceso de cancelación
                                lógica (soft delete) y estricta anonimización. Una vez anonimizados, estos registros
                                pierden su carácter de &quot;dato personal&quot; al ser imposibles de vincular con la
                                identidad original del Usuario, y serán conservados exclusivamente para el
                                reentrenamiento supervisado del modelo de IA.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-4">
                                7. Infraestructura, subencargados y transferencia de Datos
                            </h4>
                            <p>
                                Para proveer la operatividad y alojamiento de la Plataforma GIRS, el procesamiento de la
                                lógica del sistema (backend) y el funcionamiento del motor de Inteligencia Artificial,
                                Universitas utiliza de manera centralizada la infraestructura en la nube de proveedores
                                internacionales de clase mundial (Subencargados), específicamente el ecosistema de
                                Google Cloud Platform (incluyendo la arquitectura de Cloud Run, Vertex AI y Dialogflow
                                CX).
                                <br />
                                <br />
                                Al aceptar esta política, el Usuario comprende y autoriza que sus datos sean procesados
                                en los servidores de este subencargado, los cuales pueden estar ubicados fuera del
                                territorio de la República Bolivariana de Venezuela, implicando una transferencia
                                internacional de datos de tipo técnica.
                                <br />
                                <br />
                                Universitas garantiza que la información se procesa en instancias de nube privadas y
                                corporativas. El subencargado tecnológico mencionado actúa bajo estrictos Acuerdos de
                                Procesamiento de Datos (DPA) y está contractualmente impedido de utilizar los datos,
                                documentos o consultas ingresadas por nuestros Usuarios para entrenar sus propios
                                modelos fundacionales públicos o para fines ajenos a la prestación del servicio.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-4">
                                8. Consideraciones especiales sobre el Uso de WhatsApp
                            </h4>
                            <p>
                                El Usuario reconoce que la utilización de WhatsApp como canal para la gestión de pagos,
                                envío de normativas y soporte técnico implica la transferencia de datos a través de una
                                plataforma de terceros sujeta a sus propias políticas de privacidad. Universitas
                                protegerá la información recibida por esta vía, pero insta al Usuario a no compartir
                                datos personales sensibles o información no solicitada expresamente por nuestro equipo
                                técnico u operativo.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-4">
                                9. Medidas de seguridad de la información
                            </h4>
                            <p>
                                Universitas implementa medidas técnicas, administrativas y organizativas robustas para
                                salvaguardar los datos personales contra el acceso no autorizado, alteración, pérdida o
                                destrucción. Estas medidas incluyen, pero no se limitan a, protocolos de cifrado de
                                datos en tránsito y en reposo, controles de acceso basados en roles, y auditorías de
                                seguridad sobre nuestra arquitectura en la nube.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-neutral-dark mt-4">
                                10. Modificaciones a la Política de Privacidad
                            </h4>
                            <p>
                                Universitas Services, C.A. se reserva el derecho de actualizar o modificar la presente
                                Política de Privacidad en cualquier momento para reflejar cambios legislativos,
                                operativos, técnicos o comerciales.
                                <br />
                                <br />
                                En caso de realizar modificaciones sustanciales (tales como cambios en la finalidad del
                                tratamiento de datos, la recolección de nueva información o la inclusión de nuevos
                                subencargados), Universitas notificará al Usuario con una antelación mínima de quince
                                (15) días continuos, a través de un mensaje enviado al correo electrónico registrado o
                                mediante un aviso destacado en el panel principal de la Plataforma GIRS, indicando
                                siempre la fecha de la &quot;última actualización&quot;.
                                <br />
                                <br />
                                Si el Usuario no está de acuerdo con las nuevas políticas de tratamiento de datos,
                                tendrá el derecho irrenunciable de ejercer la cancelación y eliminación de su cuenta
                                antes de que los cambios entren en vigor. El uso continuado de la Plataforma GIRS
                                posterior a la fecha de entrada en vigencia de las modificaciones, se interpretará como
                                el consentimiento tácito, libre e inequívoco del Usuario a la nueva Política de
                                Privacidad.
                            </p>
                        </div>
                    </div>

                    <div className="shrink-0 pt-6 mt-2 border-t border-surface-soft/20">
                        <Button
                            variant="secondary"
                            className="w-full h-12 rounded-xl bg-surface-soft/20 hover:bg-surface-soft/40 text-neutral-dark font-bold text-base transition-colors"
                            onClick={() => setIsPrivacyOpen(false)}
                        >
                            Cerrar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
