import { createHash, timingSafeEqual } from "node:crypto";

export type WompiConfig = {
  environment: "sandbox";
  apiUrl: string;
  publicKey: string;
  privateKey: string;
  integritySecret: string;
  eventsSecret: string;
};

// This first integration intentionally accepts Sandbox credentials only.
// Live payments require a separate, reviewed activation after end-to-end tests.
export function sandboxConfig(
  env: Record<string, string | undefined>,
): WompiConfig | null {
  if (env.WOMPI_ENVIRONMENT?.trim() !== "sandbox") return null;
  const values = [
    ["WOMPI_PUBLIC_KEY", "pub_test_"],
    ["WOMPI_PRIVATE_KEY", "prv_test_"],
    ["WOMPI_INTEGRITY_SECRET", "test_integrity_"],
    ["WOMPI_EVENTS_SECRET", "test_events_"],
  ].map(([key, prefix]) => {
    const value = env[key]?.trim() ?? "";
    return value.startsWith(prefix) &&
      value.length > prefix.length &&
      !/\s/.test(value)
      ? value
      : null;
  });
  if (values.some((value) => !value)) return null;
  return {
    environment: "sandbox",
    apiUrl: "https://sandbox.wompi.co/v1",
    publicKey: values[0]!,
    privateKey: values[1]!,
    integritySecret: values[2]!,
    eventsSecret: values[3]!,
  };
}

export const sha256 = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export function secureEqual(a: string, b: string) {
  const left = Buffer.from(a),
    right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
export function integritySignature(
  reference: string,
  cents: number,
  secret: string,
  expiration = "",
) {
  if (!Number.isSafeInteger(cents) || cents <= 0)
    throw new Error("invalid_amount");
  return sha256(`${reference}${cents}COP${expiration}${secret}`);
}

function ownPath(value: unknown, path: string): unknown {
  let current = value;
  for (const key of path.split(".")) {
    if (!current || typeof current !== "object" || !Object.hasOwn(current, key))
      return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

export function authenticEvent(
  body: unknown,
  secret: string,
  header?: string | null,
) {
  if (!body || typeof body !== "object") return false;
  const event = body as Record<string, unknown>;
  const signature = event.signature as Record<string, unknown> | undefined;
  if (
    event.environment !== "test" ||
    !Number.isSafeInteger(event.timestamp) ||
    !signature ||
    !Array.isArray(signature.properties) ||
    !signature.properties.length ||
    signature.properties.length > 30
  )
    return false;
  let joined = "";
  for (const path of signature.properties) {
    if (typeof path !== "string" || path.length > 150) return false;
    const value = ownPath(event.data, path);
    if (
      typeof value !== "string" &&
      typeof value !== "number" &&
      typeof value !== "boolean"
    )
      return false;
    joined += String(value);
  }
  const checksum = header ?? signature.checksum;
  if (typeof checksum !== "string" || !/^[a-f0-9]{64}$/i.test(checksum))
    return false;
  return secureEqual(
    sha256(`${joined}${event.timestamp}${secret}`),
    checksum.toLowerCase(),
  );
}

export function colombiaDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  const number = (type: string) =>
    Number(parts.find((part) => part.type === type)!.value);
  return { year: number("year"), month: number("month"), day: number("day") };
}
export function nextMonthlyDate(start: Date, anchorDay: number): Date {
  const { year, month } = colombiaDateParts(start);
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return new Date(Date.UTC(year, month, Math.min(anchorDay, lastDay), 15));
}

export function sameContract(accepted: string, current: string) {
  try {
    const a = JSON.parse(
      Buffer.from(accepted.split(".")[1], "base64url").toString("utf8"),
    );
    const b = JSON.parse(
      Buffer.from(current.split(".")[1], "base64url").toString("utf8"),
    );
    return (
      typeof a.file_hash === "string" &&
      a.file_hash.length > 0 &&
      a.file_hash === b.file_hash &&
      a.contract_id === b.contract_id &&
      a.permalink === b.permalink
    );
  } catch {
    return false;
  }
}
