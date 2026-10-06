import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/site-shell";
import { DonationResult } from "@/components/donation-result";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "es" ? "Aporte · Wompi" : "Your gift · Wompi",
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
    other = lang === "es" ? "en" : "es";
  const alternateQuery = new URLSearchParams();
  for (const key of ["donation", "id"])
    if (typeof query[key] === "string") alternateQuery.set(key, query[key]);
  const suffix = alternateQuery.size ? `?${alternateQuery}` : "";
  return (
    <>
      <Header
        lang={lang}
        alternate={`/${other}/donation/${view}${suffix}`}
        preserveFragment={view === "manage"}
      />
      <DonationResult
        lang={lang}
        manage={view === "manage"}
        donation={
          typeof query.donation === "string" ? query.donation : undefined
        }
        transactionId={typeof query.id === "string" ? query.id : undefined}
      />
      <Footer lang={lang} />
    </>
  );
}
