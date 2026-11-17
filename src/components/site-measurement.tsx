"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  consentCommand,
  linkMeasurement,
  measurementPath,
  parseMeasurementConsent,
  readMeasurementConsent,
  tagManagerId,
  trackEvent,
} from "@/lib/measurement";

export function SiteMeasurement({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const [loadContainer, setLoadContainer] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const started = useRef(false);
  const lastPage = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    function syncConsent(event?: Event) {
      const consent =
        event instanceof CustomEvent
          ? (parseMeasurementConsent(event.detail) ?? readMeasurementConsent())
          : readMeasurementConsent();
      const page = measurementPath(window.location.pathname);
      window.gtag?.("set", {
        page_location: window.location.origin + page,
        page_referrer: "",
        send_page_view: false,
      });
      window.gtag?.("consent", "update", consentCommand(consent));
      setAllowed(consent.analytics || consent.marketing);
      if (!consent.analytics && !consent.marketing) lastPage.current = null;
      if (consent.analytics || consent.marketing) {
        if (!started.current) {
          (window.dataLayer ??= []).push({
            "gtm.start": Date.now(),
            event: "gtm.js",
          });
          started.current = true;
        }
        setLoadContainer(true);
        (window.dataLayer ??= []).push({
          event: "alma_consent_update",
          analytics_consent: consent.analytics ? "granted" : "denied",
          marketing_consent: consent.marketing ? "granted" : "denied",
        });
      }
    }
    function click(event: MouseEvent) {
      const target =
        event.target instanceof Element
          ? event.target.closest("a[href]")
          : null;
      if (!(target instanceof HTMLAnchorElement)) return;
      const measured = linkMeasurement(
        target.href,
        target.getAttribute("data-measure-event"),
      );
      if (!measured) return;
      trackEvent(measured.event, {
        ...("fields" in measured ? measured.fields : {}),
        placement: target.closest("footer")
          ? "footer"
          : target.closest("header")
            ? "header"
            : "content",
      });
    }
    syncConsent();
    window.addEventListener("alma-consent-updated", syncConsent);
    document.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("alma-consent-updated", syncConsent);
      document.removeEventListener("click", click, true);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !allowed || !loadContainer || lastPage.current === pathname)
      return;
    const consent = readMeasurementConsent();
    if (!consent.analytics && !consent.marketing) return;
    const page = measurementPath(pathname);
    window.gtag?.("set", { page_location: window.location.origin + page });
    (window.dataLayer ??= []).push({
      event: "alma_page_view",
      page_path: page,
      page_location: window.location.origin + page,
      language: page.startsWith("/en") ? "en" : "es",
    });
    lastPage.current = pathname;
  }, [enabled, allowed, loadContainer, pathname]);

  return enabled && loadContainer ? (
    <Script
      id="alma-google-tag-manager"
      src={`https://www.googletagmanager.com/gtm.js?id=${tagManagerId}`}
      strategy="afterInteractive"
    />
  ) : null;
}
