"use client";

import { createContext, useContext } from "react";
import type { DonationChannel } from "@/lib/donation-channel";
import type { Lang } from "@/lib/i18n";

const Channel = createContext<DonationChannel>("external");

export function DonationChannelProvider({
  mode,
  lang,
  children,
}: {
  mode: DonationChannel;
  lang: Lang;
  children: React.ReactNode;
}) {
  return (
    <Channel.Provider value={mode}>
      {mode === "sandbox" && (
        <aside
          className="donation-review-banner"
          aria-label={lang === "es" ? "Entorno de pruebas" : "Test environment"}
        >
          <strong>
            {lang === "es" ? "ENTORNO DE PRUEBAS" : "TEST ENVIRONMENT"}
          </strong>
          <span>
            {lang === "es"
              ? "Wompi y PayPal Sandbox · No se mueve dinero real."
              : "Wompi and PayPal Sandbox · No real money moves."}
          </span>
        </aside>
      )}
      {children}
    </Channel.Provider>
  );
}

export function useDonationChannel() {
  return useContext(Channel);
}

export function SandboxOnly({ children }: { children: React.ReactNode }) {
  return useDonationChannel() === "sandbox" ? children : null;
}

export function CurrentDonationScope({ lang }: { lang: Lang }) {
  const mode = useDonationChannel();
  return (
    <p>
      {mode === "sandbox"
        ? lang === "es"
          ? "Esta versión permite consultar los proyectos y probar aportes únicos y mensuales con Wompi y PayPal Sandbox. No mueve dinero real. Guarda el aporte de prueba, su autorización y su estado en una base de datos de pruebas. Los datos del medio de pago se introducen en la plataforma de pagos correspondiente."
          : "This version lets you explore projects and test one-time and monthly gifts with Wompi and PayPal Sandbox. No real money moves. The test gift, authorization and status are stored in a test database. Payment method details are entered through the relevant payment platform."
        : lang === "es"
          ? "Las donaciones únicas se realizan directamente en la plataforma externa de Wompi de la fundación. El valor y los datos de pago se introducen en Wompi. Esta web no procesa esos pagos ni los registra en su base de pruebas. El registro de aportantes se completa por separado en el formulario de Google de la fundación."
          : "One-time donations are made directly on the foundation’s external Wompi payment page. The amount and payment details are entered in Wompi. This website does not process those payments or record them in its test database. Contributor registration is completed separately using the foundation’s Google form."}
    </p>
  );
}
