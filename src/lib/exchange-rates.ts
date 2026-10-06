export const ecbRatesUrl =
  "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
export const ecbReferenceUrl =
  "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html";

export type EuroReferenceRate = {
  date: string;
  usdPerEuro: number;
};

export function readEuroReferenceRate(
  value: unknown,
  now = new Date(),
): EuroReferenceRate | null {
  if (!value || typeof value !== "object") return null;
  const { date, usdPerEuro } = value as Record<string, unknown>;
  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    typeof usdPerEuro !== "number" ||
    !Number.isFinite(usdPerEuro) ||
    usdPerEuro <= 0
  )
    return null;
  const published = Date.parse(`${date}T00:00:00Z`);
  const today = Date.parse(`${now.toISOString().slice(0, 10)}T00:00:00Z`);
  if (
    !Number.isFinite(published) ||
    new Date(published).toISOString().slice(0, 10) !== date ||
    published > today ||
    today - published > 7 * 86400000
  )
    return null;
  return { date, usdPerEuro };
}

export function parseEcbEuroReference(
  xml: string,
  now = new Date(),
): EuroReferenceRate | null {
  // The daily ECB feed quotes each currency per one EUR, not EUR per USD.
  const date = xml.match(/<Cube\s+time=['"](\d{4}-\d{2}-\d{2})['"]/i)?.[1];
  const usd = xml.match(
    /<Cube\s+currency=['"]USD['"]\s+rate=['"](\d+(?:\.\d+)?)['"]/i,
  )?.[1];
  return readEuroReferenceRate({ date, usdPerEuro: Number(usd) }, now);
}

export function convertUsdToEur(usd: number, rate: EuroReferenceRate): number {
  return Math.round((usd * 100) / rate.usdPerEuro) / 100;
}
