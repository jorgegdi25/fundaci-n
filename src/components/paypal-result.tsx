"use client";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Heart, RefreshCw } from "lucide-react";
import { paypalRequest } from "@/lib/paypal-client";
import { href, type Lang } from "@/lib/i18n";
type Gift = {
  id: string;
  amount: number;
  currency: string;
  frequency: string;
  cause: string;
  status: string;
  subscriptionState: string;
  nextCharge: string | null;
  cancelled: boolean;
};
export function PayPalResult({
  lang,
  donation,
  manage = false,
}: {
  lang: Lang;
  donation?: string;
  manage?: boolean;
}) {
  const es = lang === "es";
  const [identity, setIdentity] = useState<{
      id: string;
      access?: string;
    } | null>(null),
    [gift, setGift] = useState<Gift | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [link, setLink] = useState(""),
    [cancelReview, setCancelReview] = useState(false);
  useEffect(() => {
    const [id, access] = manage
      ? window.location.hash.slice(1).split(".")
      : [
          donation,
          donation ? sessionStorage.getItem(`alma-paypal-${donation}`) : null,
        ];
    if (id) {
      setIdentity({ id, ...(access ? { access } : {}) });
      if (access)
        setLink(
          `${window.location.origin}/${lang}/paypal/manage#${id}.${access}`,
        );
    } else
      setError(
        es
          ? "Abre tu enlace personal de gestión del aporte."
          : "Open your personal gift management link.",
      );
  }, [donation, manage, lang, es]);
  const refresh = useCallback(async () => {
    if (!identity) return;
    setBusy(true);
    setError("");
    try {
      setGift(await paypalRequest({ action: "status", ...identity }));
    } catch {
      setError(
        es
          ? "No pudimos confirmar el estado. Inténtalo más tarde o contacta a la fundación."
          : "We could not confirm the status. Try later or contact the foundation.",
      );
    } finally {
      setBusy(false);
    }
  }, [identity, es]);
  useEffect(() => {
    if (identity) void refresh();
  }, [identity, refresh]);
  async function cancel() {
    if (!identity) return;
    setBusy(true);
    setError("");
    try {
      setGift(await paypalRequest({ action: "cancel", ...identity }));
      setCancelReview(false);
    } catch {
      setError(
        es
          ? "PayPal aún no confirmó la cancelación. Consulta el estado antes de volver a intentarlo."
          : "PayPal has not confirmed cancellation yet. Check the status before retrying.",
      );
    } finally {
      setBusy(false);
    }
  }
  const paid = gift?.status === "COMPLETED";
  const labels: Record<string, string> = {
    general: es ? "Donde más se necesite" : "Where it is needed most",
    "el-cairo": "El Cairo",
    "sierra-nevada": "Sierra Nevada",
    amazonas: es ? "Amazonas" : "Amazon",
    mhuysqa: es ? "Pueblo Mhuysqa" : "Mhuysqa people",
  };
  return (
    <main id="contenido" className="payment-result-page section-pad">
      <div className="payment-result-card">
        <span className="icon-disc">{paid ? <CheckCircle2 /> : <Heart />}</span>
        <span className="eyebrow">
          {es ? "TU APORTE · PAYPAL" : "YOUR GIFT · PAYPAL"}
        </span>
        <h1>
          {gift?.cancelled
            ? es
              ? "Tu aporte mensual está cancelado."
              : "Your monthly gift is cancelled."
            : paid
              ? es
                ? "Tu aporte de prueba fue confirmado."
                : "Your test gift was confirmed."
              : gift?.subscriptionState === "ACTIVE"
                ? es
                  ? "Tu aporte mensual está autorizado."
                  : "Your monthly gift is authorized."
                : es
                  ? "Revisemos el estado de tu aporte."
                  : "Check your gift status."}
        </h1>
        <p className="sandbox-notice">
          {es
            ? "Modo de pruebas. No se ha movido dinero real."
            : "Test mode. No real money has moved."}
        </p>
        {gift && (
          <>
            <dl className="gift-summary">
              <div>
                <dt>{es ? "Proyecto" : "Project"}</dt>
                <dd>{labels[gift.cause]}</dd>
              </div>
              <div>
                <dt>{es ? "Aporte" : "Gift"}</dt>
                <dd>
                  {new Intl.NumberFormat(es ? "es-CO" : "en-US", {
                    style: "currency",
                    currency: gift.currency,
                  }).format(gift.amount / 100)}{" "}
                  {gift.currency}
                  {gift.frequency === "monthly"
                    ? es
                      ? " / mes"
                      : " / month"
                    : ""}
                </dd>
              </div>
            </dl>
            {!paid && !gift.cancelled && (
              <p>
                {gift.status === "REVIEW"
                  ? es
                    ? "Este aporte requiere revisión por una notificación de devolución o reversión. Contacta a la fundación."
                    : "This gift needs review following a refund or reversal notification. Contact the foundation."
                  : ["REFUNDED", "PARTIALLY_REFUNDED", "REVERSED"].includes(
                        gift.status,
                      )
                    ? es
                      ? "PayPal informó una devolución o reversión de este aporte."
                      : "PayPal reported a refund or reversal for this gift."
                    : es
                      ? "Todavía no tenemos un pago completado confirmado. Actualiza el estado antes de iniciar otro aporte."
                      : "A completed payment has not been confirmed yet. Refresh the status before starting another gift."}
              </p>
            )}
            {gift.frequency === "monthly" && !gift.cancelled && (
              <>
                {gift.subscriptionState === "ACTIVE" && gift.nextCharge && (
                  <p>
                    {es
                      ? "Próximo aporte mensual de prueba: "
                      : "Next test monthly gift: "}
                    {new Intl.DateTimeFormat(es ? "es-CO" : "en-US", {
                      dateStyle: "long",
                      timeZone: "America/Bogota",
                    }).format(new Date(gift.nextCharge))}
                    .
                  </p>
                )}
                {gift.subscriptionState === "SUSPENDED" && (
                  <p>
                    {es
                      ? "PayPal suspendió el aporte mensual. Revisa tu cuenta de Sandbox."
                      : "PayPal suspended the monthly gift. Check your Sandbox account."}
                  </p>
                )}
                {link && (
                  <div className="management-link">
                    <p>
                      {es
                        ? "Guarda este enlace para consultar o cancelar tu aporte. Es personal: no lo compartas."
                        : "Save this personal link to check or cancel your gift. Do not share it."}
                    </p>
                    <a href={link}>
                      {es ? "Mi enlace de gestión" : "My management link"}
                    </a>
                  </div>
                )}
                {["ACTIVE", "SUSPENDED"].includes(gift.subscriptionState) &&
                  (cancelReview ? (
                    <div className="cancel-review">
                      <p>
                        {es
                          ? "¿Quieres cancelar los próximos aportes mensuales de PayPal?"
                          : "Cancel future PayPal monthly gifts?"}
                      </p>
                      <button
                        className="button payment-cancel"
                        onClick={cancel}
                        disabled={busy}
                      >
                        {es ? "Confirmar cancelación" : "Confirm cancellation"}
                      </button>
                      <button
                        className="button"
                        onClick={() => setCancelReview(false)}
                        disabled={busy}
                      >
                        {es ? "Mantener mi aporte" : "Keep my gift"}
                      </button>
                    </div>
                  ) : (
                    <button
                      className="button payment-cancel"
                      disabled={busy}
                      onClick={() => setCancelReview(true)}
                    >
                      {es
                        ? "Cancelar mi aporte mensual"
                        : "Cancel my monthly gift"}
                    </button>
                  ))}
              </>
            )}
            {gift.cancelled && (
              <p>
                {es
                  ? "PayPal confirmó la cancelación de futuros aportes. Un pago que ya esté en proceso puede completarse."
                  : "PayPal confirmed cancellation of future gifts. A payment already processing may still complete."}
              </p>
            )}
          </>
        )}
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
        {identity && (
          <button className="button purple" disabled={busy} onClick={refresh}>
            <RefreshCw size={18} />
            {busy
              ? es
                ? "Consultando…"
                : "Checking…"
              : es
                ? "Actualizar estado"
                : "Refresh status"}
          </button>
        )}
        <a className="payment-home-link" href={href(lang, "home")}>
          {es ? "Volver al inicio" : "Back to home"}
        </a>
        <a
          className="payment-home-link"
          href="mailto:contacto@fundacionalmaarcoiris.org"
        >
          {es ? "Contactar a la fundación" : "Contact the foundation"}
        </a>
      </div>
    </main>
  );
}
