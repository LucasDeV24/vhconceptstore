import type { Produto } from "@/types";
import { brl, brlCentavos, descontoPct } from "@/utils/format";

interface Props {
  produto: Produto;
  tamanho?: "sm" | "md" | "lg";
}

/** Preço à vista (como na tabela da loja) + parcela em 12x no cartão. */
export function PriceBlock({ produto: p, tamanho = "md" }: Props) {
  if (p.sobConsulta) {
    return (
      <div className={`price price--${tamanho}`}>
        <div className="price-label">Chegou agora</div>
        <div className="price-now price-now--consulta">Consulte o valor</div>
        <div className="price-inst">Chame no WhatsApp</div>
      </div>
    );
  }
  const off = descontoPct(p.preco, p.precoAnterior);
  return (
    <div className={`price price--${tamanho}`}>
      {off > 0 && (
        <div className="price-old">
          <s>{brl(p.precoAnterior!)}</s>
          <span className="price-off">-{off}%</span>
        </div>
      )}
      <div className="price-label">À vista</div>
      <div className="price-now">{brl(p.preco)}</div>
      <div className="price-inst">
        ou em até {p.parcelas.quantidade}x de{" "}
        <span className="nw">
          <b>{brlCentavos(p.parcelas.valor)}</b> <span className="com-juros">com juros</span>
        </span>
      </div>
    </div>
  );
}
