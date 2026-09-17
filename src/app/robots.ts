import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
export default function robots(): MetadataRoute.Robots {
  const enabled = process.env.SITE_INDEXABLE === "true";
  return {
    rules: {
      userAgent: "*",
      allow: enabled ? "/" : undefined,
      disallow: enabled ? ["/es/estudio", "/api/"] : "/",
    },
    ...(enabled ? { sitemap: new URL("/sitemap.xml", getSiteUrl()).href } : {}),
  };
}
