"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function RoutePosition() {
  const pathname = usePathname();
  const restoredPath = useRef<string | null>(null);
  useEffect(() => {
    const markRestoration = () => {
      restoredPath.current = window.location.pathname;
    };
    window.addEventListener("popstate", markRestoration);
    return () => window.removeEventListener("popstate", markRestoration);
  }, []);
  useEffect(() => {
    // Keep explicit section links and native back/forward restoration intact.
    const restored = restoredPath.current === pathname;
    restoredPath.current = null;
    if (restored) return;
    if (window.location.hash) return;
    const frame = requestAnimationFrame(() =>
      window.scrollTo({ top: 0, left: 0, behavior: "instant" }),
    );
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  return null;
}
