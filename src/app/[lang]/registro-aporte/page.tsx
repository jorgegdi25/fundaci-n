import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/site-shell";
import { LegacyDonationReturn } from "@/components/legacy-donation";
import { routedDonationChannel } from "@/lib/server/donation-channel";

export const metadata: Metadata = {
  title: "Fundación Alma Arcoíris · Registro",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== "es" && lang !== "en") notFound();
  const mode = routedDonationChannel((await headers()).get("host"));
  return (
    <>
      <Header
        lang={lang}
        alternate={`/${lang === "es" ? "en" : "es"}/registro-aporte`}
      />
      <LegacyDonationReturn lang={lang} testMode={mode === "sandbox"} />
      <Footer lang={lang} />
    </>
  );
}
