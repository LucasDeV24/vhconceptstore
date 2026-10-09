import { useState } from "react";
import { Link } from "react-router-dom";
import { MODELOS, getModelo } from "@/data/modelos";
import { api } from "@/services/api";
import { urlFoto } from "@/utils/fotos";
import { SectionHead } from "@/components/ui/SectionHead";
import { brl } from "@/utils/format";
import type { Modelo } from "@/types";

const LINHAS: { rotulo: string; valor: (m: Modelo) => string; melhor?: (ms: Modelo[]) => number }[] = [
  { rotulo: "Tela", valor: (m) => `${m.tela.toString().replace(".", ",")}"`, melhor: (ms) => Math.max(...ms.map((m) => m.tela)) },
  { rotulo: "Painel", valor: (m) => m.painel },
  { rotulo: "Chip", valor: (m) => m.chip },
  { rotulo: "Câmera", valor: (m) => m.camera },
  { rotulo: "Bateria", valor: (m) => `Até ${m.bateriaVideo}h de vídeo`, melhor: (ms) => Math.max(...ms.map((m) => m.bateriaVideo)) },
  { rotulo: "5G", valor: (m) => (m.cincoG ? "Sim" : "Não") },
  { rotulo: "Conector", valor: (m) => m.conector },
];

const menorPreco = (modeloId: string) => {
  const ps = api.todos().filter((p) => p.modelo === modeloId && !p.sobConsulta);
  return ps.length ? Math.min(...ps.map((p) => p.preco)) : null;
};

export function Compare() {
  const [sel, setSel] = useState(["iphone-16", "iphone-17", "iphone-18-pro"]);
  const ms = sel.map((id) => getModelo(id)!);

  return (
    <section className="sec wrap" id="comparar">
      <SectionHead titulo="Compare iPhones" sub="Escolha até três modelos e veja a diferença lado a lado." />
      <div className="compare" style={{ "--n": sel.length } as React.CSSProperties}>
        <div className="cmp-row cmp-head">
          <span />
          {ms.map((m, i) => {
            const preco = menorPreco(m.id);
            return (
              <div key={i} className="cmp-col">
                <div className="cmp-art"><img src={urlFoto(m.id, m.cores[0])} alt={`${m.nome}`} loading="lazy" decoding="async" draggable={false} /></div>
                <select
                  value={m.id}
                  aria-label={`Modelo ${i + 1}`}
                  onChange={(e) => setSel((s) => s.map((x, j) => (j === i ? e.target.value : x)))}
                >
                  {MODELOS.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
                </select>
                <span className="cmp-price">{preco ? <>a partir de <b>{brl(preco)}</b></> : "Consulte o valor"}</span>
              </div>
            );
          })}
        </div>
        {LINHAS.map((l) => {
          const melhor = l.melhor?.(ms);
          return (
            <div key={l.rotulo} className="cmp-row">
              <span className="cmp-label">{l.rotulo}</span>
              {ms.map((m, i) => {
                const destaque =
                  melhor !== undefined && (l.rotulo === "Tela" ? m.tela === melhor : m.bateriaVideo === melhor) &&
                  new Set(ms.map((x) => l.valor(x))).size > 1;
                return <span key={i} className={destaque ? "is-best" : ""}>{l.valor(m)}</span>;
              })}
            </div>
          );
        })}
        <div className="cmp-row cmp-foot">
          <span />
          {ms.map((m, i) => (
            <Link key={i} to={`/loja?q=${encodeURIComponent(m.nome)}`} className="btn btn-ghost btn-sm">Ver {m.nome}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}
