import { useEffect, useState } from "react";
import type { Produto } from "@/types";
import { OfferCard } from "@/components/product/OfferCard";
import { SectionHead } from "@/components/ui/SectionHead";
import { agruparVitrine } from "@/services/catalogo";

/** tempo até domingo 23:59 */
function restante() {
  const agora = new Date();
  const fim = new Date(agora);
  fim.setDate(agora.getDate() + ((7 - agora.getDay()) % 7));
  fim.setHours(23, 59, 59, 999);
  const ms = Math.max(0, fim.getTime() - agora.getTime());
  return { d: Math.floor(ms / 864e5), h: Math.floor((ms / 36e5) % 24), m: Math.floor((ms / 6e4) % 60) };
}

function Contagem() {
  const [t, setT] = useState(restante);
  useEffect(() => {
    const i = setInterval(() => setT(restante()), 30000);
    return () => clearInterval(i);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="countdown" aria-label="Tempo restante das ofertas">
      <span>Termina em</span>
      <b>{t.d}d</b><b>{pad(t.h)}h</b><b>{pad(t.m)}m</b>
    </div>
  );
}

export function WeeklyOffers({ produtos }: { produtos: Produto[] }) {
  const ofertas = agruparVitrine(produtos.filter((p) => p.precoAnterior && p.estoque > 0))
    .map((i) => i.produto)
    .sort((a, b) => (b.precoAnterior! - b.preco) - (a.precoAnterior! - a.preco))
    .slice(0, 4);

  if (ofertas.length < 2) return null;
  const [principal, ...resto] = ofertas;

  return (
    <section className="sec wrap" id="ofertas">
      <SectionHead titulo="Ofertas da semana" link={{ to: "/loja?ofertas=1", rotulo: "Todas as ofertas" }} extra={<Contagem />} />
      <div className="offers">
        <OfferCard produto={principal} destaque />
        <div className="offers-stack">
          {resto.map((p) => <OfferCard key={p.id} produto={p} />)}
        </div>
      </div>
    </section>
  );
}
