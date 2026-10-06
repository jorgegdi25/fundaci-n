"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  ShieldCheck,
} from "lucide-react";
import { href, projectHref, type Lang, type PageKey } from "@/lib/i18n";
import styles from "./site-footer.module.css";

const pages: { key: PageKey; es: string; en: string }[] = [
  { key: "projects", es: "Nuestros proyectos", en: "Our projects" },
  { key: "impact", es: "Impacto y transparencia", en: "Impact & transparency" },
  {
    key: "join",
    es: "Experiencias y voluntariado",
    en: "Experiences & volunteering",
  },
  { key: "about", es: "Conoce la fundación", en: "About the foundation" },
];

export function Footer({ lang }: { lang: Lang }) {
  const es = lang === "es";
  return (
    <footer className={styles.footer} id="comunidad">
      <div className={styles.inner}>
        <section
          className={styles.newsletter}
          aria-labelledby="community-heading"
        >
          <div className={styles.story} data-reveal>
            <Image
              src="/images/amazonas.webp"
              alt={
                es
                  ? "Niños y voluntarios reunidos durante la Misión Amazonas"
                  : "Children and volunteers together during the Amazon mission"
              }
              width={1100}
              height={733}
              sizes="(max-width: 900px) 100vw, (max-width: 1120px) 38vw, 430px"
              className={styles.storyPhoto}
            />
            <div className={styles.storyCaption}>
              <span>
                <MapPin size={18} aria-hidden="true" />{" "}
                {es ? "Leticia, Amazonas" : "Leticia, Amazon"}
              </span>
              <Link href={projectHref(lang, "amazonas")}>
                {es
                  ? "Cada encuentro deja una historia."
                  : "Every gathering holds a story."}
                <span className={styles.storyArrow}>
                  <ArrowUpRight size={23} aria-hidden="true" />
                </span>
              </Link>
            </div>
          </div>
          <div className={styles.invitation}>
            <span className={styles.eyebrow}>
              <Mail size={20} aria-hidden="true" />
              {es ? "NOTICIAS Y COMUNIDAD" : "NEWS AND COMMUNITY"}
            </span>
            <h2 id="community-heading" data-reveal>
              {es ? (
                <>
                  Haz parte de la gran familia <em>Alma Arcoíris</em> alrededor
                  del mundo.
                </>
              ) : (
                <>
                  Become part of the <em>Alma Arcoíris family</em> around the
                  world.
                </>
              )}
            </h2>
            <p className={styles.intro} data-reveal>
              {es
                ? "Recibe noticias directas sobre nuestras expediciones, caminatas y avances en territorio."
                : "Receive news about our expeditions, walks and progress on the ground."}
            </p>
            <div className={styles.registration}>
              <label htmlFor="community-contact">
                {es ? "Tu correo o WhatsApp" : "Your email or WhatsApp"}
              </label>
              <div className={styles.inputRow}>
                <input
                  id="community-contact"
                  type="text"
                  disabled
                  placeholder={
                    es ? "Tu correo o WhatsApp" : "Your email or WhatsApp"
                  }
                  aria-describedby="community-availability"
                />
                <button type="button" disabled>
                  {es ? "Unirme" : "Join"}
                  <ArrowRight size={21} aria-hidden="true" />
                </button>
              </div>
              <p id="community-availability" className={styles.availability}>
                {es
                  ? "El registro se habilitará próximamente."
                  : "Sign-up will be available soon."}
              </p>
            </div>
            <a
              className={styles.whatsapp}
              href="https://wa.me/573044989707"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={23} aria-hidden="true" />
              <span>
                {es
                  ? "Mientras tanto, conversemos por WhatsApp"
                  : "In the meantime, let’s talk on WhatsApp"}
              </span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
          </div>
        </section>

        <div className={styles.main}>
          <div className={styles.identity} data-reveal>
            <Link
              href={href(lang, "home")}
              aria-label={
                es
                  ? "Fundación Alma Arcoíris · Inicio"
                  : "Fundación Alma Arcoíris · Home"
              }
            >
              <Image
                src="/images/logo-white.webp"
                alt="Fundación Alma Arcoíris"
                width={170}
                height={170}
              />
            </Link>
            <p>
              {es
                ? "Unión consciente, corazón y mente."
                : "Conscious connection, heart and mind."}
            </p>
            <div className={styles.legalIdentity}>
              <ShieldCheck size={21} aria-hidden="true" />
              <span>
                {es ? "Entidad sin ánimo de lucro" : "Nonprofit organisation"}
                <span>NIT 901784588-0 · Colombia</span>
              </span>
            </div>
          </div>

          <nav
            className={styles.column}
            data-reveal
            aria-label={es ? "Explora la fundación" : "Explore the foundation"}
          >
            <h3>{es ? "Explora" : "Explore"}</h3>
            <ul className={styles.linkList}>
              {pages.map((page) => (
                <li key={page.key}>
                  <Link href={href(lang, page.key)}>{page[lang]}</Link>
                </li>
              ))}
            </ul>
            <Link className={styles.donate} href={href(lang, "donate")}>
              <Heart size={19} aria-hidden="true" />
              {es ? "Hacer una donación" : "Make a donation"}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </nav>

          <div className={styles.column} data-reveal>
            <h3>{es ? "Conversemos" : "Get in touch"}</h3>
            <address className={styles.contacts}>
              <a href="mailto:contacto@fundacionalmaarcoiris.org">
                <Mail size={20} aria-hidden="true" />
                <span className={styles.email}>
                  contacto@
                  <wbr />
                  fundacionalmaarcoiris.org
                </span>
              </a>
              <a
                href="https://wa.me/573044989707"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={20} aria-hidden="true" />
                <span>+57 304 498 9707</span>
              </a>
              <a href="mailto:fundacionalmaarcoiris@gmail.com">
                <Mail size={20} aria-hidden="true" />
                <span className={styles.email}>
                  fundacionalmaarcoiris@
                  <wbr />
                  gmail.com
                </span>
              </a>
              <a href="tel:+573178292106">
                <Phone size={20} aria-hidden="true" />
                <span>+57 317 829 2106</span>
              </a>
              <div>
                <MapPin size={20} aria-hidden="true" />
                <span>
                  Carrera 9 A No 21-61, Conjunto Portanova Cs 1. Chía,
                  Cundinamarca
                  <span className={styles.country}>Colombia</span>
                </span>
              </div>
            </address>
          </div>

          <nav
            className={styles.column}
            data-reveal
            aria-label={
              es
                ? "Redes sociales de la fundación"
                : "Foundation social networks"
            }
          >
            <h3>{es ? "Sigamos cerca" : "Stay connected"}</h3>
            <ul className={styles.socials}>
              <li>
                <a
                  href="https://www.instagram.com/almaarcoiris_org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.socialIcon}>
                    <Camera size={20} aria-hidden="true" />
                  </span>
                  <span>Instagram</span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/channel/UCJFXvw5HGwxwfVm_mIjA1cw"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.socialIcon}>
                    <Play size={19} aria-hidden="true" />
                  </span>
                  <span>YouTube</span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/fundacionalmaarcoiris"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.socialIcon} aria-hidden="true">
                    f
                  </span>
                  <span>Facebook</span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className={styles.bottom}>
          <span>© 2026 Fundación Alma Arcoíris</span>
          <nav aria-label={es ? "Información legal" : "Legal information"}>
            <Link href={href(lang, "privacy")}>
              {es ? "Privacidad" : "Privacy"}
            </Link>
            <Link href={href(lang, "terms")}>
              {es ? "Condiciones" : "Terms"}
            </Link>
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new Event("open-cookie-settings"))
              }
            >
              {es ? "Preferencias de cookies" : "Cookie preferences"}
            </button>
          </nav>
        </div>
        <p className={styles.preview}>
          <span aria-hidden="true" />
          {es
            ? "Vista previa · Contenido en revisión · Sin cobros reales"
            : "Preview · Content under review · No real payments"}
        </p>
      </div>
    </footer>
  );
}
