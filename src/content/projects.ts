import { l, type Localized } from "../lib/i18n.ts";
export type Project = {
  _id: string;
  slug: string;
  name: Localized;
  title: Localized;
  subtitle: Localized;
  location: Localized;
  category: Localized;
  image: string;
  hero: string;
  alt: Localized;
  color: string;
  modules: {
    title: Localized;
    description: Localized;
    image?: string;
    portrait?: boolean;
  }[];
  results: { value: string; label: Localized }[];
  resultsTitle?: Localized;
  achievements?: Localized[];
  testimony?: { quote: Localized; author: Localized };
  video?: string;
  videoImage?: string;
  involvement: Localized;
  involvementText: Localized;
  faqs: { question: Localized; answer: Localized }[];
};
const paymentFaq = {
  question: l("¿Cómo puedo donar?", "How can I donate?"),
  answer: l(
    "Usa el botón de donación de esta página y revisa las condiciones del medio de pago. Para recibir orientación, escríbenos a contacto@fundacionalmaarcoiris.org.",
    "Use this page’s donation button and review the payment method’s terms. For guidance, contact contacto@fundacionalmaarcoiris.org.",
  ),
};
export const projects: Project[] = [
  {
    _id: "project-el-cairo",
    slug: "el-cairo",
    name: l("El Cairo", "El Cairo"),
    title: l(
      "Respuesta humanitaria Emergencia tras Terremoto: Reconstrucción Sostenible y Apoyo Directo en El Cairo, Valle del Cauca",
      "Humanitarian response after the earthquake: Sustainable Rebuilding and Direct Support in El Cairo, Valle del Cauca",
    ),
    subtitle: l(
      "Tu aporte financia la reconstrucción segura de la escuela de la comunidad Indígena Embera Chamí, recupera la arquitectura tradicional de bahareque y reactiva la autosostenibilidad de las familias indígenas afectadas en el Paisaje Cultural Cafetero.",
      "Your gift funds the safe rebuilding of the Embera Chamí Indigenous community’s school, restores traditional bahareque architecture and supports the livelihoods of affected Indigenous families in Colombia’s Coffee Cultural Landscape.",
    ),
    location: l("Valle del Cauca, Colombia", "Valle del Cauca, Colombia"),
    category: l("Respuesta humanitaria", "Humanitarian response"),
    image: "/images/el-cairo.webp",
    hero: "/images/el-cairo-escuela.webp",
    alt: l(
      "Escuela de la comunidad Embera Chamí en Doxura, El Cairo",
      "The Embera Chamí community’s school in Doxura, El Cairo",
    ),
    color: "#a76443",
    modules: [
      {
        title: l(
          "Reconstrucción sostenible y segura",
          "Safe, sustainable rebuilding",
        ),
        description: l(
          "Implementación de modelos de construcción que unifican la arquitectura sísmicamente resistente con el uso de materiales locales como la guadua y tabla tradicional. La Escuela lo requiere urgente.",
          "Building models that combine earthquake-resistant architecture with local materials such as guadua bamboo and traditional timber. The school urgently needs this work.",
        ),
      },
      {
        title: l(
          "Apoyo directo y apadrinamiento escolar",
          "Direct support and school sponsorship",
        ),
        description: l(
          "Fortalecimiento de la autosostenibilidad y apoyo a las familias indígenas y campesinas para la reconstrucción de sus medios de vida y el aseguramiento educativo de la niñez Embera Chamí en Doxura.",
          "Supporting Indigenous and rural families as they rebuild their livelihoods, strengthen self-sufficiency and secure education for Embera Chamí children in Doxura.",
        ),
      },
    ],
    results: [
      {
        value: "+$20M COP",
        label: l(
          "recaudados para primeras entregas de emergencia y articulación técnica",
          "raised for initial emergency support and technical coordination",
        ),
      },
      {
        value: "+15",
        label: l(
          "familias beneficiadas directamente en El Cairo, Valle del Cauca",
          "families directly supported in El Cairo, Valle del Cauca",
        ),
      },
    ],
    resultsTitle: l(
      "Respuestas reales ante la emergencia en El Cairo",
      "Responses to the emergency in El Cairo",
    ),
    testimony: {
      quote: l(
        "No es solo volver a levantar techos y paredes; es reconstruir nuestra identidad indígena y campesina con nuestras propias manos y los materiales de nuestra tierra.",
        "It is more than rebuilding roofs and walls; it is rebuilding our Indigenous and rural identity with our own hands and the materials of our land.",
      ),
      author: l(
        "Líder comunitario del Municipio de El Cairo, Valle del Cauca",
        "Community leader from El Cairo, Valle del Cauca",
      ),
    },
    involvement: l(
      "Acompaña la reconstrucción sostenida: Conviértete en Padrino de la Escuela y las Familias",
      "Support lasting rebuilding: Sponsor the School and Families",
    ),
    involvementText: l(
      "La recuperación total de la comunidad Embera Chamí requiere constancia. A través de nuestro programa de Apadrinamiento Directo, tus aportes mensuales se destinan al sostenimiento de la compra de materiales locales de bioconstrucción y a garantizar la permanencia escolar de los niños en la Escuela de Doxura sin interrupciones.",
      "The Embera Chamí community’s full recovery requires continuity. Through our Direct Sponsorship programme, monthly contributions support local natural-building materials and help children continue their education at Doxura School without interruption.",
    ),
    faqs: [
      {
        question: l(
          "¿Cómo garantiza el proyecto que las estructuras sean resistentes a futuros sismos?",
          "How does the project make structures resistant to future earthquakes?",
        ),
        answer: l(
          "Contamos con un equipo de expertos que integran los principios técnicos del bahareque encostillado y la guadua, reconocidos por su flexibilidad y comportamiento sismorresistente en el Paisaje Cultural Cafetero.",
          "Our experts combine the technical principles of timber-framed bahareque and guadua bamboo, known for their flexibility and earthquake-resistant behaviour in the Coffee Cultural Landscape.",
        ),
      },
      {
        question: l(
          "¿A dónde se destina mi aporte?",
          "How will my gift be used?",
        ),
        answer: l(
          "Los fondos financian la ejecución del proyecto, la compra de materiales locales, el desarrollo pedagógico y la reactivación de la escuela de los niños en las familias indígenas afectadas.",
          "Funds support project delivery, local materials, educational work and reopening the school for children from affected Indigenous families.",
        ),
      },
      paymentFaq,
    ],
  },
  {
    _id: "project-sierra-nevada",
    slug: "sierra-nevada",
    name: l("Sierra Nevada", "Sierra Nevada"),
    title: l(
      "Misión Sierra Nevada: Cuidando el corazón del mundo y la sabiduría Kogui",
      "Sierra Nevada Mission: Caring for the heart of the world and Kogui wisdom",
    ),
    subtitle: l(
      "Tu aporte protege los ecosistemas sagrados de la Sierra Nevada de Santa Marta, apoya la educación ancestral de la niñez y sostiene a las autoridades indígenas del Pueblo Kogui.",
      "Your support protects sacred ecosystems in the Sierra Nevada de Santa Marta, supports children’s ancestral education and sustains the Kogui people’s traditional authorities.",
    ),
    location: l("Sierra Nevada de Santa Marta", "Sierra Nevada de Santa Marta"),
    category: l("Territorio y saberes", "Land and ancestral knowledge"),
    image: "/images/sierra-nevada.webp",
    hero: "/images/sierra-nevada.webp",
    alt: l(
      "Encuentro de la comunidad Kogui y participantes de la fundación",
      "A gathering of the Kogui community and foundation participants",
    ),
    color: "#416448",
    modules: [
      {
        title: l(
          "Protección ambiental y territorio",
          "Environmental and land protection",
        ),
        description: l(
          "Cuidado de los manglares, las Madres Viejas y el agua, en diálogo con los conocimientos de la comunidad.",
          "Caring for mangroves, the Madres Viejas and water, guided by community knowledge.",
        ),
        image: "/images/sierra-ambiente.webp",
      },
      {
        title: l(
          "Educación tradicional indígena",
          "Traditional Indigenous education",
        ),
        description: l(
          "Kits escolares y apoyo a espacios de aprendizaje que mantienen viva la educación ancestral.",
          "School supplies and learning spaces that help keep ancestral education alive.",
        ),
        image: "/images/sierra-educacion.webp",
      },
      {
        title: l("Saberes de la mujer Kogui", "Kogui women’s knowledge"),
        description: l(
          "Apoyo a las autoridades tradicionales femeninas y a los materiales que sostienen el tejido artesanal.",
          "Supporting traditional women leaders and the materials that sustain their weaving practices.",
        ),
        image: "/images/sierra-mujeres.webp",
        portrait: true,
      },
      {
        title: l(
          "Movilidad de autoridades Kogui",
          "Supporting Kogui authorities’ journeys",
        ),
        description: l(
          "Acompañamiento a sus viajes para pagamentos, protección del territorio e intercambio de saberes.",
          "Supporting journeys for ceremonial offerings, land protection and knowledge exchange.",
        ),
        image: "/images/sierra-autoridades.webp",
        portrait: true,
      },
    ],
    results: [
      {
        value: "22",
        label: l("kits escolares entregados", "school supply kits delivered"),
      },
      {
        value: "70+",
        label: l(
          "personas en la expedición 2026",
          "people brought together in the 2026 expedition",
        ),
      },
      {
        value: "5+",
        label: l(
          "viajes de autoridades acompañados",
          "journeys by traditional authorities supported",
        ),
      },
    ],
    video: "QrTNcRNwD2s",
    resultsTitle: l(
      "Resultados reales en la Sierra Nevada de Santa Marta durante los últimos 3 años",
      "Results in the Sierra Nevada de Santa Marta over the last 3 years",
    ),
    achievements: [
      l(
        "Apoyo logístico en más de 5 viajes nacionales e internacionales (Perú, Francia, Chile, Nueva Zelanda y Bogotá) de autoridades indígenas Kogui con propósitos espirituales y medioambientales.",
        "Logistics support for over 5 national and international journeys (Peru, France, Chile, New Zealand and Bogotá) by Kogui authorities for spiritual and environmental purposes.",
      ),
      l(
        "Intermediación en la proyección del primer documental sobre los Kogui en Japón.",
        "Facilitating a screening of the first documentary about the Kogui in Japan.",
      ),
      l(
        "Conformación de la alianza oficial entre ONG Colombo Francesa La Semilla y la Organización Kogui Aldeñjina.",
        "Formation of the partnership between the Colombian-French NGO La Semilla and the Kogui organisation Aldeñjina.",
      ),
    ],
    testimony: {
      quote: l(
        "Sostener la labor ceremonial de los Mamos y cuidar el agua de la Sierra es salvaguardar el equilibrio de toda la Tierra.",
        "Supporting the Mamos’ ceremonial work and caring for the Sierra’s water safeguards the balance of the whole Earth.",
      ),
      author: l(
        "Memoria Viva · Autoridades tradicionales del resguardo Kogui",
        "Living memory · Traditional authorities of the Kogui reserve",
      ),
    },
    videoImage: "/images/sierra-educacion.webp",
    involvement: l(
      "¿Sientes el llamado a conectar con el corazón del mundo?",
      "Feel the call to connect with the heart of the world?",
    ),
    involvementText: l(
      "Una expedición de cinco días para conocer el territorio, cuidar los manglares y compartir círculos de palabra con autoridades Kogui. Participación autofinanciada, vinculada al trabajo comunitario.",
      "A five-day expedition to learn about the land, care for mangroves and share listening circles with Kogui authorities. Self-funded participation connected to community work.",
    ),
    faqs: [
      {
        question: l(
          "¿Qué sostiene mi donación?",
          "What does my donation support?",
        ),
        answer: l(
          "Materiales educativos y de tejido, alimentación comunitaria y el sostenimiento de Mamos y Sagas, de acuerdo con las necesidades definidas en territorio.",
          "Learning and weaving materials, community meals and support for Mamos and Sagas, according to needs identified in the territory.",
        ),
      },
      paymentFaq,
    ],
  },
  {
    _id: "project-amazonas",
    slug: "amazonas",
    name: l("Amazonas", "Amazon"),
    title: l(
      "Misión Amazonas: empoderando a los guardianes de la selva",
      "Amazon Mission: empowering the guardians of the rainforest",
    ),
    subtitle: l(
      "Tu aporte nos ayuda en la construcción de espacios educativos dignos, preserva la sabiduría ancestral y apoya a la comunidad indígena Tikuna en Leticia, Amazonas colombiano.",
      "Your support helps create dignified learning spaces, preserve ancestral knowledge and support the Tikuna community in Leticia, in the Colombian Amazon.",
    ),
    location: l("Leticia, Amazonas", "Leticia, Amazon"),
    category: l("Educación y comunidad", "Education and community"),
    image: "/images/amazonas.webp",
    hero: "/images/amazonas-hero.webp",
    alt: l(
      "Comunidad y voluntarios de Misión Amazonas",
      "Community members and volunteers of the Amazon mission",
    ),
    color: "#425f3e",
    modules: [
      {
        title: l("Aulas e infraestructura", "Classrooms and infrastructure"),
        description: l(
          "Adecuación y pintura de los salones de la Escuela Santa Isabel para un aprendizaje digno.",
          "Improving and painting classrooms at Santa Isabel School to create dignified learning spaces.",
        ),
        image: "/images/amazonas-aulas.webp",
      },
      {
        title: l("Espacios de juego sano", "Healthy spaces to play"),
        description: l(
          "Construcción de parques artesanales que invitan a la niñez a jugar, compartir y descubrir al aire libre.",
          "Building handcrafted playgrounds that invite children to play, connect and explore outdoors.",
        ),
        image: "/images/amazonas-juego.webp",
      },
      {
        title: l(
          "Preservación cultural y arte",
          "Cultural preservation and art",
        ),
        description: l(
          "Talleres creativos, teatro pedagógico y preservación de saberes ancestrales junto a la niñez.",
          "Creative workshops, educational theatre and ancestral knowledge shared with children.",
        ),
        image: "/images/amazonas-talleres.webp",
      },
    ],
    results: [
      {
        value: "60+",
        label: l(
          "niños de la Escuela Santa Isabel",
          "children at Santa Isabel School",
        ),
      },
      {
        value: "250",
        label: l(
          "habitantes del sector El Vergel",
          "residents of the El Vergel area",
        ),
      },
      {
        value: "2",
        label: l(
          "expediciones comunitarias realizadas",
          "community expeditions completed",
        ),
      },
    ],
    video: "vd6Iwo2xobA",
    resultsTitle: l(
      "Resultados reales en la comunidad Tikuna",
      "Results in the Tikuna community",
    ),
    achievements: [
      l(
        "Construcción del primer espacio de juegos artesanal de la Escuela junto a 9 voluntarios.",
        "Construction of the school’s first handcrafted playground alongside 9 volunteers.",
      ),
    ],
    videoImage: "/images/amazonas-hero.webp",
    involvement: l(
      "Vive esta transformación en el territorio",
      "Be part of this transformation on the ground",
    ),
    involvementText: l(
      "Seis días de trabajo comunitario, bioconstrucción y encuentro con la comunidad Tikuna. Conoce la participación autofinanciada y cómo contribuye a los proyectos en territorio.",
      "Six days of community work, natural building and exchange with the Tikuna community. Learn about self-funded participation and its contribution to local projects.",
    ),
    faqs: [
      {
        question: l(
          "¿Cómo puedo conocer los resultados?",
          "How can I see the results?",
        ),
        answer: l(
          "Publicamos informes de gestión y memorias audiovisuales de las misiones. Puedes consultarlos en Impacto y transparencia.",
          "We publish annual reports and audiovisual records of our missions. Explore them in Impact and transparency.",
        ),
      },
      paymentFaq,
    ],
  },
  {
    _id: "project-mhuysqa",
    slug: "mhuysqa",
    name: l("Pueblo Mhuysqa", "Mhuysqa people"),
    title: l(
      "Resurgimiento del Pueblo Mhuysqa: Fondo de Apoyo a las Sabedoras y Abuelas Ancestrales.",
      "Mhuysqa Renewal: Supporting Ancestral Women Knowledge Keepers and Grandmothers",
    ),
    subtitle: l(
      "Tu aporte sostiene los cantos al agua, los rezos a la Madre Tierra y el centro regenerativo Casa de Pensamiento en Apulo, Cundinamarca, visibilizando el liderazgo espiritual femenino.",
      "Your support sustains songs to water, prayers to Mother Earth and the Casa de Pensamiento regenerative centre in Apulo, Cundinamarca, bringing women’s spiritual leadership into view.",
    ),
    location: l("Cundinamarca, Colombia", "Cundinamarca, Colombia"),
    category: l(
      "Memoria y liderazgo femenino",
      "Living memory and women’s leadership",
    ),
    image: "/images/mhuysqa.webp",
    hero: "/images/mhuysqa-hero.webp",
    alt: l(
      "Encuentro comunitario con sabedoras Mhuysqa",
      "A community gathering with Mhuysqa knowledge keepers",
    ),
    color: "#7b653b",
    modules: [
      {
        title: l(
          "Cantos al agua y rezos a la Tierra",
          "Songs to water and prayers to the Earth",
        ),
        description: l(
          "Movilidad y sostenimiento para que las Abuelas compartan sus ceremonias en fuentes hídricas y territorios sagrados.",
          "Travel and support for the Grandmothers to share ceremonies at water sources and sacred places.",
        ),
        image: "/images/mhuysqa-agua.webp",
      },
      {
        title: l("Medicina herbal y tejido", "Herbal knowledge and weaving"),
        description: l(
          "Espacios de intercambio de conocimientos botánicos y artesanales con comunidades urbanas.",
          "Spaces for sharing botanical and craft knowledge with urban communities.",
        ),
        image: "/images/mhuysqa-saberes.webp",
      },
      {
        title: l(
          "Centro regenerativo en Apulo",
          "Regenerative centre in Apulo",
        ),
        description: l(
          "Fortalecimiento del Jardín Botánico y Casa de Pensamiento, liderado por la Abuela Blanca Nelly Rativá.",
          "Supporting the Botanical Garden and Casa de Pensamiento, led by Grandmother Blanca Nelly Rativá.",
        ),
        image: "/images/mhuysqa-apulo.webp",
        portrait: true,
      },
    ],
    results: [
      {
        value: "4",
        label: l(
          "comunidades en el encuentro intercultural",
          "communities in the intercultural gathering",
        ),
      },
      {
        value: "70+",
        label: l(
          "personas reunidas en Cundinamarca",
          "people brought together in Cundinamarca",
        ),
      },
      {
        value: "1",
        label: l(
          "centro regenerativo acompañado",
          "regenerative centre supported",
        ),
      },
    ],
    involvement: l(
      "Círculos de sabiduría y encuentros con las Abuelas",
      "Wisdom circles and gatherings with the Grandmothers",
    ),
    resultsTitle: l(
      "Tejiendo memoria y liderazgo femenino Mhuysqa",
      "Weaving Mhuysqa memory and women’s leadership",
    ),
    testimony: {
      quote: l(
        "Cantarle al agua y cuidar las plantas no es un acto del pasado; es la medicina que las ciudades necesitan hoy para recordar su origen y sanar su vínculo con la Tierra.",
        "Singing to water and caring for plants is more than an act of the past; it is the medicine cities need today to remember their origins and heal their connection with the Earth.",
      ),
      author: l(
        "Abuela Blanca Nelly Rativá · Princesa Mhuysqa",
        "Grandmother Blanca Nelly Rativá · Mhuysqa Princess",
      ),
    },
    involvementText: l(
      "Participa en jornadas de canto al agua, talleres de tejido, reconocimiento de plantas y encuentros en la Casa de Pensamiento.",
      "Join songs to water, weaving workshops, plant walks and gatherings at the Casa de Pensamiento.",
    ),
    faqs: [
      {
        question: l(
          "¿Quién lidera esta iniciativa?",
          "Who leads this initiative?",
        ),
        answer: l(
          "La Abuela Blanca Nelly Rativá, en alianza con Fundación Alma Arcoíris, acompaña el fondo de apoyo a sabedoras y el proceso de la Casa de Pensamiento.",
          "Grandmother Blanca Nelly Rativá, in partnership with Fundación Alma Arcoíris, leads the support fund for knowledge keepers and the Casa de Pensamiento process.",
        ),
      },
      paymentFaq,
    ],
  },
];
