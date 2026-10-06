import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";
import { href, type Lang, type PageKey } from "@/lib/i18n";
import type { Project } from "@/content/projects";
import { ProjectCards, Faq, Closing } from "./content-blocks";
import { DonationForm } from "./donation-form";

const contact = "mailto:contacto@fundacionalmaarcoiris.org";
export function ProjectsIndex({
  lang,
  projects,
}: {
  lang: Lang;
  projects: Project[];
}) {
  const es = lang === "es";
  return (
    <>
      <section className="section page-intro">
        <span className="eyebrow">
          {es ? "PROYECTOS EN TERRITORIO" : "COMMUNITY PROJECTS"}
        </span>
        <h1>
          {es
            ? "Cuatro territorios. Un propósito compartido."
            : "Four territories. One shared purpose."}
        </h1>
        <p>
          {es
            ? "Acompañamos a comunidades que cuidan la vida, la cultura y la biodiversidad de Colombia. Conoce su trabajo y elige la misión que quieres apoyar."
            : "We work alongside communities that care for life, culture and biodiversity in Colombia. Discover their work and choose the mission you would like to support."}
        </p>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <ProjectCards lang={lang} projects={projects} />
      </section>
      <Closing lang={lang} />
    </>
  );
}

export { JoinPage, AboutPage } from "./institutional-pages";

export function DonatePage({ lang }: { lang: Lang }) {
  const es = lang === "es";
  return (
    <>
      <section className="section page-intro">
        <span className="eyebrow">
          {es ? "TU APORTE TIENE UN PROPÓSITO" : "YOUR GIFT HAS A PURPOSE"}
        </span>
        <h1>
          {es
            ? "Ayúdanos a cuidar la vida y los territorios."
            : "Help us care for life and the land."}
        </h1>
        <p>
          {es
            ? "Elige un aporte único o mensual y la causa que quieres acompañar. Estamos preparando los pagos en línea; por ahora puedes explorar las opciones y conversar con la fundación."
            : "Choose a one-time or monthly gift and the cause you would like to support. We are preparing online payments; for now, explore the options and get in touch with the foundation."}
        </p>
      </section>
      <section className="section donation-section">
        <div className="donation-story">
          <Heart size={36} color="#534a8f" />
          <h2>
            {es
              ? "La continuidad también transforma."
              : "Lasting support creates lasting change."}
          </h2>
          <p>
            {es
              ? "Un aporte mensual permite acompañar procesos comunitarios. Una donación única suma a las necesidades del territorio. Tú eliges cómo contribuir."
              : "A monthly gift helps sustain community work. A one-time donation contributes to local needs. You choose how to help."}
          </p>
          <Link
            className="text-link"
            style={{ marginTop: 25 }}
            href={href(lang, "impact")}
          >
            {es ? "Revisa nuestros informes" : "Read our reports"}
            <ArrowUpRight size={17} />
          </Link>
        </div>
        <DonationForm lang={lang} />
      </section>
      <Faq
        lang={lang}
        items={[
          {
            question: es
              ? "¿Ya puedo realizar un pago en esta página?"
              : "Can I make a payment on this website now?",
            answer: es
              ? "Los cobros reales todavía no están habilitados. Cuando veas el aviso de modo de pruebas, podrás revisar Wompi con datos ficticios, sin mover dinero real. No introduzcas datos bancarios reales en estas pruebas."
              : "Real payments are not enabled yet. When the test mode notice appears, you can try Wompi with fictitious data without moving real money. Do not enter real banking details in these tests.",
          },
          {
            question: es
              ? "¿Puedo elegir un proyecto?"
              : "Can I choose a project?",
            answer: es
              ? "Sí. Puedes seleccionar El Cairo, Sierra Nevada, Amazonas, Pueblo Mhuysqa o apoyar el trabajo general de la fundación."
              : "Yes. Choose El Cairo, Sierra Nevada, the Amazon, the Mhuysqa people or support the foundation’s overall work.",
          },
          {
            question: es
              ? "¿Cómo recibo orientación para donar?"
              : "How can I get help with donating?",
            answer: es
              ? "Escríbenos a contacto@fundacionalmaarcoiris.org. El equipo podrá explicarte las opciones disponibles y la documentación del aporte."
              : "Email contacto@fundacionalmaarcoiris.org. Our team can explain the available options and documentation for your gift.",
          },
        ]}
      />
    </>
  );
}

export function LegalPage({ lang, kind }: { lang: Lang; kind: PageKey }) {
  const es = lang === "es";
  const privacy = kind === "privacy";
  const cookies = kind === "cookies";
  return (
    <>
      <section className="section page-intro">
        <span className="eyebrow">Fundación Alma Arcoíris</span>
        <h1>
          {cookies
            ? es
              ? "Preferencias de cookies"
              : "Cookie preferences"
            : privacy
              ? es
                ? "Privacidad y datos personales"
                : "Privacy and personal data"
              : es
                ? "Condiciones de esta vista previa"
                : "Preview terms"}
        </h1>
        <p>
          {es
            ? "Información de la versión de revisión del sitio."
            : "Information for the website review version."}
        </p>
      </section>
      <section className="section legal-copy">
        <h2>{es ? "Alcance actual" : "Current scope"}</h2>
        <p>
          {es
            ? "Esta versión permite consultar los proyectos y explorar una intención de donación. No procesa pagos, no registra suscripciones ni envía formularios a una base de datos."
            : "This version lets you explore projects and review a potential gift. It does not process payments, register subscriptions or send forms to a database."}
        </p>
        <h2>
          {cookies
            ? es
              ? "Tus preferencias"
              : "Your preferences"
            : privacy
              ? es
                ? "Información y contacto"
                : "Information and contact"
              : es
                ? "Contenido en revisión"
                : "Content under review"}
        </h2>
        <p>
          {cookies
            ? es
              ? "Guardamos tus preferencias en el almacenamiento local del navegador. En esta versión no se cargan servicios de analítica ni publicidad. Puedes cambiar o retirar tu elección desde “Cookies” en el pie de página."
              : "We save your preferences in your browser’s local storage. This version loads no analytics or advertising services. Change or withdraw your choices through “Cookies” in the footer."
            : privacy
              ? es
                ? "Los enlaces de correo y WhatsApp abren un servicio externo. Si decides comunicarte por esos canales, la información se enviará a través del proveedor elegido. Puedes consultar el tratamiento de tus datos con la fundación."
                : "Email and WhatsApp links open an external service. If you choose to contact us through them, information will be sent through that provider. Contact the foundation about how your data is handled."
              : es
                ? "Los indicadores, documentos institucionales y políticas definitivas requieren validación de la fundación antes de la publicación. Las experiencias se coordinan directamente con el equipo; esta página no realiza reservas."
                : "The foundation must validate indicators, institutional records and final policies before publication. Experiences are coordinated directly with the team; this website does not take bookings."}
        </p>
        <h2>{es ? "Contenido externo" : "External content"}</h2>
        <p>
          {es
            ? "Los videos de YouTube se cargan únicamente cuando eliges reproducirlos. La navegación a redes sociales y documentos externos está sujeta a las condiciones de sus respectivos servicios."
            : "YouTube videos load only when you choose to play them. Visits to social networks and external documents are subject to those services’ terms."}
        </p>
        <h2>{es ? "Responsable y consultas" : "Organisation and enquiries"}</h2>
        <p>
          Fundación Alma Arcoíris · NIT 901784588-0 · Chía, Colombia.
          <br />
          <a href={contact}>contacto@fundacionalmaarcoiris.org</a>
        </p>
        <p>
          {es
            ? "La política completa de tratamiento de datos, los canales para ejercer derechos y las condiciones de las donaciones se incorporarán antes de habilitar el sitio público."
            : "The full data policy, rights request channels and donation terms will be added before the public website is enabled."}
        </p>
      </section>
    </>
  );
}
