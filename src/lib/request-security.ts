export function matchesOrigin(
  requestUrl: string,
  host: string | null,
  origin: string | null,
) {
  if (!host || !origin) return false;
  try {
    const expected = new URL(requestUrl),
      received = new URL(origin);
    return (
      received.origin === origin &&
      received.protocol === expected.protocol &&
      received.host === host
    );
  } catch {
    return false;
  }
}
