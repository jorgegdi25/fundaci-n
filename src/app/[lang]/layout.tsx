import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteUrl } from "@/lib/site-url";
import { headers } from "next/headers";
import Script from "next/script";
import { routedDonationChannel } from "@/lib/server/donation-channel";
import { DonationChannelProvider } from "@/components/donation-channel";
import { FoundationSchema } from "@/components/foundation-schema";
import { RoutePosition } from "@/components/route-position";
import { SiteMeasurement } from "@/components/site-measurement";
import { measurementHost } from "@/lib/measurement";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "./globals.css";
import "./motion.css";
import "./revision.css";
export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Fundación Alma Arcoíris",
    template: "%s | Fundación Alma Arcoíris",
  },
  icons: { icon: "/images/icon.webp" },
  robots:
    process.env.SITE_INDEXABLE === "true"
      ? { index: true, follow: true }
      : { index: false, follow: false },
};
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== "es" && lang !== "en") notFound();
  const host = (await headers()).get("host") ?? "";
  const mode = routedDonationChannel(host);
  const measure = measurementHost(host);
  return (
    <html lang={lang}>
      <head>
        <FoundationSchema lang={lang} />
      </head>
      <body>
        {measure && (
          <Script id="alma-google-consent" strategy="beforeInteractive">
            {`window.dataLayer=window.dataLayer||[];
window.gtag=function(){window.dataLayer.push(arguments);};
window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
window.gtag('set','ads_data_redaction',true);`}
          </Script>
        )}
        <SiteMeasurement enabled={measure} />
        <DonationChannelProvider
          mode={mode}
          lang={lang}
          liveReview={process.env.PAYPAL_LIVE_CHECKOUT_STAGE === "review"}
        >
          <RoutePosition />
          {children}
        </DonationChannelProvider>
      </body>
    </html>
  );
}
