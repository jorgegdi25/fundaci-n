# PayPal Live · preparación del 18 de noviembre de 2026

La publicación pública continúa con el enlace alojado de Wompi. Esta preparación no activa PayPal real al guardar una clave, desplegar una Preview o crear un plan.

## Separación

- Sandbox conserva `/api/paypal`, sus variables `PAYPAL_*` y su ledger actual.
- Live usa `/api/paypal/live`, `/api/paypal/live/events`, variables `PAYPAL_LIVE_*` exclusivas de Production y una base dedicada. La configuración rechaza una conexión al mismo ledger de Sandbox, incluso con otro usuario o el hostname pooled.
- La base Live lleva un marcador y un CHECK que solo admite `environment='production'`. El servicio verifica el marcador antes de acceder a sus registros.
- `PAYPAL_LIVE_CHECKOUT_STAGE` vacío mantiene la creación desactivada. `review` permite únicamente el hostname inmutable del despliegue de Production; ni el dominio público ni una Preview obtienen acceso. `public` queda pendiente de autorización de lanzamiento. Conservar la protección de Vercel en el despliegue de revisión.
- Un donante existente conserva acceso autenticado al estado y cancelación aunque se deshabilite la creación de nuevos aportes. El receptor de eventos tampoco depende de habilitar nuevos cobros.

## Planes

`scripts/setup-paypal-live.mjs` es una orden de operador explícita, ajena al build. Usa una credencial temporal privada y la elimina al terminar, también si falla. Verifica OAuth y el permiso de suscripciones. Reutiliza un producto y los planes mensuales USD/EUR existentes antes de crear otros; guarda únicamente sus identificadores en el resultado.

Los planes base son de 1,00 en cada moneda, mensuales e indefinidos, sin cuota de inscripción ni cobro de saldo acumulado adicional. Son plantillas internas: la suscripción sobreescribe el precio con el total elegido por el donante. Antes de devolver al navegador el identificador aprobable, el servidor consulta y valida el contrato canónico: moneda, importe exacto, plan, frecuencia mensual, ausencia de cargos adicionales y relación con el aporte. Se comprueba de nuevo al confirmar y al recibir eventos.

La preparación de planes no crea órdenes ni suscripciones de prueba en Live y no captura pagos.

Para usar las credenciales ya almacenadas en Vercel sin extraerlas, existe un receptor temporal de operador en `/api/paypal/live/setup`. Reutiliza los mismos provisionadores, exige un token de 256 bits, origen coincidente y el hostname inmutable de Production; rechaza Preview y dominios públicos. Caduca el 19 de noviembre de 2026 a las 22:30 UTC, incluso en un despliegue antiguo. Solo admite `plans`, `schema` y `webhook`, con recursos y destinos fijos. El alta del webhook exige comprobar antes que el receptor público existe y rechaza un evento sin firma. Utilizar únicamente en un despliegue staged con Vercel Authentication y sin asignar dominios; retirar el token al terminar. El receptor devuelve resultados de configuración, nunca credenciales.

La base Live usa un proyecto independiente de Neon Free, sin copiar registros ni contraseñas de Sandbox. La migración exige un hostname diferente al de Sandbox, conexión directa y una base vacía o con el marcador Live correcto. Usa el SQL versionado y revierte las filas ficticias de verificación. La integración de Vercel se conecta solo a Production con prefijo `PAYPAL_LIVE`.

## Notificaciones y correos

El webhook Live se registra en `https://fundacionalmaarcoiris.org/api/paypal/live/events`. Solo verifica eventos mediante PayPal Live y su propio webhook ID. El payload y el retorno del navegador no son prueba de pago: se vuelve a consultar el recurso canónico y se deduplican eventos y transacciones. Una suscripción ACTIVE no equivale a un pago COMPLETED.

Los correos requieren una activación independiente, remitente verificado y fecha de inicio. `PAYPAL_LIVE_EMAILS_ENABLED=review` envía ambos modelos únicamente a `webmaster@fundacionalmaarcoiris.org`. `public` permite enviar al correo del pagador confirmado por PayPal y a `misiones@fundacionalmaarcoiris.org`. No se reutiliza la clave de correo de Sandbox automáticamente.

El aviso se guarda en la base antes de programar un Workflow duradero. Sus reintentos vuelven a verificar el pago y usan claves de idempotencia de Resend; no guardan secretos ni el correo del donante en argumentos del Workflow. Los reintentos quedan dentro de 23 horas y después requieren conciliación manual. Los mensajes en español e inglés enlazan al formulario SARLAFT y distinguen pago y registro; no prometen certificados automáticos.

## Validación pendiente de servicios

El código y las pruebas automatizadas no acreditan que los planes, webhook, base Live o correo estén conectados. Registrar evidencia de cada conexión. Antes de publicar: comprobar USD y EUR, pago único y mensual, importe elegido, aprobación y rechazo, eventos repetidos, página de gracias y registro, cancelación y correos. El pago de validación Live debe autorizarlo personalmente el titular del medio de pago; nunca se presentan tarjetas Sandbox como válidas para Live.

## Conexiones verificadas · 18 de noviembre de 2026

- API Live autenticada y permiso de suscripciones confirmado. Producto `PROD-13J08517NH669333G`; planes canónicos mensuales `P-7RG48290YW7276707NL7C2QQ` (USD) y `P-5HD16607KF7031356NL7C2QY` (EUR). Identificadores guardados solo en Production.
- Neon Free: recurso `alma-arcoiris-paypal-live`, proyecto independiente `sweet-mud-91428611`, rama `br-young-recipe-bb86o4uq`. Enlace de Vercel solo a Production con prefijo propio. Migración realizada; marcador Production y restricción comprobados; filas ficticias revertidas. No se copió la base Sandbox.
- Receptor publicado en el dominio con checkout Live desactivado. Un POST sin firma devuelve HTTP 401. Webhook Live `7E535728141573414` creado y consultado en PayPal para los 16 tipos de eventos definidos. Su ID está guardado en Production; requiere un despliegue posterior para cargar esa variable nueva.
- No se han creado órdenes ni suscripciones de donantes, capturado pagos o enviado correos de esta preparación. El botón público mantiene el enlace alojado de Wompi.

Pendientes: Merchant ID de la cuenta receptora (la pantalla de información comercial aparece en blanco); aprobación y creación de una clave Resend separada para Live, con revisión restringida a webmaster; cargar la configuración final en un despliegue privado y validar un pago autorizado, su evento firmado, registro, página de gracias, correos y cancelación antes del lanzamiento. La creación del webhook y la respuesta 401 no equivalen a haber verificado un pago real.
