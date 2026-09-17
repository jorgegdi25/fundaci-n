import { createClient } from "next-sanity";
import { projects as reviewedProjects, type Project } from "@/content/projects";
import { cache } from "react";

export const sanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
);
const client = sanityConfigured
  ? createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2026-09-16",
      useCdn: true,
      perspective: "published",
      token: process.env.SANITY_API_READ_TOKEN,
    })
  : null;

/** A partial CMS dataset must never silently remove one of the four agreed projects. */
export const getProjects = cache(async (): Promise<Project[]> => {
  if (!client) return reviewedProjects;
  try {
    const records = await client.fetch<Project[]>(
      `*[_type == "project"] | order(order asc) {...,"image":coalesce(coverImage.asset->url,image),"hero":coalesce(heroImage.asset->url,hero),"modules":modules[]{...,"image":coalesce(photo.asset->url,image)},"videoImage":coalesce(videoCover.asset->url,videoImage)}`,
      {},
      { next: { revalidate: 60 } },
    );
    return reviewedProjects.map((base) => {
      const edited = records.find((p) => p.slug === base.slug);
      return edited
        ? {
            ...base,
            ...Object.fromEntries(
              Object.entries(edited).filter(
                ([, v]) => v !== null && v !== undefined,
              ),
            ),
          }
        : base;
    });
  } catch {
    console.warn(
      "Sanity unavailable: rendering the reviewed local project content.",
    );
    return reviewedProjects;
  }
});
