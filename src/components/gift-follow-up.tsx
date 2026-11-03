"use client";

import { useId, useState } from "react";
import { Copy, Mail, MessageCircle } from "lucide-react";
import { href, type Lang } from "@/lib/i18n";
import { ContributorRegistration } from "./contributor-registration";
import { CommunitySignup } from "./community-signup";
import { MonthlyCancellationNotice } from "./monthly-cancellation-notice";

export function PersonalManagementLink({
  lang,
  url,
  manage,
  testMode,
}: {
  lang: Lang;
  url: string;
  manage: boolean;
  testMode: boolean;
}) {
  const es = lang === "es";
  const id = useId();
  const [message, setMessage] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setMessage(
        es
          ? "Enlace copiado. Guárdalo en un lugar privado."
          : "Link copied. Save it somewhere private.",
      );
    } catch {
      setMessage(
        es
          ? "Selecciona y copia el enlace del campo."
          : "Select and copy the link from the field.",
      );
    }
  }
  return (
    <section className="management-link">
      <h2>
        {es ? "Tu enlace personal de gestión" : "Your personal management link"}
      </h2>
      <p>
        {manage
          ? es
            ? "Ya estás en tu página de gestión. Aquí puedes consultar el estado y cancelar los próximos aportes. Guarda el enlace para volver."
            : "You are on your management page. Here you can check the status and cancel future gifts. Save the link to return."
          : es
            ? "Guarda este enlace para consultar o cancelar tu aporte mensual. Es personal: no lo compartas."
            : "Save this link to check or cancel your monthly gift. It is personal: do not share it."}
      </p>
      <MonthlyCancellationNotice lang={lang} testMode={testMode} />
      <label htmlFor={id}>{es ? "Enlace privado" : "Private link"}</label>
      <input
        id={id}
        readOnly
        value={url}
        onFocus={(event) => event.currentTarget.select()}
        autoComplete="off"
        spellCheck={false}
      />
      <div className="button-row">
        <button className="button outline" type="button" onClick={copy}>
          <Copy size={18} />
          {es ? "Copiar y guardar enlace" : "Copy and save link"}
        </button>
        {!manage && (
          <a className="text-link" href={url}>
            {es ? "Abrir gestión del aporte" : "Open gift management"}
          </a>
        )}
      </div>
      <p role="status">{message}</p>
    </section>
  );
}

export function GiftSupport({ lang }: { lang: Lang }) {
  const es = lang === "es";
  return (
    <div className="gift-support">
      <h2>{es ? "Estamos para ayudarte" : "We are here to help"}</h2>
      <div className="button-row">
        <a
          className="button outline"
          href="https://wa.me/573044989707"
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={19} />
          WhatsApp · +57 304 498 9707
        </a>
        <a
          className="button outline"
          href="mailto:contacto@fundacionalmaarcoiris.org"
        >
          <Mail size={19} />
          {es ? "Escribir por correo" : "Send an email"}
        </a>
      </div>
    </div>
  );
}

// Only mount after the provider status has been verified by the private API.
export function ApprovedGiftFollowUp({
  lang,
  provider,
  testMode,
}: {
  lang: Lang;
  provider: "wompi" | "paypal";
  testMode: boolean;
}) {
  const es = lang === "es";
  const [shareMessage, setShareMessage] = useState("");
  const donationUrl = `https://fundacionalmaarcoiris.org${href(lang, "donate")}`;
  const text = testMode
    ? es
      ? "Conoce los proyectos de Fundación Alma Arcoíris para proteger la sabiduría ancestral y la biodiversidad en Colombia."
      : "Discover Fundación Alma Arcoíris projects protecting ancestral wisdom and biodiversity in Colombia."
    : es
      ? "Acabo de donar para proteger la sabiduría ancestral y la biodiversidad en Colombia junto a @fundacionalmaarcoiris. ¡Súmate tú también a la causa!"
      : "I just donated to help protect ancestral wisdom and biodiversity in Colombia with @fundacionalmaarcoiris. Join the cause!";
  async function share() {
    try {
      if (navigator.share)
        await navigator.share({
          title: "Fundación Alma Arcoíris",
          text,
          url: donationUrl,
        });
      else {
        await navigator.clipboard.writeText(`${text} ${donationUrl}`);
        setShareMessage(es ? "Invitación copiada." : "Invitation copied.");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setShareMessage(
        es
          ? "Puedes compartir la dirección fundacionalmaarcoiris.org."
          : "You can share the address fundacionalmaarcoiris.org.",
      );
    }
  }
  return (
    <div className="approved-gift-follow-up">
      <section className="gift-certificate">
        <h2>
          {es
            ? "Sobre tu certificado de donación"
            : "About your donation certificate"}
        </h2>
        <p>
          {testMode
            ? es
              ? "Este aporte es una prueba y no genera certificado tributario."
              : "This gift is a test and does not generate a tax certificate."
            : es
              ? "Si solicitaste un certificado tributario, será emitido a tu correo a nombre de Fundación Alma Arcoíris (NIT 901784588-0), a más tardar en enero del año siguiente a tu donación, conforme a la política de la fundación."
              : "If you requested a tax certificate, it will be issued by email in the name of Fundación Alma Arcoíris (NIT 901784588-0), no later than January of the year following your donation, under the foundation’s policy."}
        </p>
        <a href="mailto:certificados@fundacionalmaarcoiris.org">
          certificados@fundacionalmaarcoiris.org
        </a>
      </section>
      <ContributorRegistration
        lang={lang}
        provider={provider}
        testMode={testMode}
      />
      <section className="gift-community">
        <h2>
          {es
            ? "La transformación no termina aquí. ¡Súmate a la tribu!"
            : "The transformation continues. Join the community!"}
        </h2>
        <p>
          {es
            ? "Queremos mantenerte cerca. Entérate de primera mano cómo se ejecuta tu aporte en el territorio, asiste a nuestras caminatas conscientes o participa en espacios de conexión con los saberes ancestrales."
            : "Stay close to our work. Learn how gifts are used in the communities, join mindful walks or take part in gatherings with ancestral knowledge keepers."}
        </p>
        <CommunitySignup lang={lang} withName />
        <div className="button-row">
          <a
            className="button outline"
            href={`https://wa.me/573044989707?text=${encodeURIComponent("Quiero unirme al Círculo Femenino de Integración Sagrada (EFIS)")}`}
            target="_blank"
            rel="noreferrer"
          >
            {es ? "Solicitar acceso a EFIS" : "Request access to EFIS"}
          </a>
          <a
            className="button outline"
            href={`https://wa.me/573044989707?text=${encodeURIComponent("Quiero unirme a la Hermandad del Cóndor")}`}
            target="_blank"
            rel="noreferrer"
          >
            {es
              ? "Solicitar acceso a la Hermandad"
              : "Request access to the Brotherhood"}
          </a>
        </div>
      </section>
      <section className="gift-share">
        <h2>
          {es
            ? "Invita a un amigo a sembrar esta semilla."
            : "Invite a friend to plant this seed."}
        </h2>
        <div className="button-row">
          <a
            className="button outline"
            href={`https://wa.me/?text=${encodeURIComponent(`${text} ${donationUrl}`)}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          <a
            className="button outline"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(donationUrl)}`}
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>
          <a
            className="button outline"
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(donationUrl)}`}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <button className="button outline" type="button" onClick={share}>
            {es ? "Compartir invitación" : "Share invitation"}
          </button>
        </div>
        <p role="status">{shareMessage}</p>
        <p>
          <a
            href="https://www.youtube.com/@FundacionAlmaArcoiris"
            target="_blank"
            rel="noreferrer"
          >
            YouTube ↗
          </a>{" "}
          ·{" "}
          <a
            href="https://www.instagram.com/almaarcoiris_org"
            target="_blank"
            rel="noreferrer"
          >
            Instagram ↗
          </a>
        </p>
      </section>
    </div>
  );
}
