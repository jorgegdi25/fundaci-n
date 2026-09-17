import { defineType, defineField } from "sanity";

const localized = (name: string, title: string) =>
  defineField({ name, title, type: "localizedText" });
const image = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [localized("alt", "Texto alternativo ES / EN")],
  });
const localizedText = defineType({
  name: "localizedText",
  title: "Texto en español e inglés",
  type: "object",
  fields: [
    {
      name: "es",
      title: "Español",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    },
    {
      name: "en",
      title: "English",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    },
  ],
});
const project = defineType({
  name: "project",
  title: "Proyectos · estructura v2",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Ruta del proyecto",
      type: "string",
      options: { list: ["el-cairo", "sierra-nevada", "amazonas", "mhuysqa"] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      validation: (r) => r.required().min(0).max(3),
    }),
    localized("name", "Nombre"),
    localized("title", "Titular principal"),
    localized("subtitle", "Presentación"),
    localized("location", "Territorio"),
    localized("category", "Línea de trabajo"),
    localized("alt", "Descripción de la fotografía"),
    image("coverImage", "Fotografía del selector"),
    image("heroImage", "Fotografía de cabecera"),
    defineField({
      name: "image",
      title: "Fotografía local de respaldo",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({ name: "hero", type: "string", readOnly: true, hidden: true }),
    defineField({
      name: "color",
      title: "Color del bloque de participación",
      type: "string",
      validation: (r) => r.regex(/^#[0-9a-fA-F]{6}$/),
    }),
    defineField({
      name: "modules",
      title: "Qué logras con tu generosidad",
      type: "array",
      validation: (r) => r.required().min(3).max(4),
      of: [
        {
          type: "object",
          fields: [
            localized("title", "Título"),
            localized("description", "Descripción"),
            image("photo", "Fotografía"),
            {
              name: "image",
              title: "Archivo local de respaldo",
              type: "string",
              hidden: true,
            },
            {
              name: "portrait",
              title: "Conservar encuadre vertical",
              type: "boolean",
            },
          ],
          preview: { select: { title: "title.es", media: "photo" } },
        },
      ],
    }),
    defineField({
      name: "results",
      title: "Resultados",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "value", title: "Cifra", type: "string" },
            localized("label", "Descripción"),
            { name: "period", title: "Periodo", type: "string" },
            {
              name: "source",
              title: "Fuente o informe de respaldo",
              type: "url",
            },
            {
              name: "verified",
              title: "Revisado por la fundación",
              type: "boolean",
              initialValue: false,
            },
          ],
          preview: { select: { title: "label.es", subtitle: "value" } },
        },
      ],
    }),
    defineField({
      name: "video",
      title: "ID de video de YouTube",
      type: "string",
      validation: (r) => r.regex(/^[A-Za-z0-9_-]{11}$/),
    }),
    image("videoCover", "Portada del video"),
    defineField({ name: "videoImage", type: "string", hidden: true }),
    localized("involvement", "Título de participación"),
    localized("involvementText", "Texto de participación"),
    defineField({
      name: "faqs",
      title: "Preguntas frecuentes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            localized("question", "Pregunta"),
            localized("answer", "Respuesta"),
          ],
          preview: { select: { title: "question.es" } },
        },
      ],
    }),
  ],
  preview: { select: { title: "name.es", media: "coverImage" } },
  orderings: [
    {
      title: "Orden del cliente",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
const activity = defineType({
  name: "activity",
  title: "Actividades y expediciones",
  type: "document",
  fields: [
    localized("title", "Título"),
    localized("description", "Descripción"),
    defineField({
      name: "category",
      title: "Tipo",
      type: "string",
      options: { list: ["caminata", "expedicion", "evento", "voluntariado"] },
    }),
    defineField({ name: "date", title: "Fecha confirmada", type: "datetime" }),
    defineField({
      name: "status",
      title: "Estado",
      type: "string",
      options: { list: ["borrador", "confirmada", "cerrada"] },
      initialValue: "borrador",
    }),
    localized("requirements", "Requisitos y logística"),
    localized("contribution", "Costos y destino del aporte"),
    image("photo", "Fotografía"),
  ],
  preview: { select: { title: "title.es" } },
});
const report = defineType({
  name: "report",
  title: "Informes y documentos oficiales",
  type: "document",
  fields: [
    localized("title", "Nombre"),
    defineField({ name: "year", title: "Año", type: "number" }),
    defineField({
      name: "type",
      title: "Clase",
      type: "string",
      options: { list: ["gestion", "financiero", "dictamen", "legal"] },
    }),
    localized("summary", "Resumen HTML"),
    defineField({
      name: "file",
      title: "PDF oficial",
      type: "file",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "language",
      title: "Idioma del documento",
      type: "string",
      options: { list: ["es", "en"] },
    }),
    defineField({
      name: "verified",
      title: "Vigencia y contenido verificados",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: { select: { title: "title.es", subtitle: "year" } },
});
const person = defineType({
  name: "teamMember",
  title: "Sabedores y equipo",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nombre", type: "string" }),
    localized("role", "Responsabilidad"),
    localized("bio", "Experiencia"),
    image("photo", "Retrato autorizado"),
    defineField({ name: "order", title: "Orden", type: "number" }),
  ],
});
const ally = defineType({
  name: "ally",
  title: "Alianzas y patrocinios",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Organización", type: "string" }),
    image("logo", "Logotipo"),
    localized("relationship", "Relación con la fundación"),
    defineField({ name: "url", title: "Sitio oficial", type: "url" }),
    defineField({ name: "order", title: "Orden", type: "number" }),
  ],
});
const settings = defineType({
  name: "siteSettings",
  title: "Configuración editorial",
  type: "document",
  fields: [
    localized("homeTitle", "Titular de inicio"),
    localized("purpose", "Qué hacemos"),
    localized("homeDescription", "Descripción de inicio"),
    image("homeImage", "Banner de inicio"),
    localized("emergencyText", "Mensaje de emergencia"),
    defineField({
      name: "emergencyActive",
      title: "Mostrar aviso de emergencia",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "email",
      title: "Correo institucional",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Teléfono institucional",
      type: "string",
    }),
    defineField({ name: "legalName", title: "Razón social", type: "string" }),
    defineField({ name: "nit", title: "NIT", type: "string" }),
  ],
});
export const schemaTypes = [
  localizedText,
  project,
  activity,
  report,
  person,
  ally,
  settings,
];
