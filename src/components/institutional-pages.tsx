import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Heart,
  Leaf,
  Users,
  Footprints,
  HandHeart,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { href, l, type Lang } from "@/lib/i18n";
import { Photo, SectionTitle, Faq } from "./content-blocks";

const contact = "mailto:contacto@fundacionalmaarcoiris.org";
const whatsapp = "https://wa.me/573044989707";
const valueDescriptions = [
  {
    title: l("Humildad", "Humility"),
    text: l(
      "La humildad es nuestra luz guía, recordándonos que, independientemente de nuestros logros, siempre hay espacio para aprender y crecer. En Alma Arcoíris, reconocemos la valía de cada individuo y la riqueza que aporta a nuestro colectivo. Nos esforzamos por mantenernos humildes en el éxito y resilientes en los desafíos, promoviendo un ambiente donde la colaboración y la apertura de mente son la norma.",
      "Humility guides us, reminding us that regardless of our achievements, there is always room to learn and grow. At Alma Arcoíris, we recognise each person’s worth and contribution. We strive to remain humble in success and resilient through challenges, encouraging collaboration and open-mindedness.",
    ),
  },
  {
    title: l("Compromiso", "Commitment"),
    text: l(
      "Nuestro compromiso es un lazo indestructible que une a nuestra comunidad. Estamos dedicados a la causa del bien común, trabajando incansablemente para construir un mundo mejor. Cada acción, cada proyecto, refleja nuestro compromiso de contribuir positivamente a la vida de aquellos a quienes servimos. En Alma Arcoíris, el compromiso es el motor que impulsa nuestra labor, siempre recordándonos que cada esfuerzo cuenta.",
      "Commitment brings our community together. We are dedicated to the common good and work towards a better world. Each action and project reflects our commitment to improving the lives of those we serve. Commitment drives our work, reminding us that every effort counts.",
    ),
  },
  {
    title: l("Gratitud", "Gratitude"),
    text: l(
      "La gratitud es el corazón latente de nuestra Fundación. Valoramos y agradecemos cada pequeño paso que nos acerca a nuestros objetivos. Reconocemos la importancia de las contribuciones de cada persona en nuestra comunidad y expresamos gratitud con sinceridad. En Alma Arcoíris, cultivamos un ambiente donde el agradecimiento florece, recordándonos que la apreciación fortalece nuestros lazos y nos impulsa hacia adelante.",
      "Gratitude is at the heart of our foundation. We appreciate every small step towards our goals and sincerely acknowledge each person’s contributions. We cultivate an atmosphere of gratitude, knowing that appreciation strengthens our bonds and helps us move forward.",
    ),
  },
  {
    title: l("Compasión", "Compassion"),
    text: l(
      "La compasión es nuestro faro luminoso, iluminando el camino hacia un mundo más comprensivo y solidario. En Alma Arcoíris, practicamos la compasión no solo como un acto aislado, sino como un estilo de vida. Nos esforzamos por entender las luchas de los demás y ofrecer apoyo incondicional. Creemos que la compasión es la fuerza que une a las comunidades y transforma vidas.",
      "Compassion guides us towards a more understanding and supportive world. At Alma Arcoíris, we practise compassion as a way of life. We strive to understand others’ struggles and offer unconditional support. We believe compassion brings communities together and transforms lives.",
    ),
  },
  {
    title: l("Integridad", "Integrity"),
    text: l(
      "La integridad es la columna vertebral de nuestra Fundación. Nos comprometemos a actuar con honestidad, transparencia y coherencia en todas nuestras interacciones. En Alma Arcoíris, creemos que la integridad es la base de la confianza, y es a través de esta confianza que podemos lograr un impacto duradero. Nos esforzamos por ser íntegros en nuestras acciones, manteniendo la coherencia entre lo que decimos y lo que hacemos.",
      "Integrity is the backbone of our foundation. We are committed to honesty, transparency and consistency in every interaction. We believe integrity builds the trust needed for lasting impact. We strive to act with integrity and to keep our words and actions aligned.",
    ),
  },
];

export function JoinPage({ lang }: { lang: Lang }) {
  const es = lang === "es";
  const routes = [
    {
      id: "expediciones",
      icon: HandHeart,
      title: es ? "Voluntariado y misiones" : "Volunteering and missions",
      text: es
        ? "Postulación autofinanciada para brigadas de bioconstrucción, infraestructura escolar y apoyo humanitario en Amazonas, Sierra Nevada y El Cairo."
        : "Self-funded participation in natural building, school infrastructure and humanitarian work in the Amazon, Sierra Nevada and El Cairo.",
    },
    {
      id: "caminatas",
      icon: Footprints,
      title: es ? "Caminatas conscientes" : "Mindful walks",
      text: es
        ? "Salidas ecológicas mensuales de reconexión, ejercicios de respiración y conservación de páramos en Cundinamarca."
        : "Monthly nature walks, breathing practices and páramo conservation in Cundinamarca.",
    },
    {
      id: "circulos",
      icon: Users,
      title: es ? "Círculos de sostenimiento" : "Community circles",
      text: es
        ? "Redes de autogestión emocional: Círculo Femenino (EFIS) y Círculo Masculino (Hermandad del Cóndor)."
        : "Emotional self-management networks: EFIS women’s circle and Hermandad del Cóndor men’s circle.",
    },
    {
      id: "encuentros",
      icon: Leaf,
      title: es ? "Eventos y foros culturales" : "Cultural events and forums",
      text: es
        ? "Encuentros urbanos con sabedores ancestrales Mhuysqa, Kogui y Tikuna para el trabajo comunitario."
        : "Urban gatherings with Mhuysqa, Kogui and Tikuna knowledge keepers for community work.",
    },
  ];
  return (
    <>
      <section className="section page-intro">
        <span className="eyebrow">
          {es ? "COMUNIDAD VIVA" : "LIVING COMMUNITY"} · Fundación Alma Arcoíris
        </span>
        <h1>
          {es
            ? "Tu energía transforma el territorio: haz parte de la gran Familia Alma Arcoíris"
            : "Your energy transforms the land: become part of the Alma Arcoíris family"}
        </h1>
        <p>
          {es
            ? "Conéctate con la naturaleza, comparte con sabedores ancestrales y aporta tu talento o tiempo a través de nuestros voluntariados, caminatas ecológicas y círculos de apoyo continuo."
            : "Connect with nature, meet ancestral knowledge keepers and share your time or skills through volunteering, nature walks and ongoing support circles."}
        </p>
        <div className="button-row">
          <a className="button gold" href="#circulos">
            <Heart size={20} />
            {es ? "Unirme a la comunidad" : "Join the community"}
          </a>
          <a className="button outline" href="#expediciones">
            {es
              ? "Ver voluntariado y misiones"
              : "Explore volunteering and missions"}
            <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <SectionTitle
          eyebrow={es ? "ECOSISTEMA DE PARTICIPACIÓN" : "WAYS TO TAKE PART"}
          title={
            es ? "Elige cómo deseas participar" : "Choose how to take part"
          }
        />
        <div className="participation-grid">
          {routes.map((r) => (
            <a
              className="participation-card"
              href={`#${r.id}`}
              key={r.id}
              data-reveal
            >
              <r.icon size={30} />
              <h3>{r.title}</h3>
              <p>{r.text}</p>
              <span className="text-link">
                {es ? "Conocer más" : "Learn more"}
                <ArrowUpRight size={18} />
              </span>
            </a>
          ))}
        </div>
      </section>
      <section className="section" id="expediciones">
        <article className="feature-row">
          <div className="mission-photos">
            <Photo
              src="/images/misiones.webp"
              alt={
                es
                  ? "Participación comunitaria durante la Misión Amazonas"
                  : "Community participation during the Amazon mission"
              }
            />
            <Photo
              src="/images/sierra-misiones.webp"
              alt={
                es
                  ? "Encuentro comunitario durante la Misión Sierra Nevada"
                  : "Community gathering during the Sierra Nevada mission"
              }
            />
          </div>
          <div>
            <span className="eyebrow">
              {es
                ? "VOLUNTARIADO Y MISIONES EN TERRITORIO"
                : "VOLUNTEERING AND COMMUNITY MISSIONS"}
            </span>
            <h2>
              {es
                ? "Pon tus manos y tu corazón al servicio de la Tierra"
                : "Put your hands and heart at the service of the Earth"}
            </h2>
            <p>
              {es
                ? "Salir de la rutina urbana para adentrarte en la selva o la montaña no es solo un viaje; es una experiencia de transformación personal. Como voluntario o voluntaria, te integras a brigadas de bioconstrucción e infraestructura social trabajando mano a mano con las familias campesinas e indígenas en territorio."
                : "Leaving the urban routine for the forest or mountains is a journey of personal transformation. Volunteers join natural building and social infrastructure teams, working alongside rural and Indigenous families."}
            </p>
            <p>
              {es
                ? "Las expediciones y misiones comunitarias son actividades autofinanciadas por los propios participantes."
                : "Community expeditions and missions are self-funded by participants."}
            </p>
            <a
              className="button gold"
              href={`${contact}?subject=Voluntariado%20y%20misiones`}
            >
              {es ? "Postularme como voluntario" : "Enquire about volunteering"}
              <ArrowUpRight size={18} />
            </a>
          </div>
        </article>
        <ol className="participation-steps">
          <li>
            <h3>{es ? "Elige tu misión" : "Choose your mission"}</h3>
            <p>
              {es
                ? "Misión Amazonas, Misión Sierra Nevada o reconstrucción en El Cairo, Valle."
                : "Amazon Mission, Sierra Nevada Mission or rebuilding in El Cairo, Valle."}
            </p>
          </li>
          <li>
            <h3>{es ? "Comparte tu perfil" : "Share your skills"}</h3>
            <p>
              {es
                ? "Arquitectura, pedagogía, salud, logística o apoyo general. Contacta al equipo para consultar la postulación."
                : "Architecture, education, healthcare, logistics or general support. Contact the team to enquire about applying."}
            </p>
          </li>
          <li>
            <h3>
              {es
                ? "Prepara tu equipaje y tu corazón"
                : "Prepare your bag and your heart"}
            </h3>
            <p>
              {es
                ? "Recibe la inducción logística y súmate a las jornadas de trabajo comunitario autofinanciado."
                : "Receive a logistics introduction and join self-funded community work."}
            </p>
          </li>
        </ol>
      </section>
      <section className="section" id="caminatas">
        <article className="feature-row">
          <Photo
            src="/images/caminatas.webp"
            alt={
              es
                ? "Grupo de caminantes junto a una laguna de páramo en Cundinamarca"
                : "Walkers beside a páramo lake in Cundinamarca"
            }
          />
          <div>
            <span className="eyebrow">
              {es
                ? "CAMINATAS CONSCIENTES Y RECONEXIÓN ECOLÓGICA"
                : "MINDFUL WALKS AND ECOLOGICAL RECONNECTION"}
            </span>
            <h2>
              {es
                ? "Camina con propósito, protege nuestros ecosistemas"
                : "Walk with purpose, protect our ecosystems"}
            </h2>
            <p>
              {es
                ? "Nuestras salidas mensuales en Cundinamarca (Sueva, Sumapaz, Guasca, Sesquilé) combinan la educación ambiental temprana, el reconocimiento de plantas nativas y meditaciones guiadas."
                : "Our monthly outings in Cundinamarca (Sueva, Sumapaz, Guasca and Sesquilé) combine environmental education, native plant recognition and guided meditation."}
            </p>
            <a
              className="button outline"
              href={`${contact}?subject=Pr%C3%B3ximas%20caminatas`}
            >
              {es
                ? "Consultar próximas fechas de caminatas"
                : "Ask about upcoming walk dates"}
              <ArrowUpRight size={18} />
            </a>
            <p className="source-note">
              {es
                ? "La guía de reconexión y el calendario se incorporarán cuando estén disponibles."
                : "The reconnection guide and calendar will be added when available."}
            </p>
          </div>
        </article>
      </section>
      <section className="section" id="circulos">
        <SectionTitle
          eyebrow={es ? "CÍRCULOS DE COMUNIDAD" : "COMMUNITY CIRCLES"}
          title={
            es
              ? "Haz parte de la gran comunidad Alma Arcoíris alrededor del mundo"
              : "Become part of the Alma Arcoíris community around the world"
          }
          text={
            es
              ? "El bienestar interior se sostiene en tribu. Creamos espacios virtuales y presenciales de escucha, respeto y crecimiento continuo sin costo de inscripción."
              : "Inner wellbeing is sustained in community. We create virtual and in-person spaces for listening, respect and ongoing growth with no joining fee."
          }
        />
        <div className="community-grid three">
          {[
            [
              es ? "Comunidad general" : "General community",
              es
                ? "En este grupo recibirás información de valor y las fechas de todos nuestros encuentros."
                : "Receive useful information and dates for our gatherings.",
            ],
            [
              "EFIS",
              es
                ? "Encuentro Femenino de Integración Sagrada. Encuentros virtuales y presenciales."
                : "Encuentro Femenino de Integración Sagrada. Virtual and in-person gatherings for women.",
            ],
            [
              "Hermandad del Cóndor",
              es
                ? "Red de liderazgo consciente y sanación emocional para hombres. Círculos de palabra y retiros."
                : "A conscious leadership and emotional healing network for men. Listening circles and retreats.",
            ],
          ].map(([title, text]) => (
            <article key={title}>
              <MessageCircle size={28} />
              <h3>{title}</h3>
              <p>{text}</p>
              <a
                className="text-link"
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
              >
                {es
                  ? "Consultar cómo unirme por WhatsApp"
                  : "Ask how to join on WhatsApp"}
                <ArrowUpRight size={18} />
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className="section" id="encuentros">
        <article className="feature-row">
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
              {es
                ? "EVENTOS, FOROS Y MINGAS CULTURALES"
                : "EVENTS, FORUMS AND CULTURAL MINGAS"}
            </span>
            <h2>
              {es
                ? "Encuentros con sabedores ancestrales"
                : "Gatherings with ancestral knowledge keepers"}
            </h2>
            <p>
              {es
                ? "Encuentros urbanos con sabedores ancestrales Mhuysqa, Kogui y Tikuna para el trabajo comunitario."
                : "Urban gatherings with Mhuysqa, Kogui and Tikuna knowledge keepers for community work."}
            </p>
            <a
              className="button outline"
              href={`${contact}?subject=Eventos%20y%20foros%20culturales`}
            >
              {es
                ? "Consultar próximos encuentros"
                : "Ask about upcoming gatherings"}
              <ArrowUpRight size={18} />
            </a>
          </div>
        </article>
      </section>
      <Faq
        lang={lang}
        items={[
          {
            question: es
              ? "¿Requiere experiencia previa ser voluntario en las misiones en territorio?"
              : "Do community mission volunteers need prior experience?",
            answer: es
              ? "No. Lo más importante es la disposición al trabajo en equipo y el respeto por las comunidades originarias. Contamos con equipos técnicos que guían cada actividad."
              : "No. Willingness to work as a team and respect for Indigenous communities are what matter most. Technical teams guide each activity.",
          },
          {
            question: es
              ? "¿Por qué las misiones de voluntariado requieren un aporte solidario?"
              : "Why do volunteering missions require a contribution?",
            answer: es
              ? "Somos una Entidad Sin Ánimo de Lucro (ESAL). El aporte cubre tus costos de estadía, alimentación, transporte local, póliza de seguro médico y la compra de materiales de bioconstrucción o kits escolares para la comunidad."
              : "We are a nonprofit. The contribution covers accommodation, meals, local transport, medical insurance and building materials or school kits for the community.",
          },
          {
            question: es
              ? "¿Cómo funcionan los círculos de WhatsApp EFIS y Hermandad del Cóndor?"
              : "How do the EFIS and Hermandad del Cóndor WhatsApp circles work?",
            answer: es
              ? "Son comunidades de acceso abierto y respetuoso donde compartimos lecturas, invitaciones a talleres virtuales, meditaciones y encuentros de palabra."
              : "They are open, respectful communities that share readings, invitations to virtual workshops, meditation and listening circles.",
          },
        ]}
      />
      <section className="closing">
        <h2>
          {es
            ? "Encuentra tu tribu, transforma tu entorno"
            : "Find your community, transform your surroundings"}
        </h2>
        <p>
          {es
            ? "Cada paso que das en la naturaleza o cada hora que entregas en territorio florece como soberanía y bienestar para nuestras comunidades aliadas."
            : "Every step in nature and every hour shared on the ground supports the sovereignty and wellbeing of our partner communities."}
        </p>
        <a
          className="button gold"
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
        >
          <Heart size={20} />
          {es
            ? "Unirme a la Familia Alma Arcoíris hoy"
            : "Join the Alma Arcoíris family today"}
        </a>
      </section>
    </>
  );
}

const team = [
  [
    "Claudia Patricia Pavas Salazar",
    "Presidente y Representante Legal",
    "President and Legal Representative",
  ],
  [
    "Alejandro",
    "Liderazgo estratégico y cofundador",
    "Strategic leadership and co-founder",
  ],
  [
    "Ana Zivkovic",
    "Dirección y desarrollo institucional",
    "Institutional leadership and development",
  ],
  [
    "Óscar y Tatiana",
    "Coordinación y ejecución de proyectos en territorio",
    "Community project coordination and delivery",
  ],
  ["Julián Méndez", "Guía y etnoeducador", "Guide and ethno-educator"],
  [
    "Jorge González",
    "Desarrollador web y arquitectura digital",
    "Web development and digital architecture",
  ],
  ["Bernardo", "Asesoría legal internacional", "International legal advisory"],
  [
    "SEMbox España · Paqui Martín",
    "Gestión de campañas Google Ad Grants y estrategia SEM",
    "Google Ad Grants campaigns and SEM strategy",
  ],
];
const allianceGroups = [
  {
    es: "Soporte tecnológico y herramientas",
    en: "Technology support and tools",
    items: [
      ["google", "Google for Nonprofits"],
      ["elevenlabs", "ElevenLabs"],
      ["canva", "Canva"],
      ["contablemente", "Contablemente"],
    ],
  },
  {
    es: "Organizaciones y cooperación internacional",
    en: "Organisations and international cooperation",
    items: [
      ["semilla", "ONG La Semilla · Francia"],
      ["aldenjina", "Organización Kogui Aldeñjina"],
      ["mujer", "Mujer Potencia · Argentina"],
      ["potencia", "Potencia Humana · Argentina"],
    ],
  },
  {
    es: "Centros regenerativos y redes",
    en: "Regenerative centres and networks",
    items: [
      ["santuario", "Santuario Centros Regenerativos"],
      ["", "Fundación Pech · Bogotá"],
      ["", "Casa Santuario · Bogotá"],
    ],
  },
];
export function AboutPage({ lang }: { lang: Lang }) {
  const es = lang === "es";
  return (
    <>
      <section className="section page-intro">
        <span className="eyebrow">
          {es ? "GOBERNANZA, RAÍZ Y EQUIPO" : "GOVERNANCE, ROOTS AND TEAM"}
        </span>
        <h1>
          {es
            ? "Somos el puente entre la sabiduría ancestral y la regeneración del planeta"
            : "We are a bridge between ancestral wisdom and planetary regeneration"}
        </h1>
        <p>
          {es
            ? "Conoce al equipo humano, a los sabedores tradicionales en territorio y a la red global de aliados que respaldan nuestra gestión con transparencia, rigor legal y respeto por la tierra."
            : "Meet our team, traditional knowledge keepers and global partners who support our work with transparency, legal rigour and respect for the Earth."}
        </p>
        <div className="button-row">
          <Link className="button gold" href={href(lang, "donate")}>
            <Heart size={20} />
            {es ? "Apoyar nuestra misión" : "Support our mission"}
          </Link>
          <a className="button outline" href="#equipo">
            {es ? "Ver equipo y alianzas" : "Meet our team and partners"}
            <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
      <div className="institutional-root">
        <section className="section" id="raiz">
          <SectionTitle
            eyebrow={es ? "NUESTRA RAÍZ" : "OUR ROOTS"}
            title={
              es
                ? "Un propósito claro frente a la crisis global"
                : "A clear purpose in the face of a global crisis"
            }
            text={
              es
                ? "Sabemos lo difícil que es encontrar proyectos sociales transparentes donde sientas la seguridad de que tu apoyo llega de forma directa y respetuosa al territorio."
                : "We understand how difficult it can be to find transparent social projects where you feel confident that your support reaches communities directly and respectfully."
            }
          />
          <div className="purpose-grid">
            <article data-reveal>
              <span className="eyebrow">{es ? "EL POR QUÉ" : "OUR WHY"}</span>
              <h3>{es ? "Nuestro propósito" : "Our purpose"}</h3>
              <p>
                {es
                  ? "Creemos que la regeneración del planeta y de la humanidad empieza reconectando con la sabiduría ancestral."
                  : "We believe that regenerating the planet and humanity starts by reconnecting with ancestral wisdom."}
              </p>
              <p>
                {es
                  ? "Nuestro propósito es respaldar su bienestar y soberanía territorial."
                  : "Our purpose is to support Indigenous communities’ wellbeing and territorial sovereignty."}
              </p>
            </article>
            <article data-reveal>
              <span className="eyebrow">
                {es ? "NUESTRA MISIÓN" : "OUR MISSION"}
              </span>
              <h3>
                {es
                  ? "Proyectos de doble impacto"
                  : "Projects with a dual impact"}
              </h3>
              <p>
                {es
                  ? "Impulsamos el bienestar y la soberanía de los guardianes ancestrales en Colombia mediante proyectos de doble impacto (infraestructura social, educación intercultural y conservación ambiental) y expediciones conscientes que conectan el saber nativo con el desarrollo sostenible."
                  : "We support the wellbeing and sovereignty of Colombia’s ancestral guardians through dual-impact projects (social infrastructure, intercultural education and environmental conservation) and mindful expeditions connecting native knowledge with sustainable development."}
              </p>
            </article>
            <article data-reveal>
              <span className="eyebrow">
                {es ? "NUESTRA VISIÓN · 2030" : "OUR VISION · 2030"}
              </span>
              <h3>
                {es
                  ? "Una red de territorios fortalecidos"
                  : "A network of stronger territories"}
              </h3>
              <p>
                {es
                  ? "Ser el modelo referente en Colombia en la articulación de la sabiduría ancestral con el desarrollo territorial sostenible, consolidando una red de resguardos indígenas fortalecidos e integrados."
                  : "To become a reference model in Colombia for connecting ancestral wisdom with sustainable territorial development, consolidating a network of strong, connected Indigenous reserves."}
              </p>
            </article>
          </div>
        </section>
      </div>
      <section className="section" id="sabedores">
        <SectionTitle
          eyebrow={
            es
              ? "SABEDORES Y ETNOEDUCADORES"
              : "KNOWLEDGE KEEPERS AND EDUCATORS"
          }
          title={
            es
              ? "La sabiduría no se impone, se escucha y se acompaña"
              : "Wisdom is heard and supported, never imposed"
          }
          text={
            es
              ? "Nuestras acciones en la Sierra Nevada, el Amazonas y Cundinamarca son orientadas directamente por los mayores y líderes juveniles de las comunidades originarias."
              : "Our actions in the Sierra Nevada, Amazon and Cundinamarca are guided directly by Indigenous elders and youth leaders."
          }
        />
        <div className="ancestral-grid">
          <article data-reveal>
            <span className="eyebrow">Sierra Nevada</span>
            <h3>{es ? "Pueblo Kogui" : "Kogui people"}</h3>
            <p>
              {es
                ? "Mamos y Sagas de la comunidad Kogui Mamacondo y Ciénaga, Magdalena."
                : "Mamos and Sagas from the Mamacondo and Ciénaga Kogui community, Magdalena."}
            </p>
            <p>
              {es
                ? "Alianza con la Organización Aldeñjina."
                : "Partnership with the Aldeñjina organisation."}
            </p>
          </article>
          <article data-reveal>
            <span className="eyebrow">Cundinamarca</span>
            <h3>{es ? "Pueblo Mhuysqa" : "Mhuysqa people"}</h3>
            <p>
              {es
                ? "Sospkwachiswa Yeison Márquez · Líder juvenil del resguardo de Sesquilé."
                : "Sospkwachiswa Yeison Márquez · Youth leader of the Sesquilé reserve."}
            </p>
            <p>
              {es
                ? "Mayora Lourdes · Líder espiritual del resguardo de Cota."
                : "Elder Lourdes · Spiritual leader of the Cota reserve."}
            </p>
          </article>
          <article data-reveal>
            <span className="eyebrow">Amazonas</span>
            <h3>{es ? "Pueblo Tikuna" : "Tikuna people"}</h3>
            <p>
              {es
                ? "Acuerdo de apoyo avalado por el curaca y líderes de El Vergel y la Escuela Santa Isabel."
                : "Support agreement endorsed by the curaca and leaders of El Vergel and Santa Isabel School."}
            </p>
          </article>
          <article data-reveal>
            <span className="eyebrow">Valle del Cauca</span>
            <h3>El Cairo</h3>
            <p>{es ? "Acuerdo de apoyo." : "Support agreement."}</p>
          </article>
        </div>
      </section>
      <section className="section" id="valores">
        <SectionTitle
          eyebrow={es ? "NUESTROS VALORES" : "OUR VALUES"}
          title={
            es
              ? "Los principios que nos definen"
              : "The principles that define us"
          }
          text={
            es
              ? "Estos principios son la base sólida sobre la cual construimos nuestro compromiso con el bien común, guiados por una visión compartida de humanidad y compasión."
              : "These principles underpin our commitment to the common good, guided by a shared vision of humanity and compassion."
          }
        />
        <ul className="values-list">
          {(es
            ? [
                "Humildad",
                "Hermandad",
                "Compromiso",
                "Integridad",
                "Gratitud",
                "Compasión",
              ]
            : [
                "Humility",
                "Fellowship",
                "Commitment",
                "Integrity",
                "Gratitude",
                "Compassion",
              ]
          ).map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
        <div className="value-descriptions">
          {valueDescriptions.map((value) => (
            <details key={value.title.es} suppressHydrationWarning>
              <summary>{value.title[lang]}</summary>
              <p>{value.text[lang]}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="section" id="equipo">
        <SectionTitle
          eyebrow={
            es
              ? "LIDERAZGO Y EQUIPO DE PROYECTOS"
              : "LEADERSHIP AND PROJECT TEAM"
          }
          title={
            es ? "El equipo detrás del impacto" : "The team behind the impact"
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
              ? "Unidos por un impacto sistémico"
              : "United for systemic impact"
          }
        />
        {allianceGroups.map((group) => (
          <div className="alliance-group" key={group.es}>
            <h3>{group[lang]}</h3>
            <div className="allies">
              {group.items.map(([file, name]) => (
                <div key={name}>
                  {file && (
                    <Image
                      src={`/images/ally-${file}.webp`}
                      alt={name}
                      width={240}
                      height={120}
                    />
                  )}
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
      <section className="section" id="marco-legal">
        <div className="institutional-legal">
          <ShieldCheck size={32} />
          <h2>
            {es
              ? "Institucionalidad y cumplimiento de ley"
              : "Institutional framework and legal compliance"}
          </h2>
          <dl>
            <div>
              <dt>{es ? "Personería jurídica" : "Legal registration"}</dt>
              <dd>
                {es
                  ? "Inscrita el 27/12/2023 bajo la Matrícula S0063813. Cámara de Comercio de Bogotá."
                  : "Registered on 27 December 2023 under registration S0063813. Bogotá Chamber of Commerce."}
              </dd>
            </div>
            <div>
              <dt>{es ? "Identificación tributaria" : "Tax identification"}</dt>
              <dd>
                NIT 901.784.588-0 ·{" "}
                {es
                  ? "Responsabilidad 04 · DIAN, Régimen Tributario Especial."
                  : "Responsibility 04 · DIAN, Special Tax Regime."}
              </dd>
            </div>
            <div>
              <dt>{es ? "Supervisión y vigilancia" : "Oversight"}</dt>
              <dd>
                {es
                  ? "Certificado vigencia 2025. Radicado GOB-S-CR-2026-0168636. Gobernación de Cundinamarca."
                  : "2025 reporting-period certificate. Reference GOB-S-CR-2026-0168636. Cundinamarca Government."}
              </dd>
            </div>
            <div>
              <dt>{es ? "Normativa contable" : "Accounting standards"}</dt>
              <dd>
                {es
                  ? "Estados financieros bajo NIIF para PYMES. Revisoría fiscal independiente."
                  : "Financial statements under IFRS for SMEs. Independent statutory audit."}
              </dd>
            </div>
          </dl>
          <Link
            className="button outline"
            href={`${href(lang, "impact")}#memorias`}
          >
            {es
              ? "Consultar documentos de transparencia"
              : "Explore transparency records"}
            <ArrowUpRight size={18} />
          </Link>
          <p className="source-note">
            {es
              ? "Los certificados oficiales se incorporarán a la biblioteca cuando estén disponibles."
              : "Official certificates will be added to the library when available."}
          </p>
        </div>
      </section>
      <Faq
        lang={lang}
        items={[
          {
            question: es
              ? "¿Cómo garantizan que la ayuda no altere la cultura de las comunidades indígenas?"
              : "How do you ensure support respects Indigenous cultures?",
            answer: es
              ? "Trabajamos bajo el modelo de co-creación de doble vía. No imponemos proyectos externos; financiamos únicamente las necesidades de infraestructura o educación solicitadas y avaladas por sus autoridades tradicionales."
              : "We work through reciprocal co-creation. We fund infrastructure or education needs requested and endorsed by traditional authorities, without imposing external projects.",
          },
          {
            question: es
              ? "¿Quién audita los recursos que recibe la fundación?"
              : "Who audits the resources received by the foundation?",
            answer: es
              ? "Nuestros estados financieros son preparados bajo normas NIIF, auditados por Revisor Fiscal independiente y reportados anualmente ante la Gobernación de Cundinamarca y la DIAN."
              : "Our financial statements are prepared under IFRS, audited by an independent statutory auditor and reported annually to the Cundinamarca Government and DIAN.",
          },
        ]}
      />
      <section className="closing">
        <h2>
          {es
            ? "Sé parte de la historia que estamos construyendo"
            : "Be part of the story we are building"}
        </h2>
        <p>
          {es
            ? "Tu donación o participación fortalece un modelo real de preservación cultural y ecológica en Colombia."
            : "Your donation or participation strengthens cultural and ecological preservation in Colombia."}
        </p>
        <Link className="button gold" href={href(lang, "donate")}>
          <Heart size={20} />
          {es ? "Apoyar a la fundación hoy" : "Support the foundation today"}
        </Link>
      </section>
    </>
  );
}
