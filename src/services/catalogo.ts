import type { FiltrosCatalogo, Produto } from "@/types";
import { getModelo } from "@/data/modelos";
import { descontoPct } from "@/utils/format";

export interface ItemVitrine {
  produto: Produto;
  /** outras cores do mesmo modelo/armazenamento (só novos) */
  variantes: Produto[];
}

const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const tokens = (s: string) => normalizar(s).replace(/(\d+)\s*(gb|tb)/g, "$1$2").split(/[^a-z0-9]+/).filter(Boolean);

/** Números precisam bater exatamente ("12" não casa com "128gb"); palavras casam pelo início ("semi" → "seminovo"). */
function casaBusca(p: Produto, busca: string) {
  const alvo = tokens(`${p.nome} ${p.armazenamento ?? ""} ${p.cor.nome} ${p.condicao === "novo" ? "lacrado novo" : "seminovo"}`);
  return tokens(busca).every((t) => alvo.some((a) => (/^\d+$/.test(t) ? a === t || a === `${t}gb` || a === `${t}tb` : a.startsWith(t))));
}

export function aplicarFiltros(lista: Produto[], f: FiltrosCatalogo): Produto[] {
  let r = lista.filter((p) => {
    const m = getModelo(p.modelo);
    if (f.categoria && p.categoria !== f.categoria) return false;
    if (f.busca && !casaBusca(p, f.busca)) return false;
    if (f.linhas?.length && (!m || !f.linhas.includes(m.linha))) return false;
    if (f.condicoes?.length && !f.condicoes.includes(p.condicao)) return false;
    if (f.armazenamentos?.length && (!p.armazenamento || !f.armazenamentos.includes(p.armazenamento))) return false;
    if (f.cores?.length && !f.cores.includes(p.cor.nome)) return false;
    if (f.telas?.length && (!m || !f.telas.includes(m.tela))) return false;
    if (f.cameras?.length && (!m || !f.cameras.includes(m.qtdCameras))) return false;
    if (f.precoMax && p.preco > f.precoMax) return false;
    if (f.apenasEmEstoque && p.estoque < 1) return false;
    if (f.apenasOfertas && !descontoPct(p.preco, p.precoAnterior)) return false;
    return true;
  });

  const ord = f.ordenacao ?? "mais-vendidos";
  r = [...r].sort((a, b) => {
    switch (ord) {
      case "menor-preco": return (a.sobConsulta ? Infinity : a.preco) - (b.sobConsulta ? Infinity : b.preco) || 0;
      case "maior-preco": return (b.sobConsulta ? -1 : b.preco) - (a.sobConsulta ? -1 : a.preco);
      case "maior-desconto": return descontoPct(b.preco, b.precoAnterior) - descontoPct(a.preco, a.precoAnterior);
      case "lancamentos": return b.lancamento - a.lancamento || b.preco - a.preco;
      default: return b.vendidos - a.vendidos;
    }
  });
  return r;
}

/** Agrupa novos de mesmo modelo + armazenamento num único card com seletor de cor. */
export function agruparVitrine(lista: Produto[]): ItemVitrine[] {
  const grupos = new Map<string, Produto[]>();
  for (const p of lista) {
    const chave = p.categoria === "iphone" ? `${p.modelo}|${p.nome}|${p.armazenamento}|${p.condicao}` : p.id;
    const g = grupos.get(chave);
    if (g) g.push(p);
    else grupos.set(chave, [p]);
  }
  return [...grupos.values()].map((g) => ({ produto: g.find((p) => p.estoque > 0) ?? g[0], variantes: g }));
}

/** Variações de um produto novo (mesmo modelo e condição) para a página de produto. */
export function variacoesDe(p: Produto, todos: Produto[]) {
  return todos.filter((x) => x.modelo === p.modelo && x.condicao === p.condicao && x.categoria === p.categoria);
}
