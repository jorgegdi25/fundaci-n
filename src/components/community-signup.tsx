"use client";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { href, type Lang } from "@/lib/i18n";
import { validateCommunitySignup } from "@/lib/community";
import styles from "./community-signup.module.css";

export function CommunitySignup({
  lang,
  withName = false,
}: {
  lang: Lang;
  withName?: boolean;
}) {
  const es = lang === "es",
    id = useId();
  const [configured, setConfigured] = useState(false);
  const [contact, setContact] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [invalid, setInvalid] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/community", { cache: "no-store", signal: controller.signal })
      .then((r) => r.json())
      .then((v) => setConfigured(v.configured === true))
      .catch(() => {});
    return () => controller.abort();
  }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      name,
      contact,
      consent,
      lang,
      source: withName ? "donate" : "footer",
    };
    if (!validateCommunitySignup(body)) {
      setInvalid(true);
      return;
    }
    if (!configured || state === "sending") return;
    setInvalid(false);
    setState("sending");
    try {
      const r = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok || data.ok !== true) throw new Error("signup_unavailable");
      setState("done");
      setContact("");
      setName("");
      setConsent(false);
    } catch {
      setState("error");
    }
  }
  return (
    <form onSubmit={submit} className={styles.form}>
      {withName && (
        <div className={styles.field}>
          <label htmlFor={`${id}-name`}>{es ? "Tu Nombre" : "Your Name"}</label>
          <input
            id={`${id}-name`}
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            required
          />
        </div>
      )}
      <div className={styles.field}>
        <label htmlFor={`${id}-contact`}>
          {es ? "Tu correo o WhatsApp" : "Your email or WhatsApp"}
        </label>
        <input
          id={`${id}-contact`}
          type="text"
          value={contact}
          onChange={(e) => {
            setContact(e.target.value);
            setInvalid(false);
          }}
          maxLength={254}
          required
          aria-invalid={invalid}
          aria-describedby={`${id}-status`}
        />
      </div>
      <label className={styles.consent}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
        />
        <span>
          {es ? "Acepto los " : "I accept the "}
          <Link href={href(lang, "terms")}>{es ? "Términos" : "Terms"}</Link>
          {es ? " y " : " and "}
          <Link href={href(lang, "dataPolicy")}>
            {es
              ? "Política de Tratamiento de Datos Personales"
              : "Personal Data Processing Policy"}
          </Link>
          {es
            ? " de la Fundación Alma Arcoíris para el envío de información sobre proyectos, caminatas y eventos por correo o WhatsApp."
            : " of Fundación Alma Arcoíris to receive information about projects, walks and events by email or WhatsApp."}
        </span>
      </label>
      <button type="submit" disabled={!configured || state === "sending"}>
        {state === "sending"
          ? es
            ? "Enviando…"
            : "Sending…"
          : withName
            ? es
              ? "Unirme a la comunidad"
              : "Join the community"
            : es
              ? "Unirme"
              : "Join"}
        <ArrowRight size={20} aria-hidden="true" />
      </button>
      <p className={styles.status} id={`${id}-status`} role="status">
        {invalid
          ? es
            ? "Ingresa un correo válido o un número de WhatsApp con código de país."
            : "Enter a valid email or WhatsApp number with country code."
          : state === "done"
            ? es
              ? "Tu registro se guardó correctamente."
              : "Your sign-up was saved successfully."
            : state === "error" || !configured
              ? es
                ? "El registro no está disponible en este momento."
                : "Sign-up is not available at the moment."
              : ""}
      </p>
    </form>
  );
}
