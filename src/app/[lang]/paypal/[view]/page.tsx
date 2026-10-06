import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/site-shell";
import { PayPalResult } from "@/components/paypal-result";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "es" ? "Aporte · PayPal" : "Your gift · PayPal",
    robots: { index: false, follow: false },
    referrer: "no-referrer",
  };
}
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; view: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang, view } = await params;
  if (
    (lang !== "es" && lang !== "en") ||
    (view !== "result" && view !== "manage")
  )
    notFound();
  const query = await searchParams,
    donation = typeof query.donation === "string" ? query.donation : undefined;
  return (
    <>
      <Header
        lang={lang}
        alternate={`/${lang === "es" ? "en" : "es"}/paypal/${view}${donation ? `?donation=${encodeURIComponent(donation)}` : ""}`}
        preserveFragment={view === "manage"}
      />
      <PayPalResult
        lang={lang}
        donation={donation}
        manage={view === "manage"}
      />
      <Footer lang={lang} />
    </>
  );
}
