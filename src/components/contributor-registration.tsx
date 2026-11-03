"use client";

import { useId } from "react";
import { ClipboardList, ExternalLink, Info } from "lucide-react";
import { href, type Lang } from "@/lib/i18n";
import styles from "./contributor-registration.module.css";

const formUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSf8pNkL8_F_6Bhb4QnWBD2p8jfuSwIrfkLwGYDUgdLbNELT7w/viewform";

export function ContributorRegistration({
  lang,
  provider,
  testMode = true,
}: {
  lang: Lang;
  provider: "wompi" | "paypal";
  testMode?: boolean;
}) {
  const es = lang === "es";
  const headingId = useId();
  const frameId = useId();

  return (
    <section className={styles.card} aria-labelledby={headingId}>
      <div className={styles.heading}>
        <span className={styles.icon} aria-hidden="true">
          <ClipboardList size={28} />
        </span>
        <div>
          <span className={styles.eyebrow}>
            {es ? "TRANSPARENCIA Y REGISTRO" : "TRANSPARENCY AND REGISTRATION"}
          </span>
          <h2 id={headingId}>
            {es
              ? "Un último paso importante para la transparencia"
              : "One last important step for transparency"}
          </h2>
        </div>
      </div>

      <p className={styles.intro}>
        {testMode
          ? es
            ? "Aquí puedes revisar el formulario oficial de la fundación para el registro de participantes y la declaración de origen de fondos."
            : "You can review the foundation’s official form for participant registration and the declaration of source of funds here."
          : es
            ? "Para registrar tu aporte y tramitar tu certificado, si lo solicitaste, la fundación requiere que completes este formulario de registro de participantes y declaración de origen de fondos (SARLAFT)."
            : "To register your gift and process a certificate, if requested, the foundation requires you to complete this participant registration and declaration of source of funds form (SARLAFT)."}
      </p>

      {testMode && (
        <div className={styles.notice}>
          <Info size={22} aria-hidden="true" />
          <p>
            <strong>
              {es ? "Vista previa · Aporte de prueba" : "Preview · Test gift"}
            </strong>
            {es
              ? "Puedes revisar el formulario, pero no lo rellenes ni envíes datos reales durante esta prueba."
              : "You can review the form, but do not fill it in or submit real information during this test."}
          </p>
        </div>
      )}

      <div className={styles.details}>
        <span>{es ? "Formulario de la fundación" : "Foundation’s form"}</span>
        <span>{es ? "Disponible en español" : "Available in Spanish"}</span>
      </div>
      <p className={styles.paymentNote}>
        {es ? "Medio de pago: " : "Payment method: "}
        {provider === "paypal" ? "PayPal" : "Wompi"}
      </p>
      {!es && (
        <p className={styles.paymentNote}>
          The foundation’s form is currently available in Spanish. Contact us if
          you need help completing it in English.
        </p>
      )}
      <div className={styles.actions}>
        <a
          className={styles.external}
          href={formUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {es ? "Abrir en otra pestaña" : "Open in another tab"}
          <ExternalLink size={18} aria-hidden="true" />
        </a>
      </div>

      <p className={styles.paymentNote}>
        <a href="mailto:certificados@fundacionalmaarcoiris.org">
          {es
            ? "Solicitar certificado de donación"
            : "Request a donation certificate"}
        </a>
        {testMode &&
          (es
            ? " · En Sandbox no se emiten certificados tributarios."
            : " · Sandbox gifts do not receive tax certificates.")}
      </p>

      <p className={styles.privacy}>
        {es
          ? "El formulario se aloja en Google Forms. Si lo completas y lo envías, tus respuestas se remiten al formulario de la fundación en Google."
          : "This form is hosted on Google Forms. If you complete and submit it, your answers are sent to the foundation’s form on Google."}{" "}
        <a href={href(lang, "privacy")}>
          {es ? "Consultar privacidad" : "Read about privacy"}
        </a>
      </p>

      <div id={frameId}>
        {
          <div className={styles.frame}>
            <iframe
              src={`${formUrl}?embedded=true`}
              title={
                es
                  ? "Registro de participantes y declaración de origen de fondos de Fundación Alma Arcoíris (en español)"
                  : "Fundación Alma Arcoíris participant registration and declaration of source of funds (in Spanish)"
              }
              lang="es"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        }
      </div>
    </section>
  );
}
