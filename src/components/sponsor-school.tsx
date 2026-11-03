"use client";

import { ArrowUpRight } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { useDonationChannel } from "./donation-channel";

export function SponsorSchool({ lang }: { lang: Lang }) {
  const es = lang === "es";
  const sandbox = useDonationChannel() === "sandbox";
  return (
    <>
      <p>
        {sandbox
          ? es
            ? "La recuperación total de la comunidad Embera Chamí requiere constancia. A través de nuestro programa de Apadrinamiento Directo, tus aportes mensuales se destinan al sostenimiento de la compra de materiales locales de bioconstrucción y a garantizar la permanencia escolar de los niños en la Escuela de Doxura sin interrupciones."
            : "The Embera Chamí community’s recovery requires continuity. Through our Direct Sponsorship programme, monthly gifts support the purchase of local natural-building materials and help children stay at Doxura School without interruption."
          : es
            ? "El botón de Wompi disponible actualmente permite realizar un aporte único. Para conocer el programa de apadrinamiento de la escuela y las familias, consulta al equipo de la fundación."
            : "The currently available Wompi button allows a one-time gift. To learn about sponsorship of the school and families, contact the foundation’s team."}
      </p>
      {sandbox ? (
        <a
          className="button outline-light"
          href="#donar-formulario"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("alma:monthly-sponsorship", {
                detail: "el-cairo",
              }),
            )
          }
        >
          {es ? "Quiero apadrinar esta causa" : "Sponsor this cause"}
          <ArrowUpRight size={18} />
        </a>
      ) : (
        <a
          className="button outline-light"
          href="https://wa.me/573044989707?text=Quiero%20conocer%20el%20apadrinamiento%20de%20la%20Escuela%20de%20Doxura"
          target="_blank"
          rel="noreferrer"
        >
          {es ? "Consultar apadrinamiento" : "Ask about sponsorship"}
          <ArrowUpRight size={18} />
        </a>
      )}
    </>
  );
}
