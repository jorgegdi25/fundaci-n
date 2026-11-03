import { l } from "../lib/i18n.ts";

// Donation terms supplied by the foundation; notice period confirmed by the
// client on 3 November 2026. The certificate delivery month remains under review.
export const monthlyCancellationNotice = l(
  "La cancelación de tu aporte mensual debe solicitarse con un mínimo de cinco (5) días hábiles de anticipación al próximo cobro automático.",
  "Cancellation of your monthly gift must be requested at least five (5) business days before the next automatic charge.",
);
export const cancellationEmail = "contacto@fundacionalmaarcoiris.org";
export const sandboxCancellationNotice = l(
  "En Sandbox puedes probar la cancelación inmediata, sin dinero real.",
  "In Sandbox you can test immediate cancellation, with no real money involved.",
);

// Annual attribution clarified by the client on 3 November 2026. This describes
// the period certified, without choosing between the conflicting delivery months.
export const annualCertificatePeriod = l(
  "El certificado anual corresponde al año en que se realizaron las donaciones. Por ejemplo: tus aportes de enero, febrero y marzo de 2027 se incluyen en el certificado que se emite en 2028 y acredita las donaciones del año gravable 2027.",
  "The annual certificate covers the year in which the donations were made. For example, your gifts in January, February and March 2027 are included in the certificate issued in 2028, documenting donations for the 2027 tax year.",
);
