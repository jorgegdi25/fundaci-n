"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Heart, Menu, X, Globe } from "lucide-react";
import { href, projectHref, type Lang, type PageKey } from "@/lib/i18n";
const sections: PageKey[] = ["home", "projects", "impact", "join", "about"];
const labels = {
  es: ["Inicio", "Proyectos", "Impacto y transparencia", "Súmate", "Conócenos"],
  en: ["Home", "Projects", "Impact & transparency", "Get involved", "About us"],
};
function submenu(lang: Lang, key: PageKey) {
  const es = lang === "es";
  if (key === "projects")
    return [
      [
        projectHref(lang, "el-cairo"),
        es ? "Reconstrucción en El Cairo" : "Rebuilding El Cairo",
      ],
      [
        projectHref(lang, "sierra-nevada"),
        es
          ? "Sierra Nevada · Comunidad Kogui"
          : "Sierra Nevada · Kogui community",
      ],
      [
        projectHref(lang, "amazonas"),
        es ? "Amazonas · Comunidad Tikuna" : "Amazon · Tikuna community",
      ],
      [
        projectHref(lang, "mhuysqa"),
        es ? "Resurgimiento del pueblo Mhuysqa" : "Mhuysqa renewal",
      ],
    ];
  const items =
    key === "impact"
      ? [
          [
            "trayectoria",
            es ? "Trayectoria y proyectos" : "Our work and projects",
          ],
          ["cuentas", es ? "Estados financieros" : "Financial statements"],
          [
            "memorias",
            es ? "Memorias y certificación legal" : "Reports and legal records",
          ],
        ]
      : key === "join"
        ? [
            ["caminatas", es ? "Caminatas conscientes" : "Mindful walks"],
            [
              "expediciones",
              es
                ? "Voluntariado y expediciones"
                : "Volunteering and expeditions",
            ],
            ["circulos", es ? "Círculos de comunidad" : "Community circles"],
            [
              "encuentros",
              es ? "Eventos, foros y mingas" : "Events, forums and mingas",
            ],
          ]
        : key === "about"
          ? [
              ["raiz", es ? "Nuestra raíz" : "Our roots"],
              [
                "sabedores",
                es
                  ? "Sabedores y etnoeducadores"
                  : "Knowledge keepers and educators",
              ],
              ["equipo", es ? "Liderazgo y equipo" : "Leadership and team"],
              [
                "alianzas",
                es ? "Alianzas y patrocinios" : "Partnerships and support",
              ],
            ]
          : [];
  return items.map(([anchor, label]) => [
    `${href(lang, key)}#${anchor}`,
    label,
  ]);
}
export function Header({
  lang,
  alternate,
  preserveFragment = false,
}: {
  lang: Lang;
  alternate: string;
  preserveFragment?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const navigation = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const es = lang === "es";
  const [fragment, setFragment] = useState("");
  useEffect(() => {
    if (preserveFragment) setFragment(window.location.hash);
  }, [preserveFragment]);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !navigation.current?.contains(event.target)
      ) {
        navigation.current
          ?.querySelectorAll("details[open]")
          .forEach((menu) => {
            (menu as HTMLDetailsElement).open = false;
          });
      }
    };
    document.addEventListener("pointerdown", closeOutside, { passive: true });
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);
  return (
    <>
      <a href="#contenido" className="skip-link">
        {es ? "Saltar al contenido" : "Skip to content"}
      </a>
      <div className="header-wrap">
        <div className="announcement">
          <span>
            <span className="announcement-label">
              {es ? "JUNTOS POR EL CAIRO" : "TOGETHER FOR EL CAIRO"}
            </span>
            <span className="announcement-copy">
              {es
                ? "Ayudemos a las familias afectadas por el terremoto."
                : "Support families affected by the earthquake."}
            </span>
          </span>
          <Link href={projectHref(lang, "el-cairo")}>
            {es ? "Apoyar emergencia" : "Support the response"}
            <ArrowUpRight size={14} />
          </Link>
        </div>
        <header className="header">
          <Link
            href={href(lang, "home")}
            className="brand"
            aria-label={
              es
                ? "Fundación Alma Arcoíris · Inicio"
                : "Fundación Alma Arcoíris · Home"
            }
          >
            <Image
              src="/images/logo.webp"
              alt="Fundación Alma Arcoíris"
              width={88}
              height={94}
              preload
            />
          </Link>
          <nav
            ref={navigation}
            aria-label={es ? "Navegación principal" : "Main navigation"}
            className={open ? "nav open" : "nav"}
            onKeyDown={(event) => {
              if (event.key !== "Escape") return;
              const menu =
                navigation.current?.querySelector<HTMLDetailsElement>(
                  "details[open]",
                );
              if (menu) {
                menu.open = false;
                menu.querySelector("summary")?.focus();
              } else setOpen(false);
            }}
          >
            {sections.map((key, i) =>
              key !== "home" ? (
                <div className="nav-projects" key={key}>
                  <Link
                    className={
                      pathname.startsWith(href(lang, key)) ? "active" : ""
                    }
                    href={href(lang, key)}
                    onClick={() => setOpen(false)}
                  >
                    {labels[lang][i]}
                  </Link>
                  {/* Keep a native submenu opened by the visitor before hydration. */}
                  <details name="main-navigation" suppressHydrationWarning>
                    <summary
                      aria-label={`${es ? "Abrir submenú de" : "Show submenu for"} ${labels[lang][i]}`}
                    >
                      <ChevronDown size={13} />
                    </summary>
                    <div className="nav-dropdown">
                      {submenu(lang, key).map(([url, label]) => (
                        <Link
                          key={url}
                          href={url}
                          onClick={(e) => {
                            setOpen(false);
                            const menu = e.currentTarget.closest("details");
                            if (menu) menu.open = false;
                          }}
                        >
                          {label}
                          <ArrowUpRight size={14} />
                        </Link>
                      ))}
                    </div>
                  </details>
                </div>
              ) : (
                <Link
                  key={key}
                  href={href(lang, key)}
                  onClick={() => setOpen(false)}
                  className={pathname === href(lang, key) ? "active" : ""}
                >
                  {labels[lang][i]}
                </Link>
              ),
            )}
          </nav>
          <div className="header-actions">
            <Link
              href={`${alternate}${fragment}`}
              className="language"
              aria-label={es ? "Read in English" : "Leer en español"}
            >
              <Globe size={15} />
              {es ? "EN" : "ES"}
            </Link>
            <Link
              className="button gold header-donate"
              href={href(lang, "donate")}
            >
              <Heart size={15} />
              {es ? "Donar" : "Donate"}
            </Link>
            <button
              className="icon-button menu-button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={es ? "Abrir menú" : "Open menu"}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </header>
      </div>
    </>
  );
}
export { Footer } from "./site-footer";
