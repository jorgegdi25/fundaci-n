import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  MapPin,
  Plus,
  Heart,
  Leaf,
  HandHeart,
  Footprints,
  ShieldCheck,
  Check,
  Sun,
  Users,
  FileText,
} from "lucide-react";
import { href, projectHref, type Lang } from "@/lib/i18n";
import type { Project } from "@/content/projects";
import { DonationForm } from "./donation-form";
import { VideoCard, FinancialChart } from "./interactions";
export function Photo({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      className={`photo ${className}`}
      src={src}
      alt={alt}
      width={1800}
      height={1200}
      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 90vw, 1300px"
      preload={priority}
    />
  );
}
export function SectionTitle({
  eyebrow,
  title,
  text,
  light = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  light?: boolean;
}) {
  return (
    <div className={`section-title ${light ? "light" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
export function ProjectCards({
  lang,
  projects,
}: {
  lang: Lang;
  projects: Project[];
}) {
  const es = lang === "es";
  return (
    <div className="project-grid">
      {projects.map((p, i) => (
        <Link
          href={projectHref(lang, p.slug)}
          key={p.slug}
          className="project-card"
        >
          <div className="project-photo">
            <Photo src={p.image} alt={p.alt[lang]} />
            {i === 0 && (
              <span className="project-tag">
                {es ? "Respuesta humanitaria" : "Humanitarian response"}
              </span>
            )}
            <span className="round-arrow">
              <ArrowUpRight size={23} />
            </span>
          </div>
          <div className="project-card-copy">
            <span className="eyebrow">{p.location[lang]}</span>
            <h3>
              {p.slug === "sierra-nevada"
                ? es
                  ? "Comunidad Kogui"
                  : "Kogui community"
                : p.slug === "amazonas"
                  ? es
                    ? "Comunidad Tikuna"
                    : "Tikuna community"
                  : p.name[lang]}
            </h3>
            <p>
              {
                [
                  es
                    ? "Reconstrucción de hogares y comunidad."
                    : "Rebuilding homes and community.",
                  es
                    ? "Cuidando el corazón del mundo."
                    : "Caring for the heart of the world.",
                  es
                    ? "Empoderando a los guardianes de la selva."
                    : "Empowering the guardians of the rainforest.",
                  es
                    ? "Fondo de apoyo a sabedoras Mhuysqas."
                    : "Supporting Mhuysqa women knowledge keepers.",
                ][i]
              }
            </p>
            <span className="text-link">
              {es ? "Dona ahora" : "Donate now"}
              <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
export function Faq({
  items,
  title,
  lang,
}: {
  items: { question: string; answer: string }[];
  title?: string;
  lang: Lang;
}) {
  return (
    <section className="section faq-section">
      <SectionTitle
        eyebrow={
          lang === "es" ? "RESOLVAMOS TUS DUDAS" : "YOUR QUESTIONS, ANSWERED"
        }
        title={
          title ??
          (lang === "es"
            ? "Preguntas frecuentes"
            : "Frequently asked questions")
        }
      />
      <div className="faq-list">
        {items.map((q, i) => (
          <details key={i} suppressHydrationWarning>
            <summary>
              {q.question}
              <Plus size={21} />
            </summary>
            <p>{q.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
export function Closing({ lang }: { lang: Lang }) {
  const es = lang === "es";
  return (
    <section className="closing">
      <span className="eyebrow">
        {es
          ? "UN PEQUEÑO GESTO. UN CAMBIO COMPARTIDO."
          : "ONE SMALL GESTURE. A SHARED CHANGE."}
      </span>
      <h2>
        {es
          ? "Tu confianza sostiene la vida y la cultura en el territorio."
          : "Your trust sustains life and culture in the territory."}
      </h2>
      <Link className="button gold" href={href(lang, "donate")}>
        <Heart size={18} />
        {es ? "Realizar una donación" : "Make a donation"}
        <ArrowUpRight size={18} />
      </Link>
    </section>
  );
}
export function Home({ lang, projects }: { lang: Lang; projects: Project[] }) {
  const es = lang === "es";
  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="full-photo-hero">
          <Photo
            src="/images/home-hero.webp"
            alt={
              es
                ? "Guardianes de los saberes ancestrales en su territorio, Colombia"
                : "Guardians of ancestral knowledge on their land in Colombia"
            }
            priority
          />
          <div className="full-photo-message section">
            <span className="eyebrow">Fundación Alma Arcoíris</span>
            <h1 id="home-title">
              {es
                ? "Reconecta con los saberes ancestrales."
                : "Reconnect with ancestral wisdom."}
            </h1>
          </div>
          <div className="full-photo-identity">
            <ShieldCheck size={22} aria-hidden="true" />
            <span>
              Fundación Alma Arcoíris Colombia · NIT 901784588-0 ·{" "}
              {es ? "Entidad sin ánimo de lucro" : "Nonprofit organisation"}
            </span>
          </div>
        </div>
        <div className="hero-purpose section">
          <div>
            <span className="eyebrow">
              {es ? "¿QUÉ HACEMOS?" : "WHAT DO WE DO?"}
            </span>
            <h2>
              {es
                ? "Impulsamos el bienestar y la soberanía de comunidades indígenas guardianes de la biodiversidad en Colombia."
                : "We support the wellbeing and sovereignty of Indigenous communities who protect biodiversity in Colombia."}
            </h2>
          </div>
          <div>
            <p>
              {es
                ? "Desarrollamos proyectos de doble impacto que conectan la sabiduría indígena Kogui, Mhuysqa y Tikuna con el desarrollo sostenible mediante expediciones con propósito, reconexión ecológica y espiritual, protegiendo así la vida, la cultura y el planeta."
                : "Our projects connect Kogui, Mhuysqa and Tikuna Indigenous wisdom with sustainable development through purposeful expeditions and ecological and spiritual reconnection, protecting life, culture and the planet."}
            </p>
            <div className="button-row">
              <Link className="button gold" href={href(lang, "donate")}>
                <Heart size={20} />
                {es ? "Haz una donación" : "Make a donation"}
              </Link>
              <a className="button outline" href="#proyectos">
                {es ? "Conoce nuestros proyectos" : "Explore our projects"}
                <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>
      <section
        className="context-stats"
        aria-label={
          es
            ? "El valor de los pueblos indígenas"
            : "The importance of Indigenous peoples"
        }
      >
        {[
          {
            n: "115",
            a: es
              ? "pueblos indígenas en Colombia"
              : "Indigenous peoples in Colombia",
            b: es
              ? "Pueblos nativos identificados por el Censo Nacional de Población y Vivienda 2018."
              : "Native peoples identified by Colombia’s 2018 population and housing census.",
            s: "DANE · CNPV 2018",
            url: "https://www.dane.gov.co/files/investigaciones/boletines/grupos-etnicos/infograf%C3%ADa-grupos-etnicos-2019.pdf",
          },
          {
            n: "46%",
            a: es
              ? "del bosque natural colombiano"
              : "of Colombia’s natural forest",
            b: es
              ? "Aproximadamente el 46% del bosque natural de Colombia se encuentra en resguardos indígenas."
              : "Approximately 46% of Colombia’s natural forest is located in Indigenous reserves.",
            s: "WWF Colombia · 2024",
            url: "https://www.wwf.org.co/de_interes/noticias/?uNewsID=364960",
          },
          {
            n: "60%",
            a: es
              ? "del carbono forestal amazónico de Colombia"
              : "of forest carbon in Colombia’s Amazon",
            b: es
              ? "El 60% del carbono de los bosques de la Amazonía colombiana se almacena en resguardos indígenas."
              : "60% of forest carbon in the Colombian Amazon is stored in Indigenous reserves.",
            s: "WWF Colombia · 2024",
            url: "https://www.wwf.org.co/de_interes/noticias/?uNewsID=364960",
          },
        ].map((x) => (
          <details key={x.n} suppressHydrationWarning>
            <summary>
              <strong>{x.n}</strong>
              <span>
                {x.a}
                <Plus size={16} />
              </span>
            </summary>
            <p>{x.b}</p>
            <a
              className="stat-source"
              href={x.url}
              target="_blank"
              rel="noreferrer"
            >
              {es ? "Fuente" : "Source"}: {x.s}
              <ArrowUpRight size={16} />
            </a>
          </details>
        ))}
      </section>
      <section className="section projects-section" id="proyectos">
        <div className="section-heading-row">
          <SectionTitle
            eyebrow={
              es
                ? "IMPACTO DIRECTO EN TERRITORIO"
                : "DIRECT IMPACT ON THE GROUND"
            }
            title={
              es
                ? "Haz que tu aporte cuide la vida y los territorios."
                : "Help care for life and the land."
            }
          />
          <p>
            {es
              ? "Elige tu misión. Cada territorio tiene una historia. Tú puedes ser parte de lo que viene."
              : "Choose your mission. Every territory has a story. You can be part of what comes next."}
          </p>
        </div>
        <ProjectCards lang={lang} projects={projects} />
      </section>
      <section className="steps-section section">
        <div className="steps-heading">
          <span className="eyebrow">
            {es ? "ASÍ EMPIEZA EL CAMBIO" : "THIS IS HOW CHANGE BEGINS"}
          </span>
          <h2>
            {es ? "Tu intención, en acción." : "Turn intention into action."}
          </h2>
        </div>
        <div className="steps">
          {[
            {
              icon: Heart,
              t: es ? "Elige tu causa" : "Choose your cause",
              d: es
                ? "Un proyecto en territorio, una emergencia o una experiencia de reconexión."
                : "A community project, an emergency or a journey of reconnection.",
            },
            {
              icon: HandHeart,
              t: es ? "Conéctate" : "Connect",
              d: es
                ? "Apoya un proyecto o participa en la actividad que resuene contigo."
                : "Support a project or join an activity that resonates with you.",
            },
            {
              icon: Leaf,
              t: es ? "Regenera" : "Regenerate",
              d: es
                ? "Conoce los avances y sigue siendo parte de esta comunidad."
                : "Follow our progress and stay connected to the community.",
            },
          ].map((x, i) => (
            <div className="step" key={x.t}>
              <span className="step-number">0{i + 1}</span>
              <x.icon size={27} />
              <h3>{x.t}</h3>
              <p>{x.d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="impact-home">
        <div className="section">
          <div className="section-heading-row">
            <SectionTitle
              light
              eyebrow={es ? "¿QUÉ HEMOS HECHO?" : "WHAT HAVE WE ACHIEVED?"}
              title={
                es
                  ? "Impacto demostrable: transformamos tu confianza en desarrollo tangible para el territorio."
                  : "Demonstrable impact: turning your trust into tangible development on the ground."
              }
            />
            <Link className="button outline-light" href={href(lang, "impact")}>
              {es ? "Nuestra transparencia" : "Our transparency"}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="impact-numbers">
            {[
              {
                n: "~950",
                t: es
                  ? "beneficiarios directos en 2025"
                  : "direct beneficiaries in 2025",
              },
              {
                n: "3",
                t: es
                  ? "comunidades indígenas aliadas"
                  : "Indigenous community partners",
              },
              {
                n: "45",
                t: es
                  ? "niños y familias con infraestructura"
                  : "children and families supported with infrastructure",
              },
              {
                n: "100%",
                t: es
                  ? "de los excedentes reinvertidos"
                  : "of surpluses reinvested in our mission",
              },
            ].map((x) => (
              <div key={x.n}>
                <strong>{x.n}</strong>
                <p>{x.t}</p>
              </div>
            ))}
          </div>
          <div className="home-funds-link">
            <FileText size={36} aria-hidden="true" />
            <div>
              <h3>
                {es
                  ? "Memorias, estados financieros y documentos oficiales"
                  : "Annual reports, financial statements and official records"}
              </h3>
              <p>
                {es
                  ? "La transparencia es la base de nuestro trabajo."
                  : "Transparency is the foundation of our work."}
              </p>
            </div>
            <Link
              className="button outline-light"
              href={`${href(lang, "impact")}#memorias`}
            >
              {es ? "Consultar informes" : "Read the reports"}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="impact-bottom">
            <p>
              {es
                ? "Cada proyecto tiene una historia y cada aporte, un propósito. Conoce nuestros resultados y el destino de los recursos."
                : "Every project has a story and every gift has a purpose. Explore our results and how resources are used."}
            </p>
            <Link
              href={`${href(lang, "impact")}#cuentas`}
              className="text-link light-link"
            >
              {es ? "Ver destino de los fondos" : "See how funds are used"}
              <ArrowRight size={18} />
            </Link>
            <a
              href="https://fundacionalmaarcoiris.org/wp-content/uploads/2026/03/4-2025-REPORTE-DE-GESTION-final.pdf"
              target="_blank"
              rel="noreferrer"
              className="text-link light-link"
            >
              {es
                ? "Informe de gestión 2025 · PDF"
                : "2025 annual report · PDF"}
              <ArrowRight size={18} />
            </a>
          </div>
          <p className="funds-pending">
            {es
              ? "Estados financieros (PDF): pendientes de incorporar el documento oficial."
              : "Financial statements (PDF): official document pending upload."}
          </p>
        </div>
      </section>
      <section className="section action-section">
        <SectionTitle
          eyebrow={es ? "ECOSISTEMA DE ACCIÓN" : "WAYS TO TAKE PART"}
          title={
            es
              ? "Hay muchas formas de sumar."
              : "There is more than one way to help."
          }
        />
        <div className="action-grid">
          <Link href="#proyectos" className="action-card">
            <Heart size={32} />
            <div>
              <h3>
                {es
                  ? "Donaciones y fondo de emergencias"
                  : "Donations and emergency support"}
              </h3>
              <p>
                {es
                  ? "Financia proyectos en comunidades indígenas o apoya la reconstrucción de El Cairo."
                  : "Fund projects with Indigenous communities or support rebuilding in El Cairo."}
              </p>
              <span className="text-link">
                {es ? "Apadrinar un proyecto" : "Support a project"}
                <ArrowUpRight size={17} />
              </span>
            </div>
          </Link>
          <Link href={href(lang, "join")} className="action-card">
            <Footprints size={32} />
            <div>
              <h3>
                {es
                  ? "Experiencias y voluntariado"
                  : "Experiences and volunteering"}
              </h3>
              <p>
                {es
                  ? "Caminatas conscientes, expediciones y encuentros que nos conectan con el territorio."
                  : "Mindful walks, expeditions and gatherings that connect us to the land."}
              </p>
              <span className="text-link">
                {es
                  ? "Ver calendario y voluntariado"
                  : "Explore activities and volunteering"}
                <ArrowUpRight size={17} />
              </span>
            </div>
          </Link>
        </div>
      </section>
      <section
        className="donation-section section donation-photo-section"
        id="apoyo"
      >
        <div className="donation-background" aria-hidden="true">
          <Image
            src="/images/misiones.webp"
            alt=""
            fill
            sizes="(max-width: 700px) calc(100vw - 32px), (max-width: 1310px) calc(100vw - 70px), 1240px"
          />
        </div>
        <div className="donation-story">
          <span className="eyebrow">
            {es ? "CULTIVEMOS UN FUTURO COMPARTIDO" : "GROW A SHARED FUTURE"}
          </span>
          <h2>
            {es
              ? "Siembra tu semilla de cambio hoy."
              : "Plant your seed of change today."}
          </h2>
          <p>
            {es
              ? "Un gesto tuyo puede acompañar años de trabajo en comunidad. Elige cómo quieres ser parte."
              : "Your gift can support years of community work. Choose how you would like to take part."}
          </p>
          <div className="donation-trust">
            <ShieldCheck size={26} />
            <span>
              {es
                ? "Una fundación real. Un propósito compartido."
                : "A real foundation. A shared purpose."}
              <small>Fundación Alma Arcoíris · NIT 901784588-0</small>
            </span>
          </div>
          <Link className="text-link" href={href(lang, "impact")}>
            {es
              ? "Conoce cómo cuidamos tu confianza"
              : "See how we earn your trust"}
            <ArrowUpRight size={17} />
          </Link>
        </div>
        <DonationForm lang={lang} />
      </section>
      <section className="section testimonial">
        <div className="testimonial-photo">
          <Photo
            src="/images/nelly.webp"
            alt={
              es
                ? "Fotografía elegida para el testimonio de Nelly Guzman, en una actividad en la naturaleza"
                : "The photograph selected for Nelly Guzman’s story, during a nature activity"
            }
          />
        </div>
        <div>
          <span className="eyebrow">
            {es ? "HISTORIAS QUE NOS CONECTAN" : "STORIES THAT CONNECT US"}
          </span>
          <h2>
            {es
              ? "Sana por dentro, transforma por fuera."
              : "Reconnect within. Create change around you."}
          </h2>
          <blockquote>
            “
            {es
              ? "Aportar a la Misión Amazonas y participar en el apoyo a la comunidad no solo ayudó a construir en el territorio; le dio un sentido profundo a mi vida diaria."
              : "Supporting the Amazon Mission and taking part in community work helped build more than spaces on the ground; it gave my everyday life a deeper sense of purpose."}
            ”
          </blockquote>
          <p className="quote-author">
            Nelly Guzman
            <span>{es ? "Donante y voluntaria" : "Donor and volunteer"}</span>
          </p>
          <Link className="button purple" href={href(lang, "join")}>
            {es ? "Sumarme a la fundación" : "Join the foundation"}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
export function ProjectPage({
  lang,
  project: p,
}: {
  lang: Lang;
  project: Project;
}) {
  const es = lang === "es";
  return (
    <>
      <section className="project-hero">
        <Photo src={p.hero} alt={p.alt[lang]} priority />
        <div className="project-hero-inner section">
          <div className="project-hero-copy">
            <Link href={href(lang, "projects")} className="breadcrumb">
              {es ? "Proyectos" : "Projects"} / {p.name[lang]}
            </Link>
            <span className="location">
              <MapPin size={16} />
              {p.location[lang]}
            </span>
            <h1>{p.title[lang]}</h1>
            <p>{p.subtitle[lang]}</p>
            <span className="project-identity">
              <ShieldCheck size={17} />
              Fundación Alma Arcoíris · NIT 901784588-0
            </span>
          </div>
          <DonationForm key={p.slug} lang={lang} cause={p.slug} compact />
        </div>
      </section>
      <section className="section">
        <SectionTitle
          eyebrow={p.category[lang]}
          title={
            es
              ? "¿Qué logras con tu generosidad hoy?"
              : "What can your generosity make possible?"
          }
        />
        <div className={`module-grid count-${p.modules.length}`}>
          {p.modules.map((m, i) => (
            <article
              className={`module-card ${m.portrait ? "portrait" : ""}`}
              key={i}
            >
              {m.image ? (
                <Photo src={m.image} alt={m.title[lang]} />
              ) : (
                <div className="module-placeholder">
                  <span>0{i + 1}</span>
                  <HandHeart size={44} />
                </div>
              )}
              <div>
                <span className="eyebrow">0{i + 1}</span>
                <h3>{m.title[lang]}</h3>
                <p>{m.description[lang]}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="project-results section">
        <SectionTitle
          eyebrow={
            es
              ? "TRANSPARENCIA Y PRUEBA SOCIAL"
              : "TRANSPARENCY AND COMMUNITY IMPACT"
          }
          title={
            p.resultsTitle?.[lang] ??
            (es ? `Resultados en ${p.name.es}` : `Progress in ${p.name.en}`)
          }
        />
        <div className="results-row">
          {p.results.map((r) => (
            <div key={r.label[lang]}>
              <strong>{r.value}</strong>
              <p>{r.label[lang]}</p>
            </div>
          ))}
        </div>
        {p.achievements && (
          <ul className="project-details-list">
            {p.achievements.map((item) => (
              <li key={item.es}>{item[lang]}</li>
            ))}
          </ul>
        )}
        <p className="small-note">
          {es
            ? "Datos del documento del proyecto, sujetos a revisión con sus informes de respaldo."
            : "Figures from the project brief, pending review against supporting reports."}
        </p>
        {p.testimony && (
          <blockquote className="project-quote">
            “{p.testimony.quote[lang]}”<cite>{p.testimony.author[lang]}</cite>
          </blockquote>
        )}
        {p.video && (
          <VideoCard
            id={p.video}
            image={p.videoImage ?? p.hero}
            title={es ? `Una mirada a ${p.name.es}` : `A look at ${p.name.en}`}
            lang={lang}
          />
        )}
        {p.slug === "el-cairo" && (
          <div className="project-partners">
            <h3>{es ? "Nuestros aliados" : "Our partners"}</h3>
            <ul>
              <li>Santuario Playa Bonita</li>
              <li>Fundación Pech</li>
              <li>Casa Santuario Bogotá</li>
              <li>
                {es
                  ? "Junta de Acción Comunal Prado Veraniego · Bogotá"
                  : "Prado Veraniego Community Action Board · Bogotá"}
              </li>
            </ul>
          </div>
        )}
        <div className="center">
          <a className="button gold" href="#donar-formulario">
            <Heart size={18} />
            {es ? "Dona ahora" : "Donate now"}
            <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
      <section className="involvement section" style={{ background: p.color }}>
        <span className="eyebrow">
          {es ? "DA UN PASO MÁS" : "TAKE ANOTHER STEP"}
        </span>
        <h2>{p.involvement[lang]}</h2>
        <p>{p.involvementText[lang]}</p>
        {p.slug === "el-cairo" && (
          <p>
            {es
              ? "Un proyecto en alianza con otras organizaciones y las familias del territorio."
              : "A project in partnership with other organisations and local families."}
          </p>
        )}
        <Link
          className="button outline-light"
          href={`${href(lang, "join")}#${p.slug === "mhuysqa" ? "encuentros" : "expediciones"}`}
        >
          {es ? "Conocer cómo participar" : "Discover how to take part"}
          <ArrowUpRight size={18} />
        </Link>
      </section>
      <Faq
        lang={lang}
        items={p.faqs.map((f) => ({
          question: f.question[lang],
          answer: f.answer[lang],
        }))}
      />
      <div className="mobile-donate">
        <a className="button gold full" href="#donar-formulario">
          <Heart size={18} />
          {es ? "Donar a este proyecto" : "Donate to this project"}
        </a>
      </div>
    </>
  );
}
export function ImpactPage({ lang }: { lang: Lang }) {
  const es = lang === "es";
  return (
    <>
      <section className="section page-intro">
        <span className="eyebrow">
          {es ? "IMPACTO Y TRANSPARENCIA" : "IMPACT AND TRANSPARENCY"}
        </span>
        <h1>
          {es
            ? "Cuentas claras para un impacto duradero en el territorio."
            : "Clear accounts. Lasting impact on the ground."}
        </h1>
        <p>
          {es
            ? "Transformamos cada contribución en soberanía indígena, educación intercultural y conservación ambiental. Explora la ejecución de nuestros recursos, certificados legales y memorias anuales."
            : "We turn contributions into Indigenous sovereignty, intercultural education and environmental conservation. Explore how resources are used, legal records and annual reports."}
        </p>
        <div className="button-row">
          <Link className="button gold" href={href(lang, "donate")}>
            {es ? "Apoyar un proyecto" : "Support a project"}
            <ArrowUpRight size={18} />
          </Link>
          <a className="button outline" href="#memorias">
            {es ? "Ver memorias y cuentas" : "Explore reports and accounts"}
          </a>
        </div>
      </section>
      <section className="section legal-badges">
        {[
          es
            ? "Régimen Tributario Especial · DIAN"
            : "Special Tax Regime · DIAN",
          es ? "Inspección y vigilancia" : "Oversight",
          es ? "Registro ESAL · CCB" : "Nonprofit registration · CCB",
          es
            ? "Rendición Social Pública de Cuentas"
            : "Public social accountability",
          es ? "Estados financieros" : "Financial statements",
        ].map((label, i) => (
          <details key={label} suppressHydrationWarning>
            <summary>
              {i === 0 ? <ShieldCheck /> : <FileText />}
              <strong>{label}</strong>
              <Plus size={16} />
            </summary>
            <p>
              {
                [
                  es
                    ? "NIT 901.784.588-0. Responsabilidad 04 en el RUT."
                    : "NIT 901.784.588-0. Responsibility 04 on the tax register.",
                  es
                    ? "Gobernación de Cundinamarca. Radicado GOB-S-CR-2026-0168636, 2 de septiembre de 2026, vigencia 2025."
                    : "Cundinamarca Government. Reference GOB-S-CR-2026-0168636, 2 September 2026, 2025 reporting period.",
                  es
                    ? "Cámara de Comercio de Bogotá. Registro S0063813, inscripción 00373753 del Libro I de las ESAL."
                    : "Bogotá Chamber of Commerce. Registration S0063813, entry 00373753 in Book I for nonprofits.",
                  es
                    ? "Ejercicio anual de Rendición Social Pública de Cuentas del año 2025."
                    : "Annual public social accountability exercise for 2025.",
                  es
                    ? "NIIF para PYMES. Contadora Pública T.P. 180773-T y Revisor Fiscal T.P. 289607-T."
                    : "IFRS for SMEs. Public Accountant licence 180773-T and Statutory Auditor licence 289607-T.",
                ][i]
              }
            </p>
            <a className="text-link" href="#memorias">
              {es ? "Consultar documentos" : "Explore records"}
              <ArrowUpRight size={16} />
            </a>
          </details>
        ))}
      </section>
      <section className="section" id="cuentas">
        <SectionTitle
          eyebrow={es ? "RENDICIÓN DE CUENTAS 2025" : "2025 ACCOUNTABILITY"}
          title={
            es
              ? "¿A dónde va cada peso que recibimos?"
              : "Where does every peso go?"
          }
        />
        <FinancialChart lang={lang} />
      </section>
      <section className="section root-story">
        <Photo
          src="/images/permisos-kogui.webp"
          alt={
            es
              ? "Encuentro con autoridades Kogui"
              : "Gathering with Kogui authorities"
          }
        />
        <div>
          <span className="eyebrow">
            {es ? "RESPETO POR LA RAÍZ" : "RESPECT FOR OUR ROOTS"}
          </span>
          <h2>
            {es
              ? "La transparencia no es solo financiera, es el respeto por la raíz"
              : "Transparency reaches beyond finances to respect for our roots"}
          </h2>
          <blockquote>
            “
            {es
              ? "Para cuidar la Sierra Nevada y el agua, primero hay que estar en orden con la ley de origen. La Fundación Alma Arcoíris no llega como un extraño; llega a escuchar la palabra del Mamo, a pedir el permiso en los sitios sagrados y a caminar juntos en la protección de la naturaleza."
              : "To care for the Sierra Nevada and the water, we must first be in harmony with the law of origin. Fundación Alma Arcoíris comes to listen to the Mamo’s words, seek permission at sacred sites and walk together to protect nature."}
            ”
          </blockquote>
          <p className="quote-author">
            Mamo Atanasio
            <span>
              {es
                ? "Sabedor tradicional del Pueblo Kogui"
                : "Traditional Kogui knowledge keeper"}
            </span>
          </p>
          <p>
            {es
              ? "Caminamos junto a las autoridades comunitarias, respetando sus saberes, su autonomía y su relación con el territorio."
              : "We walk alongside community authorities, respecting their knowledge, autonomy and relationship with the land."}
          </p>
        </div>
      </section>
      <section className="section" id="trayectoria">
        <SectionTitle
          eyebrow={es ? "RESULTADOS E INDICADORES" : "RESULTS AND INDICATORS"}
          title={
            es
              ? "Resultados cuantitativos y alineación con los ODS"
              : "Results and alignment with the Sustainable Development Goals"
          }
        />
        <div className="results-row">
          <div>
            <strong>~950</strong>
            <p>
              {es
                ? "beneficiarios directos · 2025"
                : "direct beneficiaries · 2025"}
            </p>
          </div>
          <div>
            <strong>3</strong>
            <p>
              {es
                ? "comunidades étnicas aliadas: Kogui, Tikuna y Mhuysqa"
                : "Indigenous community partners: Kogui, Tikuna and Mhuysqa"}
            </p>
          </div>
          <div>
            <strong>&gt;250</strong>
            <p>
              {es
                ? "participantes en caminatas de páramo · 2025"
                : "páramo walk participants · 2025"}
            </p>
          </div>
        </div>
        <VideoCard
          lang={lang}
          id="xxoat0t-AQM"
          image="/images/sierra-educacion.webp"
          title={
            es
              ? "El primer paso es el respeto por el territorio"
              : "The first step is respect for the land"
          }
        />
        <div className="ods-grid">
          {[
            [
              Leaf,
              es ? "Conservación y territorio" : "Conservation and land",
              "ODS 15",
              es
                ? "Más de 250 participantes en caminatas de reconexión ecológica durante 2025."
                : "Over 250 participants in ecological reconnection walks during 2025.",
            ],
            [
              HandHeart,
              es
                ? "Soberanía e infraestructura"
                : "Sovereignty and infrastructure",
              "ODS 10 · 17",
              es
                ? "Educación, bioconstrucción y cooperación junto a comunidades Tikuna, Kogui y Mhuysqa."
                : "Education, natural building and cooperation with Tikuna, Kogui and Mhuysqa communities.",
            ],
            [
              Users,
              es ? "Comunidad e igualdad" : "Community and equality",
              "ODS 3 · 5",
              es
                ? "En 2025: EFIS, comunidad virtual de 160 mujeres; Hermandad del Cóndor, red de 188 hombres."
                : "In 2025: EFIS, a virtual community of 160 women; Hermandad del Cóndor, a network of 188 men.",
            ],
          ].map(([Icon, title, ods, text], i) => {
            const I = Icon as typeof Leaf;
            return (
              <article key={i}>
                <I />
                <small>{ods as string}</small>
                <h3>{title as string}</h3>
                <p>{text as string}</p>
              </article>
            );
          })}
        </div>
      </section>
      <section className="section archive" id="memorias">
        <SectionTitle
          eyebrow={
            es ? "MEMORIAS Y CUENTAS ANUALES" : "ANNUAL REPORTS AND ACCOUNTS"
          }
          title={
            es
              ? "La confianza se construye con información."
              : "Trust grows through information."
          }
        />
        {[2025, 2024, 2023].map((year, i) => (
          <details key={year} open={i === 0} suppressHydrationWarning>
            <summary>
              <strong>{year}</strong>
              <span>
                {
                  [
                    es ? "Consolidación e impacto" : "Consolidation and impact",
                    es ? "Apertura y comunidad" : "Beginnings and community",
                    es ? "Nuestra constitución" : "Our foundation",
                  ][i]
                }
              </span>
              <Plus size={22} />
            </summary>
            <div className="archive-body">
              <p>
                {i === 0
                  ? es
                    ? "~950 beneficiarios directos y tres comunidades indígenas aliadas. Consulta el informe publicado de la fundación."
                    : "~950 direct beneficiaries and three Indigenous community partners. Read the foundation’s published report."
                  : es
                    ? i === 1
                      ? "900 caminantes, encuentro ancestral Sagrado Corazón y retiro Hermandad del Cóndor."
                      : "Registro ante la Cámara de Comercio de Bogotá el 27 de diciembre de 2023 y asignación de NIT ante la DIAN."
                    : i === 1
                      ? "900 walkers, the Sagrado Corazón ancestral gathering and the Hermandad del Cóndor retreat."
                      : "Registration with the Bogotá Chamber of Commerce on 27 December 2023 and tax identification with DIAN."}
              </p>
              {i < 2 ? (
                <a
                  className="button outline"
                  href={
                    i === 0
                      ? "https://fundacionalmaarcoiris.org/wp-content/uploads/2026/03/4-2025-REPORTE-DE-GESTION-final.pdf"
                      : "https://fundacionalmaarcoiris.org/wp-content/uploads/2026/03/3-Reporte-de-gestion-2024-a-febrero-2025.pdf"
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <FileText size={17} />
                  {es
                    ? i === 0
                      ? "Informe de gestión 2025 · PDF"
                      : "Informe 2024 · corte febrero 2025 · PDF"
                    : i === 0
                      ? "2025 annual report · PDF (Spanish)"
                      : "2024 report · February 2025 cut-off · PDF (Spanish)"}
                  <ArrowUpRight size={17} />
                </a>
              ) : (
                <a
                  className="text-link"
                  href="mailto:contacto@fundacionalmaarcoiris.org"
                >
                  {es ? "Solicitar documentación" : "Request documents"}
                  <ArrowUpRight size={16} />
                </a>
              )}
              <p className="small-note">
                {es
                  ? i < 2
                    ? "Anexo financiero y dictamen de revisoría fiscal: pendientes de incorporación."
                    : "Informe de constitución y balance de apertura: pendientes de incorporación."
                  : i < 2
                    ? "Financial annex and statutory audit report: pending upload."
                    : "Foundation report and opening balance: pending upload."}
              </p>
            </div>
          </details>
        ))}
        <details suppressHydrationWarning>
          <summary>
            <strong>
              <ShieldCheck />
            </strong>
            <span>
              {es
                ? "Marco estatutario y documentos oficiales"
                : "Governing documents and official records"}
            </span>
            <Plus size={22} />
          </summary>
          <div className="archive-body">
            <p>
              {es
                ? "RUT vigente, certificado de existencia y representación, certificado de la Gobernación de Cundinamarca y certificado de Rendición Social Pública de Cuentas. Solicítalos a la fundación mientras se completa la biblioteca."
                : "Current tax registration, legal registration, Cundinamarca Government certificate and public social accountability certificate. Contact the foundation while the library is being completed."}
            </p>
            <a
              className="text-link"
              href="mailto:contacto@fundacionalmaarcoiris.org"
            >
              {es ? "Contactar" : "Contact us"}
              <ArrowUpRight size={16} />
            </a>
          </div>
        </details>
      </section>
      <Faq
        lang={lang}
        items={[
          {
            question: es
              ? "¿Cómo conozco el destino de mi aporte?"
              : "How can I see where my gift goes?",
            answer: es
              ? "Los informes de gestión y las memorias de cada proyecto documentan las actividades y sus resultados. Estamos preparando los anexos financieros para esta biblioteca."
              : "Annual reports and project records document activities and results. We are preparing the financial annexes for this library.",
          },
          {
            question: es
              ? "¿Puedo solicitar un certificado de donación?"
              : "Can I request a donation certificate?",
            answer: es
              ? "Contacta a la fundación para conocer los requisitos y el tratamiento aplicable a tu donación. El comprobante del pago y el certificado tributario son documentos diferentes."
              : "Contact the foundation for requirements and the treatment applicable to your gift. A payment receipt and a tax certificate are separate documents.",
          },
        ]}
      />
      <Closing lang={lang} />
    </>
  );
}
