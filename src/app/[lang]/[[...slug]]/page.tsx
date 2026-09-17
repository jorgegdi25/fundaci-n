import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  href,
  projectHref,
  routeNames,
  locales,
  type PageKey,
  type Lang,
} from "@/lib/i18n";
import { getProjects, sanityConfigured } from "@/sanity/content";
import { projects } from "@/content/projects";
import { Home, ProjectPage, ImpactPage } from "@/components/content-blocks";
import {
  ProjectsIndex,
  JoinPage,
  AboutPage,
  DonatePage,
  LegalPage,
} from "@/components/secondary-pages";
import { Header, Footer } from "@/components/site-shell";
import { Consent } from "@/components/interactions";
import { Studio } from "@/components/studio";
import { MotionSurface } from "@/components/motion-surface";

type Props = { params: Promise<{ lang: string; slug?: string[] }> };
type Resolved =
  | { lang: Lang; kind: "studio" }
  | { lang: Lang; kind: "page"; page: PageKey }
  | { lang: Lang; kind: "project"; slug: string };
function resolve(lang: string, slug: string[] = []): Resolved | null {
  if (lang !== "es" && lang !== "en") return null;
  const path = slug.join("/");
  if (lang === "es" && slug[0] === "estudio")
    return { lang, kind: "studio" as const };
  const page = (Object.keys(routeNames) as PageKey[]).find(
    (k) => routeNames[k][lang] === path,
  );
  if (page) return { lang, kind: "page" as const, page };
  if (
    slug.length === 2 &&
    slug[0] === routeNames.projects[lang] &&
    projects.some((p) => p.slug === slug[1])
  )
    return { lang, kind: "project" as const, slug: slug[1] };
  return null;
}
const titles: Record<PageKey, { es: string; en: string }> = {
  home: {
    es: "Reconecta con los saberes ancestrales",
    en: "Reconnect with ancestral wisdom",
  },
  projects: { es: "Proyectos en territorio", en: "Community projects" },
  impact: { es: "Impacto y transparencia", en: "Impact and transparency" },
  join: { es: "Súmate a la comunidad", en: "Get involved" },
  about: { es: "Conócenos", en: "About us" },
  donate: {
    es: "Dona y apoya a las comunidades",
    en: "Donate and support communities",
  },
  privacy: { es: "Privacidad", en: "Privacy" },
  terms: { es: "Condiciones", en: "Terms" },
  cookies: { es: "Cookies", en: "Cookies" },
};
export function generateStaticParams() {
  return locales.flatMap((lang) => [
    ...(Object.keys(routeNames) as PageKey[]).map((key) => ({
      lang,
      slug: routeNames[key][lang] ? [routeNames[key][lang]] : [],
    })),
    ...projects.map((p) => ({
      lang,
      slug: [routeNames.projects[lang], p.slug],
    })),
  ]);
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const r = resolve(lang, slug);
  if (!r)
    return {
      title: "Página no encontrada",
      robots: { index: false, follow: false },
    };
  if (r.kind === "studio")
    return { title: "Administración", robots: { index: false, follow: false } };
  const p =
    r.kind === "project"
      ? (await getProjects()).find((p) => p.slug === r.slug)
      : undefined;
  const title = p
    ? p.title[r.lang]
    : titles[r.kind === "page" ? r.page : "home"][r.lang];
  const description = p
    ? p.subtitle[r.lang]
    : r.lang === "es"
      ? "Impulsamos el bienestar y la soberanía de comunidades indígenas guardianes de la biodiversidad en Colombia. Conoce nuestros proyectos y cómo apoyar."
      : "We support Indigenous communities safeguarding biodiversity in Colombia. Explore our projects and discover how to help.";
  const canonical =
    r.kind === "project" ? projectHref(r.lang, r.slug) : href(r.lang, r.page);
  const alternates = Object.fromEntries(
    locales.map((l) => [
      l,
      r.kind === "project" ? projectHref(l, r.slug) : href(l, r.page),
    ]),
  );
  return {
    title,
    description,
    alternates: { canonical, languages: alternates },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Fundación Alma Arcoíris",
      locale: r.lang === "es" ? "es_CO" : "en_US",
      type: "website",
      images: [
        {
          url: p?.hero || "/images/home-hero.webp",
          width: 1800,
          height: 1200,
          alt: title,
        },
      ],
    },
  };
}
export default async function Page({ params }: Props) {
  const { lang, slug } = await params;
  const r = resolve(lang, slug);
  if (!r) notFound();
  if (r.kind === "studio")
    return sanityConfigured ? (
      <Studio />
    ) : (
      <main className="studio-setup">
        <h1>Sanity está preparado para conectar.</h1>
        <p>
          Falta el identificador del proyecto de la fundación. Configura estas
          variables en .env.local y reinicia el servidor:
        </p>
        <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code>
        <code>NEXT_PUBLIC_SANITY_DATASET</code>
        <p>
          Los modelos editoriales están creados. La web usa mientras tanto el
          contenido revisado de los documentos.
        </p>
        <a href="/es">← Volver al sitio</a>
      </main>
    );
  const content = await getProjects();
  const other: Lang = r.lang === "es" ? "en" : "es";
  const alternate =
    r.kind === "project" ? projectHref(other, r.slug) : href(other, r.page);
  let body: React.ReactNode;
  if (r.kind === "project") {
    const p = content.find((p) => p.slug === r.slug);
    if (!p) notFound();
    body = <ProjectPage lang={r.lang} project={p} />;
  } else
    switch (r.page) {
      case "home":
        body = <Home lang={r.lang} projects={content} />;
        break;
      case "projects":
        body = <ProjectsIndex lang={r.lang} projects={content} />;
        break;
      case "impact":
        body = <ImpactPage lang={r.lang} />;
        break;
      case "join":
        body = <JoinPage lang={r.lang} />;
        break;
      case "about":
        body = <AboutPage lang={r.lang} />;
        break;
      case "donate":
        body = <DonatePage lang={r.lang} />;
        break;
      default:
        body = <LegalPage lang={r.lang} kind={r.page} />;
    }
  return (
    <>
      <Header lang={r.lang} alternate={alternate} />
      <MotionSurface key={`${lang}/${slug?.join("/") ?? ""}`}>
        <main id="contenido">{body}</main>
        <Footer lang={r.lang} />
      </MotionSurface>
      <Consent lang={r.lang} />
    </>
  );
}
