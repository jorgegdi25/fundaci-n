import { timingSafeEqual } from "node:crypto";
import { matchesOrigin } from "./request-security.ts";

// Temporary operator window. An old deployment cannot keep this tool enabled.
const expiresAt = Date.parse("2026-11-19T22:30:00Z");

export function paypalSetupAllowed(
  request: Request,
  env: Record<string, string | undefined>,
  now = Date.now(),
) {
  const host = request.headers.get("host");
  const expected = env.PAYPAL_LIVE_SETUP_TOKEN;
  const received = request.headers.get("authorization");
  if (
    now >= expiresAt ||
    env.VERCEL_ENV !== "production" ||
    !/^[a-z0-9-]+\.vercel\.app$/.test(env.VERCEL_URL ?? "") ||
    host !== env.VERCEL_URL ||
    !matchesOrigin(request.url, host, request.headers.get("origin")) ||
    request.headers.get("content-type") !== "application/json" ||
    !/^[a-f0-9]{64}$/.test(expected ?? "") ||
    received?.length !== 71
  )
    return false;
  return timingSafeEqual(
    Buffer.from(received),
    Buffer.from(`Bearer ${expected}`),
  );
}
