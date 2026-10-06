"use client";
import { useEffect, useRef, useState } from "react";
import type { PayPalButtonsComponent, OnInitActions } from "@paypal/paypal-js";
import { LockKeyhole } from "lucide-react";
import { href, type Lang } from "@/lib/i18n";
import { paypalRequest } from "@/lib/paypal-client";
import type { Frequency } from "@/lib/donations";
import type { PayPalCurrency } from "@/lib/paypal-security";
type Intent = {
  id: string;
  access: string;
  orderId?: string;
  subscriptionId?: string;
  resultPath: string;
};
export function PayPalCheckout({
  lang,
  amount,
  currency,
  frequency,
  cause,
  close,
  reopen,
}: {
  lang: Lang;
  amount: string;
  currency: PayPalCurrency;
  frequency: Frequency;
  cause: string;
  close: () => void;
  reopen: () => void;
}) {
  const es = lang === "es",
    monthly = frequency === "monthly";
  const [foundation, setFoundation] = useState(false),
    [authorization, setAuthorization] = useState(false),
    [loaded, setLoaded] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [gift, setGift] = useState<Intent | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const controls = useRef<OnInitActions | null>(null);
  const consent = useRef({ foundation: false, authorization: false });
  const intent = useRef<Promise<Intent> | null>(null);
  // Dialog callbacks change on parent renders; the SDK reads their latest values.
  const dialog = useRef({ close, reopen });
  useEffect(() => {
    dialog.current = { close, reopen };
  }, [close, reopen]);
  useEffect(() => {
    consent.current = { foundation, authorization };
    const actions = controls.current;
    if (actions)
      void (foundation && (!monthly || authorization)
        ? actions.enable()
        : actions.disable());
  }, [foundation, authorization, monthly]);
  useEffect(() => {
    let active = true;
    let button: PayPalButtonsComponent | undefined;
    const controller = new AbortController();
    function recover() {
      if (!active) return;
      setBusy(false);
      setError(
        es
          ? "No pudimos confirmar el aporte. Consulta su estado antes de iniciar otro."
          : "We could not confirm your gift. Check its status before starting another.",
      );
      dialog.current.reopen();
    }
    async function createIntent() {
      const agreed = consent.current;
      if (!agreed.foundation || (monthly && !agreed.authorization))
        throw new Error("consent_required");
      if (!intent.current) {
        intent.current = paypalRequest({
          amount,
          currency,
          frequency,
          cause,
          lang,
          agreeFoundation: true,
          agreeMonthly: monthly,
        }).then((created: Intent) => {
          // The HttpOnly cookie remains a fallback if browser storage is unavailable.
          try {
            sessionStorage.setItem(`alma-paypal-${created.id}`, created.access);
          } catch {
            /* Cookie ownership still applies. */
          }
          if (active) setGift(created);
          return created;
        });
      }
      return intent.current;
    }
    async function load() {
      const response = await fetch("/api/paypal", {
        cache: "no-store",
        signal: controller.signal,
      });
      const health = await response.json();
      if (
        !response.ok ||
        !health.configured ||
        health.environment !== "sandbox" ||
        typeof health.clientId !== "string"
      )
        throw new Error("paypal_unavailable");
      const { loadScript } = await import("@paypal/paypal-js");
      const sdk = await loadScript({
        clientId: health.clientId,
        environment: "sandbox",
        components: "buttons",
        currency,
        locale: es ? "es_CO" : "en_US",
        intent: monthly ? "subscription" : "capture",
        vault: monthly,
        dataNamespace: `almaPayPal${currency}${monthly ? "Monthly" : "Once"}${lang}`,
      });
      if (!active || !container.current) return;
      if (!sdk?.Buttons) throw new Error("paypal_unavailable");
      button = sdk.Buttons({
        fundingSource: "paypal",
        style: { layout: "vertical", color: "gold", shape: "pill", height: 50 },
        ...(monthly
          ? {
              createSubscription: async () =>
                (await createIntent()).subscriptionId!,
            }
          : { createOrder: async () => (await createIntent()).orderId! }),
        onInit: (_data, actions) => {
          controls.current = actions;
          const agreed = consent.current;
          void (agreed.foundation && (!monthly || agreed.authorization)
            ? actions.enable()
            : actions.disable());
        },
        onClick: (_data, actions) => {
          const agreed = consent.current;
          if (!agreed.foundation || (monthly && !agreed.authorization))
            return actions.reject();
          setBusy(true);
          setError("");
          dialog.current.close();
          return actions.resolve();
        },
        onApprove: async (data) => {
          try {
            if (!intent.current) throw new Error("missing_intent");
            const created = await intent.current;
            try {
              await paypalRequest({
                action: "confirm",
                id: created.id,
                access: created.access,
                orderId: data.orderID,
                subscriptionId: data.subscriptionID,
              });
            } catch {
              /* The result page queries PayPal without assuming payment success. */
            }
            window.location.assign(created.resultPath);
          } catch {
            recover();
          }
        },
        onCancel: () => {
          if (!active) return;
          setBusy(false);
          setError(
            es
              ? "Cerraste PayPal. Puedes consultar el estado o continuar con el mismo aporte."
              : "You closed PayPal. You can check the status or continue with the same gift.",
          );
          dialog.current.reopen();
        },
        onError: recover,
      });
      if (!button.isEligible()) throw new Error("not_eligible");
      await button.render(container.current);
      if (active) setLoaded(true);
    }
    void load().catch(() => {
      if (active) {
        setBusy(false);
        setError(
          es
            ? "No pudimos cargar PayPal. Cierra este resumen e inténtalo de nuevo."
            : "We could not load PayPal. Close this summary and try again.",
        );
      }
    });
    return () => {
      active = false;
      controller.abort();
      controls.current = null;
      void button?.close().catch(() => {});
    };
  }, [amount, currency, frequency, cause, lang, es, monthly]);
  return (
    <div className="checkout-content">
      <p className="sandbox-notice">
        <LockKeyhole size={18} />
        {es
          ? "PayPal Sandbox · Pruebas sin dinero real"
          : "PayPal Sandbox · Testing without real money"}
      </p>
      <label className="checkout-consent">
        <input
          type="checkbox"
          checked={foundation}
          onChange={(e) => setFoundation(e.target.checked)}
        />
        <span>
          {es ? "He leído y acepto las " : "I have read and accept the "}
          <a href={href(lang, "terms")} target="_blank" rel="noopener">
            {es ? "condiciones de donación" : "donation terms"}
          </a>
          {es ? " y la " : " and the "}
          <a href={href(lang, "privacy")} target="_blank" rel="noopener">
            {es ? "política de privacidad." : "privacy policy."}
          </a>
        </span>
      </label>
      {monthly && (
        <label className="checkout-consent">
          <input
            type="checkbox"
            checked={authorization}
            onChange={(e) => setAuthorization(e.target.checked)}
          />
          <span>
            {es
              ? `Autorizo un aporte de prueba de ${amount} ${currency} cada mes, hasta que lo cancele en PayPal o desde mi enlace personal de gestión.`
              : `I authorize a test gift of ${amount} ${currency} each month until I cancel it in PayPal or through my personal management link.`}
          </span>
        </label>
      )}
      <p>
        {es
          ? "Continúa con una cuenta personal de PayPal Sandbox."
          : "Continue with a personal PayPal Sandbox account."}
      </p>
      <div ref={container} className="paypal-buttons" />
      <p role="status">
        {busy
          ? es
            ? "Conectando…"
            : "Connecting…"
          : !loaded && !error
            ? es
              ? "Cargando PayPal…"
              : "Loading PayPal…"
            : ""}
      </p>
      {error && (
        <p role="alert" className="field-error">
          {error}
        </p>
      )}
      {gift && (
        <a className="payment-home-link" href={gift.resultPath}>
          {es ? "Consultar el estado de mi aporte" : "Check my gift status"}
        </a>
      )}
    </div>
  );
}
