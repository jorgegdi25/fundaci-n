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
import { useDonationChannel } from "./donation-channel";
import { LegacyDonationPage } from "./legacy-donation";

// Copy: ajustes DONAR oct 24 2026. Unchanged cause descriptions retain the prior client copy.
const causes = [
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
  {
    id: "el-cairo",
    image: "/images/el-cairo-escuela.webp",
    name: [
      "Reconstrucción de escuela tras el terremoto en El Cairo (Embera Chamí)",
      "School rebuilding after the El Cairo earthquake (Embera Chamí)",
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
] as const;

export function DonatePage({ lang }: { lang: Lang }) {
  const es = lang === "es",
    i = es ? 0 : 1;
  const [cause, setCause] = useState("general");
  const widget = useRef<HTMLDivElement>(null);
  const channel = useDonationChannel();
  if (channel !== "sandbox") return <LegacyDonationPage lang={lang} />;
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
                NIT 901784588-0 ·{" "}
                {es
                  ? "Entidad sin Ánimo de Lucro (ESAL) · Régimen Tributario Especial"
                  : "Nonprofit organisation (ESAL) · Special Tax Regime"}
              </span>
            </div>
            <h1 id="donate-title">
              {es
                ? "Tu generosidad protege la vida, la cultura y los ecosistemas de Colombia"
                : "Your generosity protects Colombia’s life, culture and ecosystems"}
            </h1>
            <p>
              {es
                ? "Transforma tu intención en desarrollo real. Cada donación fortalece la educación, la bioconstrucción y la soberanía de los pueblos indígenas Embera Chamí, Kogui, Tikuna y Mhuysqa, o apoya la capacidad operativa de nuestra Fundación."
                : "Turn your intention into real development. Every donation strengthens education, natural building and the sovereignty of the Embera Chamí, Kogui, Tikuna and Mhuysqa Indigenous peoples, or supports our Foundation’s operational capacity."}
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
                {es
                  ? "Pago procesado por Wompi / PayPal"
                  : "Payment processed by Wompi / PayPal"}
              </span>
              <FileText size={19} aria-hidden="true" />
              <span>
                {es
                  ? "Certificado de donación disponible en Colombia"
                  : "Donation certificate available in Colombia"}
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
            ? "Transparencia en la acción: Conoce la Misión y el territorio de tu impacto."
            : "Transparency in action: discover the Mission and the land of your impact."}
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
          <h2 id="transparency-title">
            {es
              ? "Cuentas Claras: Así ejecutamos tu confianza"
              : "Clear Accounts: How we put your trust into action"}
          </h2>
          <div className={styles.accountability}>
            <div className={styles.metric}>
              <p>
                {es
                  ? "Del total de tu aporte destinado a un proyecto en territorio, el 85% se invierte directamente en materiales, trabajo comunitario y logística de campo, mientras que el 15% asegura nuestra coordinación técnica, seguimiento y procesos de rendición de cuentas anual. Ese 15% es el equipo que hace posible que la ayuda llegue, que sea sostenible y que tú puedas auditar los resultados."
                  : "Of your total contribution to a project on the ground, 85% is invested directly in materials, community work and field logistics, while 15% ensures technical coordination, monitoring and annual accountability. That 15% supports the team that gets help to the communities, makes it sustainable and enables you to audit the results."}
              </p>
            </div>
            <div className={styles.metric}>
              <h3>
                {es ? "¿Qué es el Fondo General?" : "What is the General Fund?"}
              </h3>
              <p>
                {es
                  ? "Si decides aportar al Fondo General, estás sosteniendo a quienes sostienen los proyectos. Este fondo vital cubre nuestra estructura contable, revisoría fiscal, seguros, infraestructura tecnológica y la planeación estratégica de nuevas misiones. Cada trimestre, informamos a nuestros donantes exactos sobre el uso de este fondo de fortalecimiento institucional."
                  : "By contributing to the General Fund, you support those who sustain the projects. This vital fund covers accounting, statutory auditing, insurance, technology infrastructure and strategic planning for new missions. Every quarter, we inform our donors about exactly how this institutional strengthening fund is used."}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section
        className={`${styles.section} ${styles.legal}`}
        aria-labelledby="legal-title"
      >
        <h2 id="legal-title">
          {es
            ? "Institucionalidad y cumplimiento de ley"
            : "Institutional standing and legal compliance"}
        </h2>
        <div className={styles.credentials}>
          <div>
            <ShieldCheck size={25} aria-hidden="true" />
            <div>
              <h3>
                {es ? "Vigilancia Gubernamental" : "Government Oversight"}
              </h3>
              <p>
                {es
                  ? "Contamos con certificación vigente expedida por la Gobernación de Cundinamarca (Rad. GOB-S-CR-2026-0168636) y estados financieros auditados bajo NIIF para PYMES."
                  : "We hold a current certificate issued by the Government of Cundinamarca (reference GOB-S-CR-2026-0168636) and audited financial statements under IFRS for SMEs."}
              </p>
            </div>
          </div>
          <div>
            <FileText size={25} aria-hidden="true" />
            <div>
              <h3>{es ? "Certificado de Donación" : "Donation Certificate"}</h3>
              <p>
                {es
                  ? "Si eres contribuyente en Colombia y lo solicitas al donar, la Fundación emitirá un certificado oficial conforme a la ley (a más tardar en enero del año siguiente). Este documento te da derecho a un descuento tributario del 25% del valor donado (art. 257 E.T.) en tu declaración de renta (con los límites que establece la norma)."
                  : "If you are a taxpayer in Colombia and request it when donating, the Foundation will issue an official certificate in accordance with the law, no later than January of the following year. This document entitles you to a tax credit of 25% of the donated amount (Article 257 of the Tax Statute) in your income tax return, subject to the statutory limits."}
              </p>
              <a
                href="mailto:certificados@fundacionalmaarcoiris.org"
                className={styles.certificateLink}
              >
                certificados@fundacionalmaarcoiris.org
              </a>
            </div>
          </div>
          <div>
            <Leaf size={25} aria-hidden="true" />
            <div>
              <h3>{es ? "Respeto Territorial" : "Respect for the Land"}</h3>
              <p>
                {es
                  ? "Todo proyecto con comunidades originarias opera bajo el acuerdo y aval previo de sus autoridades tradicionales, garantizando un consentimiento libre e informado."
                  : "Every project with Indigenous communities operates with prior agreement and endorsement from their traditional authorities, ensuring free and informed consent."}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.documentLinks}>
          <Link className="button outline" href={href(lang, "impact")}>
            {es ? "Revisa nuestros informes" : "Read our reports"}
            <ArrowUpRight size={19} />
          </Link>
          <a
            className="button outline"
            href="https://drive.google.com/file/d/10b0yQ183pwdhK7gs7n1wpA1S6peH3J7Z/view?usp=drive_link"
            target="_blank"
            rel="noreferrer"
          >
            {es ? "Estados financieros · PDF" : "Financial statements · PDF"}
            <FileText size={19} />
          </a>
          <a
            className="button outline"
            href="https://drive.google.com/file/d/1RorNR6htOTf_Wr9Enni-agJ3C3g4K-Ek/view?usp=drive_link"
            target="_blank"
            rel="noreferrer"
          >
            {es
              ? "Certificado de vigilancia 2026 · PDF"
              : "2026 oversight certificate · PDF"}
            <FileText size={19} />
          </a>
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
              "Solicita tu certificado en certificados@fundacionalmaarcoiris.org. Se emite conforme a la ley, a más tardar en enero del año siguiente.",
              "Request your certificate at certificados@fundacionalmaarcoiris.org. It is issued in accordance with the law, no later than January of the following year.",
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
              ? "Tu energía y tiempo también suman. Únete a la comunidad."
              : "Your energy and time count too. Join the community."}
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
                <a
                  href="https://www.youtube.com/@FundacionAlmaArcoiris"
                  target="_blank"
                  rel="noreferrer"
                >
                  {es
                    ? "Suscribirme al canal de YouTube"
                    : "Subscribe to our YouTube channel"}
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
              "¿Recibo certificado de donación?",
              "Will I receive a donation certificate?",
              "Sí. Somos una entidad sin ánimo de lucro calificada en el Régimen Tributario Especial. Si lo necesitas, déjanos tu nombre y documento al donar; lo emitimos conforme a la ley a más tardar en enero del año siguiente. Los contribuyentes en Colombia pueden tener derecho a un descuento del 25% del valor donado (art. 257 E.T.), con sus límites.",
              "Yes. We are a nonprofit organisation qualified under Colombia’s Special Tax Regime. If you need one, provide your name and identification when donating; we issue it in accordance with the law, no later than January of the following year. Taxpayers in Colombia may be entitled to a tax credit of 25% of the donated amount (Article 257), subject to statutory limits.",
            ],
            [
              "¿A dónde va tu donación?",
              "Where does your donation go?",
              "Del 100% de tu aporte a este proyecto, 85% se destina a materiales, trabajo comunitario y logística en el territorio y 15% a coordinación, seguimiento y rendición de cuentas. Ese 15% es el equipo que hace que lo que prometemos llegue y que puedas verificarlo.",
              "Of your full contribution to this project, 85% goes to materials, community work and logistics on the ground, and 15% to coordination, monitoring and accountability. That 15% supports the team that fulfils our commitments and lets you verify the results.",
            ],
            [
              "Fondo General",
              "General Fund",
              "Sostiene a quienes sostienen los proyectos. Cubre el equipo, la contabilidad, la revisoría fiscal, los seguros y la logística que todos los proyectos necesitan. Informamos en qué se usa cada trimestre.",
              "It supports those who sustain the projects. It covers the team, accounting, statutory auditing, insurance and logistics that all projects need. We report on its use every quarter.",
            ],
            [
              "Cubre los costos de tu donación (opcional)",
              "Cover donation costs (optional)",
              "Quiero sumar 5% / 10% / 15% para cubrir la comisión de la pasarela y aportar a la operación de la Fundación.",
              "I would like to add 5% / 10% / 15% to cover payment processing and contribute to the Foundation’s operations.",
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
