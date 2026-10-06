"use client";
import Script from "next/script";
import { useEffect, useId, useState } from "react";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { href, type Lang } from "@/lib/i18n";
import type { Frequency } from "@/lib/donations";

type Intent = {
  id: string;
  token: string;
  publicKey?: string;
  checkoutUrl?: string;
  resultPath: string;
  contracts?: { policy: string; personal: string };
  acceptance?: { policy: string; personal: string };
};
type WidgetResult = { payment_source?: { token: string; type: string } };
declare global {
  interface Window {
    WidgetCheckout?: new (config: {
      publicKey: string;
      widgetOperation: "tokenize";
    }) => { open(callback: (result: WidgetResult) => void): void };
  }
}
export async function donationRequest(body: Record<string, unknown>) {
  const response = await fetch("/api/donations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "payments_unavailable");
  return data;
}
export function DonationCheckout({
  lang,
  amount,
  frequency,
  cause,
  close,
}: {
  lang: Lang;
  amount: number;
  frequency: Frequency;
  cause: string;
  close: () => void;
}) {
  const es = lang === "es",
    monthly = frequency === "monthly";
  const inputId = useId();
  const [ready, setReady] = useState<boolean | null>(null);
  const [intent, setIntent] = useState<Intent | null>(null);
  const [email, setEmail] = useState("");
  const [foundation, setFoundation] = useState(false);
  const [authorize, setAuthorize] = useState(false);
  const [policy, setPolicy] = useState(false);
  const [personal, setPersonal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/donations", { signal: controller.signal, cache: "no-store" })
      .then((res) => res.json())
      .then((data) =>
        setReady(data.environment === "sandbox" && data.configured === true),
      )
      .catch(() => {
        if (!controller.signal.aborted) setReady(false);
      });
    return () => controller.abort();
  }, []);
  const showError = (e: unknown) => {
    const pending = e instanceof Error && e.message === "confirmation_pending";
    setError(
      pending
        ? es
          ? "Wompi todavía no confirmó el resultado. Revisa el estado de tu aporte antes de volver a intentarlo."
          : "Wompi has not confirmed the result. Check your gift status before trying again."
        : es
          ? "No pudimos continuar. Inténtalo más tarde o contacta a la fundación."
          : "We could not continue. Try again later or contact the foundation.",
    );
    setBusy(false);
  };
  async function prepare(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const created: Intent = await donationRequest({
        amount,
        frequency,
        cause,
        lang,
        agreeFoundation: foundation,
      });
      if (!monthly) {
        const url = new URL(created.checkoutUrl!);
        if (url.origin !== "https://checkout.wompi.co")
          throw new Error("invalid_checkout");
        window.location.assign(url.href);
        return;
      }
      sessionStorage.setItem(`alma-gift-${created.id}`, created.token);
      setIntent(created);
      setBusy(false);
    } catch (e) {
      showError(e);
    }
  }
  function openAuthorization(e: React.FormEvent) {
    e.preventDefault();
    if (
      !intent?.publicKey ||
      !window.WidgetCheckout ||
      !authorize ||
      !policy ||
      !personal ||
      !foundation
    )
      return;
    setError("");
    close();
    const checkout = new window.WidgetCheckout({
      publicKey: intent.publicKey,
      widgetOperation: "tokenize",
    });
    checkout.open(async (result) => {
      if (!result.payment_source) return;
      setBusy(true);
      try {
        await donationRequest({
          action: "authorize",
          id: intent.id,
          email,
          paymentToken: result.payment_source.token,
          paymentType: result.payment_source.type,
          policyToken: intent.acceptance!.policy,
          personalToken: intent.acceptance!.personal,
          agreeMonthly: authorize,
          agreePolicy: policy,
          agreePersonal: personal,
          agreeFoundation: foundation,
        });
      } catch {
        /* The result page also handles pending or uncertain provider replies. */
      }
      window.location.assign(intent.resultPath);
    });
  }
  if (ready === null)
    return (
      <p role="status">
        {es ? "Comprobando las opciones de pago…" : "Checking payment options…"}
      </p>
    );
  if (!ready)
    return (
      <>
        <p>
          {es
            ? "Estamos habilitando las donaciones en línea. No se ha realizado ningún cobro."
            : "We are preparing online donations. No payment has been made."}
        </p>
        <a
          className="button purple full"
          href="mailto:contacto@fundacionalmaarcoiris.org"
        >
          {es ? "Contactar a la fundación" : "Contact the foundation"}
          <ArrowUpRight size={18} />
        </a>
      </>
    );
  return (
    <div className="checkout-content">
      <p className="sandbox-notice">
        <LockKeyhole size={18} />
        {es
          ? "Modo de pruebas · No se cobra dinero real. Usa únicamente datos de prueba."
          : "Test mode · No real money is charged. Use test data only."}
      </p>
      <form onSubmit={intent ? openAuthorization : prepare}>
        {monthly && (
          <div className="field">
            <label htmlFor={inputId}>
              {es
                ? "Correo para tu aporte mensual"
                : "Email for your monthly gift"}
            </label>
            <input
              id={inputId}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
            />
          </div>
        )}
        <label className="checkout-consent">
          <input
            type="checkbox"
            required
            checked={foundation}
            onChange={(e) => setFoundation(e.target.checked)}
          />{" "}
          <span>
            {es ? "He leído las " : "I have read the "}
            <a href={href(lang, "terms")} target="_blank" rel="noopener">
              {es ? "condiciones de donación" : "donation terms"}
            </a>
            {es ? " y la " : " and "}
            <a href={href(lang, "privacy")} target="_blank" rel="noopener">
              {es ? "política de privacidad" : "privacy policy"}
            </a>
            .
          </span>
        </label>
        {monthly && (
          <label className="checkout-consent">
            <input
              type="checkbox"
              required
              checked={authorize}
              onChange={(e) => setAuthorize(e.target.checked)}
            />
            <span>
              {es
                ? `Autorizo un aporte de prueba de $${new Intl.NumberFormat("es-CO").format(amount)} COP ahora y cada mes, hasta que lo cancele. Recibiré un enlace para gestionar mi aporte.`
                : `I authorize a test gift of COP ${new Intl.NumberFormat("en-US").format(amount)} now and each month until I cancel. I will receive a link to manage my gift.`}
            </span>
          </label>
        )}
        {intent?.contracts && (
          <>
            <label className="checkout-consent">
              <input
                type="checkbox"
                required
                checked={policy}
                onChange={(e) => setPolicy(e.target.checked)}
              />
              <span>
                {es ? "Acepto los " : "I accept Wompi’s "}
                <a
                  href={intent.contracts.policy}
                  target="_blank"
                  rel="noopener"
                >
                  {es ? "términos de Wompi" : "terms"}
                </a>
                .
              </span>
            </label>
            <label className="checkout-consent">
              <input
                type="checkbox"
                required
                checked={personal}
                onChange={(e) => setPersonal(e.target.checked)}
              />
              <span>
                {es ? "Acepto la " : "I accept Wompi’s "}
                <a
                  href={intent.contracts.personal}
                  target="_blank"
                  rel="noopener"
                >
                  {es
                    ? "autorización de tratamiento de datos de Wompi"
                    : "personal data authorization"}
                </a>
                .
              </span>
            </label>
            <Script
              src="https://checkout.wompi.co/widget.js"
              strategy="afterInteractive"
              onReady={() => setScriptReady(true)}
              onError={() =>
                setError(
                  es
                    ? "No se pudo cargar Wompi. Inténtalo más tarde."
                    : "Wompi could not load. Try again later.",
                )
              }
            />
          </>
        )}
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
        <button
          className="button purple full"
          disabled={busy || Boolean(intent && !scriptReady)}
          type="submit"
        >
          {busy
            ? es
              ? "Preparando…"
              : "Preparing…"
            : intent
              ? es
                ? "Autorizar con Wompi"
                : "Authorize with Wompi"
              : monthly
                ? es
                  ? "Preparar mi aporte mensual"
                  : "Prepare my monthly gift"
                : es
                  ? "Continuar con Wompi"
                  : "Continue with Wompi"}
          <ArrowUpRight size={18} />
        </button>
      </form>
      {intent && (
        <a className="checkout-status-link" href={intent.resultPath}>
          {es ? "Revisar el estado de este aporte" : "Check this gift’s status"}
        </a>
      )}
    </div>
  );
}
