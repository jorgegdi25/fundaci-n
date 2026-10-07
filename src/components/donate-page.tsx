"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  FileText,
  Heart,
  Leaf,
  MapPin,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { href, type Lang } from "@/lib/i18n";
import { DonationForm } from "./donation-form";
import { CommunitySignup } from "./community-signup";
import styles from "./donate-page.module.css";

// Client copy: Estructura web 2026 v2 (2), pp. 36–38. No inferred metrics.
const causes = [
  {
    id: "el-cairo",
    image: "/images/el-cairo-escuela.webp",
    name: [
      "Emergencia Terremoto El Cairo (Embera Chami)",
      "El Cairo Earthquake Emergency (Embera Chami)",
    ],
    focus: [
      "Reconstrucción sostenible con guadua y bahareque",
      "Sustainable rebuilding with guadua bamboo and bahareque",
    ],
    impact: [
      "Reconstruye la Escuela de la comunidad indigena Embera Chami en Doxura.",
      "Rebuilds the Embera Chami Indigenous community’s school in Doxura.",
    ],
  },
  {
    id: "sierra-nevada",
    image: "/images/sierra-nevada.webp",
    name: ["Misión Sierra Nevada (Kogui)", "Sierra Nevada Mission (Kogui)"],
    focus: [
      "Protección del agua, educación ancestral y movilidad de Mamos/Sagas",
      "Water protection, ancestral education and travel for Mamos/Sagas",
    ],
    impact: [
      "Insumos de tejido textil para las Saxas y kits escolares para la niñez Kogui.",
      "Textile weaving supplies for the Saxas and school kits for Kogui children.",
    ],
  },
  {
    id: "amazonas",
    image: "/images/amazonas.webp",
    name: ["Misión Amazonas (Tikuna)", "Amazon Mission (Tikuna)"],
    focus: [
      "Infraestructura escolar y parques infantiles artesanales",
      "School infrastructure and handcrafted playgrounds",
    ],
    impact: [
      "Aulas dignas y espacios de juego sano para +60 niños en la Escuela Santa Isabel",
      "Dignified classrooms and healthy play spaces for over 60 children at Santa Isabel School",
    ],
  },
  {
    id: "mhuysqa",
    image: "/images/mhuysqa.webp",
    name: ["Resurgimiento Mhuysqa", "Mhuysqa Revival"],
    focus: [
      "Fondo de Apoyo a Sabedoras y Casa de Pensamiento en Apulo.",
      "Support Fund for Women Knowledge Keepers and Casa de Pensamiento in Apulo.",
    ],
    impact: [
      "Sostiene círculos de canto al agua y medicina herbal liderados por Abuelas ancestrales.",
      "Sustains circles of songs to water and herbal medicine led by ancestral grandmothers.",
    ],
  },
  {
    id: "general",
    image: null,
    name: ["Fondo General de Misión", "General Mission Fund"],
    focus: [
      "Flexibilidad operativa para respuesta inmediata y logística territorial.",
      "Operational flexibility for an immediate response and logistics on the ground.",
    ],
    impact: [
      "Asigna el recurso a la necesidad más urgente de la fundación",
      "Allocates resources to the foundation’s most urgent need",
    ],
  },
] as const;

export function DonatePage({ lang }: { lang: Lang }) {
  const es = lang === "es",
    i = es ? 0 : 1;
  const [cause, setCause] = useState("general");
  const widget = useRef<HTMLDivElement>(null);
  const chooseCause = (value: string) => {
    setCause(value);
    widget.current?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    widget.current?.focus({ preventScroll: true });
  };
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="donate-title">
        <div className={styles.heroInner}>
          <div className={styles.intro}>
            <div className={styles.identity}>
              <ShieldCheck size={23} aria-hidden="true" />
              <span>
                Fundación Alma Arcoíris Colombia
                <br />
                NIT 901784588-0 · ESAL
              </span>
            </div>
            <h1 id="donate-title">
              {es
                ? "Tu generosidad es la semilla que protege la vida, el agua y la sabiduría en el territorio."
                : "Your generosity is the seed that protects life, water and wisdom on the land."}
            </h1>
            <p>
              {es
                ? "Transforma tu intención en impacto real. Cada donación apoya directamente a la escuela de la comunidad indigena Embera Chami en el Cairo por Emergencia Terremoto y fortalece la soberanía de los pueblos indígenas originarios Kogui, Tikuna y Mhuysqa en Colombia."
                : "Turn your intention into real impact. Every donation directly supports the Embera Chami Indigenous community’s school in El Cairo following the earthquake emergency and strengthens the sovereignty of the Kogui, Tikuna and Mhuysqa Indigenous peoples in Colombia."}
            </p>
            <a className={styles.explore} href="#destinos-aporte">
              {es ? "¿A dónde va tu aporte?" : "Where does your gift go?"}
              <ArrowDown size={19} aria-hidden="true" />
            </a>
            <figure className={styles.heroPhoto}>
              <Image
                src="/images/misiones.webp"
                alt={
                  es
                    ? "Participantes de las misiones de la Fundación Alma Arcoíris"
                    : "Participants in Fundación Alma Arcoíris missions"
                }
                width={1100}
                height={733}
                sizes="(max-width: 900px) 90vw, 550px"
              />
              <figcaption>
                <MapPin size={18} aria-hidden="true" />
                {es
                  ? "Proyectos en territorio · Colombia"
                  : "Community projects · Colombia"}
              </figcaption>
            </figure>
          </div>
          <div
            ref={widget}
            tabIndex={-1}
            className={styles.widget}
            aria-label={es ? "Selecciona tu aporte" : "Choose your gift"}
          >
            <DonationForm
              lang={lang}
              missionPage
              selectedCause={cause}
              onCauseChange={setCause}
            />
            <div className={styles.paymentMarks}>
              <ShieldCheck size={19} aria-hidden="true" />
              <span>
                Wompi · PayPal
                <br />
                {es ? "COP · USD · EUR" : "COP · USD · EUR"}
              </span>
              <FileText size={19} aria-hidden="true" />
              <span>
                {es ? "Certificado de donación" : "Donation certificate"}
                <br />
                {es ? "Únicamente en Colombia" : "Colombia only"}
              </span>
            </div>
            <p className={styles.testNote}>
              {es
                ? "En esta versión de pruebas no se mueve dinero real ni se emiten certificados tributarios."
                : "This test version moves no real money and issues no tax certificates."}
            </p>
          </div>
        </div>
      </section>

      <section
        className={styles.section}
        id="destinos-aporte"
        aria-labelledby="causes-title"
      >
        <span className="eyebrow">
          {es ? "¿A DÓNDE VA TU APORTE?" : "WHERE DOES YOUR GIFT GO?"}
        </span>
        <h2 id="causes-title">
          {es
            ? "Transparencia en la acción: Elige la mística y el territorio de tu impacto"
            : "Transparency in action: choose the spirit and the land of your impact"}
        </h2>
        <div className={styles.causes}>
          {causes.map((c, index) => (
            <article
              key={c.id}
              className={`${styles.cause} ${c.id === "general" ? styles.general : ""}`}
              data-reveal
            >
              {c.image ? (
                <Image
                  src={c.image}
                  alt={c.name[i]}
                  width={1100}
                  height={733}
                  sizes="(max-width: 640px) 90vw, (max-width: 1050px) 45vw, 390px"
                />
              ) : (
                <div className={styles.generalArt}>
                  <Leaf size={54} strokeWidth={1.2} aria-hidden="true" />
                  <span>Alma Arcoíris</span>
                </div>
              )}
              <div className={styles.causeCopy}>
                <span className={styles.causeNumber}>0{index + 1}</span>
                <h3>{c.name[i]}</h3>
                <span className={styles.label}>
                  {es ? "Enfoque de la donación" : "Donation focus"}
                </span>
                <p>{c.focus[i]}</p>
                <span className={styles.label}>
                  {es ? "Impacto tangible directo" : "Direct, tangible impact"}
                </span>
                <p>{c.impact[i]}</p>
                <button
                  type="button"
                  onClick={() => chooseCause(c.id)}
                  aria-pressed={cause === c.id}
                >
                  {es ? "Elegir esta causa" : "Choose this cause"}
                  {cause === c.id ? (
                    <Check size={20} aria-hidden="true" />
                  ) : (
                    <ArrowRight size={20} aria-hidden="true" />
                  )}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className={styles.transparency}
        aria-labelledby="transparency-title"
      >
        <div className={styles.section}>
          <span className="eyebrow">
            {es
              ? "TRANSPARENCIA Y RESPALDO LEGAL"
              : "TRANSPARENCY AND LEGAL SUPPORT"}
          </span>
          <h2 id="transparency-title">
            {es
              ? "Cuentas claras: Tu confianza se traduce en desarrollo real."
              : "Clear accounts: your trust translates into real development."}
          </h2>
          <div className={styles.accountability}>
            <div className={styles.metric}>
              <Leaf size={54} strokeWidth={1.25} aria-hidden="true" />
              <h3>
                {es ? "Inversión Social Directa" : "Direct Social Investment"}
              </h3>
              <p>
                {es
                  ? "Proyectos en territorio, materiales de bioconstrucción e infraestructura social"
                  : "Community projects, natural building materials and social infrastructure"}
              </p>
            </div>
            <div className={styles.credentials}>
              {[
                [
                  "Supervisión y Vigilancia",
                  "Supervision and Oversight",
                  "Certificado oficial emitido por la Gobernación de Cundinamarca (Radicado GOB-S-CR-2026-0168636).",
                  "Official certificate issued by the Government of Cundinamarca (reference GOB-S-CR-2026-0168636).",
                ],
                [
                  "Estados Financieros Auditados",
                  "Audited Financial Statements",
                  "Contabilidad bajo NIIF para PYMES con dictamen de Revisoría Fiscal independiente.",
                  "Accounting under IFRS for SMEs with an independent statutory auditor’s opinion.",
                ],
                [
                  "Aval Ancestral",
                  "Ancestral Endorsement",
                  "Proyectos iniciados bajo consulta previa, ceremonia de pago y autorización de los Mamos Kogui y Sabedoras Mhuysqa",
                  "Projects initiated with prior consultation, a ceremony of offerings and authorization from Kogui Mamos and Mhuysqa women knowledge keepers",
                ],
              ].map(([a, b, c, d]) => (
                <div key={a}>
                  <ShieldCheck size={25} aria-hidden="true" />
                  <div>
                    <h3>{es ? a : b}</h3>
                    <p>{es ? c : d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.documentLinks}>
            <Link className="button outline-light" href={href(lang, "impact")}>
              {es ? "Revisa nuestros informes" : "Read our reports"}
              <ArrowUpRight size={19} />
            </Link>
            <a
              className="button outline-light"
              href="https://drive.google.com/file/d/10b0yQ183pwdhK7gs7n1wpA1S6peH3J7Z/view?usp=drive_link"
              target="_blank"
              rel="noreferrer"
            >
              {es ? "Estados financieros · PDF" : "Financial statements · PDF"}
              <FileText size={19} />
            </a>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="donate-plan">
        <span className="eyebrow">
          {es ? "EL PLAN DE DONACIÓN" : "THE DONATION PLAN"}
        </span>
        <h2 id="donate-plan">{es ? "3 Pasos Simples" : "3 Simple Steps"}</h2>
        <div className={styles.steps}>
          {[
            [
              "Selecciona tu Aporte",
              "Choose Your Gift",
              "Define si deseas realizar un aporte mensual recurrente o una donación única por el valor que decidas.",
              "Decide whether to make a recurring monthly gift or a one-time donation of the amount you choose.",
            ],
            [
              "Transfiere con Seguridad",
              "Transfer Securely",
              "Procesa tu donación a través de nuestra pasarela cifrada (Tarjetas de crédito/débito internacionales, PSE, Nequi, Daviplata o PayPal).",
              "Process your donation through our encrypted payment gateway (international credit/debit cards, PSE, Nequi, Daviplata or PayPal).",
            ],
            [
              "Recibe tu Certificado (Únicamente en Colombia) y Reportes",
              "Receive Your Certificate (Colombia Only) and Reports",
              "Reportes trimestrales de avance en territorio.",
              "Quarterly progress reports from the ground.",
            ],
          ].map(([a, b, c, d], index) => (
            <article key={a} data-reveal>
              <span>0{index + 1}</span>
              <h3>{es ? a : b}</h3>
              <p>{es ? c : d}</p>
              {index === 2 && (
                <p className={styles.testNote}>
                  {es
                    ? "La emisión automática de certificados está pendiente de habilitación."
                    : "Automatic certificate issuance is pending activation."}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.community} aria-labelledby="donate-community">
        <div className={styles.section}>
          <span className="eyebrow">
            {es
              ? "Si hoy no puedes donar dinero, ¡tu presencia y energía se transforman!"
              : "If you cannot donate money today, your presence and energy can make a difference!"}
          </span>
          <h2 id="donate-community">
            {es
              ? "Únete a la gran Familia Alma Arcoíris"
              : "Join the Alma Arcoíris Family"}
          </h2>
          <div className={styles.communityGrid}>
            <div>
              <MessageCircle size={34} aria-hidden="true" />
              <h3>
                {es
                  ? "Súmate a nuestros círculos gratuitos en WhatsApp"
                  : "Join our free WhatsApp circles"}
              </h3>
              <p>
                {es
                  ? "Mantente conectado con meditaciones, saberes y actividades de campo."
                  : "Stay connected through meditations, knowledge and activities on the ground."}
              </p>
              <div className={styles.circleLinks}>
                <a
                  href={`https://wa.me/573044989707?text=${encodeURIComponent(es ? "Quiero unirme al Círculo Femenino EFIS" : "I would like to join the EFIS Women’s Circle")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {es
                    ? "Unirme al Círculo Femenino EFIS"
                    : "Join the EFIS Women’s Circle"}
                  <ArrowUpRight size={20} />
                </a>
                <a
                  href={`https://wa.me/573044989707?text=${encodeURIComponent(es ? "Quiero unirme a la Hermandad del Cóndor" : "I would like to join the Hermandad del Cóndor")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {es ? "Unirme a la Hermandad" : "Join the Brotherhood"}
                  <ArrowUpRight size={20} />
                </a>
              </div>
            </div>
            <div>
              <h3>{es ? "Únete al boletín" : "Join the newsletter"}</h3>
              <p>
                {es
                  ? "Entérate de convocatorias de voluntariado, caminatas ecológicas y misiones en territorio."
                  : "Hear about volunteering opportunities, ecological walks and missions on the ground."}
              </p>
              <CommunitySignup lang={lang} withName />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="donate-faq">
        <span className="eyebrow">FAQ</span>
        <h2 id="donate-faq">
          {es
            ? "Preguntas frecuentes sobre donaciones"
            : "Frequently asked questions about donations"}
        </h2>
        <div className={styles.faq}>
          {[
            [
              "¿Cómo obtengo mi certificado de donación deducible de impuestos?",
              "How do I obtain my tax donation certificate?",
              "La emisión automática de certificados no está habilitada en esta versión de pruebas. En Sandbox no se emiten certificados tributarios.",
              "Automatic certificate issuance is not enabled in this test version. Sandbox gifts do not receive tax certificates.",
            ],
            [
              "¿Puedo donar desde fuera de Colombia?",
              "Can I donate from outside Colombia?",
              "Sí. La pasarela de pagos acepta tarjetas de crédito/débito internacionales de cualquier país, así como transferencias seguras mediante PayPal.",
              "Yes. The payment gateway accepts international credit/debit cards from any country, as well as secure transfers through PayPal.",
            ],
            [
              "¿Cómo puedo cancelar o modificar mi donación mensual recurrente?",
              "How can I cancel or change my recurring monthly donation?",
              "Puedes gestionar, cambiar el monto o pausar tu suscripción en cualquier momento enviando un mensaje directo a nuestro equipo vía WhatsApp (+57 304 498 9707) o correo electrónico.",
              "You can manage, change the amount or pause your subscription at any time by messaging our team on WhatsApp (+57 304 498 9707) or by email.",
            ],
            [
              "¿Cómo garantizan que los fondos lleguen realmente al territorio?",
              "How do you ensure funds reach the communities?",
              "Publicamos anualmente los Estados Financieros Auditados NIIF y enviamos boletines con fotografías, testimonios y rendición de cuentas a toda nuestra red de donantes.",
              "We publish audited IFRS financial statements annually and send newsletters with photographs, testimonies and accountability reports to our donor network.",
            ],
          ].map(([a, b, c, d]) => (
            <details key={a}>
              <summary>
                {es ? a : b}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{es ? c : d}</p>
            </details>
          ))}
        </div>
        <a
          className={styles.support}
          href="mailto:misiones@fundacionalmaarcoiris.org"
        >
          misiones@fundacionalmaarcoiris.org
          <ArrowUpRight size={18} />
        </a>
      </section>
      <div className={styles.mobileBar}>
        <a href="#donar-formulario">
          <Heart size={20} aria-hidden="true" />
          {es ? "Donar ahora de forma segura" : "Donate securely now"}
        </a>
      </div>
    </div>
  );
}
