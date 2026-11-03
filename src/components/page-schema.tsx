import { getSiteUrl } from "@/lib/site-url";
import { href, type Lang } from "@/lib/i18n";

export function PageSchema({
  lang,
  title,
  path,
  kind = "WebPage",
  project = false,
}: {
  lang: Lang;
  title: string;
  path: string;
  kind?: "WebPage" | "AboutPage" | "CollectionPage";
  project?: boolean;
}) {
  const origin = getSiteUrl().origin;
  // Canonical path only: never include private management tokens or queries.
  const url = new URL(path.split(/[?#]/)[0], origin).href;
  const crumbs = [
    {
      name: lang === "es" ? "Inicio" : "Home",
      item: new URL(href(lang, "home"), origin).href,
    },
    ...(project
      ? [
          {
            name: lang === "es" ? "Proyectos" : "Projects",
            item: new URL(href(lang, "projects"), origin).href,
          },
        ]
      : []),
    ...(path !== href(lang, "home") ? [{ name: title, item: url }] : []),
  ];
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": kind,
        "@id": `${url}#webpage`,
        url,
        name: title,
        inLanguage: lang,
        isPartOf: { "@id": `${origin}/#website` },
        about: { "@id": `${origin}/#organization` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: crumbs.map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          ...crumb,
        })),
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
