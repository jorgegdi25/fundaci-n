# Control de procedencia del contenido

## Revisión vigente · 2 de octubre de 2026

Fuentes rectoras suministradas por Jorge: **Estructura web 2026 v2.pdf** (35 páginas, carpeta Descargas) y **Ajustes visuales a sitio web vercel.pdf** (4 páginas). Se revisaron el texto completo, los enlaces y todas las páginas renderizadas. La sección del 16 de septiembre, conservada debajo como historial, describe la versión anterior y queda sustituida en los puntos siguientes.

| Página / bloque   | Implementación y fuente                                                                                                                                                                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inicio            | Fotografía completa, frase breve y presentación/CTA debajo según Ajustes, pp. 1–4. Tarjetas Kogui y Tikuna corregidas. Estructura general según v2, pp. 1–8.                                                                                             |
| Navegación        | Submenús de Proyectos, Impacto, Súmate y Conócenos según v2, pp. 1–2. Los recursos internos de Botiquín/cursos siguen en fase 2 por decisión de Jorge.                                                                                                   |
| Proyectos         | Titulares, resultados, testimonios y destino de los aportes según v2, pp. 8–22. Se añadieron $20 millones recaudados en El Cairo, logros de cooperación de Sierra Nevada y nueve voluntarios/parque infantil de Amazonas.                                |
| Transparencia     | Biblioteca por vigencias, cinco respaldos legales y cita completa del Mamo según v2, pp. 22–27. La ruta `/reportes-de-gestion/` se conserva con redirección al contenido ES; la ruta anterior de la vista previa también redirige.                       |
| Súmate            | Cuatro rutas de participación, misiones, caminatas, tres círculos y encuentros según v2, pp. 28–31. Las fotos de misiones y caminatas se descargaron de los enlaces indicados y se optimizaron; procedencia en `assets-manifest.json`.                   |
| Conócenos         | Misión, visión 2030, propósito, sabedores/autoridades, valores, funciones del equipo y alianzas según v2, pp. 31–35. Los perfiles del PDF siguen siendo marcadores de posición: no se redactaron biografías ni se asignaron retratos sin identificación. |
| Footer y donación | Dirección, dos correos, teléfonos y redes según v2, pp. 6–8. Destinos del aporte cambian por causa y frecuencia según pp. 6, 8–9, 12, 16 y 19. Wompi/PayPal siguen pendientes de conexión.                                                               |

### Comprobaciones y diferencias pendientes

- **Estadísticas del inicio:** DANE (censo 2018) respalda 115 pueblos; WWF (9 agosto 2024) respalda 46% del bosque natural de Colombia en resguardos y 60% del carbono de los bosques amazónicos. Se enlazan las fuentes junto a las cifras. Se retiraron los detalles no respaldados del PDF (4,7%, 29% y el alcance colombiano del 91%); no se inventó una referencia para sostenerlos.
- **Finanzas:** el inicio propone 75/15/10, mientras las cuentas de 2025 detallan 89,87% de inversión social. Se reemplazó el reparto del inicio por acceso a los informes mientras se aclara. Los gastos detallados suman $88.964.163, pero el total escrito es $88.964.000: diferencia de $163. El 89,87% corresponde a gastos, no a los ingresos de $88.567.000. La gráfica declara su base de cálculo y su conciliación pendiente. El porcentaje de 2024 (79,25%) tampoco coincide con $54.669.685 / $67.778.676; no se publicó esa proporción.
- **Círculos:** EFIS presenta 160 participantes para 2025 y 190+ en Súmate sin la misma vigencia; se conserva la cifra fechada en resultados y no se mezclan periodos. Hermandad: 188 en 2025. No se agrega el dato de 1.500 caminantes sin respaldo identificable.
- **Documentos:** la carpeta de Drive continúa sin acceso; no se enviaron solicitudes. Jorge entregó `drive-download-20261002T214102Z-1-001.zip` el 2 de octubre: diez archivos, nueve PDFs distintos, conservados sin alterar su contenido en `DOCUMENTOS LEGALES/RECIBIDOS 2026-10-02/`. Incluye estados financieros de 2023, 2024 y 2025; dictámenes de los tres años (firmas visibles); informe de gestión 2023 con balance de apertura; anexo financiero y cuantitativo 2025; certificado de Inspección, Vigilancia y Control GOB-S-CR-2026-0168636. Las dos copias del anexo 2025 tienen idéntico SHA-256. Los informes de gestión 2024 y 2025 ya están enlazados desde el sitio actual. Faltan RUT, certificado de existencia y representación legal y certificado de Rendición Social Pública de Cuentas. La recepción no implica publicación: estos nuevos originales aún no se han enlazado en la web.
- **Revisión de los documentos recibidos:** el informe 2023, p. 2, describe los $555.000 como efectivo aportado, mientras `EEFF_ALMA_2023.pdf`, p. 1, los registra como cuentas por cobrar a socios; confirmar clasificación antes de reproducirla en la web. Los EEFF 2024, p. 4, presentan un estado de cambios en el patrimonio con fechas 2021 y 2022, anteriores a la constitución declarada; pedir versión confirmada por el responsable contable. El anexo 2025 confirma 90,27% de inversión social respecto a ingresos y 89,87% respecto a gastos; persiste la diferencia de $163 entre el desglose y el total. No se corrigieron ni reexportaron los PDFs suministrados.
- **Fotografías pendientes:** reconstrucción de El Cairo (nuevo enlace `1gN0vUCNfdlKWsFqQ-FgMcJkVZIiDXZ1D`) y mingas (`1J1RUyxpRWqDzZhrutXpuxHSdc5xXdf9-`) no pudieron recuperarse. EFIS y Hermandad tampoco se descargaron. Se conserva el material válido existente; no se generan fotos ni se presenta material de otro territorio como si fuera El Cairo.
- **Fondo de donaciones del inicio:** a petición de Jorge, el bloque “Siembra tu semilla de cambio hoy” utiliza `/images/misiones.webp` como fondo decorativo, con degradado verde y formulario blanco. La foto ya proviene de los enlaces de la clienta y está registrada en `assets-manifest.json`; no se atribuyen identidades ni resultados nuevos. En móvil el fondo se limita a 760px y se funde con el color de la sección para conservar el encuadre y la lectura. Los textos y las opciones del aporte permanecen iguales.
- **Formularios y calendario:** al no existir calendario, guía descargable, enlaces de grupos ni servicio de inscripción confirmados, los botones llevan al correo o WhatsApp institucional para consultar. No se simulan registros completados.
- **Legal:** el certificado de Gobernación recibido respalda documentalmente NIT, registro S0063813, inscripción 00373753 y cumplimiento de la entrega de información jurídica y financiera para vigencia 2025. Su texto declara seis meses de vigencia desde el 2 de septiembre de 2026 y aclara que no es licencia de funcionamiento. No sustituye los certificados de Cámara de Comercio, DIAN o Rendición Social Pública de Cuentas pendientes. Las políticas de la primera versión conservan su aviso provisional: faltan versiones institucionales aprobadas de tratamiento de datos/privacidad y términos de donación. Se omitió el 85% de biodiversidad del bloque de propósito al no disponer de respaldo para ese alcance.
- **Idioma y moneda:** las traducciones siguen pendientes de aprobación editorial. Se conservan los importes COP; los equivalentes USD del PDF no se muestran como conversión vigente ni como moneda de cobro.

Fuentes externas consultadas para verificar los datos ya suministrados:

- DANE: https://www.dane.gov.co/files/investigaciones/boletines/grupos-etnicos/infograf%C3%ADa-grupos-etnicos-2019.pdf
- WWF: https://www.wwf.org.co/de_interes/noticias/?uNewsID=364960
- Informe 2024: https://fundacionalmaarcoiris.org/wp-content/uploads/2026/03/3-Reporte-de-gestion-2024-a-febrero-2025.pdf
- Informe 2025: https://fundacionalmaarcoiris.org/wp-content/uploads/2026/03/4-2025-REPORTE-DE-GESTION-final.pdf

## Historial · 16 de septiembre de 2026

Revisión del 16 de septiembre de 2026, a petición de Jorge. Fuente rectora: **Estructura web 2026 v2.docx**, conservada en la raíz del proyecto. Los documentos de revisión complementan su estructura; no convierten un ejemplo editorial en un hecho institucional.

## Contenido contrastado con v2

| Contenido de la vista previa                                                    | Ubicación en el documento                                                                                                               |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Titular principal, qué hacemos, pueblos Kogui, Mhuysqa y Tikuna                 | Inicio, secciones 1 y 2                                                                                                                 |
| 115 pueblos, 46% de bosques, 60% de carbono                                     | Inicio, bloque B. Son datos suministrados por la clienta, con sus fuentes indicadas; queda pendiente validar las referencias originales |
| ~950 beneficiarios, 3 comunidades, 45 niños y familias, excedentes reinvertidos | Inicio, sección 4; ~950 también aparece en Impacto, sección 3                                                                           |
| Distribución 75/15/10                                                           | Inicio, sección 4. No está conciliada con la distribución de Transparencia                                                              |
| 20 familias de El Cairo; modelo piloto, aplicación y mingas                     | Proyecto El Cairo, secciones 1–3                                                                                                        |
| 22 kits, más de 70 personas, más de 5 viajes; expedición de cinco días          | Misión Sierra Nevada, secciones 3 y 4                                                                                                   |
| Más de 60 niños, 250 habitantes, dos expediciones; experiencia de seis días     | Misión Amazonas, secciones 3 y 4                                                                                                        |
| Cuatro comunidades, más de 70 personas, centro en Apulo                         | Pueblo Mhuysqa, sección 3                                                                                                               |
| Testimonio atribuido a Nelly Guzman                                             | Inicio, sección 7. Español tomado del documento; inglés traducido para revisión                                                         |
| Cita de Mamo Atanasio                                                           | Impacto y transparencia, sección 2. La web usa un extracto y su traducción                                                              |
| Integrantes del equipo, colaboradores y alianzas                                | Menú Conócenos, al inicio del documento. No se añadieron biografías ni credenciales                                                     |
| NIT, correos y teléfonos                                                        | Footer, columnas 1 y 3                                                                                                                  |
| Fotografías originales                                                          | Asignaciones de v2 e inventario de archivos: `MAPA_DE_FOTOS_Y_REFERENCIAS_V2.md` y `assets-manifest.json`                               |

La coincidencia con el documento acredita la **procedencia**, no una verificación independiente de cifras, vigencias, testimonios o condiciones tributarias.

## Adaptaciones y correcciones

Los títulos de apoyo, textos de botones, frases de transición, resúmenes y traducciones contienen adaptaciones editoriales para la web. No todo el texto es una transcripción literal ni se debe presentar como redacción ya aprobada. Ejemplos: «Tu intención, en acción», «Cada encuentro deja una historia» y las introducciones de Súmate. No añaden resultados, personas ni testimonios.

Se retiraron las respuestas redactadas para «Por qué / Cómo / Qué»: v2 pide un Círculo de Oro 2026, pero no proporciona ese texto oficial. Su espacio queda identificado como pendiente. El bloque anterior ahora se llama «Qué hacemos» y utiliza el texto suministrado, sin presentarlo como misión institucional formal.

Se retiró el indicador numérico «1 modelo de vivienda replicable propuesto» de El Cairo: el documento describe un modelo piloto, pero no lo enumera entre sus métricas. La descripción del proyecto se conserva.

Los avisos sobre pagos, formularios, documentos pendientes y políticas provisionales describen el estado real de esta implementación; no son contenido institucional suministrado por la clienta. No deben sustituir las políticas oficiales al publicar.

## Regla para las siguientes revisiones

- No añadir cifras, noticias, testimonios, perfiles, certificaciones, fechas ni promesas sin localizar su fuente suministrada.
- Conservar las fotografías asignadas y distinguir logros realizados de propuestas o convocatorias.
- Si falta un dato o una redacción institucional, dejarlo pendiente para la clienta.
- Mantener como pendientes de revisión los textos editoriales y las traducciones, así como las diferencias financieras documentadas en `REVISION_Y_ESTRUCTURA_WEB.md`.
- Las animaciones son exclusivamente visuales: no cambian números, no simulan donaciones y no generan actividad ficticia.
