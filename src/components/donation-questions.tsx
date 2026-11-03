"use client";

import {
  cancellationEmail,
  monthlyCancellationNotice,
  sandboxCancellationNotice,
} from "@/content/donation-policy";
import type { Lang } from "@/lib/i18n";
import { useDonationChannel } from "./donation-channel";

// Shared across Donar and the project pages. Production availability stays
// separate from the integration being reviewed in Sandbox.
export function DonationQuestions({
  lang,
  fundDetails = false,
}: {
  lang: Lang;
  fundDetails?: boolean;
}) {
  const es = lang === "es";
  const sandbox = useDonationChannel() === "sandbox";
  const items = [
    [
      es
        ? "¿Recibo certificado de donación?"
        : "Will I receive a donation certificate?",
      sandbox
        ? es
          ? "Los aportes de Sandbox son pruebas y no generan certificados tributarios. Para donaciones reales, puedes solicitar el certificado a certificados@fundacionalmaarcoiris.org; se tramita conforme a la política de la fundación, a más tardar en enero del año siguiente."
          : "Sandbox gifts are tests and do not generate tax certificates. For real donations, request a certificate at certificados@fundacionalmaarcoiris.org; it is processed under the foundation’s policy, no later than January of the following year."
        : es
          ? "Puedes solicitar tu certificado a certificados@fundacionalmaarcoiris.org y completar el registro de aportantes. Se tramita conforme a la política de la fundación, a más tardar en enero del año siguiente."
          : "Request your certificate at certificados@fundacionalmaarcoiris.org and complete contributor registration. It is processed under the foundation’s policy, no later than January of the following year.",
    ],
    ...(fundDetails
      ? [
          [
            es ? "¿A dónde va tu donación?" : "Where does your donation go?",
            es
              ? "Del 100% de tu aporte a este proyecto, 85% se destina a materiales, trabajo comunitario y logística en el territorio y 15% a coordinación, seguimiento y rendición de cuentas. Ese 15% es el equipo que hace que lo que prometemos llegue y que puedas verificarlo."
              : "Of your full contribution to this project, 85% goes to materials, community work and logistics on the ground, and 15% to coordination, monitoring and accountability. That 15% supports the team that fulfils our commitments and lets you verify the results.",
          ],
          [
            es ? "Fondo General" : "General Fund",
            es
              ? "Sostiene a quienes sostienen los proyectos. Cubre el equipo, la contabilidad, la revisoría fiscal, los seguros y la logística que todos los proyectos necesitan. Informamos en qué se usa cada trimestre."
              : "It supports those who sustain the projects. It covers the team, accounting, statutory auditing, insurance and logistics that all projects need. We report on its use every quarter.",
          ],
        ]
      : []),
    [
      es
        ? "Cubre los costos de tu donación (opcional)"
        : "Cover donation costs (optional)",
      sandbox
        ? es
          ? "Puedes sumar voluntariamente 5%, 10% o 15% para cubrir la comisión de la pasarela y aportar a la operación de la Fundación. El formulario muestra el total antes de continuar."
          : "You can voluntarily add 5%, 10% or 15% to cover payment processing and support the Foundation’s operations. The form shows the total before you continue."
        : es
          ? "La fundación contempla un aporte opcional para cubrir costos de la pasarela y apoyar su operación. Revisa el valor final en el botón externo de Wompi antes de confirmar."
          : "The foundation provides for an optional contribution toward processing costs and operations. Review the final amount on the external Wompi payment page before confirming.",
    ],
    [
      es
        ? "¿Puedo donar desde fuera de Colombia?"
        : "Can I donate from outside Colombia?",
      sandbox
        ? es
          ? "En esta versión puedes probar PayPal en USD y EUR, y Wompi en COP. Todas estas operaciones están en Sandbox y no mueven dinero real."
          : "In this version you can test PayPal in USD and EUR, and Wompi in COP. All these operations are in Sandbox and move no real money."
        : es
          ? "Consulta los medios de pago disponibles en la plataforma externa de Wompi de la fundación. Si necesitas orientación para un aporte internacional, escríbenos a contacto@fundacionalmaarcoiris.org."
          : "Check the available payment methods on the foundation’s external Wompi payment page. For help with an international gift, contact contacto@fundacionalmaarcoiris.org.",
    ],
    [
      es
        ? "¿Cómo puedo cancelar o modificar mi donación mensual recurrente?"
        : "How can I cancel or change my recurring monthly donation?",
      `${monthlyCancellationNotice[lang]} ${es ? "Envía tu solicitud a" : "Send your request to"} ${cancellationEmail}. ${
        sandbox
          ? `${sandboxCancellationNotice[lang]} ${es ? "Guarda el enlace personal de gestión para consultar tu aporte de prueba." : "Save your personal management link to check your test gift."}`
          : es
            ? "El botón público actual recibe aportes únicos. Para consultar un aporte mensual existente, comunícate con la fundación."
            : "The current public payment button receives one-time gifts. Contact the foundation about an existing monthly gift."
      }`,
    ],
    [
      es
        ? "¿Cómo garantizan que los fondos lleguen realmente al territorio?"
        : "How do you ensure funds reach the communities?",
      es
        ? "Publicamos anualmente los Estados Financieros Auditados NIIF y enviamos boletines con fotografías, testimonios y rendición de cuentas a nuestra red de donantes. Puedes consultar los documentos disponibles en Impacto y transparencia."
        : "We publish audited IFRS financial statements annually and send newsletters with photographs, testimonies and accountability reports to our donor network. Explore the available records in Impact and transparency.",
    ],
  ];
  return (
    <>
      {items.map(([question, answer]) => (
        <details key={question}>
          <summary>
            {question}
            <span aria-hidden="true">+</span>
          </summary>
          <p>{answer}</p>
        </details>
      ))}
    </>
  );
}
