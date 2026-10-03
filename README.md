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
- Selección de aporte único/mensual, proyecto y monto personalizado en COP; validación y resumen. **No se cobra, no se crea una suscripción ni se solicitan datos de pago.** El endpoint `/api/donations` responde 503 a solicitudes válidas y 400 a solicitudes inválidas.
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

## Comprobaciones realizadas

```sh
npm run typecheck
npm test
npm run build
# Con el servidor local iniciado y SITE_INDEXABLE=false:
node --experimental-strip-types scripts/check-preview.ts
```

El 16 de septiembre de 2026 pasaron TypeScript, tres pruebas de validación de donaciones, compilación optimizada y revisión HTTP de las 26 páginas. Se verificaron 404, bloqueo de pagos y robots. En el navegador se revisaron escritorio y móvil de 390 px, menú móvil, idioma conservando proyecto, monto personalizado, resumen sin cobro y selección de categoría financiera. Sin errores de consola en las páginas revisadas.

`npm install` reportó cero vulnerabilidades tras aplicar correcciones puntuales de dependencias transitivas del CLI de Sanity. Los `overrides` de `package.json` corrigen js-yaml, smol-toml, adm-zip y uuid; revisar su necesidad al actualizar Sanity. No se hizo una degradación forzada de Sanity.

No se ha medido todavía Lighthouse, Core Web Vitals en producción, compatibilidad exhaustiva entre navegadores ni accesibilidad mediante auditoría completa. No se ha certificado cumplimiento de Google Ad Grants.

## Antes del lanzamiento

1. **Pagos:** conectar cuentas oficiales de Wompi y PayPal, confirmar recurrencia por proveedor, monedas y condiciones; implementar órdenes de servidor, firmas/webhooks, idempotencia, estados de pago, cancelación y pruebas sandbox. Nunca contar una selección o retorno del navegador como donación confirmada.
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
