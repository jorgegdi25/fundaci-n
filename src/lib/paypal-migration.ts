import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { separatePayPalDatabase } from "./paypal-live.ts";

export async function migratePayPalLive(
  liveUrl: string,
  sandboxUrl: string,
  source: string,
) {
  const connection = new URL(liveUrl);
  const sandbox = new URL(sandboxUrl);
  if (
    !connection.hostname.endsWith(".neon.tech") ||
    connection.hostname.includes("-pooler.") ||
    !["/alma_paypal_live", "/neondb"].includes(connection.pathname) ||
    connection.hostname.replace("-pooler.", ".") ===
      sandbox.hostname.replace("-pooler.", ".") ||
    !separatePayPalDatabase(liveUrl, sandboxUrl)
  )
    throw new Error("dedicated_live_project_required");
  const sql = neon(liveUrl);

  const tables =
    await sql`SELECT tablename FROM pg_tables WHERE schemaname='public'`;
  const expected = [
    "paypal_environment",
    "paypal_gifts",
    "paypal_payments",
    "paypal_events",
    "donation_rate_limits",
    "donation_communications",
  ];
  if (tables.some((row) => !expected.includes(row.tablename)))
    throw new Error("database_is_not_dedicated");
  if (tables.length) {
    if (!tables.some((row) => row.tablename === "paypal_environment"))
      throw new Error("live_database_marker_missing");
    const marker =
      await sql`SELECT environment FROM paypal_environment WHERE singleton=true`;
    if (marker.length !== 1 || marker[0].environment !== "production")
      throw new Error("wrong_environment");
  }

  const statements = source
    .split(";")
    .map((value) => value.trim())
    .filter(Boolean);
  await sql.transaction(statements.map((statement) => sql.query(statement)));
  const constraints =
    await sql`SELECT pg_get_constraintdef(oid) AS definition FROM pg_constraint WHERE contype='c' AND conrelid='public.paypal_gifts'::regclass`;
  if (
    !constraints.some(
      (row) =>
        row.definition.replace(/[\s()]/g, "") ===
        "CHECKenvironment='production'::text",
    )
  )
    throw new Error("live_constraint_missing");

  const fixture = randomUUID(),
    rejected = randomUUID();
  // Generated UUIDs are the only interpolated identifiers. The deliberate
  // exception rolls back both the valid fixture and the invalid Sandbox trial.
  await sql.query(`DO $verification$
  BEGIN
    BEGIN
      INSERT INTO paypal_gifts(id,access_hash,amount,currency,frequency,cause,lang,environment,consent)
        VALUES('${fixture}',repeat('0',64),333,'EUR','monthly','general','es','production','{"verification":true}'::jsonb);
      BEGIN
        INSERT INTO paypal_gifts(id,access_hash,amount,currency,frequency,cause,lang,environment,consent)
          VALUES('${rejected}',repeat('0',64),333,'USD','monthly','general','es','sandbox','{}'::jsonb);
        RAISE EXCEPTION 'sandbox_row_accepted';
      EXCEPTION WHEN check_violation THEN NULL;
      END;
      RAISE EXCEPTION USING ERRCODE='P0004',MESSAGE='rollback_fixture';
    EXCEPTION WHEN SQLSTATE 'P0004' THEN NULL;
    END;
  END $verification$;`);
  if (
    (
      await sql`SELECT id FROM paypal_gifts WHERE id=${fixture} OR id=${rejected}`
    ).length
  )
    throw new Error("fixture_not_rolled_back");
  return {
    migrated: true,
    environment: "production",
    sandboxRejected: true,
    fixturesRolledBack: true,
  };
}
