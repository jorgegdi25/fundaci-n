"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Heart, ArrowUpRight, LockKeyhole, X, Check } from "lucide-react";
import {
  donationAmounts,
  usdDonationAmounts,
  donationTotal,
  supportPercentages,
  validateDonation,
  type Frequency,
} from "@/lib/donations";
import { href, l, type Lang } from "@/lib/i18n";
import { DonationCheckout } from "./donation-checkout";
import { PayPalCheckout } from "./paypal-checkout";
import {
  decimalCents,
  decimalAmount,
  type PayPalCurrency,
} from "@/lib/paypal-security";
import {
  convertUsdToEur,
  ecbReferenceUrl,
  readEuroReferenceRate,
  type EuroReferenceRate,
} from "@/lib/exchange-rates";
// Rubros indicados en los ajustes de Home y Donar del 24 de octubre de 2026.
const monthlyDescriptions = [
  l(
    "Viáticos para sabedores indígenas en sus visitas",
    "Travel expenses for Indigenous knowledge keepers on their visits",
  ),
  l(
    "Sostenimiento de proyectos en las comunidades",
    "Supporting projects in the communities",
  ),
];
export function DonationForm({
  lang,
  cause = "general",
  compact = false,
  missionPage = false,
  selectedCause,
  onCauseChange,
}: {
  lang: Lang;
  cause?: string;
  compact?: boolean;
  missionPage?: boolean;
  selectedCause?: string;
  onCauseChange?: (cause: string) => void;
}) {
  const es = lang === "es";
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [amount, setAmount] = useState<number | null>(
    donationAmounts.monthly[0],
  );
  const [supportPercentage, setSupportPercentage] = useState(0);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState("");
  const [internalDestination, setDestination] = useState(cause);
  const destination = selectedCause ?? internalDestination;
  const [reviewed, setReviewed] = useState(false);
  const [sandbox, setSandbox] = useState(false);
  const [currency, setCurrency] = useState<"COP" | PayPalCurrency>("COP");
  const [international, setInternational] = useState("");
  const [internationalIndex, setInternationalIndex] = useState<number | null>(
    0,
  );
  const [euroRate, setEuroRate] = useState<EuroReferenceRate | null>(null);
  const [euroRateUnavailable, setEuroRateUnavailable] = useState(false);
  const [paypalSandbox, setPaypalSandbox] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/donations", { signal: controller.signal, cache: "no-store" })
      .then((res) => res.json())
      .then((data) =>
        setSandbox(data.configured === true && data.environment === "sandbox"),
      )
      .catch(() => {});
    fetch("/api/paypal", { signal: controller.signal, cache: "no-store" })
      .then((r) => r.json())
      .then((data) =>
        setPaypalSandbox(
          data.configured === true && data.environment === "sandbox",
        ),
      )
      .catch(() => {});
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (currency !== "EUR" || euroRate) return;
    const controller = new AbortController();
    setEuroRateUnavailable(false);
    fetch("/api/exchange-rates", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("exchange_rate_unavailable");
        const rate = readEuroReferenceRate(await response.json());
        if (!rate) throw new Error("exchange_rate_unavailable");
        setEuroRate(rate);
      })
      .catch(() => {
        if (!controller.signal.aborted) setEuroRateUnavailable(true);
      });
    return () => controller.abort();
  }, [currency, euroRate]);
  const fmt = (v: number) =>
    new Intl.NumberFormat(es ? "es-CO" : "en-US").format(v);
  const internationalAmounts =
    currency === "USD"
      ? usdDonationAmounts[frequency]
      : euroRate
        ? usdDonationAmounts[frequency].map((usd) =>
            convertUsdToEur(usd, euroRate),
          )
        : [];
  const suggestions: readonly number[] =
    currency === "COP" ? donationAmounts[frequency] : internationalAmounts;
  const preset =
    currency === "COP"
      ? amount
      : internationalIndex === null
        ? null
        : (internationalAmounts[internationalIndex] ?? null);
  const internationalValue = preset === null ? international : String(preset);
  const selected =
    currency === "COP"
      ? (amount ?? Number(custom))
      : (decimalCents(internationalValue) ?? 0) / 100;
  const formatSuggestion = (value: number) =>
    currency === "COP"
      ? `$${fmt(value)}`
      : new Intl.NumberFormat(es ? "es-CO" : "en-US", {
          style: "currency",
          currency,
          currencyDisplay: "narrowSymbol",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(value);
  const contribution = donationTotal(selected, supportPercentage, currency);
  const total = contribution?.total ?? selected;
  const formatMoney = (value: number) =>
    currency === "COP"
      ? `$${fmt(value)} COP`
      : `${new Intl.NumberFormat(es ? "es-CO" : "en-US", { style: "currency", currency, currencyDisplay: "narrowSymbol" }).format(value)} ${currency}`;
  const formatted =
    currency === "COP"
      ? `$${fmt(total)} COP`
      : `${new Intl.NumberFormat(es ? "es-CO" : "en-US", { style: "currency", currency, currencyDisplay: "narrowSymbol" }).format(total)} ${currency}`;
  const amountIndex = suggestions.findIndex((value) => value === preset);
  const missionFocus = {
    general: l(
      "Flexibilidad operativa para respuesta inmediata y logística territorial.",
      "Operational flexibility for an immediate response and logistics on the ground.",
    ),
    "el-cairo": l(
      "Reconstrucción sostenible con guadua y bahareque",
      "Sustainable rebuilding with guadua bamboo and bahareque",
    ),
    "sierra-nevada": l(
      "Protección del agua, educación ancestral y movilidad de Mamos/Sagas",
      "Water protection, ancestral education and travel for Mamos/Sagas",
    ),
    amazonas: l(
      "Infraestructura escolar y parques infantiles artesanales",
      "School infrastructure and handcrafted playgrounds",
    ),
    mhuysqa: l(
      "Fondo de Apoyo a Sabedoras y Casa de Pensamiento en Apulo.",
      "Support Fund for Women Knowledge Keepers and Casa de Pensamiento in Apulo.",
    ),
  };
  const giftText =
    frequency === "monthly" && amountIndex >= 0
      ? monthlyDescriptions[amountIndex]?.[lang]
      : frequency === "once"
        ? missionFocus[destination as keyof typeof missionFocus]?.[lang]
        : undefined;
  const labels: Record<string, string> = {
    general: es ? "Fondo General (Recomendado)" : "General Fund (Recommended)",
    "el-cairo": "El Cairo",
    "sierra-nevada": "Sierra Nevada",
    amazonas: es ? "Amazonas" : "Amazon",
    mhuysqa: es ? "Pueblo Mhuysqa" : "Mhuysqa people",
  };
  if (missionPage) {
    Object.assign(labels, {
      general: es
        ? "Fondo General (Recomendado)"
        : "General Fund (Recommended)",
      "el-cairo": es
        ? "Reconstrucción de escuela tras el terremoto El Cairo (Valle)"
        : "School rebuilding after the El Cairo earthquake (Valle)",
      "sierra-nevada": es
        ? "Misión Sierra Nevada (Comunidad Kogui)"
        : "Sierra Nevada Mission (Kogui community)",
      amazonas: es
        ? "Misión Amazonas (Comunidad Tikuna)"
        : "Amazon Mission (Tikuna community)",
      mhuysqa: es
        ? "Resurgimiento Mhuysqa (Sabedoras y Casa de Pensamiento)"
        : "Mhuysqa Revival (Knowledge keepers and Casa de Pensamiento)",
    });
  }
  const review = (e: React.FormEvent) => {
    e.preventDefault();
    if (currency !== "COP") {
      const cents = decimalCents(internationalValue);
      if (
        cents === null ||
        cents < 100 ||
        cents > 1000000 ||
        !contribution ||
        Math.round(total * 100) > 1000000
      ) {
        setError(
          es
            ? `Ingresa un valor entre 1 y 10.000 ${currency}, con máximo dos decimales.`
            : `Enter an amount between 1 and 10,000 ${currency}, with up to two decimal places.`,
        );
        return;
      }
      setError("");
      setReviewed(true);
      dialog.current?.showModal();
      return;
    }
    const result = validateDonation({
      amount: total,
      frequency,
      cause: destination,
    });
    if (!result.ok) {
      setError(
        es
          ? "Ingresa un valor entero entre $1.500 y $100.000.000 COP."
          : "Enter a whole amount between COP 1,500 and 100,000,000.",
      );
      return;
    }
    setError("");
    setReviewed(true);
    dialog.current?.showModal();
  };
  return (
    <div
      className={`donation-card ${compact ? "compact" : ""}`}
      id="donar-formulario"
    >
      <div className="donation-heading">
        <span className="icon-disc">
          <Heart size={20} />
        </span>
        <div>
          <span className="eyebrow">
            {es ? "TU APOYO TRANSFORMA" : "YOUR SUPPORT MATTERS"}
          </span>
          <h3>
            {es ? "Siembra tu semilla de cambio" : "Plant a seed of change"}
          </h3>
        </div>
      </div>
      <p className="donation-entry-note">
        {es
          ? "Puedes apoyar desde $9.900 COP mensuales."
          : "You can contribute from COP $9,900 per month."}
      </p>
      <form onSubmit={review}>
        <fieldset className="frequency">
          <legend className="sr-only">
            {es ? "Frecuencia del aporte" : "Donation frequency"}
          </legend>
          {(["monthly", "once"] as Frequency[]).map((f) => (
            <button
              type="button"
              key={f}
              aria-pressed={frequency === f}
              onClick={() => {
                setFrequency(f);
                setAmount(donationAmounts[f][0]);
                setInternationalIndex(0);
                setReviewed(false);
                setError("");
              }}
            >
              {f === "monthly"
                ? es
                  ? missionPage
                    ? "Dona Mensualmente"
                    : "Mensualmente"
                  : "Monthly"
                : es
                  ? missionPage
                    ? "Donación Única"
                    : "Una sola vez"
                  : "One time"}
              {frequency === f && <Check size={15} />}
            </button>
          ))}
        </fieldset>
        <div className="field donation-currency">
          <label htmlFor={`${id}-currency`}>
            {es ? "Moneda y medio de pago" : "Currency and payment method"}
          </label>
          <select
            id={`${id}-currency`}
            value={currency}
            onChange={(e) => {
              const nextCurrency = e.target.value as "COP" | PayPalCurrency;
              setCurrency(nextCurrency);
              setInternationalIndex(0);
              setReviewed(false);
              setError("");
            }}
          >
            <option value="COP">COP · Wompi</option>
            <option value="USD">USD · PayPal</option>
            <option value="EUR">EUR · PayPal</option>
          </select>
        </div>
        {cause === "general" && (
          <div className="field">
            <label htmlFor={`${id}-cause`}>
              {es ? "¿Dónde quieres ayudar?" : "Where would you like to help?"}
            </label>
            <select
              id={`${id}-cause`}
              value={destination}
              onChange={(e) => {
                if (onCauseChange) onCauseChange(e.target.value);
                else setDestination(e.target.value);
                setReviewed(false);
              }}
            >
              {Object.entries(labels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}
        <fieldset className="amounts">
          <legend>
            {es ? "Elige tu aporte" : "Choose your gift"}{" "}
            <span>{currency}</span>
          </legend>
          {suggestions.length > 0 && (
            <div className="amount-grid">
              {suggestions.map((v, index) => (
                <button
                  type="button"
                  key={v}
                  aria-pressed={preset === v}
                  onClick={() => {
                    if (currency === "COP") setAmount(v);
                    else setInternationalIndex(index);
                    setReviewed(false);
                    setError("");
                  }}
                >
                  {formatSuggestion(v)}
                </button>
              ))}
            </div>
          )}
          {suggestions.length > 0 && (
            <button
              className="other-amount"
              type="button"
              aria-pressed={preset === null}
              onClick={() => {
                if (currency === "COP") setAmount(null);
                else setInternationalIndex(null);
                setReviewed(false);
                setError("");
              }}
            >
              {es ? "Elegir otro valor" : "Choose another amount"}
            </button>
          )}
          {preset === null && (
            <div className="field">
              <label htmlFor={`${id}-amount`}>
                {currency === "COP"
                  ? es
                    ? "Tu aporte en pesos colombianos"
                    : "Your gift in Colombian pesos"
                  : `${es ? "Tu aporte en" : "Your gift in"} ${currency}`}
              </label>
              <input
                id={`${id}-amount`}
                type="number"
                min={currency === "COP" ? "1500" : "1"}
                max={currency === "COP" ? "100000000" : "10000"}
                step={currency === "COP" ? "1" : "0.01"}
                inputMode={currency === "COP" ? "numeric" : "decimal"}
                value={currency === "COP" ? custom : international}
                onChange={(e) => {
                  if (currency === "COP") setCustom(e.target.value);
                  else {
                    setInternational(e.target.value);
                    setInternationalIndex(null);
                  }
                  setReviewed(false);
                  setError("");
                }}
                required
                aria-describedby={error ? `${id}-error` : undefined}
              />
            </div>
          )}
        </fieldset>
        {currency === "EUR" && (
          <p className="source-note" aria-live="polite">
            {euroRate ? (
              <>
                {es
                  ? "Importes sugeridos convertidos desde USD. "
                  : "Suggested amounts converted from USD. "}
                <a href={ecbReferenceUrl} target="_blank" rel="noreferrer">
                  {es ? "Referencia BCE" : "ECB reference"}
                </a>
                {": "}
                {new Intl.DateTimeFormat(es ? "es-CO" : "en-US", {
                  dateStyle: "medium",
                  timeZone: "UTC",
                }).format(new Date(`${euroRate.date}T00:00:00Z`))}
                {". "}
                {frequency === "monthly" &&
                  (es
                    ? "Tu aporte mensual conserva el importe en EUR que autorices."
                    : "Your monthly gift keeps the EUR amount you authorize.")}
              </>
            ) : euroRateUnavailable ? (
              es ? (
                "No pudimos consultar la cotización. Puedes ingresar tu aporte en EUR o elegir USD."
              ) : (
                "We could not retrieve the exchange rate. Enter your gift in EUR or choose USD."
              )
            ) : es ? (
              "Consultando la cotización para los importes en EUR…"
            ) : (
              "Checking the exchange rate for EUR amounts…"
            )}
          </p>
        )}
        <p className="gift-description">
          {giftText ??
            (frequency === "monthly"
              ? es
                ? "Un apoyo constante para acompañar los proyectos en territorio."
                : "Ongoing support for long-term community projects."
              : es
                ? "Un aporte que ayuda a responder a las necesidades de las comunidades."
                : "A gift that helps meet the needs of local communities.")}
        </p>
        {missionPage && (
          <details className="donation-support-details">
            <summary>
              {es
                ? "Cubre los costos de tu donación (opcional)"
                : "Cover donation costs (optional)"}
              {supportPercentage > 0 && <span> +{supportPercentage}%</span>}
            </summary>
            <fieldset className="donation-support">
              <legend className="sr-only">
                {es
                  ? "Apoyo opcional para costos"
                  : "Optional support for costs"}
              </legend>
              <p>
                {es
                  ? "Quiero sumar para cubrir la comisión de la pasarela y aportar a la operación de la Fundación."
                  : "I would like to add support to cover payment processing and contribute to the Foundation’s operations."}
              </p>
              <div className="support-options">
                {supportPercentages.map((percentage) => (
                  <button
                    type="button"
                    key={percentage}
                    aria-pressed={supportPercentage === percentage}
                    disabled={
                      (donationTotal(selected, percentage, currency)?.total ??
                        Infinity) > (currency === "COP" ? 100000000 : 10000)
                    }
                    onClick={() => {
                      setSupportPercentage(percentage);
                      setReviewed(false);
                    }}
                  >
                    {percentage === 0
                      ? es
                        ? "Sin adicional"
                        : "No extra"
                      : `${percentage}%`}
                  </button>
                ))}
              </div>
              {supportPercentage > 0 && contribution && (
                <p className="donation-total" aria-live="polite">
                  {es ? "Aporte" : "Gift"}: {formatMoney(selected)} +{" "}
                  {formatMoney(contribution.support)} ({supportPercentage}%).
                  <br />
                  <strong>
                    {es ? "Total" : "Total"}: {formatMoney(total)}
                    {frequency === "monthly"
                      ? es
                        ? " / mes"
                        : " / month"
                      : ""}
                  </strong>
                </p>
              )}
            </fieldset>
          </details>
        )}
        <p className="donation-policy-links">
          <a href={href(lang, "terms")}>
            {es ? "Condiciones de donación" : "Donation terms"}
          </a>
          <span aria-hidden="true"> · </span>
          <a href={href(lang, "privacy")}>{es ? "Privacidad" : "Privacy"}</a>
        </p>
        {error && (
          <p className="field-error" id={`${id}-error`} role="alert">
            {error}
          </p>
        )}
        <button className="button gold full" type="submit">
          {missionPage
            ? es
              ? "Donar ahora de forma segura"
              : "Donate securely now"
            : es
              ? "Revisar mi aporte"
              : "Review my gift"}
          <ArrowUpRight size={19} />
        </button>
        <p className="payment-notice">
          <LockKeyhole size={14} />
          {(currency === "COP" ? sandbox : paypalSandbox)
            ? es
              ? `${currency === "COP" ? "Wompi" : "PayPal"} en modo de pruebas · Sin dinero real`
              : `${currency === "COP" ? "Wompi" : "PayPal"} test mode · No real money`
            : es
              ? "Pagos en línea disponibles próximamente"
              : "Online payments coming soon"}
        </p>
        <p className="donation-disclaimer">
          {es
            ? "Nota legal: 85% se destina a materiales, trabajo comunitario y logística de cada proyecto y 15% a coordinación, seguimiento y rendición de cuentas."
            : "Legal note: 85% goes to materials, community work and logistics for each project, and 15% to coordination, monitoring and accountability."}
        </p>
      </form>
      <dialog
        ref={dialog}
        className="dialog"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        aria-labelledby={`${id}-title`}
      >
        <button
          className="icon-button dialog-close"
          aria-label={es ? "Cerrar" : "Close"}
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        <span className="icon-disc">
          <Heart />
        </span>
        <span className="eyebrow">
          {es ? "GRACIAS POR QUERER SUMARTE" : "THANK YOU FOR YOUR SUPPORT"}
        </span>
        <h2 id={`${id}-title`}>
          {es
            ? "Tu intención hace la diferencia."
            : "Your support makes a difference."}
        </h2>
        <dl className="gift-summary">
          <div>
            <dt>{es ? "Proyecto" : "Project"}</dt>
            <dd>{labels[destination]}</dd>
          </div>
          <div>
            <dt>{es ? "Aporte" : "Gift"}</dt>
            <dd>
              {formatted}{" "}
              {frequency === "monthly" ? (es ? "/ mes" : "/ month") : ""}
            </dd>
          </div>
          {supportPercentage > 0 && contribution && (
            <div>
              <dt>{es ? "Detalle del total" : "Total breakdown"}</dt>
              <dd>
                {formatMoney(selected)} + {formatMoney(contribution.support)} (
                {supportPercentage}%)
              </dd>
            </div>
          )}
        </dl>
        {reviewed &&
          (currency === "COP" ? (
            <DonationCheckout
              key={`${frequency}-${total}-${destination}`}
              lang={lang}
              amount={total}
              frequency={frequency}
              cause={destination}
              close={() => dialog.current?.close()}
            />
          ) : (
            <PayPalCheckout
              key={`${currency}-${frequency}-${total}-${destination}`}
              lang={lang}
              amount={decimalAmount(Math.round(total * 100))}
              currency={currency}
              frequency={frequency}
              cause={destination}
              close={() => dialog.current?.close()}
              reopen={() => {
                if (!dialog.current?.open) dialog.current?.showModal();
              }}
            />
          ))}
      </dialog>
    </div>
  );
}
