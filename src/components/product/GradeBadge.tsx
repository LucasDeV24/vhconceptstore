import type { Condicao } from "@/types";
import { CONDICOES } from "@/data/conteudo";

interface Props {
  condicao: Condicao;
  completo?: boolean;
  /** mantido por compatibilidade: não há mais tooltip de graus de conservação */
  dica?: boolean;
  /** acessórios não são "lacrados": mostram só "Novo" */
  acessorio?: boolean;
}

/** Selo de condição: Lacrado ou Seminovo. */
export function GradeBadge({ condicao, completo, acessorio }: Props) {
  const c = CONDICOES[condicao];
  if (acessorio) return <span className="grade grade--novo">Novo</span>;
  return <span className={`grade grade--${condicao}`}>{completo ? c.rotulo : c.curto}</span>;
}
