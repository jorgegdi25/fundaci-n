"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, ChevronDown, Heart, Menu, X, Globe } from "lucide-react";
import { href, projectHref, type Lang, type PageKey } from "@/lib/i18n";
const sections: PageKey[] = ["home", "projects", "impact", "join", "about"];
const labels = {
  es: ["Inicio", "Proyectos", "Impacto y transparencia", "Súmate", "Conócenos"],
  en: ["Home", "Projects", "Impact & transparency", "Get involved", "About us"],
};
export function Header({ lang, alternate }: { lang: Lang; alternate: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const es = lang === "es";
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
              priority
            />
          </Link>
          <nav
            aria-label={es ? "Navegación principal" : "Main navigation"}
            className={open ? "nav open" : "nav"}
          >
            {sections.map((key, i) =>
              key === "projects" ? (
                <div className="nav-projects" key={key}>
                  <Link
                    className={
                      pathname.includes(href(lang, key)) ? "active" : ""
                    }
                    href={href(lang, key)}
                    onClick={() => setOpen(false)}
                  >
                    {labels[lang][i]}
                  </Link>
                  <details>
                    <summary
                      aria-label={es ? "Abrir proyectos" : "Show projects"}
                    >
                      <ChevronDown size={13} />
                    </summary>
                    <div className="nav-dropdown">
                      {["el-cairo", "sierra-nevada", "amazonas", "mhuysqa"].map(
                        (p, j) => (
                          <Link
                            key={p}
                            href={projectHref(lang, p)}
                            onClick={() => setOpen(false)}
                          >
                            {
                              [
                                "El Cairo",
                                "Sierra Nevada",
                                es ? "Amazonas" : "Amazon",
                                es ? "Pueblo Mhuysqa" : "Mhuysqa people",
                              ][j]
                            }
                            <ArrowUpRight size={14} />
                          </Link>
                        ),
                      )}
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
              href={alternate}
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
