import { createClient } from "next-sanity";
import { projects } from "../src/content/projects.ts";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token)
  throw new Error(
    "Configura NEXT_PUBLIC_SANITY_PROJECT_ID y SANITY_API_WRITE_TOKEN en .env.local. No se ha escrito contenido.",
  );
const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-09-16",
  token,
  useCdn: false,
});
function keys<T extends object>(values: T[]) {
  return values.map((v, i) => ({ ...v, _key: `item-${i}` }));
}
let transaction = client.transaction();
for (const [order, p] of projects.entries())
  transaction = transaction.createIfNotExists({
    ...p,
    _id: `drafts.${p._id}`,
    _type: "project",
    order,
    modules: keys(p.modules),
    results: keys(p.results),
    achievements: keys(p.achievements ?? []).map((item) => ({
      ...item,
      _type: "localizedText",
    })),
    faqs: keys(p.faqs),
  });
await transaction.commit();
console.log(
  "Cuatro borradores preparados. Los documentos existentes se conservaron; no se publicó contenido.",
);
