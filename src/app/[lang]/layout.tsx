import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteUrl } from "@/lib/site-url";
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
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
