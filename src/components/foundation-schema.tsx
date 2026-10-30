import { getSiteUrl } from "@/lib/site-url";
import { href, type Lang } from "@/lib/i18n";

// Institutional facts and graph requested in Ajustes al home, October 24, 2026.
export function FoundationSchema({ lang }: { lang: Lang }) {
  const origin = getSiteUrl().origin;
  const organization = `${origin}/#organization`;
  const action = `${origin}/#donate-${lang}`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NGO",
        "@id": organization,
        name: "Fundación Alma Arcoíris Colombia",
        alternateName: "Fundación Alma Arcoíris",
        url: origin,
        logo: `${origin}/images/logo.webp`,
        description:
          "Impulsamos el bienestar y la soberanía de comunidades indígenas guardianes de la biodiversidad en Colombia. Desarrollamos proyectos de doble impacto que conectan la sabiduría indígena Kogui, Mhuysqa y Tikuna con el desarrollo sostenible.",
        taxID: "901784588-0",
        knowsAbout: [
          "Conservación Ambiental",
          "Sabiduría Ancestral",
          "Comunidades Indígenas",
          "Bioconstrucción",
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: "Carrera 9 A No 21-61, Conjunto Portanova Cs 1",
          addressLocality: "Chía",
          addressRegion: "Cundinamarca",
          addressCountry: "CO",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+57-304-498-9707",
          contactType: "Donations and Support",
          email: "contacto@fundacionalmaarcoiris.org",
          availableLanguage: ["Spanish", "English"],
        },
        sameAs: [
          "https://www.instagram.com/almaarcoiris_org",
          "https://www.youtube.com/@FundacionAlmaArcoiris",
          "https://www.facebook.com/fundacionalmaarcoiris",
          "https://www.tiktok.com/@almaarcoiris_org",
        ],
        potentialAction: { "@id": action },
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: origin,
        name: "Fundación Alma Arcoíris Colombia",
        inLanguage: ["es", "en"],
        publisher: { "@id": organization },
      },
      {
        "@type": "DonateAction",
        "@id": action,
        name:
          lang === "es"
            ? "Donar a la Fundación Alma Arcoíris"
            : "Donate to Fundación Alma Arcoíris",
        description:
          "Tu donación apoya la reconstrucción de escuelas, proyectos de bioconstrucción y la soberanía de comunidades indígenas en Colombia.",
        recipient: { "@id": organization },
        target: {
          "@type": "EntryPoint",
          urlTemplate: new URL(href(lang, "donate"), origin).href,
          inLanguage: lang,
          actionPlatform: [
            "https://schema.org/DesktopWebPlatform",
            "https://schema.org/MobileWebPlatform",
          ],
        },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
