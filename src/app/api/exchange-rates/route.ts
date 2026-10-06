import { ecbRatesUrl, parseEcbEuroReference } from "@/lib/exchange-rates";

export async function GET() {
  try {
    const response = await fetch(ecbRatesUrl, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("exchange_rate_unavailable");
    const quote = parseEcbEuroReference(await response.text());
    if (!quote) throw new Error("exchange_rate_unavailable");
    return Response.json(quote, {
      headers: { "Cache-Control": "public, max-age=300" },
    });
  } catch {
    return Response.json(
      { error: "exchange_rate_unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
