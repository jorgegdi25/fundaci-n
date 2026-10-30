import Image from "next/image";
import { ArrowUpRight, Heart, LockKeyhole, ShieldCheck } from "lucide-react";
import { legacyDonationUrl } from "@/lib/donation-channel";
import { href, type Lang } from "@/lib/i18n";
import styles from "./legacy-donation.module.css";
import { ContributorRegistration } from "./contributor-registration";

export function LegacyDonationCard({
  lang,
  compact = false,
}: {
  lang: Lang;
  compact?: boolean;
}) {
  const es = lang === "es";
  return (
    <div
      className={`donation-card ${compact ? "compact" : ""} ${styles.card}`}
      id="donar-formulario"
    >
      <span className="icon-disc">
        <Heart size={25} aria-hidden="true" />
      </span>
      <span className="eyebrow">
        {es ? "TU APOYO TRANSFORMA" : "YOUR SUPPORT MATTERS"}
      </span>
      <h3>{es ? "Haz tu aporte en Wompi" : "Make your gift through Wompi"}</h3>
      <p>
        {es
          ? "Elige el valor y completa tu donación en la plataforma de pago de la fundación."
          : "Choose the amount and complete your donation on the foundation’s payment platform."}
      </p>
      <div className={styles.method}>
        <LockKeyhole size={21} aria-hidden="true" />
        <span>
          {es
            ? "Donación única · Pago en Wompi"
            : "One-time gift · Wompi payment"}
        </span>
      </div>
      <a className="button gold full" href={legacyDonationUrl}>
        {es ? "Continuar con Wompi" : "Continue to Wompi"}
        <ArrowUpRight size={21} aria-hidden="true" />
      </a>
      <p className={styles.note}>
        {es
          ? "Abrirás el enlace de donación que la fundación utilizaba en su página anterior."
          : "This opens the donation link used on the foundation’s previous website."}
      </p>
      <a className="text-link" href={href(lang, "impact")}>
        {es ? "Impacto y transparencia" : "Impact and transparency"}
        <ArrowUpRight size={18} aria-hidden="true" />
      </a>
    </div>
  );
}

export function LegacyDonationPage({ lang }: { lang: Lang }) {
  const es = lang === "es";
  return (
    <section className={styles.page} aria-labelledby="legacy-donation-title">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <div className={styles.identity}>
            <ShieldCheck size={26} aria-hidden="true" />
            <span>
              Fundación Alma Arcoíris Colombia
              <br />
              NIT 901784588-0
            </span>
          </div>
          <span className="eyebrow">
            {es ? "CADA APORTE SUMA" : "EVERY GIFT COUNTS"}
          </span>
          <h1 id="legacy-donation-title">
            {es
              ? "Apoya a la Fundación Alma Arcoíris."
              : "Support Fundación Alma Arcoíris."}
          </h1>
          <p>
            {es
              ? "Con tu aporte estás apoyando a que los proyectos gestionados por la fundación sean de doble vía: apoyo a comunidades ancestrales y sana expansión de la consciencia en Colombia. Gracias por ser parte."
              : "Your gift supports the foundation’s projects in two ways: supporting ancestral communities and the healthy expansion of consciousness in Colombia. Thank you for being part of it."}
          </p>
          <figure className={styles.photo}>
            <Image
              src="/images/misiones.webp"
              alt={
                es
                  ? "Participantes de las misiones de la Fundación Alma Arcoíris"
                  : "Participants in Fundación Alma Arcoíris missions"
              }
              width={1100}
              height={733}
              sizes="(max-width: 800px) 90vw, 620px"
            />
          </figure>
        </div>
        <LegacyDonationCard lang={lang} />
      </div>
    </section>
  );
}

export function LegacyDonationReturn({
  lang,
  testMode,
}: {
  lang: Lang;
  testMode: boolean;
}) {
  const es = lang === "es";
  return (
    <main id="contenido" className={`section ${styles.returnPage}`}>
      <span className="eyebrow">Fundación Alma Arcoíris</span>
      <h1>{es ? "Registro de tu aporte" : "Register your gift"}</h1>
      <p>
        {es
          ? "Si Wompi confirmó que tu pago fue aprobado, puedes completar el registro de aportantes de la fundación."
          : "If Wompi confirmed that your payment was approved, you can complete the foundation’s contributor registration."}
      </p>
      <div className={styles.returnNotice}>
        <ShieldCheck size={24} aria-hidden="true" />
        <p>
          {es
            ? "Consulta el resultado de tu pago en Wompi. El regreso a esta página no confirma que el pago haya sido aprobado ni genera un certificado automáticamente."
            : "Check your payment result in Wompi. Returning to this page does not confirm that the payment was approved or automatically issue a certificate."}
        </p>
      </div>
      <ContributorRegistration
        lang={lang}
        provider="wompi"
        testMode={testMode}
      />
      <a className="text-link" href={href(lang, "home")}>
        {es ? "Volver al inicio" : "Back to home"}
        <ArrowUpRight size={18} aria-hidden="true" />
      </a>
    </main>
  );
}
