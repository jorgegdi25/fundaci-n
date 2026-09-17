import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Heart, Users } from "lucide-react";
import { href, type Lang, type PageKey } from "@/lib/i18n";
import type { Project } from "@/content/projects";
import {
  Photo,
  SectionTitle,
  ProjectCards,
  Faq,
  Closing,
} from "./content-blocks";
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

export function JoinPage({ lang }: { lang: Lang }) {
  const es = lang === "es";
  return (
    <>
      <section className="section page-intro">
        <span className="eyebrow">{es ? "SÚMATE" : "GET INVOLVED"}</span>
        <h1>
          {es
            ? "Reconecta con tu propósito en el territorio."
            : "Reconnect with your purpose on the land."}
        </h1>
        <p>
          {es
            ? "Caminatas, expediciones y encuentros que nos acercan a la naturaleza, a los saberes ancestrales y a una comunidad con ganas de aportar."
            : "Walks, expeditions and gatherings that bring us closer to nature, ancestral knowledge and a community that wants to contribute."}
        </p>
        <div className="button-row">
          <a className="button gold" href="#expediciones">
            {es ? "Explorar experiencias" : "Explore experiences"}
            <ArrowUpRight size={18} />
          </a>
          <a className="button outline" href={contact}>
            {es ? "Quiero ser voluntario" : "I’d like to volunteer"}
          </a>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <article className="feature-row" id="caminatas">
          <Photo
            src="/images/nelly.webp"
            alt={es ? "Caminata en la naturaleza" : "A walk in nature"}
          />
          <div>
            <span className="eyebrow">
              {es ? "CAMINATAS CONSCIENTES" : "MINDFUL WALKS"}
            </span>
            <h2>
              {es
                ? "Caminar para volver a escuchar."
                : "Walk. Pause. Listen again."}
            </h2>
            <p>
              {es
                ? "Salidas ecológicas, conciencia ancestral y espacios de meditación. Una invitación a bajar el ritmo y descubrir nuestra relación con el entorno."
                : "Nature walks, ancestral awareness and moments of meditation. An invitation to slow down and discover our relationship with the living world."}
            </p>
            <p>
              {es
                ? "Consulta con el equipo la próxima salida, su recorrido, nivel de dificultad y aporte de participación."
                : "Ask our team about the next walk, its route, difficulty and participation contribution."}
            </p>
            <a
              className="button outline"
              href={`${contact}?subject=Caminatas%20conscientes`}
            >
              {es ? "Consultar próximas caminatas" : "Ask about upcoming walks"}
              <ArrowUpRight size={17} />
            </a>
          </div>
        </article>
        <article className="feature-row" id="expediciones">
          <Photo
            src="/images/amazonas-hero.webp"
            alt={
              es
                ? "Trabajo comunitario en la Misión Amazonas"
                : "Community work in the Amazon mission"
            }
          />
          <div>
            <span className="eyebrow">
              {es
                ? "VOLUNTARIADO Y EXPEDICIONES"
                : "VOLUNTEERING AND EXPEDITIONS"}
            </span>
            <h2>
              {es
                ? "Compartir el camino, construir en comunidad."
                : "Share the journey. Build together."}
            </h2>
            <p>
              {es
                ? "Expediciones de cinco días en la Sierra Nevada y seis días en el Amazonas, vinculadas al cuidado del territorio y al trabajo comunitario. En El Cairo, las mingas reúnen saberes y manos para la reconstrucción."
                : "Five-day expeditions in the Sierra Nevada and six-day expeditions in the Amazon, connected to caring for the land and working with communities. In El Cairo, rebuilding mingas bring together skills and helping hands."}
            </p>
            <p>
              {es
                ? "La participación es autofinanciada. Antes de inscribirte, el equipo te compartirá las fechas disponibles, requisitos, costos, logística y cómo se apoya al proyecto."
                : "Participation is self-funded. Before you register, our team will share available dates, requirements, costs, logistics and how the project benefits."}
            </p>
            <a
              className="button purple"
              href={`${contact}?subject=Participar%20en%20una%20expedici%C3%B3n`}
            >
              {es ? "Quiero participar" : "I’d like to take part"}
              <ArrowUpRight size={17} />
            </a>
          </div>
        </article>
        <article className="feature-row" id="encuentros">
          <Photo
            src="/images/mhuysqa-agua.webp"
            alt={
              es
                ? "Encuentro del pueblo Mhuysqa junto al agua"
                : "A Mhuysqa gathering by the water"
            }
          />
          <div>
            <span className="eyebrow">
              {es ? "EVENTOS Y FOROS CULTURALES" : "CULTURAL EVENTS AND FORUMS"}
            </span>
            <h2>
              {es
                ? "Un espacio para la palabra y los saberes."
                : "A space for stories and shared knowledge."}
            </h2>
            <p>
              {es
                ? "Encuentros con sabedores ancestrales, círculos de palabra, talleres de tejido, cantos al agua y mingas. Nos reunimos con respeto por las autoridades y los procesos de cada comunidad."
                : "Gatherings with ancestral knowledge keepers, listening circles, weaving workshops, songs to water and mingas. We come together with respect for each community’s authorities and traditions."}
            </p>
            <a
              className="button outline"
              href={`${contact}?subject=Encuentros%20y%20foros%20culturales`}
            >
              {es
                ? "Consultar próximos encuentros"
                : "Ask about upcoming gatherings"}
              <ArrowUpRight size={17} />
            </a>
          </div>
        </article>
        <SectionTitle
          eyebrow={es ? "REDES QUE ACOMPAÑAN" : "SUPPORTIVE COMMUNITIES"}
          title={
            es
              ? "La reconexión continúa en comunidad."
              : "Connection continues in community."
          }
        />
        <div className="community-grid">
          {[
            [
              "EFIS",
              es
                ? "Una red de encuentro y apoyo entre mujeres. Conoce las actividades y cómo ser parte."
                : "A network for women to connect and support each other. Discover the activities and how to take part.",
            ],
            [
              es ? "Hermandad del Cóndor" : "Hermandad del Cóndor",
              es
                ? "Un espacio de encuentro y comunidad. Consulta al equipo sus próximas actividades."
                : "A space for gathering and community. Ask our team about upcoming activities.",
            ],
          ].map(([title, description]) => (
            <article key={title}>
              <Users size={28} />
              <h3>{title}</h3>
              <p>{description}</p>
              <a
                className="text-link"
                href={`${contact}?subject=${encodeURIComponent(title)}`}
              >
                {es ? "Conocer la comunidad" : "Meet the community"}
                <ArrowUpRight size={17} />
              </a>
            </article>
          ))}
        </div>
      </section>
      <Faq
        lang={lang}
        items={[
          {
            question: es
              ? "¿Necesito experiencia para participar?"
              : "Do I need experience to take part?",
            answer: es
              ? "Los requisitos dependen de la actividad y del territorio. Cuéntanos tus intereses y habilidades para encontrar la forma de participación adecuada."
              : "Requirements depend on the activity and territory. Tell us about your interests and skills so we can find a suitable way for you to take part.",
          },
          {
            question: es
              ? "¿Dónde veo las fechas y los costos?"
              : "Where can I find dates and costs?",
            answer: es
              ? "El calendario confirmado se incorporará a esta página. Mientras tanto, consulta directamente con el equipo; no se reciben reservas ni pagos de experiencias desde esta vista previa."
              : "Confirmed dates will be added to this page. For now, contact our team directly; this preview does not accept bookings or payments for experiences.",
          },
        ]}
      />
    </>
  );
}

const team = [
  ["Óscar y Tatiana", "Equipo de proyectos", "Project team"],
  ["Julián Méndez", "Guía y etnoeducador", "Guide and ethno-educator"],
  [
    "Sospkwachiswa Yeison Márquez",
    "Líder juvenil Mhuysqa",
    "Mhuysqa youth leader",
  ],
  ["Claudia, Alejandro y Ana Zivkovic", "Liderazgo", "Leadership"],
  ["Bernardo", "Legal internacional", "International legal support"],
  [
    "Jorge González · SEM BOX España",
    "Desarrollo web · Campañas digitales",
    "Web development · Digital campaigns",
  ],
];
const allies = [
  ["google", "Google for Nonprofits"],
  ["elevenlabs", "ElevenLabs"],
  ["canva", "Canva"],
  ["contablemente", "Contablemente"],
  ["semilla", "ONG La Semilla"],
  ["aldenjina", "Aldeñjina"],
  ["santuario", "Santuario"],
  ["mujer", "Mujer Potencia"],
  ["potencia", "Potencia Humana"],
];
export function AboutPage({ lang }: { lang: Lang }) {
  const es = lang === "es";
  return (
    <>
      <section className="section page-intro">
        <span className="eyebrow">
          {es ? "CONÓCENOS · NUESTRA RAÍZ" : "ABOUT US · OUR ROOTS"}
        </span>
        <h1>
          {es
            ? "Unión consciente, corazón y mente."
            : "Conscious connection, heart and mind."}
        </h1>
        <p>
          {es
            ? "Somos Fundación Alma Arcoíris, una entidad sin ánimo de lucro en Colombia. Acompañamos a comunidades indígenas guardianas de la biodiversidad y creamos puentes con quienes quieren contribuir a su bienestar."
            : "We are Fundación Alma Arcoíris, a Colombian nonprofit. We support Indigenous communities that safeguard biodiversity and connect them with people who want to contribute to their wellbeing."}
        </p>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <article className="feature-row">
          <Photo
            src="/images/permisos-kogui.webp"
            alt={
              es
                ? "Encuentro de la fundación con autoridades Kogui"
                : "The foundation meeting with Kogui authorities"
            }
          />
          <div>
            <span className="eyebrow">{es ? "QUÉ HACEMOS" : "WHAT WE DO"}</span>
            <h2>
              {es
                ? "Cuidar la vida empieza por reconocernos."
                : "Caring for life begins with connection."}
            </h2>
            <p>
              {es
                ? "Impulsamos el bienestar y la soberanía de comunidades indígenas guardianes de la biodiversidad en Colombia."
                : "We support the wellbeing and sovereignty of Indigenous communities who protect biodiversity in Colombia."}
            </p>
            <p>
              {es
                ? "Desarrollamos proyectos de doble impacto que conectan la sabiduría indígena Kogui, Mhuysqa y Tikuna con el desarrollo sostenible mediante expediciones con propósito, reconexión ecológica y espiritual, protegiendo así la vida, la cultura y el planeta."
                : "Our projects connect Kogui, Mhuysqa and Tikuna Indigenous wisdom with sustainable development through purposeful expeditions and ecological and spiritual reconnection, protecting life, culture and the planet."}
            </p>
            <Link className="text-link" href={href(lang, "impact")}>
              {es ? "Conoce nuestros resultados" : "Explore our results"}
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </article>
        <div className="editorial-pending">
          <h2>{es ? "Nuestra raíz" : "Our roots"}</h2>
          <p>
            {es
              ? "Misión, visión y Círculo de Oro 2026: pendientes de incorporar el texto institucional aprobado por la fundación."
              : "Mission, vision and 2026 Golden Circle: awaiting the foundation’s approved institutional wording."}
          </p>
        </div>
      </section>
      <section className="section" id="equipo">
        <SectionTitle
          eyebrow={
            es
              ? "SABEDORES, EQUIPO Y COLABORADORES"
              : "KNOWLEDGE KEEPERS, TEAM AND COLLABORATORS"
          }
          title={
            es
              ? "Un trabajo tejido entre muchas manos."
              : "Work made possible by many hands."
          }
          text={
            es
              ? "Las autoridades y los sabedores de cada comunidad orientan nuestro encuentro con el territorio. El equipo y los colaboradores acompañan sus procesos."
              : "Community authorities and knowledge keepers guide our relationship with the land. Our team and collaborators support their work."
          }
        />
        <div className="team-grid">
          {team.map(([name, role, roleEn]) => (
            <article className="team-card" key={name}>
              <span aria-hidden="true">{name.charAt(0)}</span>
              <h3>{name}</h3>
              <p>{es ? role : roleEn}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section" id="alianzas">
        <SectionTitle
          eyebrow={es ? "ALIANZAS Y PATROCINIOS" : "PARTNERSHIPS AND SUPPORT"}
          title={
            es
              ? "Conectados, llegamos más lejos."
              : "Together, we can go further."
          }
          text={
            es
              ? "Soporte tecnológico, cooperación y alianzas de impacto indicadas por la fundación."
              : "Technology support, cooperation and impact partnerships identified by the foundation."
          }
        />
        <div className="allies">
          {allies.map(([file, name]) => (
            <div key={file}>
              <Image
                src={`/images/ally-${file}.webp`}
                alt={name}
                width={240}
                height={120}
              />
            </div>
          ))}
        </div>
      </section>
      <Closing lang={lang} />
    </>
  );
}

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
              ? "Todavía no. La fundación está preparando sus cuentas de Wompi y PayPal. Esta vista previa permite seleccionar y revisar el aporte, sin solicitar datos bancarios ni efectuar cobros."
              : "Not yet. The foundation is preparing its Wompi and PayPal accounts. This preview lets you choose and review a gift without collecting payment details or making charges.",
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
