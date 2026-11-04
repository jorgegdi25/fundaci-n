"use client";

import { useEffect, useId, useRef } from "react";
import { CheckCircle2, ClipboardList, ExternalLink, Info } from "lucide-react";
import { href, type Lang } from "@/lib/i18n";
import styles from "./contributor-registration.module.css";

const formUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSf8pNkL8_F_6Bhb4QnWBD2p8jfuSwIrfkLwGYDUgdLbNELT7w/viewform";

export function ContributorRegistration({
  lang,
  provider,
  testMode = true,
  afterPayment = false,
}: {
  lang: Lang;
  provider: "wompi" | "paypal";
  testMode?: boolean;
  afterPayment?: boolean;
}) {
  const es = lang === "es";
  const headingId = useId();
  const frameId = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!afterPayment) return;
    // This component is mounted only after the private API confirms payment.
    // Focus the next step once, without stealing focus on status refreshes.
    heading.current?.focus({ preventScroll: true });
    section.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [afterPayment]);

  return (
    <section
      ref={section}
      id={afterPayment ? "registro-aportante" : undefined}
      className={styles.card}
      aria-labelledby={headingId}
    >
      {afterPayment && (
        <ol
          className={styles.steps}
          aria-label={es ? "Pasos de tu aporte" : "Your gift steps"}
        >
          <li>
            <CheckCircle2 size={22} aria-hidden="true" />
            {es ? "1. Pago aprobado" : "1. Payment approved"}
          </li>
          <li aria-current="step">
            <ClipboardList size={22} aria-hidden="true" />
            {es ? "2. Registro de aportante" : "2. Contributor registration"}
          </li>
        </ol>
      )}
      <div className={styles.heading}>
        <span className={styles.icon} aria-hidden="true">
          <ClipboardList size={28} />
        </span>
        <div>
          <span className={styles.eyebrow}>
            {es ? "TRANSPARENCIA Y REGISTRO" : "TRANSPARENCY AND REGISTRATION"}
          </span>
          <h2
            ref={heading}
            id={headingId}
            tabIndex={afterPayment ? -1 : undefined}
          >
            {es
              ? "Completa el registro de tu aporte"
              : "Complete your gift registration"}
          </h2>
        </div>
      </div>

      <p className={styles.intro}>
        {es
          ? "El siguiente paso es completar el formulario oficial de participantes y declaración de origen de fondos (SARLAFT). Llena todos los campos obligatorios y pulsa «Enviar» al final del formulario."
          : "Next, complete the foundation’s participant registration and declaration of source of funds form (SARLAFT). Fill in all required fields and select “Submit” at the end of the form."}
      </p>

      {testMode && (
        <div className={styles.notice}>
          <Info size={22} aria-hidden="true" />
          <p>
            <strong>
              {es
                ? "Formulario real · Aporte de prueba"
                : "Real form · Test gift"}
            </strong>
            {es
              ? "En Sandbox revisa este paso sin enviar datos reales ni ficticios al registro de la fundación."
              : "In Sandbox, review this step without submitting real or fictitious information to the foundation’s register."}
          </p>
        </div>
      )}

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
          {es
            ? "¿No ves el formulario? Ábrelo en otra pestaña"
            : "Can’t see the form? Open it in another tab"}
          <ExternalLink size={18} aria-hidden="true" />
        </a>
      </div>

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
              loading={afterPayment ? "eager" : "lazy"}
              referrerPolicy="no-referrer"
            />
          </div>
        }
      </div>
      <p className={styles.completion}>
        {es
          ? "El registro se envía con el botón «Enviar» de Google Forms. Abrir esta página no confirma que hayas completado el formulario."
          : "Use the “Submit” button in Google Forms to send your registration. Opening this page does not confirm that the form has been completed."}
      </p>
      <div className={styles.details}>
        <span>{provider === "paypal" ? "PayPal" : "Wompi"}</span>
        <span>{es ? "Formulario en español" : "Form in Spanish"}</span>
      </div>
      <p className={styles.privacy}>
        {es
          ? "Tus respuestas se envían al formulario de la fundación en Google."
          : "Your answers are sent to the foundation’s form on Google."}{" "}
        <a href={href(lang, "privacy")}>
          {es ? "Consultar privacidad" : "Read about privacy"}
        </a>
      </p>
    </section>
  );
}
