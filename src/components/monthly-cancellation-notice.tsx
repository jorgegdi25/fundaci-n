import type { Lang } from "@/lib/i18n";
import {
  cancellationEmail,
  monthlyCancellationNotice,
  sandboxCancellationNotice,
} from "@/content/donation-policy";

export function MonthlyCancellationNotice({
  lang,
  testMode = false,
}: {
  lang: Lang;
  testMode?: boolean;
}) {
  return (
    <div className="monthly-cancellation-notice">
      <p>
        <strong>{monthlyCancellationNotice[lang]}</strong>
      </p>
      <p>
        {lang === "es" ? "Envía tu solicitud a " : "Send your request to "}
        <a href={`mailto:${cancellationEmail}`}>{cancellationEmail}</a>.
      </p>
      {testMode && (
        <p className="small-note">{sandboxCancellationNotice[lang]}</p>
      )}
    </div>
  );
}
