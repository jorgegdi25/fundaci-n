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
      priority={priority}
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
            <h3>{p.name[lang]}</h3>
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
                    ? "Guardianes de la selva y sus saberes."
                    : "Guardians of the forest and its knowledge.",
                  es
                    ? "Sabiduría viva de nuestras abuelas."
                    : "The living wisdom of our grandmothers.",
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
          <details key={i}>
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
        <div className="hero-stage">
          <div className="hero-copy">
            <div className="hero-overline">
              <span aria-hidden="true" />
              <span>Fundación Alma Arcoíris</span>
            </div>
            <h1 id="home-title">
              {es ? (
                <>
                  Reconecta con los saberes ancestrales.
                  <em>Protejamos los guardianes de la tierra.</em>
                </>
              ) : (
                <>
                  Reconnect with ancestral wisdom.
                  <em>Let’s protect the guardians of the Earth.</em>
                </>
              )}
            </h1>
            <p className="hero-lead">
              {es
                ? "Tu aporte cuida la vida, la cultura y los territorios de Colombia."
                : "Your gift cares for life, culture and communities across Colombia."}
            </p>
            <div className="hero-actions">
              <Link className="button gold" href={href(lang, "donate")}>
                <Heart size={21} />
                {es ? "Haz una donación" : "Make a donation"}
                <ArrowUpRight size={21} />
              </Link>
              <a href="#proyectos" className="hero-projects-link">
                {es ? "Conoce los proyectos" : "Explore the projects"}
                <ArrowRight size={21} />
              </a>
            </div>
            <div className="hero-identity">
              <ShieldCheck size={23} />
              <span>
                {es ? "Entidad sin ánimo de lucro" : "Nonprofit organisation"}
                <span>NIT 901784588-0 · Colombia</span>
              </span>
            </div>
          </div>
          <figure className="hero-portrait">
            <Photo
              src="/images/home-hero.webp"
              alt={
                es
                  ? "Dos guardianes de los saberes ancestrales en su territorio, Colombia"
                  : "Two guardians of ancestral knowledge on their land in Colombia"
              }
              priority
            />
            <figcaption>
              <span className="hero-caption-mark" aria-hidden="true">
                <Leaf size={27} />
              </span>
              <span>
                {es
                  ? "La sabiduría que nos une."
                  : "The wisdom that connects us."}
                <strong>
                  {es
                    ? "La tierra que nos cuida."
                    : "The Earth that sustains us."}
                </strong>
              </span>
            </figcaption>
          </figure>
        </div>
        <div className="hero-purpose section">
          <div>
            <span className="eyebrow">
              {es ? "¿QUÉ HACEMOS?" : "WHAT DO WE DO?"}
            </span>
            <h2>
              {es
                ? "El bienestar de las comunidades. El cuidado de la tierra."
                : "Community wellbeing. Care for the Earth."}
            </h2>
          </div>
          <div>
            <p className="purpose-lead">
              {es
                ? "Impulsamos el bienestar y la soberanía de comunidades indígenas guardianes de la biodiversidad en Colombia."
                : "We support the wellbeing and sovereignty of Indigenous communities who protect biodiversity in Colombia."}
            </p>
            <p>
              {es
                ? "Desarrollamos proyectos de doble impacto que conectan la sabiduría indígena Kogui, Mhuysqa y Tikuna con el desarrollo sostenible mediante expediciones con propósito, reconexión ecológica y espiritual, protegiendo así la vida, la cultura y el planeta."
                : "Our projects connect Kogui, Mhuysqa and Tikuna Indigenous wisdom with sustainable development through purposeful expeditions and ecological and spiritual reconnection, protecting life, culture and the planet."}
            </p>
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
            a: es ? "pueblos indígenas" : "Indigenous peoples",
            b: es
              ? "El 4,7% de la población de Colombia."
              : "4.7% of Colombia’s population.",
            s: "DANE / IWGIA",
          },
          {
            n: "46%",
            a: es ? "de los bosques" : "of forests",
            b: es
              ? "Se concentran en resguardos indígenas: 29% del territorio continental, con el 91% en excelente estado ecológico."
              : "Are located in Indigenous reserves: 29% of the continental territory, with 91% in excellent ecological condition.",
            s: "Instituto Humboldt",
          },
          {
            n: "60%",
            a: es ? "del carbono forestal" : "of forest carbon",
            b: es
              ? "Almacenado en resguardos de la Amazonía colombiana."
              : "Stored in Indigenous reserves in the Colombian Amazon.",
            s: "WWF Colombia",
          },
        ].map((x) => (
          <details key={x.n}>
            <summary>
              <strong>{x.n}</strong>
              <span>
                {x.a}
                <Plus size={16} />
              </span>
            </summary>
            <p>{x.b}</p>
            <small>
              {es
                ? "Fuente indicada en el documento"
                : "Source cited in the brief"}
              : {x.s}. {es ? "Dato en validación." : "Figure under review."}
            </small>
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
                  ? "Transformamos tu confianza en impacto."
                  : "Turning your trust into impact."
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
          <div className="home-funds">
            <div>
              <span className="eyebrow">
                {es ? "DESTINO DE LOS FONDOS" : "HOW FUNDS ARE USED"}
              </span>
              <h3>
                {es ? "Cada aporte, un propósito." : "Every gift, a purpose."}
              </h3>
              <p>
                {es
                  ? "Distribución propuesta en el documento del cliente. Pendiente de conciliar con los estados financieros."
                  : "Distribution proposed in the client document. Pending reconciliation with financial statements."}
              </p>
            </div>
            <div>
              <div
                className="funds-bar"
                role="img"
                aria-label={
                  es
                    ? "75% programas, 15% logística, 10% administración. Borrador."
                    : "75% programmes, 15% logistics, 10% administration. Draft."
                }
              >
                <span />
                <span />
                <span />
              </div>
              <div className="funds-labels">
                <span>
                  <b>75%</b>
                  {es
                    ? "Programas e infraestructura"
                    : "Programmes and infrastructure"}
                </span>
                <span>
                  <b>15%</b>
                  {es ? "Logística y operación" : "Logistics and operations"}
                </span>
                <span>
                  <b>10%</b>
                  {es
                    ? "Administración y cumplimiento"
                    : "Administration and compliance"}
                </span>
              </div>
            </div>
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
            <Link
              href={`${href(lang, "impact")}#memorias`}
              className="text-link light-link"
            >
              {es
                ? "Reporte de impacto 2025 · HTML"
                : "2025 impact report · HTML"}
              <ArrowRight size={18} />
            </Link>
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
      <section className="donation-section section">
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
                  <small>
                    {es
                      ? "Imagen del proyecto pendiente"
                      : "Project photograph pending"}
                  </small>
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
          title={es ? `Resultados en ${p.name.es}` : `Progress in ${p.name.en}`}
        />
        <div className="results-row">
          {p.results.map((r) => (
            <div key={r.label[lang]}>
              <strong>{r.value}</strong>
              <p>{r.label[lang]}</p>
            </div>
          ))}
        </div>
        <p className="small-note">
          {es
            ? "Datos del documento del proyecto, sujetos a revisión con sus informes de respaldo."
            : "Figures from the project brief, pending review against supporting reports."}
        </p>
        {p.video && (
          <VideoCard
            id={p.video}
            image={p.videoImage ?? p.hero}
            title={es ? `Una mirada a ${p.name.es}` : `A look at ${p.name.en}`}
            lang={lang}
          />
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
            ? "Explora nuestros resultados, el destino de los recursos y las memorias del trabajo que construimos junto a las comunidades."
            : "Explore our results, how resources are used and the records of work built together with communities."}
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
          es ? "Identidad y registro" : "Identity and registration",
          es ? "Régimen tributario" : "Tax status",
          es ? "Inspección y vigilancia" : "Oversight",
          es ? "Estados financieros" : "Financial statements",
        ].map((label, i) => (
          <details key={label}>
            <summary>
              {i === 0 ? <ShieldCheck /> : <FileText />}
              <strong>{label}</strong>
              <Plus size={16} />
            </summary>
            <p>
              {i === 0
                ? "Fundación Alma Arcoíris Colombia · NIT 901784588-0."
                : es
                  ? "El documento oficial y su vigencia se incorporarán a la biblioteca una vez verificados."
                  : "The official document and its validity will be added to the library once verified."}
            </p>
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
              ? "La transparencia también es escuchar."
              : "Transparency also means listening."}
          </h2>
          <blockquote>
            “
            {es
              ? "Para cuidar la Sierra Nevada y el agua, primero hay que estar en orden con la ley de origen."
              : "To care for the Sierra Nevada and the water, we must first be in harmony with the law of origin."}
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
      <section className="section">
        <SectionTitle
          eyebrow={es ? "RESULTADOS E INDICADORES" : "RESULTS AND INDICATORS"}
          title={
            es
              ? "Un trabajo compartido que deja huella."
              : "Shared work that makes a difference."
          }
        />
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
                ? "Encuentros y redes de apoyo EFIS y Hermandad del Cóndor."
                : "Gatherings and support networks through EFIS and Hermandad del Cóndor.",
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
          <details key={year} open={i === 0}>
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
                    ? "Los documentos de esta vigencia se están preparando para su incorporación a esta biblioteca."
                    : "Documents for this reporting year are being prepared for this library."}
              </p>
              {i === 0 ? (
                <a
                  className="button outline"
                  href="https://fundacionalmaarcoiris.org/wp-content/uploads/2026/03/4-2025-REPORTE-DE-GESTION-final.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FileText size={17} />
                  {es
                    ? "Informe de gestión 2025 · PDF"
                    : "2025 annual report · PDF (Spanish)"}
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
                  ? "Anexos financieros y dictámenes: pendientes de incorporación."
                  : "Financial annexes and audit reports: pending upload."}
              </p>
            </div>
          </details>
        ))}
        <details>
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
                ? "RUT, certificado de existencia y representación y certificado de inspección y vigilancia. Solicítalos a la fundación mientras se completa la biblioteca."
                : "Tax registration, legal registration and oversight certificate. Contact the foundation while the library is being completed."}
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
