# Fundación Alma Arcoíris · primera versión

Sitio en **Next.js 16, React 19, TypeScript y Sanity**, basado en `Estructura web 2026 v2` y en las revisiones suministradas. Existe una primera vista previa en Vercel; la revisión del 2 de octubre se prepara localmente para revisar contenido paso a paso. No está publicado en el dominio de la fundación.

## Ver el sitio

```sh
npm install
npm run dev
```

Abrir `http://127.0.0.1:3000/es` o `http://127.0.0.1:3000/en`. El servidor escucha únicamente en la máquina local. Para revisar una compilación optimizada, detener el servidor de desarrollo y ejecutar `npm run build` y `npm start`.

## Incluido

- 26 páginas ES/EN: Inicio, Proyectos, cuatro fichas de proyecto, Impacto y transparencia, Súmate, Conócenos, Donar y páginas informativas de privacidad, condiciones y cookies.
- Plantillas que mantienen el orden de proyectos y bloques de v2, con fotografías del cliente optimizadas a WebP. Las dos imágenes faltantes de los módulos de El Cairo se señalan expresamente.
- Menú móvil, selector de idioma con equivalencia de ruta, preguntas desplegables, archivo de memorias, gráfico financiero interactivo y videos de YouTube cargados solo al pulsar reproducir.
- Aportes únicos y mensuales de prueba en COP con Wompi y USD/EUR con PayPal, con validación, resumen, consentimiento y consulta privada. Las plataformas reciben los datos de pago; la web guarda referencias y estados en la base de Sandbox. **No se mueve dinero real.**
- Preferencias de analítica/publicidad guardadas en el navegador. No hay Google Analytics, Google Ads ni otras etiquetas de seguimiento activas.
- HTML prerenderizado, metadatos por página, canonical y alternancias ES/EN, fuentes locales y optimización de imágenes de Next. `SITE_INDEXABLE=false` conserva la vista previa fuera de indexación; no es control de acceso.
- Tipografía provisional Manrope con licencia abierta. Los archivos entregados de All Round Gothic son **DEMO**: sustituir por una licencia web válida cuando se entregue.

## Sanity

Copiar `.env.example` a `.env.local` y completar el identificador del proyecto y dataset. No guardar tokens en el repositorio ni usar prefijos `NEXT_PUBLIC_` para secretos.

El administrador está en `/es/estudio`. Sin proyecto configurado muestra las instrucciones; con proyecto configurado carga Sanity Studio y su autenticación normal. Configurar el origen local en la lista CORS de Sanity al conectar la cuenta.

Los modelos preparados incluyen proyectos bilingües, actividades, informes, equipo, aliados y configuración editorial. **En esta primera versión la lectura desde Sanity está conectada a las fichas y selector de proyectos.** Los demás bloques todavía usan contenido local; conectar su lectura es el siguiente paso editorial. No presentar esos modelos como edición ya operativa de toda la web.

Para crear los cuatro proyectos como borradores, con un token de escritura de permisos limitados:

```sh
npm run cms:seed
```

El script usa `createIfNotExists`, conserva documentos existentes y no publica. Las fotos iniciales continúan usando las rutas de `public/images`; desde Studio se podrán sustituir por imágenes subidas a Sanity. No hay credenciales ni cuenta de Sanity creadas por este proyecto. La verificación de conexión y permisos requiere esa cuenta.

## Preparación de credenciales Wompi · 6 de octubre de 2026

Los nombres de configuración están en `.env.example`:

| Variable                 | Valor inicial de pruebas                       | Tipo en Vercel |
| ------------------------ | ---------------------------------------------- | -------------- |
| `WOMPI_ENVIRONMENT`      | `sandbox`                                      | Config         |
| `WOMPI_PUBLIC_KEY`       | Llave completa con prefijo `pub_test_`         | Secret         |
| `WOMPI_PRIVATE_KEY`      | Llave completa con prefijo `prv_test_`         | Secret         |
| `WOMPI_INTEGRITY_SECRET` | Secreto completo con prefijo `test_integrity_` | Secret         |
| `WOMPI_EVENTS_SECRET`    | Secreto completo con prefijo `test_events_`    | Secret         |

El enlace actual de revisión corresponde al entorno **Production de Vercel**. Para probar en ese enlace, guardar allí estas credenciales **Sandbox de Wompi**. Los entornos de despliegue de Vercel y los ambientes de pagos de Wompi son independientes. Las credenciales reales se configurarán al activar cobros, después de validar la integración. No incluir valores privados en el chat, capturas, documentación ni GitHub.

Para pruebas locales, usar valores Sandbox en `.env.local`, ignorado por Git. Las variables de tipo Secret de Production y Preview no se recuperan mediante `vercel env pull`. La integración de pruebas se describe a continuación; su configuración no activa cobros reales.

## Integración Wompi Sandbox · 6 de octubre de 2026

La integración acepta exclusivamente credenciales Sandbox. Las llaves de producción quedan bloqueadas por código. El sitio conserva `noindex` y no cobra dinero real.

- Donación única: referencia y firma de integridad generadas en el servidor, registro previo en Postgres, salida al Checkout de Wompi y consulta del resultado autenticada por una cookie privada.
- Donación mensual: autorización explícita del valor, frecuencia y cancelación; Widget de tokenización de Wompi para tarjeta o Nequi; creación de la fuente de pago en el servidor. La web no recibe ni almacena números de tarjeta ni CVC.
- Registro persistente en la base separada `alma-arcoiris-donaciones-sandbox` de Neon, provisionada con plan Free y conectada al proyecto de Vercel. Sanity sigue reservado para contenido editorial.
- Notificaciones: `POST /api/wompi/events` valida firma, ambiente y los datos canónicos de la transacción obtenidos del API de Wompi. La URL `https://fundacion-alma-arcoiris.vercel.app/api/wompi/events` quedó configurada en el panel **Sandbox** de la cuenta FUNDACION ALMA ARCOIRIS COLOMBIA el 6 de octubre de 2026; se comprobó su entrega con una transacción ficticia aprobada de $50.000 COP y el registro de su evento firmado en Postgres. La configuración de eventos de producción permanece pendiente.
- Mensualidades: tarea diaria `/api/wompi/monthly`, protegida con `CRON_SECRET`, mantiene el día de referencia al pasar por meses cortos. No repite automáticamente un cobro con respuesta incierta. Si cambia una versión de los contratos de Wompi, pausa el aporte hasta una nueva autorización.
- Cancelación: enlace personal con token en el fragmento de URL, o la cookie del navegador original. Detiene futuros ciclos; un aporte que ya estaba en procesamiento puede completar su resultado. La recuperación del enlace por correo y las confirmaciones por correo quedan pendientes para el lanzamiento real.

Variables de servidor: las cinco `WOMPI_*`, `DATABASE_URL` y `CRON_SECRET`. La configuración protegida no se descarga ni se imprime. Para migraciones de la base de Sandbox: `node --env-file=tmp/payments-dev.env --experimental-strip-types scripts/migrate-payments.ts` (archivo local ignorado, obtenido con el entorno Development del proyecto). El script elige una conexión directa para la migración. No ejecutar esta migración sobre una base de producción ajena a las pruebas.

Antes de dinero real: completar las pruebas de Checkout, eventos, mensualidades y cancelación; aprobar los textos legales de la fundación; confirmar las capacidades de pagos recurrentes/3DS de su cuenta Wompi; separar la base real de Sandbox y preparar avisos/recuperación por correo. La activación real requiere una modificación explícita del bloqueo Sandbox.

Documentación oficial usada: [ambientes y llaves](https://docs.wompi.co/docs/colombia/ambientes-y-llaves/), [Checkout](https://docs.wompi.co/docs/colombia/widget-checkout-web/), [tokens de aceptación](https://docs.wompi.co/docs/colombia/tokens-de-aceptacion/), [fuentes de pago](https://docs.wompi.co/docs/colombia/fuentes-de-pago/), [eventos](https://docs.wompi.co/docs/colombia/eventos/).

El valor personalizado mínimo pasa a $1.500 COP para cubrir el mínimo publicado para el modelo Agregador. Los valores sugeridos de la clienta se conservan. Referencia: [mínimos por modelo de Wompi](https://soporte.wompi.co/hc/es-419/articles/360038824313--Cu%C3%A1l-es-el-monto-m%C3%ADnimo-para-realizar-una-transacci%C3%B3n).

Verificado el 6 de octubre con datos oficiales ficticios de Sandbox: firma de pago único aceptada y resultado APPROVED comprobado contra Wompi; primer y segundo ciclo mensual con tarjeta APPROVED; aporte mensual de $1.500 mediante Nequi APPROVED; reenvío de autorización rechazado sin otro cargo; repetición del programador sin otro ciclo; tarjeta de rechazo DECLINED con mensualidad pausada; cancelación mediante enlace personal sin futuros cargos; rechazo de consultas sin acceso, peticiones desde otro origen, eventos sin firma y programador sin secreto. Pasan 11 pruebas unitarias y TypeScript. Tras configurar la URL en el panel, un nuevo aporte ficticio de $50.000 COP quedó APPROVED y recibió un evento firmado enviado por Wompi Sandbox, comprobado por `event_timestamp > 0` y el identificador coincidente de la transacción. La validación de firmas también se prueba con fixtures locales.

## Comprobaciones realizadas

```sh
npm run typecheck
npm test
npm run build
# Con el servidor local iniciado y SITE_INDEXABLE=false:
node --experimental-strip-types scripts/check-preview.ts
```

El 16 de septiembre de 2026 pasaron TypeScript, tres pruebas de validación de donaciones, compilación optimizada y revisión HTTP de las 26 páginas. Se verificaron 404, bloqueo de pagos y robots. En el navegador se revisaron escritorio y móvil de 390 px, menú móvil, idioma conservando proyecto, monto personalizado, resumen sin cobro y selección de categoría financiera. Sin errores de consola en las páginas revisadas.

El 16 de septiembre `npm install` reportó cero vulnerabilidades tras aplicar correcciones puntuales de dependencias transitivas del CLI de Sanity. Los `overrides` de `package.json` corrigen js-yaml, smol-toml, adm-zip y uuid; revisar su necesidad al actualizar Sanity. No se hizo una degradación forzada de Sanity.

El 6 de octubre se actualizó Next.js a 16.3.6 para incorporar el [parche de ImageResponse](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j). Esta aplicación no usa ImageResponse. La instalación ya no reporta alertas críticas; quedan 22 alertas transitivas (1 baja, 11 moderadas, 10 altas), incluidas herramientas de Sanity. Revisarlas antes del lanzamiento real, sin aplicar degradaciones automáticas de Sanity.

No se ha medido todavía Lighthouse, Core Web Vitals en producción, compatibilidad exhaustiva entre navegadores ni accesibilidad mediante auditoría completa. No se ha certificado cumplimiento de Google Ad Grants.

## Antes del lanzamiento

1. **Pagos:** preparar las cuentas reales de Wompi y PayPal con políticas aprobadas, capacidades de recurrencia/3DS confirmadas, base y notificaciones separadas de Sandbox y correos de confirmación/recuperación. La aprobación, primer cobro, eventos y cancelación de PayPal Sandbox ya se comprobaron; no se ha esperado ni simulado un segundo mes de PayPal. Los eventos de Wompi Sandbox también están verificados. Nunca contar una selección, autorización o retorno del navegador como donación confirmada.
2. **CMS:** conectar proyecto/dataset, comprobar permisos y publicaciones, enlazar el resto de los modelos y habilitar vista previa de borradores autenticada.
3. **Contenido:** conciliar el reparto financiero de Inicio con los importes de Transparencia, cargar estados financieros y anexos oficiales, completar perfiles, aprobar traducciones, calendarios y las dos fotos de El Cairo. Misión y visión ya están tomadas del PDF v2 recibido en octubre.
4. **Contactos:** elegir y conectar el servicio de formularios/boletín. El registro del footer está visiblemente deshabilitado; los enlaces de correo y WhatsApp sí abren sus canales. No hay envíos ni inscripciones simuladas.
5. **Privacidad:** reemplazar los textos informativos de la vista previa por las políticas aprobadas; definir consentimiento, conservación y tratamiento de datos. Activar analítica/Ads únicamente cuando exista configuración y consentimiento aplicable. Coordinar medición con SEM BOX.
6. **Publicación:** definir hosting y dominio, HTTPS, redirecciones de las URLs actuales, páginas legales, imágenes sociales finales y comprobaciones de rendimiento/accesibilidad. Solo después activar `SITE_INDEXABLE=true` con la URL HTTPS correcta, sitemap y Search Console.

Botiquín Emocional y cursos permanecen en la segunda fase acordada. Las traducciones web están implementadas para revisión; los documentos oficiales en PDF conservan su idioma original.

## Documentación de origen

- [Revisión y estructura](docs/REVISION_Y_ESTRUCTURA_WEB.md)
- [Mapa de fotografías y referencias](docs/MAPA_DE_FOTOS_Y_REFERENCIAS_V2.md)
- [Revisión de los PDF y Ad Grants](docs/REVISION_PDF_AD_GRANTS.md)
- [Procedencia de las imágenes optimizadas](docs/assets-manifest.json)

Los documentos originales permanecen intactos.

## Segunda revisión visual · banner y legibilidad

A petición de Jorge, el banner se recompuso con fotografía protagonista, panel morado, acento dorado y acciones visibles. En escritorio, fotografía y mensaje conviven en dos columnas; en móvil la foto abre el banner. Se conserva el contenido institucional y la fotografía elegida por el cliente.

Se eliminaron los tamaños de 7–13 px: la lectura principal usa 18 px y los controles/textos de apoyo al menos 16 px, con unidades `rem`. Se amplió el interlineado, se oscureció el texto secundario y las tarjetas pasan a una columna en móvil. Los formularios, el footer y los diálogos también se adaptaron al aumento.

Verificación visual y de estilos: Inicio ES/EN, Donar, Transparencia, ficha Mhuysqa en inglés y Conócenos en 320 y 1280 px; banner adicional en 390 y 1440 px. Se corrigieron los desbordamientos de indicadores y gráfico en 320 px. Las combinaciones principales comprobadas dan 12,33:1 (blanco/morado del banner), 8,29:1 (acento dorado/morado), 6,59:1 (texto secundario/fondo claro) y 6,78:1 (texto/botón dorado).

Estas comprobaciones no constituyen una auditoría completa de accesibilidad. Se tomaron como referencia los criterios de [contraste](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) y [ampliación de texto](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) de W3C; queda pendiente la prueba exhaustiva con tecnologías de apoyo y zoom real del navegador.

## Tercera revisión visual · noticias y footer

Se rediseñó el bloque de noticias como una tarjeta clara con fotografía original de Misión Amazonas, invitación, formulario y acceso a WhatsApp agrupados. El footer conserva el morado corporativo y sus cuatro grupos: identidad, navegación, contacto y redes. Se añadieron iconos, separadores, información legal y distribución adaptable. El componente y sus estilos están aislados en `site-footer.tsx` y `site-footer.module.css`; se retiraron los estilos anteriores para evitar conflictos.

Se comprobó la ausencia de desbordamientos y de texto inferior a 16 px en español e inglés a 320, 390, 768 y 1280 px. El formulario sigue deshabilitado de forma explícita hasta conectar el servicio; no se han enviado mensajes ni registrado contactos.

## Cuarta revisión · movimiento y procedencia del contenido

Se añadieron entradas al recorrer las secciones y tarjetas, una entrada breve de la fotografía principal y transiciones de botones, enlaces, redes y desplegables. Se usan IntersectionObserver, Web Animations y CSS, sin dependencias nuevas ni cambios de posición permanentes. Las cifras no se cuentan ni se sustituyen por valores animados.

El contenido permanece visible sin JavaScript. Las animaciones se ejecutan una vez por sección y visita, se cancelan al enfocar sus controles y respetan `prefers-reduced-motion`, incluso si cambia durante la visita. Se detienen para imprimir y se recupera la observación después. El ajuste de reducción de movimiento está implementado; no se cambió la preferencia del sistema del usuario durante esta revisión.

Se contrastaron los textos institucionales, cifras, proyectos y testimonios con v2. Se retiraron las respuestas editoriales del Círculo de Oro y el indicador inferido «1 modelo» de El Cairo. En esa revisión la misión y visión quedaban pendientes; el PDF recibido en octubre ya aporta esos textos. El [control editorial](docs/CONTROL_EDITORIAL.md) distingue contenido suministrado, adaptaciones web, traducciones y pendientes; la procedencia documental no equivale a verificación independiente.

## Revisión de estructura · 2 de octubre de 2026

Se revisaron completas las 35 páginas de `Estructura web 2026 v2.pdf` y las cuatro de `Ajustes visuales a sitio web vercel.pdf`, incluidos enlaces, fotografías y anotaciones. La portada pasa a fotografía completa con frase breve y presentación debajo. Se incorporan cuatro submenús, las cuatro formas de participar, misión, visión 2030, autoridades comunitarias, funciones del equipo, alianzas y testimonios suministrados.

La transparencia en español usa `/es/reportes-de-gestion`; `/reportes-de-gestion/` y `/es/impacto-y-transparencia` redirigen permanentemente a esa ruta. Se añaden los informes de gestión 2024 y 2025 ya publicados en el sitio actual. El reparto del inicio queda sustituido por acceso a los informes mientras se concilia; la gráfica financiera conserva un aviso de revisión pendiente y aclara su base de cálculo.

Las nuevas fotos de caminatas y misiones proceden de los enlaces de la clienta y se optimizaron a WebP. El [control editorial](docs/CONTROL_EDITORIAL.md) registra fuentes por sección y pendientes de cifras, certificados, fotos, biografías, calendario, formularios, traducciones y pagos. Los nuevos campos de resultados y testimonios también están preparados en Sanity; no se creó una cuenta ni se publicó contenido en el CMS.

Validación de esta revisión: TypeScript y seis pruebas pasaron; compilación optimizada con Webpack (alternativa incluida en Next.js); revisión HTTP de las 26 páginas ES/EN, 404, robots, API de donaciones deshabilitada y redirecciones permanentes de informes. En navegador se comprobaron Inicio, Súmate, Conócenos, informes y El Cairo a 320, 390 y 1280 px, menú móvil, cierre por teclado, acordeones, categoría financiera, importe personalizado y cambio de idioma conservando el proyecto. La fotografía principal adapta su altura a la pantalla de escritorio y mantiene su proporción completa en móvil. Los desplegables nativos conservan las interacciones anteriores a la hidratación. Estas comprobaciones no constituyen una auditoría exhaustiva de accesibilidad ni aprobación de Google Ad Grants.

Pasaron la compilación optimizada y TypeScript. Se comprobó en navegador la activación de las entradas de tarjetas, la navegación ES/EN y la ausencia de desbordamiento en Inicio y Conócenos en las vistas revisadas de 320 y 1280 px; sin errores de consola.

## Integración PayPal Sandbox · 6 de octubre de 2026

Aplicación de pruebas **Arcoiris Web Sandbox**. No usa el enlace PayPal.Me para crear suscripciones ni permite el API de dinero real. Se crearon un producto de aportes mensuales y un plan por moneda, USD y EUR, con frecuencia mensual indefinida, sin tarifa inicial, impuestos ni cobro adicional de saldos pendientes. El precio de cada suscripción se fija en el servidor al valor autorizado por el donante; no se convierte desde COP ni se inventan equivalencias con los kits del cliente.

- El botón oficial de PayPal carga únicamente al revisar un aporte internacional, usando `@paypal/paypal-js`, moneda e intención correspondientes. El Client ID es público; el secreto permanece en el servidor.
- `POST /api/paypal` crea, confirma, consulta y cancela aportes. Cada aporte tiene un acceso aleatorio, guardado como hash; se utiliza una cookie HttpOnly o el enlace personal con el token en el fragmento. Las consultas sin acceso, las aprobaciones de otro aporte y las peticiones desde otro origen se rechazan.
- El servidor verifica el destinatario, el importe exacto y la moneda de las órdenes; verifica el plan, importe, frecuencia y ausencia de tarifas de las mensualidades. Una autorización `ACTIVE` no se cuenta como pago completado. Los pagos se consultan contra los recursos canónicos de PayPal y se registran por identificador único.
- PayPal programa sus propios cobros mensuales. No utiliza el programador de Wompi. La cancelación se solicita al API de PayPal y solo se muestra como confirmada cuando la consulta devuelve `CANCELLED`.
- Se registró en Sandbox `https://fundacion-alma-arcoiris.vercel.app/api/paypal/events`. El endpoint verifica la firma mediante el API oficial y deduplica eventos antes de registrar su procesamiento. No guarda payloads, nombres ni correos de PayPal. Se comprobó la entrega de eventos firmados de captura, cobro mensual, activación y cancelación enviados por PayPal Sandbox al sitio publicado.
- Las devoluciones de capturas se consultan en Payments v2. Una notificación firmada de devolución o reversión mensual marca el pago conocido para revisión; no lo sigue contando como confirmado. La conciliación de esas devoluciones queda a cargo de la fundación y debe completarse antes de activar dinero real.

Configuración de servidor en `.env.example`: `PAYPAL_ENVIRONMENT=sandbox`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_MERCHANT_ID`, `PAYPAL_PLAN_USD`, `PAYPAL_PLAN_EUR` y `PAYPAL_WEBHOOK_ID`. Guardadas en Production y Preview del proyecto correcto de Vercel; únicamente `PAYPAL_CLIENT_SECRET` es de tipo Secret. Los identificadores no son credenciales de acceso, pero no se publican valores en esta documentación. Para migrar las tablas de la base de pruebas: `node --env-file=tmp/payments-dev.env --experimental-strip-types scripts/migrate-payments.ts paypal`.

Verificado el 6 de octubre contra el API y el sitio publicado, con una cuenta Personal ficticia: aportes únicos y primeros cobros mensuales por 2,13 USD y 2,13 EUR, preservación del precio mensual personalizado, retorno del botón oficial al resultado con la referencia del aporte y consulta mediante enlace personal. Se revisaron confirmaciones en español e inglés, la próxima fecha mensual informada por PayPal y la cancelación confirmada contra el API. Todas las suscripciones ficticias aprobadas durante esta revisión se cancelaron. No se ha esperado ni simulado un segundo mes; PayPal administra ese calendario. Los eventos firmados de `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.SALE.COMPLETED`, `BILLING.SUBSCRIPTION.ACTIVATED` y `BILLING.SUBSCRIPTION.CANCELLED` quedaron registrados en Postgres.

Durante la aprobación se detectó que PayPal Sandbox puede representar los impuestos no configurados como `taxes.percentage="null"`. La validación acepta esa ausencia y sigue rechazando impuestos positivos, valores numéricos malformados, cambios de precio, moneda, destinatario o frecuencia. Pasan 18 pruebas unitarias, TypeScript y compilación optimizada. Se comprobaron HTTP 404 sin acceso o con acceso incorrecto, 400 ante identificador de aprobación ajeno, centavos fraccionarios o falta de consentimiento, 403 desde otro origen y 401 para un evento sin firma. La activación de dinero real y los correos de la fundación continúan pendientes.

Referencias oficiales: [botones del SDK mantenido](https://developer.paypal.com/sdk/js/v5/reference), [integración de suscripciones](https://developer.paypal.com/subscriptions/integrate/), [creación de órdenes](https://developer.paypal.com/api/orders/v2/orders-create), [consulta del contrato mensual](https://developer.paypal.com/api/subscriptions/v1/subscriptions-get), [verificación de firmas](https://developer.paypal.com/api/webhooks/v1/verify-webhook-signature-post).
