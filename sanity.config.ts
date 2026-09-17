import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schema";
export default defineConfig({
  name: "alma-arcoiris",
  title: "Fundación Alma Arcoíris",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "unconfigured",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/es/estudio",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
