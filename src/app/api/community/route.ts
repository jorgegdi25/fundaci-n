import { randomUUID } from "node:crypto";
import { matchesOrigin } from "@/lib/request-security";
import { validateCommunitySignup } from "@/lib/community";

function settings() {
  const endpoint = process.env.COMMUNITY_SHEETS_ENDPOINT;
  const secret = process.env.COMMUNITY_SHEETS_SECRET;
  if (!endpoint || !secret || secret.length < 32) return null;
  try {
    const url = new URL(endpoint);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "script.google.com" ||
      !/^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url.pathname) ||
      url.search
    )
      return null;
    return { endpoint, secret };
  } catch {
    return null;
  }
}
const headers = { "Cache-Control": "no-store" };
export function GET() {
  return Response.json({ configured: Boolean(settings()) }, { headers });
}
export async function POST(request: Request) {
  if (
    !matchesOrigin(
      request.url,
      request.headers.get("host"),
      request.headers.get("origin"),
    )
  )
    return Response.json({ error: "invalid_origin" }, { status: 403, headers });
  const text = await request.text();
  if (text.length > 2000)
    return Response.json(
      { error: "invalid_request" },
      { status: 400, headers },
    );
  let input: unknown;
  try {
    input = JSON.parse(text);
  } catch {
    return Response.json(
      { error: "invalid_request" },
      { status: 400, headers },
    );
  }
  const signup = validateCommunitySignup(input);
  if (!signup)
    return Response.json(
      { error: "invalid_request" },
      { status: 400, headers },
    );
  const config = settings();
  if (!config)
    return Response.json(
      { error: "signup_unavailable" },
      { status: 503, headers },
    );
  try {
    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...signup,
        secret: config.secret,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
    const result = await response.json();
    if (!response.ok || result?.ok !== true)
      throw new Error("signup_unavailable");
    return Response.json({ ok: true }, { headers });
  } catch {
    return Response.json(
      { error: "signup_unavailable" },
      { status: 503, headers },
    );
  }
}
