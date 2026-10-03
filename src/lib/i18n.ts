export type Lang = "es" | "en";
export type Localized = { es: string; en: string };
export const locales: Lang[] = ["es", "en"];
export const l = (es: string, en: string): Localized => ({ es, en });
export const pick = (value: Localized, lang: Lang) => value[lang];
export const path = (lang: Lang, slug = "") =>
  `/${lang}${slug ? `/${slug}` : ""}`;
export const routeNames = {
  home: { es: "", en: "" },
  projects: { es: "proyectos", en: "projects" },
  impact: { es: "reportes-de-gestion", en: "impact-and-transparency" },
  join: { es: "sumate", en: "get-involved" },
  about: { es: "conocenos", en: "about" },
  donate: { es: "donar", en: "donate" },
  privacy: { es: "privacidad", en: "privacy" },
  terms: { es: "condiciones", en: "terms" },
  cookies: { es: "cookies", en: "cookies" },
};
export type PageKey = keyof typeof routeNames;
export const href = (lang: Lang, key: PageKey) =>
  path(lang, routeNames[key][lang]);
export const projectHref = (lang: Lang, slug: string) =>
  `${href(lang, "projects")}/${slug}`;
