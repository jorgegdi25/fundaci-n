import Link from "next/link";
import { href, type Lang, type PageKey } from "@/lib/i18n";
import type { Project } from "@/content/projects";
import { ProjectCards, Closing } from "./content-blocks";

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
            ? "Empoderamos a los guardianes ancestrales de la biodiversidad global. Ejecutamos proyectos de doble impacto que conectan la sabiduría indígena con el desarrollo sostenible. Conoce su trabajo y elige la misión que quieres apoyar"
            : "We empower the ancestral guardians of global biodiversity. We carry out projects with a dual impact that connect Indigenous wisdom with sustainable development. Discover their work and choose the mission you want to support."}
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

export { DonatePage } from "./donate-page";

export function LegalPage({ lang, kind }: { lang: Lang; kind: PageKey }) {
  const es = lang === "es";
  const privacy = kind === "privacy";
  const cookies = kind === "cookies";
  if (kind === "dataPolicy")
    return (
      <>
        <section className="section page-intro">
          <span className="eyebrow">
            Fundación Alma Arcoíris Colombia · NIT 901784588-0
          </span>
          <h1>
            {es
              ? "Política de Tratamiento de Datos Personales"
              : "Personal Data Processing Policy"}
          </h1>
        </section>
        <section className="section legal-copy">
          <p>
            {es
              ? "Responsable: Fundación Alma Arcoíris, carrera 9A No 21-61 Cs1, Chía, Cundinamarca, Colombia."
              : "Data controller: Fundación Alma Arcoíris, carrera 9A No 21-61 Cs1, Chía, Cundinamarca, Colombia."}
          </p>
          <h2>{es ? "Finalidades y derechos" : "Purposes and rights"}</h2>
          <p>
            {es
              ? "Gestión de proyectos y donaciones, comunicación institucional y seguridad en misiones. Puedes conocer, actualizar y rectificar tus datos, solicitar prueba de autorización y ejercer tus derechos ante la Fundación."
              : "Project and donation management, institutional communication and mission safety. You can access, update and correct your data, request proof of authorization and exercise your rights with the Foundation."}
          </p>
          <a
            className="text-link"
            href="mailto:contacto@fundacionalmaarcoiris.org"
          >
            contacto@fundacionalmaarcoiris.org
          </a>
          <p>
            <a
              className="text-link"
              href="https://fundacionalmaarcoiris.org/politica-de-privacidad"
              target="_blank"
              rel="noreferrer"
            >
              {es
                ? "Consultar la política institucional completa"
                : "Read the full institutional policy"}
            </a>
          </p>
        </section>
      </>
    );
  return (
    <>
      <section className="section page-intro">
        <span className="eyebrow">Fundación Alma Arcoíris</span>
        <h1>
          {cookies
            ? es
              ? "Cookies y Aviso Legal"
              : "Cookies and Legal Notice"
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
        {(privacy || cookies) && (
          <p>
            <a
              className="text-link"
              href={
                privacy
                  ? "https://fundacionalmaarcoiris.org/politica-de-privacidad"
                  : "https://fundacionalmaarcoiris.org/avisolegalycookies/"
              }
              target="_blank"
              rel="noreferrer"
            >
              {es
                ? "Consultar el documento institucional completo"
                : "Read the full institutional document"}
            </a>
          </p>
        )}
        <h2>{es ? "Alcance actual" : "Current scope"}</h2>
        <p>
          {es
            ? "Esta versión permite consultar los proyectos y probar aportes únicos y mensuales con Wompi y PayPal Sandbox. No mueve dinero real. Guarda el aporte de prueba, su autorización y su estado en una base de datos de pruebas. Los datos del medio de pago se introducen en la plataforma de pagos correspondiente."
            : "This version lets you explore projects and test one-time and monthly gifts with Wompi and PayPal Sandbox. No real money moves. The test gift, authorization and status are stored in a test database. Payment method details are entered through the relevant payment platform."}
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
