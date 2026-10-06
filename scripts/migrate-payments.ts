import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const connection = new URL(
  process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL,
);
connection.hostname = connection.hostname.replace("-pooler.", ".");
const sql = neon(connection.href);
const source = await readFile(
  new URL("./payments-schema.sql", import.meta.url),
  "utf8",
);
const statements = source
  .split(";")
  .map((value) => value.trim())
  .filter(Boolean);
await sql.transaction(statements.map((statement) => sql.query(statement)));
console.log("Sandbox donation tables created successfully.");
