"use client";
import { useCallback, useEffect, useState } from "react";
import { Heart, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { donationRequest } from "./donation-checkout";
import { href, type Lang } from "@/lib/i18n";
import {
  ApprovedGiftFollowUp,
  GiftSupport,
  PersonalManagementLink,
} from "./gift-follow-up";

type GiftStatus = {
  id: string;
  amount: number;
  cause: string;
  frequency: string;
  status: string;
  subscriptionState: string;
  nextCharge: string | null;
  cancelled: boolean;
  environment: string;
};
export function DonationResult({
  lang,
  donation,
  transactionId,
  manage = false,
}: {
  lang: Lang;
  donation?: string;
  transactionId?: string;
  manage?: boolean;
}) {
  const es = lang === "es";
  const [gift, setGift] = useState<GiftStatus | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [identity, setIdentity] = useState<{
    id: string;
    access?: string;
  } | null>(null);
  const [managementUrl, setManagementUrl] = useState("");
  const [cancelReview, setCancelReview] = useState(false);
  const [inFlight, setInFlight] = useState(false);
  useEffect(() => {
    if (manage) {
      const [id, access] = window.location.hash.slice(1).split(".");
      if (id && access) {
        setIdentity({ id, access });
        setManagementUrl(window.location.href);
      } else
        setError(
          es
            ? "Abre el enlace de gestión que guardaste al autorizar tu aporte."
            : "Open the management link you saved when authorizing your gift.",
        );
    } else if (donation) {
      setIdentity({ id: donation });
      let access: string | null = null;
      try {
        access = sessionStorage.getItem(`alma-gift-${donation}`);
      } catch {
        /* The private cookie can still authenticate this browser. */
      }
      if (access)
        setManagementUrl(
          `${window.location.origin}/${lang}/donation/manage#${donation}.${access}`,
        );
    } else
      setError(
        es
          ? "No encontramos una referencia de aporte en este enlace."
          : "No gift reference was found in this link.",
      );
  }, [donation, es, lang, manage]);
  const refresh = useCallback(async () => {
    if (!identity) return;
    setBusy(true);
    setError("");
    try {
      setGift(
        await donationRequest({ action: "status", ...identity, transactionId }),
      );
    } catch {
      setError(
        es
          ? "No pudimos confirmar el estado. Vuelve a consultarlo o contacta a la fundación."
          : "We could not confirm the status. Check again or contact the foundation.",
      );
    } finally {
      setBusy(false);
    }
  }, [identity, transactionId, es]);
  useEffect(() => {
    if (identity) void refresh();
  }, [identity, refresh]);
  async function cancel() {
    if (!identity) return;
    setBusy(true);
    setError("");
    try {
      const response = await donationRequest({ action: "cancel", ...identity });
      setInFlight(response.inFlight);
      setCancelReview(false);
      await refresh();
    } catch {
      setError(
        es
          ? "No se pudo cancelar. Inténtalo de nuevo o contacta a la fundación."
          : "Cancellation failed. Try again or contact the foundation.",
      );
      setBusy(false);
    }
  }
  const approved = gift?.status === "APPROVED";
  const failed = ["DECLINED", "ERROR", "VOIDED"].includes(gift?.status ?? "");
  const title = gift?.cancelled
    ? es
      ? "Tu aporte mensual está cancelado."
      : "Your monthly gift is cancelled."
    : approved
      ? es
        ? "¡Gracias de corazón! Tu aporte de prueba fue aprobado."
        : "Thank you from the heart! Your test gift was approved."
      : failed
        ? es
          ? "Tu aporte de prueba no fue aprobado."
          : "Your test gift was not approved."
        : es
          ? "Revisemos el estado de tu aporte."
          : "Check your gift status.";
  const labels: Record<string, string> = {
    general: es ? "Donde más se necesite" : "Where it is needed most",
    "el-cairo": "El Cairo",
    "sierra-nevada": "Sierra Nevada",
    amazonas: es ? "Amazonas" : "Amazon",
    mhuysqa: "Pueblo Mhuysqa",
  };
  return (
    <main id="contenido" className="payment-result-page section-pad">
      <div className="payment-result-card">
        <span className="icon-disc">
          {approved ? <CheckCircle2 /> : failed ? <AlertCircle /> : <Heart />}
        </span>
        <span className="eyebrow">
          {es ? "TU APORTE · WOMPI" : "YOUR GIFT · WOMPI"}
        </span>
        <h1>
          {manage && !gift?.cancelled
            ? es
              ? "Gestión de tu aporte mensual"
              : "Manage your monthly gift"
            : title}
        </h1>
        <p className="sandbox-notice">
          {es
            ? "Modo de pruebas. No se ha movido dinero real."
            : "Test mode. No real money has moved."}
        </p>
        {gift && (
          <dl className="gift-summary">
            <div>
              <dt>{es ? "Proyecto" : "Project"}</dt>
              <dd>{labels[gift.cause]}</dd>
            </div>
            <div>
              <dt>{es ? "Aporte" : "Gift"}</dt>
              <dd>
                $
                {new Intl.NumberFormat(es ? "es-CO" : "en-US").format(
                  gift.amount,
                )}{" "}
                COP
                {gift.frequency === "monthly"
                  ? es
                    ? " / mes"
                    : " / month"
                  : ""}
              </dd>
            </div>
          </dl>
        )}
        {gift && !approved && !failed && !gift.cancelled && (
          <p>
            {es
              ? "Todavía no tenemos una aprobación confirmada. Consulta el estado antes de iniciar otro aporte."
              : "Approval has not been confirmed yet. Check the status before starting another gift."}
          </p>
        )}
        {gift?.frequency === "monthly" && !gift.cancelled && (
          <>
            {gift.subscriptionState === "active" && gift.nextCharge && (
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
            {gift.subscriptionState === "paused" && (
              <p>
                {es
                  ? "El aporte mensual está pausado y requiere revisión. No programaremos otro cobro mientras esté pausado."
                  : "Your monthly gift is paused and needs review. No further charge will be scheduled while it is paused."}
              </p>
            )}
            {managementUrl && (
              <PersonalManagementLink
                lang={lang}
                url={managementUrl}
                manage={manage}
              />
            )}
            {cancelReview ? (
              <div className="cancel-review">
                <p>
                  {es
                    ? "¿Quieres cancelar los próximos aportes mensuales? Un aporte que ya esté en proceso podría completarse."
                    : "Cancel future monthly gifts? A gift already processing may still complete."}
                </p>
                <div className="button-row">
                  <button
                    className="button payment-cancel"
                    disabled={busy}
                    onClick={cancel}
                  >
                    {es ? "Confirmar cancelación" : "Confirm cancellation"}
                  </button>
                  <button
                    className="button outline"
                    disabled={busy}
                    onClick={() => setCancelReview(false)}
                  >
                    {es ? "Mantener mi aporte" : "Keep my gift"}
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="button payment-cancel"
                disabled={busy}
                onClick={() => setCancelReview(true)}
              >
                {es ? "Cancelar mi aporte mensual" : "Cancel my monthly gift"}
              </button>
            )}
          </>
        )}
        {gift?.cancelled && (
          <p>
            {es
              ? "No programaremos nuevos aportes mensuales."
              : "No new monthly gifts will be scheduled."}
            {inFlight
              ? es
                ? " Un aporte que ya estaba en procesamiento podría completarse; puedes consultar su estado aquí."
                : " A gift that was already processing may complete; you can check its status here."
              : ""}
          </p>
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
        <GiftSupport lang={lang} />
      </div>
      {!manage && approved && !gift?.cancelled && !error && (
        <ApprovedGiftFollowUp
          lang={lang}
          provider="wompi"
          testMode={gift?.environment !== "production"}
        />
      )}
    </main>
  );
}
