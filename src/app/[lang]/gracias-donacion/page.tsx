import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/site-shell";
import { DonationResult } from "@/components/donation-result";
import { PayPalResult } from "@/components/paypal-result";
import { PageSchema } from "@/components/page-schema";

export const metadata: Metadata = {
  title: "Tu aporte · Your gift",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang } = await params;
  if (lang !== "es" && lang !== "en") notFound();
  const query = await searchParams;
  const donation =
    typeof query.donation === "string" ? query.donation : undefined;
  const provider = query.provider === "paypal" ? "paypal" : "wompi";
  const suffix = new URLSearchParams({
    provider,
    ...(donation ? { donation } : {}),
    ...(typeof query.id === "string" ? { id: query.id } : {}),
  });
  // A return URL is not proof of payment. Both result components consult the
  // authenticated API before displaying approval or the registration form.
  return (
    <>
      <PageSchema
        lang={lang}
        title={lang === "es" ? "Estado de tu aporte" : "Your gift status"}
        path={`/${lang}/gracias-donacion`}
      />
      <Header
        lang={lang}
        alternate={`/${lang === "es" ? "en" : "es"}/gracias-donacion?${suffix}`}
      />
      {provider === "paypal" ? (
        <PayPalResult lang={lang} donation={donation} />
      ) : (
        <DonationResult
          lang={lang}
          donation={donation}
          transactionId={typeof query.id === "string" ? query.id : undefined}
        />
      )}
      <Footer lang={lang} />
    </>
  );
}
