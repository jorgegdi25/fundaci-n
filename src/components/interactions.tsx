"use client";
import { useEffect, useRef, useState } from "react";
import { Play, X, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import type { Lang } from "@/lib/i18n";
export function VideoCard({
  id,
  image,
  title,
  lang,
}: {
  id: string;
  image: string;
  title: string;
  lang: Lang;
}) {
  const modal = useRef<HTMLDialogElement>(null);
  const [play, setPlay] = useState(false);
  const es = lang === "es";
  return (
    <>
      <button
        className="video-card"
        onClick={() => {
          setPlay(true);
          modal.current?.showModal();
        }}
        style={{
          backgroundImage: `linear-gradient(0deg,rgba(20,28,18,.75),transparent 80%),url("${image}")`,
        }}
      >
        <span className="play-button">
          <Play fill="currentColor" size={20} />
        </span>
        <span>
          <small>
            {es ? "MEMORIAS DEL TERRITORIO" : "STORIES FROM THE TERRITORY"}
          </small>
          <strong>{title}</strong>
        </span>
        <ArrowUpRight size={23} />
      </button>
      <dialog
        className="dialog video-dialog"
        ref={modal}
        onClose={() => setPlay(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) modal.current?.close();
        }}
        aria-label={title}
      >
        <button
          className="icon-button dialog-close"
          onClick={() => modal.current?.close()}
          aria-label={es ? "Cerrar video" : "Close video"}
        >
          <X />
        </button>
        {play && (
          <iframe
            title={title}
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}
        <p>
          {es
            ? "El video se reproduce mediante YouTube."
            : "Video playback is provided by YouTube."}
        </p>
      </dialog>
    </>
  );
}
export function FinancialChart({ lang }: { lang: Lang }) {
  const es = lang === "es";
  const [active, setActive] = useState(0);
  const items = [
    [
      "#534a8f",
      79948000,
      es ? "Inversión social directa" : "Direct mission expenditure",
    ],
    [
      "#c7a31b",
      4290300,
      es ? "Honorarios profesionales" : "Professional services",
    ],
    ["#9a8fbc", 1274600, es ? "Seguros y pólizas" : "Insurance"],
    ["#aebf9b", 1108300, es ? "Tecnología" : "Technology"],
    [
      "#7e9479",
      1864963,
      es ? "Logística y administración" : "Logistics and administration",
    ],
    ["#d7c4a0", 478000, es ? "Gastos financieros" : "Financial costs"],
  ] as const;
  const total = items.reduce((s, i) => s + i[1], 0);
  return (
    <div className="finance-module">
      <div className="donut-wrap">
        <div
          className="donut"
          role="img"
          aria-label={
            es
              ? "Desglose de ejecución financiera del borrador 2025"
              : "2025 draft expenditure breakdown"
          }
          style={{
            background:
              "conic-gradient(#534a8f 0% 89.87%,#c7a31b 89.87% 94.69%,#9a8fbc 94.69% 96.12%,#aebf9b 96.12% 97.37%,#7e9479 97.37% 99.47%,#d7c4a0 99.47% 100%)",
          }}
        >
          <div>
            <strong>
              {((items[active][1] / total) * 100).toLocaleString(
                es ? "es-CO" : "en-US",
                { maximumFractionDigits: 2 },
              )}
              %
            </strong>
            <span>{items[active][2]}</span>
          </div>
        </div>
        <p>
          {es
            ? "Datos del documento 2025 · pendientes de conciliación"
            : "2025 document figures · pending reconciliation"}
        </p>
      </div>
      <div className="finance-legend">
        {items.map((item, i) => (
          <button
            key={item[2]}
            onClick={() => setActive(i)}
            aria-pressed={active === i}
          >
            <span className="legend-dot" style={{ background: item[0] }} />
            <span>{item[2]}</span>
            <strong>
              ${new Intl.NumberFormat(es ? "es-CO" : "en-US").format(item[1])}
            </strong>
          </button>
        ))}
        <p className="small-note">
          {es
            ? "La vista previa usa los importes del documento del cliente. El desglose final se publicará al conciliarlo con los estados financieros."
            : "This preview uses the amounts in the client document. Final figures will be published after reconciliation with the financial statements."}
        </p>
      </div>
    </div>
  );
}
export function Consent({ lang }: { lang: Lang }) {
  const es = lang === "es";
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  useEffect(() => {
    let exists = false;
    try {
      const saved = localStorage.getItem("alma-consent-v1");
      if (saved) {
        const v = JSON.parse(saved);
        if (
          typeof v.analytics === "boolean" &&
          typeof v.marketing === "boolean"
        ) {
          setAnalytics(v.analytics);
          setMarketing(v.marketing);
          exists = true;
        }
      }
    } catch {}
    setVisible(!exists);
    const show = () => {
      setVisible(true);
      setConfig(true);
    };
    window.addEventListener("open-cookie-settings", show);
    return () => window.removeEventListener("open-cookie-settings", show);
  }, []);
  const save = (a: boolean, m: boolean) => {
    const state = { analytics: a, marketing: m };
    try {
      localStorage.setItem("alma-consent-v1", JSON.stringify(state));
    } catch {}
    window.dispatchEvent(
      new CustomEvent("alma-consent-updated", { detail: state }),
    );
    setVisible(false);
  };
  if (!visible) return null;
  return (
    <aside
      className="consent"
      role="region"
      aria-label={es ? "Preferencias de cookies" : "Cookie preferences"}
    >
      <div>
        <ShieldCheck size={20} />
        <strong>{es ? "Tu privacidad importa" : "Your privacy matters"}</strong>
      </div>
      <p>
        {es
          ? "Usamos almacenamiento esencial para recordar tus preferencias. Puedes elegir si permites analítica y publicidad cuando estos servicios se habiliten."
          : "We use essential storage to remember your preferences. Choose whether to allow analytics and advertising when these services are enabled."}
      </p>
      {config && (
        <div className="consent-options">
          <label>
            <input type="checkbox" checked disabled />
            {es ? "Esenciales" : "Essential"}
          </label>
          <label>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />
            {es ? "Analítica" : "Analytics"}
          </label>
          <label>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
            />
            {es ? "Publicidad" : "Advertising"}
          </label>
        </div>
      )}
      <div className="consent-actions">
        <button onClick={() => save(false, false)}>
          {es ? "Rechazar" : "Reject"}
        </button>
        <button
          onClick={() => {
            if (config) save(analytics, marketing);
            else setConfig(true);
          }}
        >
          {config ? (es ? "Guardar" : "Save") : es ? "Configurar" : "Settings"}
        </button>
        <button className="accept" onClick={() => save(true, true)}>
          {es ? "Aceptar" : "Accept"}
        </button>
      </div>
    </aside>
  );
}
