# Revisión de los dos PDF de SEMbox y aplicación al sitio

Fecha: 16 de septiembre de 2026. Lectura completa de **Revisión Web.pdf** (14 páginas) y **Revisión Documento Sitio Web Condiciones Google Ad Grants.pdf** (2 páginas), con inspección de las páginas renderizadas y contraste de las afirmaciones principales con fuentes oficiales.

## 1. Qué aporta cada documento

**Revisión Web.pdf** diagnostica el sitio publicado y propone mejoras de contenido, donaciones, confianza, medición y privacidad. Es una revisión de SEMbox; sus ejemplos de titulares, páginas y menús son recomendaciones editoriales, no requisitos literales de Google.

**Revisión Documento Sitio Web Condiciones Google Ad Grants.pdf** corrige afirmaciones de una “Guía Maestra” sobre campañas, conversiones, rendimiento y datos estructurados. La mayoría de las precisiones resultan útiles; dos puntos necesitan actualización o matiz: los grupos de anuncios y los resultados enriquecidos FAQ.

La instrucción de Jorge sigue siendo conservar **Estructura web 2026 v2** como estructura rectora. Los PDF aportan requisitos y recomendaciones que se incorporan en sus bloques, sin sustituir automáticamente sus títulos, su menú, sus cuatro proyectos o su selección de fotografías. El stack confirmado sigue siendo **Next.js + Sanity**, ES/EN y donación única/mensual desde el lanzamiento; Botiquín Emocional y cursos continúan en fase 2.

## 2. Aplicación de la revisión web, con trazabilidad

| Tema y páginas de Revisión Web | Aplicación al proyecto |
| --- | --- |
| Misión y claridad institucional, pp. 1–2 | Mantener la frase de v2 y presentar inmediatamente el “Qué hacemos”, comunidades, territorio, NIT y naturaleza sin ánimo de lucro. El titular sugerido por SEMbox es una alternativa, no una obligación de Google que sustituya el texto elegido. |
| Navegación y programas, pp. 3–4 | Usar el menú de v2 y las cuatro páginas de proyecto. Cada página explica necesidad, beneficiarios, actividades, resultados, financiación y cómo colaborar. Los nombres de proyectos incluidos como ejemplos en el PDF no crean proyectos nuevos. |
| Misión social y expediciones, p. 4 | En proyectos, priorizar el beneficio comunitario y el destino de aportes. En las páginas de expediciones, explicar el costo de participación, logística y financiación social. El bloque secundario de expedición de v2 ya permite esta jerarquía. La selección de páginas para anuncios se coordina con SEMbox. |
| Página de donación, pp. 4–6 | Incluir una página propia de donaciones en el dominio, compatible con los formularios integrados de inicio y proyectos. Explicar causa, frecuencia, importe, impacto, identidad, transparencia y pago. Conservar los cuatro destinos de v2 y prever fondo general según la configuración de donación. |
| Identidad cerca del pago, p. 6 | Mostrar Fundación Alma Arcoíris Colombia, NIT 901784588-0 y condición institucional junto al formulario. Confirmar la redacción de certificados y beneficios fiscales con la fundación. |
| Impacto en HTML, pp. 6–7 | Presentar cifras, periodos, resultados, fotografías y explicación del destino de fondos dentro de páginas web, conservando los PDF como documentos de respaldo. El reporte 2025 en HTML ya está pedido en v2. |
| Exactitud de cifras, p. 7 | Diferenciar excedentes reinvertidos de porcentaje de cada aporte destinado a una comunidad. El 85% de bienestar necesita muestra, periodo y metodología. Mantener pendientes las diferencias financieras ya identificadas en la revisión principal. |
| Salud y bienestar, pp. 7–8 | Revisar promesas terapéuticas o afirmaciones de tratamiento antes de publicar. Conservar el relato cultural y comunitario de v2. La revisión de audiencias publicitarias debe considerar la oferta y la segmentación concretas. |
| Equipo y gobernanza, p. 8 | Completar perfiles y responsabilidades dentro de Conócenos; incorporar documentación institucional y supervisión en los bloques correspondientes. |
| Historias, proyectos e inicio, pp. 8–10 | Integrar contexto, intervención y resultados en los módulos de proyectos y transparencia definidos por v2. No añadir automáticamente blog, colaboración empresarial ni el orden alternativo de home propuesto en el PDF. |
| Medición, pp. 10–11 | Registrar donación aprobada y formulario de voluntariado enviado como resultados; separar clics y descargas. La colaboración empresarial aparece como opcional en el PDF y no está añadida al alcance del lanzamiento. |
| Consentimiento, pp. 11–12 | Banner aceptar/rechazar/configurar y señales de Consent Mode v2 coherentes con la elección del visitante. Comprobar `analytics_storage`, `ad_storage`, `ad_user_data` y `ad_personalization`. |
| Datos personales, p. 12 | Revisar URLs, títulos, eventos, parámetros, dataLayer y User-ID. POST por sí solo no evita filtraciones de nombres, correos, teléfonos o información sensible a analítica. |
| Datos estructurados, pp. 12–14 | Usar identidad real de la ONG, NIT, domicilio legal y perfiles oficiales. Territorios de intervención en `areaServed` y proyectos; no como domicilio. Adaptar el ejemplo de JSON-LD a los datos y recursos finales. |

La política de Google respalda misión clara, contenido original suficiente, control del dominio, navegación útil, experiencia móvil, rapidez y HTTPS. La página propia `/donar/` es la solución propuesta para este proyecto; la política no obliga a utilizar exactamente esa ruta. [Política oficial de sitios web](https://support.google.com/nonprofits/answer/1657899?hl=es).

## 3. Precisiones sobre el PDF de condiciones

| Afirmación revisada | Resultado de la comprobación |
| --- | --- |
| CTR superior al 5% | Usar mínimo 5% mensual a nivel de cuenta, con la excepción de cuentas que usan exclusivamente campañas inteligentes. Dos meses consecutivos por debajo pueden causar desactivación temporal. [Política de cuentas](https://support.google.com/nonprofits/answer/117827?hl=es). |
| “Donación” prohibida por ser una palabra | La corrección del PDF es válida: donar, donación, ONG, voluntario y voluntariado figuran entre las excepciones publicadas. [Excepciones oficiales](https://support.google.com/nonprofits/answer/7587473?hl=es-419). |
| Dos grupos y dos anuncios ya son solo una regla histórica | **Hay discrepancia entre páginas oficiales.** La política de cuentas enumera segmentación y dos enlaces de sitio; la guía de cumplimiento todavía exige dos grupos por campaña y menciona dos anuncios asociados, tanto en español como en inglés. Dejar la interpretación pendiente de SEMbox/soporte antes de configurar campañas. [Política](https://support.google.com/nonprofits/answer/117827?hl=es), [guía](https://support.google.com/nonprofits/answer/9314402?hl=en). |
| Palabra clave literal en anuncio y titular | Tratarlo como recomendación de relevancia. La obligación publicada respecto a nivel de calidad es pausar o eliminar palabras con puntuación 1 o 2. [Guía oficial](https://support.google.com/nonprofits/answer/9314402?hl=es). |
| GA4 debe estar vinculado obligatoriamente | La medición puede implementarse directamente en Ads o importarse desde Analytics. Para este proyecto se conserva GTM + GA4 y se acuerda una única fuente primaria de conversión en Ads para evitar duplicaciones. [Guía oficial](https://support.google.com/nonprofits/answer/9314402?hl=es). |
| Una conversión mensual | Es aplicable a las cuentas y estrategias indicadas por la política; contempla cuentas desde 2018 y cuentas con Smart Bidding. La web permite medir resultados reales; el volumen mensual depende de la operación y las campañas. [Política de cuentas](https://support.google.com/nonprofits/answer/117827?hl=es). |
| CPC de 2 USD y una sola estrategia | Para cuentas nuevas, la política enumera Maximizar conversiones, Maximizar valor, CPA objetivo y ROAS objetivo, con la excepción de campañas inteligentes. La configuración corresponde a SEMbox. [Política de cuentas](https://support.google.com/nonprofits/answer/117827?hl=es). |
| Prohibición de todos los enlaces externos | La prohibición absoluta es incorrecta. Los anuncios deben usar dominios controlados y aprobados para la organización; la web puede continuar a un servicio seguro de pago. [Política web](https://support.google.com/nonprofits/answer/1657899?hl=es). |
| Suspensión automática por cargar en más de cuatro segundos | La política consultada pide rapidez, especialmente móvil, pero no fija ese umbral universal. Lighthouse >90 y el presupuesto de carga son objetivos técnicos del proyecto. [Política web](https://support.google.com/nonprofits/answer/1657899?hl=es). |
| Porcentajes de citación por IA y umbral de 2,5 segundos | El PDF advierte que no identifica fuentes verificables. No se adoptan como condiciones de Ad Grants ni como promesas de posicionamiento. |
| `Nonprofit501c3` para Alma Arcoíris | La corrección es adecuada: Schema.org lo identifica como clasificación estadounidense. Se omite esa atribución para esta entidad colombiana. [Schema.org](https://schema.org/Nonprofit501c3). |
| FAQ limitado a webs gubernamentales y sanitarias | **Información desactualizada:** Google anunció que los resultados enriquecidos FAQ dejaron de mostrarse el **7 de mayo de 2026**. Se mantienen las preguntas frecuentes del sitio por su utilidad para las personas, sin prometer ese resultado de búsqueda. [Actualización oficial de Google](https://developers.google.com/search/updates?hl=es). |

Los requisitos de campañas se documentan para coordinación con SEMbox. Esta revisión no modifica cuentas de Ads ni envía mensajes a la agencia.

## 4. Ajustes concretos para Next.js y Sanity

**Next.js:** entregar contenido sustancial en HTML; rutas ES/EN; metadatos y enlaces de idiomas; página de donación en el dominio; formularios con validación del servidor; imágenes optimizadas; HTTPS; redirecciones desde las URLs anteriores; contenido de resultados legible sin abrir un PDF.

**Sanity:** modelos para proyecto, actividad, resultado con periodo y fuente, informe anual, testimonio, equipo, aliado, preguntas frecuentes y configuración editorial. Campos bilingües, borradores, fotografías con texto alternativo y encuadre, documentos y enlaces de video. La edición debe respetar las plantillas de v2.

**Pago y medición:** `donation_complete` únicamente tras confirmación real y comprobada del pago, con `value`, `currency` y `transaction_id`; recargar o visitar una página de agradecimiento no debe generar otra conversión. Los pagos pendientes o rechazados no se contabilizan como donaciones. La recurrencia necesita confirmación de cada cobro, prevención de duplicados y mecanismo de cancelación. Sanity contiene el contenido editorial, no credenciales ni datos privados de donantes.

**Consentimiento:** comprobar las decisiones de aceptar, rechazar y configurar, y su persistencia entre páginas. Consent Mode transmite señales; el banner y los controles deben gestionar la elección real del usuario. [Guía técnica oficial](https://developers.google.com/tag-platform/security/guides/consent?hl=es).

**JSON-LD:** no copiar literalmente el ejemplo del PDF. Actualizar URLs del logo tras la migración, eliminar espacios/saltos de línea accidentales y usar sus dimensiones reales. Los `sameAs` de temas que apuntan solo a la portada de Wikidata no identifican una entidad concreta: omitirlos o sustituirlos por identificadores verificados. Mantener redes oficiales confirmadas y el domicilio de Chía, cuando la fundación confirme esos datos.

**Salud y segmentación:** la frase del PDF que asocia cualquier mención de salud mental con la prohibición de audiencias es demasiado general. La política regula la promoción de categorías sensibles y las herramientas de segmentación utilizadas. SEMbox deberá revisar anuncios, páginas y audiencias concretos; no se eliminan automáticamente referencias culturales o de bienestar de toda la web. [Política oficial de publicidad personalizada](https://support.google.com/adspolicy/answer/143465?hl=es).

## 5. Comprobación antes de campañas

1. Revisar las páginas finales en móvil y escritorio, los enlaces y el proceso de donación.
2. Verificar que las páginas de proyectos y transparencia contienen sus textos y datos en HTML en ambos idiomas.
3. Probar pago aprobado, pendiente, rechazado y recarga de agradecimiento; comprobar importes e identificadores de conversión.
4. Probar formularios, consentimiento y ausencia de datos personales en analítica.
5. Medir rendimiento en la versión desplegada y corregir problemas observados.
6. Acordar con SEMbox los identificadores de medición, conversiones primarias, páginas de destino y las discrepancias sobre estructura de campañas.

La revisión documental está completada. Las pruebas de implementación se realizarán cuando exista el sitio; los PDF originales permanecen intactos.
