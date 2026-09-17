"use client";
import dynamic from "next/dynamic";
import config from "../../sanity.config";
const NextStudio = dynamic(
  () => import("next-sanity/studio").then((m) => m.NextStudio),
  { ssr: false },
);
export function Studio() {
  return (
    <div className="studio-container">
      <NextStudio config={config} />
    </div>
  );
}
