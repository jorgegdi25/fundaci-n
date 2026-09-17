/** Canonical origin for local development and the temporary Vercel deployment. */
export function getSiteUrl(
  env: Record<string, string | undefined> = process.env,
): URL {
  if (env.NEXT_PUBLIC_SITE_URL) return new URL(env.NEXT_PUBLIC_SITE_URL);
  const host = env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL;
  return new URL(host ? `https://${host}` : "http://localhost:3000");
}
