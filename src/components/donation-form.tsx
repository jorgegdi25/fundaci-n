"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Heart, ArrowUpRight, LockKeyhole, X, Check } from "lucide-react";
import {
  donationAmounts,
  usdDonationAmounts,
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
// Amount descriptions supplied in Estructura web 2026 v2.pdf, pages 6, 8–9, 12, 16 and 19.
const giftDescriptions = {
  general: [
    l(
      "Sostenimiento de proyectos a largo plazo con comunidades",
      "Supporting long-term community projects",
    ),
    l(
      "Kits mensuales de sostenibilidad comunitaria",
      "Monthly community sustainability kits",
    ),
    l(
      "Viáticos para sabedores indígenas en sus visitas",
      "Travel expenses for Indigenous knowledge keepers",
    ),
  ],
  "el-cairo": [
    l(
      "Modelo piloto de vivienda y materiales locales",
      "Pilot housing model and local materials",
    ),
    l(
      "Apoyo en el desarrollo de talleres de bioconstrucción",
      "Supporting natural building workshops",
    ),
    l(
      "Viáticos del equipo en territorio",
      "Travel expenses for community teams",
    ),
  ],
  "sierra-nevada": [
    l(
      "Sostenimiento de sabedores tradicionales y conservación de territorios",
      "Supporting traditional knowledge keepers and land conservation",
    ),
    l(
      "Materiales de tejido y producción artesanal para familias Kogui",
      "Weaving and craft production materials for Kogui families",
    ),
    l(
      "Kits escolares y material de ecopedagogía infantil",
      "School kits and environmental learning materials for children",
    ),
  ],
  amazonas: [
    l("Materiales de infraestructura", "Infrastructure materials"),
    l("Logística y talleres comunitarios", "Logistics and community workshops"),
    l("Insumos educativos", "Educational supplies"),
  ],
  mhuysqa: [
    l(
      "Sostenimiento de la Casa de Pensamiento y Jardín Botánico en Apulo",
      "Supporting Casa de Pensamiento and the Botanical Garden in Apulo",
    ),
    l(
      "Círculos de canto al agua, rezos a la Tierra y eventos bioculturales",
      "Songs to water, prayers to the Earth and biocultural events",
    ),
    l(
      "Insumos para talleres de medicina herbal y tejido ancestral",
      "Materials for herbal knowledge and ancestral weaving workshops",
    ),
  ],
};
const oneTimeDescriptions = {
  general: [
    l(
      "Sostenimiento de proyectos a corto plazo con comunidades",
      "Supporting short-term community projects",
    ),
    l("Kits de sostenibilidad comunitaria", "Community sustainability kits"),
    giftDescriptions.general[2],
  ],
  "el-cairo": [
    giftDescriptions["el-cairo"][0],
    l(
      "Desarrollo y pedagogía para la construcción en minga",
      "Development and learning for collective construction",
    ),
    l(
      "Apoyo a la reactivación económica y turismo regenerativo",
      "Supporting economic recovery and regenerative tourism",
    ),
  ],
  "sierra-nevada": [
    l(
      "Sostenimiento de Mamos y Sagas y apoyo en sus viajes espirituales",
      "Supporting Mamos and Sagas and their spiritual journeys",
    ),
    l(
      "Materiales artesanales textiles y apoyo a olla comunitaria",
      "Textile craft materials and community meals",
    ),
    l(
      "Kits escolares e insumos pedagógicos",
      "School kits and learning supplies",
    ),
  ],
  amazonas: giftDescriptions.amazonas,
  mhuysqa: [
    l(
      "Sostenimiento del centro regenerativo Mhuysqa y siembras en Apulo",
      "Supporting the Mhuysqa regenerative centre and planting in Apulo",
    ),
    l(
      "Acompañamiento a movimientos de canto al agua y liderazgo espiritual femenino",
      "Supporting songs to water and women’s spiritual leadership",
    ),
    l(
      "Materiales para talleres comunitarios urbanos de tejido y botánica",
      "Materials for urban community weaving and botanical workshops",
    ),
  ],
};
export function DonationForm({
  lang,
  cause = "general",
  compact = false,
}: {
  lang: Lang;
  cause?: string;
  compact?: boolean;
}) {
  const es = lang === "es";
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [amount, setAmount] = useState<number | null>(150000);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState("");
  const [destination, setDestination] = useState(cause);
  const [reviewed, setReviewed] = useState(false);
  const [sandbox, setSandbox] = useState(false);
  const [currency, setCurrency] = useState<"COP" | PayPalCurrency>("COP");
  const [international, setInternational] = useState("");
  const [internationalIndex, setInternationalIndex] = useState<number | null>(
    1,
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
  const formatted =
    currency === "COP"
      ? `$${fmt(selected)} COP`
      : `${new Intl.NumberFormat(es ? "es-CO" : "en-US", { style: "currency", currency, currencyDisplay: "narrowSymbol" }).format(selected)} ${currency}`;
  const amountIndex = suggestions.findIndex((value) => value === preset);
  const descriptions =
    frequency === "monthly" ? giftDescriptions : oneTimeDescriptions;
  const giftText =
    currency === "COP" || currency === "USD" || euroRate
      ? descriptions[destination as keyof typeof giftDescriptions]?.[
          amountIndex
        ]?.[lang]
      : undefined;
  const labels: Record<string, string> = {
    general: es ? "Donde más se necesite" : "Where it is needed most",
    "el-cairo": "El Cairo",
    "sierra-nevada": "Sierra Nevada",
    amazonas: es ? "Amazonas" : "Amazon",
    mhuysqa: es ? "Pueblo Mhuysqa" : "Mhuysqa people",
  };
  const review = (e: React.FormEvent) => {
    e.preventDefault();
    if (currency !== "COP") {
      const cents = decimalCents(internationalValue);
      if (cents === null || cents < 100 || cents > 1000000) {
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
      amount: selected,
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
                setAmount(donationAmounts[f][1]);
                setInternationalIndex(1);
                setReviewed(false);
                setError("");
              }}
            >
              {f === "monthly"
                ? es
                  ? "Mensualmente"
                  : "Monthly"
                : es
                  ? "Una sola vez"
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
              setInternationalIndex(1);
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
              onChange={(e) => setDestination(e.target.value)}
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
          {es ? "Revisar mi aporte" : "Review my gift"}
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
        </dl>
        {reviewed &&
          (currency === "COP" ? (
            <DonationCheckout
              key={`${frequency}-${selected}-${destination}`}
              lang={lang}
              amount={selected}
              frequency={frequency}
              cause={destination}
              close={() => dialog.current?.close()}
            />
          ) : (
            <PayPalCheckout
              key={`${currency}-${frequency}-${selected}-${destination}`}
              lang={lang}
              amount={decimalAmount(Math.round(selected * 100))}
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
