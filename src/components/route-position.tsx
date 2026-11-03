"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function RoutePosition() {
  const pathname = usePathname();
  const clickedPath = useRef<string | null>(null);
  useEffect(() => {
    const markNavigation = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const target =
        event.target instanceof Element
          ? event.target.closest("a[href]")
          : null;
      if (
        !(target instanceof HTMLAnchorElement) ||
        target.download ||
        (target.target && target.target !== "_self")
      )
        return;
      const url = new URL(target.href, window.location.href);
      if (
        url.origin === window.location.origin &&
        !url.hash &&
        url.pathname !== window.location.pathname
      )
        clickedPath.current = url.pathname;
    };
    document.addEventListener("click", markNavigation, true);
    return () => document.removeEventListener("click", markNavigation, true);
  }, []);
  useEffect(() => {
    // Only new link navigations force the top. Back/forward and explicit section
    // links retain the browser/Next.js restoration behaviour.
    if (clickedPath.current !== pathname || window.location.hash) return;
    clickedPath.current = null;
    const frame = requestAnimationFrame(() =>
      window.scrollTo({ top: 0, left: 0, behavior: "instant" }),
    );
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  return null;
}
