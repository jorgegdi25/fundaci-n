"use client";

import { useEffect, useRef, type ReactNode } from "react";

const revealTargets = [
  "[data-reveal]",
  ".hero-copy > *",
  ".hero-portrait figcaption",
  ".hero-purpose > div",
  ".page-intro > *",
  ".section-title",
  ".section-heading-row > p",
  ".project-card",
  ".steps-heading",
  ".step",
  ".context-stats > details",
  ".impact-numbers > div",
  ".home-funds > div",
  ".action-card",
  ".donation-story",
  ".testimonial > div",
  ".module-card",
  ".feature-row > *",
  ".root-story > *",
  ".ods-grid > article",
  ".community-grid > article",
  ".team-card",
  ".closing > *",
].join(",");

/** Progressive enhancement: server-rendered content never depends on motion to be visible. */
export function MotionSurface({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const surface = root.current;
    if (!surface || !window.IntersectionObserver || !Element.prototype.animate)
      return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const seen = new WeakSet<Element>();
    const running = new Map<Animation, Element>();
    let observer: IntersectionObserver | undefined;

    function stop() {
      observer?.disconnect();
      running.forEach((_, animation) => animation.cancel());
      running.clear();
    }

    function start() {
      stop();
      if (preference.matches || !surface) return;

      const candidates = Array.from(
        surface.querySelectorAll<HTMLElement>(revealTargets),
      );
      // Avoid moving both a card and its children at the same time.
      const targets = candidates.filter(
        (node) =>
          !candidates.some(
            (parent) => parent !== node && parent.contains(node),
          ),
      );
      const portrait = surface.querySelector<HTMLElement>(
        ".hero-portrait > .photo",
      );

      observer = new IntersectionObserver(
        (entries) => {
          let order = 0;
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const element = entry.target;
            observer?.unobserve(element);
            if (seen.has(element)) continue;
            seen.add(element);
            // Keyboard and anchor navigation should make the destination immediately usable.
            if (element.contains(document.activeElement)) continue;
            const isPortrait = element === portrait;
            const animation = element.animate(
              isPortrait
                ? [{ transform: "scale(1.045)" }, { transform: "scale(1)" }]
                : [
                    { opacity: 0.85, transform: "translateY(20px)" },
                    { opacity: 1, transform: "translateY(0)" },
                  ],
              {
                duration: isPortrait ? 1200 : 700,
                delay: isPortrait ? 0 : Math.min(order++ * 70, 210),
                easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
                fill: "backwards",
              },
            );
            running.set(animation, element);
            animation.onfinish = () => running.delete(animation);
          }
        },
        { threshold: 0.08 },
      );
      targets.forEach((element) => observer?.observe(element));
      if (portrait) observer.observe(portrait);
    }

    function revealFocused(event: FocusEvent) {
      running.forEach((element, animation) => {
        if (event.target instanceof Node && element.contains(event.target)) {
          animation.cancel();
          running.delete(animation);
        }
      });
    }

    start();
    preference.addEventListener("change", start);
    surface.addEventListener("focusin", revealFocused);
    window.addEventListener("beforeprint", stop);
    window.addEventListener("afterprint", start);
    return () => {
      stop();
      preference.removeEventListener("change", start);
      surface.removeEventListener("focusin", revealFocused);
      window.removeEventListener("beforeprint", stop);
      window.removeEventListener("afterprint", start);
    };
  }, []);

  return <div ref={root}>{children}</div>;
}
