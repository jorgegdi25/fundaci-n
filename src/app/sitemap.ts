import type { MetadataRoute } from "next";
import {
  locales,
  routeNames,
  href,
  projectHref,
  type PageKey,
} from "@/lib/i18n";
import { projects } from "@/content/projects";
import { getSiteUrl } from "@/lib/site-url";
export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.SITE_INDEXABLE !== "true") return [];
  const base = getSiteUrl().origin;
  return locales.flatMap((lang) => [
    ...(Object.keys(routeNames) as PageKey[]).map((k) => ({
      url: base + href(lang, k),
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, base + href(l, k)]),
        ),
      },
    })),
    ...projects.map((p) => ({
      url: base + projectHref(lang, p.slug),
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, base + projectHref(l, p.slug)]),
        ),
      },
    })),
  ]);
}
