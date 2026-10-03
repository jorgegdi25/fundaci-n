"use client";
import { useId, useRef, useState } from "react";
import { Heart, ArrowUpRight, LockKeyhole, X, Check } from "lucide-react";
import {
  donationAmounts,
  validateDonation,
  type Frequency,
} from "@/lib/donations";
import { href, l, type Lang } from "@/lib/i18n";
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
  const fmt = (v: number) =>
    new Intl.NumberFormat(es ? "es-CO" : "en-US").format(v);
  const selected = amount ?? Number(custom);
  const amountIndex = donationAmounts[frequency].findIndex((v) => v === amount);
  const descriptions =
    frequency === "monthly" ? giftDescriptions : oneTimeDescriptions;
  const giftText =
    descriptions[destination as keyof typeof giftDescriptions]?.[amountIndex]?.[
      lang
    ];
  const labels: Record<string, string> = {
    general: es ? "Donde más se necesite" : "Where it is needed most",
    "el-cairo": "El Cairo",
    "sierra-nevada": "Sierra Nevada",
    amazonas: es ? "Amazonas" : "Amazon",
    mhuysqa: es ? "Pueblo Mhuysqa" : "Mhuysqa people",
  };
  const review = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateDonation({
      amount: selected,
      frequency,
      cause: destination,
    });
    if (!result.ok) {
      setError(
        es
          ? "Ingresa un valor entero entre $1.000 y $100.000.000 COP."
          : "Enter a whole amount between COP 1,000 and 100,000,000.",
      );
      return;
    }
    setError("");
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
            {es ? "Elige tu aporte" : "Choose your gift"} <span>COP</span>
          </legend>
          <div className="amount-grid">
            {donationAmounts[frequency].map((v) => (
              <button
                type="button"
                key={v}
                aria-pressed={amount === v}
                onClick={() => {
                  setAmount(v);
                  setError("");
                }}
              >
                ${fmt(v)}
              </button>
            ))}
          </div>
          <button
            className="other-amount"
            type="button"
            aria-pressed={amount === null}
            onClick={() => setAmount(null)}
          >
            {es ? "Elegir otro valor" : "Choose another amount"}
          </button>
          {amount === null && (
            <div className="field">
              <label htmlFor={`${id}-amount`}>
                {es
                  ? "Tu aporte en pesos colombianos"
                  : "Your gift in Colombian pesos"}
              </label>
              <input
                id={`${id}-amount`}
                type="number"
                min="1000"
                max="100000000"
                step="1"
                inputMode="numeric"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                required
                aria-describedby={error ? `${id}-error` : undefined}
              />
            </div>
          )}
        </fieldset>
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
          {es
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
              ${fmt(selected)} COP{" "}
              {frequency === "monthly" ? (es ? "/ mes" : "/ month") : ""}
            </dd>
          </div>
        </dl>
        <p>
          {es
            ? "Estamos habilitando las donaciones en línea. No se ha realizado ningún cobro. Si quieres apoyar desde ahora, contacta a la fundación para conocer las opciones disponibles."
            : "We are preparing online donations. No payment has been made. To help today, contact the foundation for available options."}
        </p>
        <a
          className="button purple full"
          href="mailto:contacto@fundacionalmaarcoiris.org"
        >
          {es ? "Contactar a la fundación" : "Contact the foundation"}
          <ArrowUpRight size={18} />
        </a>
      </dialog>
    </div>
  );
}
