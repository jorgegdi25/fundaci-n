"use client";

import { useId, useState } from "react";
import { ArrowUpRight, ClipboardList, ExternalLink, Info } from "lucide-react";
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
  const [open, setOpen] = useState(false);

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
            {es ? "Registro de aportantes" : "Contributor registration"}
          </h2>
        </div>
      </div>

      <p className={styles.intro}>
        {testMode
          ? es
            ? "Aquí puedes revisar el formulario oficial de la fundación para el registro de participantes y la declaración de origen de fondos."
            : "You can review the foundation’s official form for participant registration and the declaration of source of funds here."
          : es
            ? "Completa el formulario oficial de la fundación para registrar tus datos y declarar el origen de los fondos de tu aporte."
            : "Complete the foundation’s official form to register your details and declare the source of funds for your gift."}
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
      {provider === "paypal" && (
        <p className={styles.paymentNote}>
          {es
            ? "El formulario todavía no incluye PayPal entre sus medios de pago. Si tu aporte es por PayPal, consulta a la fundación antes de completar ese campo."
            : "The form does not yet list PayPal as a payment method. If you contributed through PayPal, contact the foundation before completing that field."}{" "}
          <a href="mailto:contacto@fundacionalmaarcoiris.org">
            {es ? "Contactar a la fundación" : "Contact the foundation"}
          </a>
        </p>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className="button purple"
          aria-expanded={open}
          aria-controls={frameId}
          onClick={() => setOpen(true)}
          disabled={open}
        >
          {open
            ? es
              ? "Formulario abierto"
              : "Form opened"
            : testMode
              ? es
                ? "Ver formulario oficial"
                : "View official form"
              : es
                ? "Completar mi registro"
                : "Complete my registration"}
          <ArrowUpRight size={20} aria-hidden="true" />
        </button>
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

      <p className={styles.privacy}>
        {es
          ? "El formulario se aloja en Google Forms. Si lo completas y lo envías, tus respuestas se remiten al formulario de la fundación en Google."
          : "This form is hosted on Google Forms. If you complete and submit it, your answers are sent to the foundation’s form on Google."}{" "}
        <a href={href(lang, "privacy")}>
          {es ? "Consultar privacidad" : "Read about privacy"}
        </a>
      </p>

      <div id={frameId}>
        {open && (
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
        )}
      </div>
    </section>
  );
}
