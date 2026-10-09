import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { JUROS_TEXTO, MAX_PARCELAS, opcoesDeParcelamento } from "@/data/parcelamento";
import { brl, brlCentavos } from "@/utils/format";

/** Tabela de parcelamento no cartão (1x até o máximo), com o aviso dos juros. */
export function Parcelamento({ preco }: { preco: number }) {
  const [aberto, setAberto] = useState(false);
  const opcoes = opcoesDeParcelamento(preco);

  return (
    <div className={`inst ${aberto ? "is-open" : ""}`}>
      <button type="button" className="inst-toggle" aria-expanded={aberto} onClick={() => setAberto(!aberto)}>
        <Icon nome="cartao" tamanho={18} />
        <span>Ver parcelamento em até {MAX_PARCELAS}x no cartão</span>
        <Icon nome="baixo" tamanho={16} />
      </button>
      {aberto && (
        <div className="inst-body">
          <div className="inst-row inst-row--vista">
            <span>À vista (PIX ou dinheiro)</span>
            <b>{brl(preco)}</b>
          </div>
          {opcoes.map((o) => (
            <div key={o.n} className="inst-row">
              <span>
                {o.n}x de <b>{brlCentavos(o.valor)}</b>
              </span>
              <small>total {brlCentavos(o.total)}</small>
            </div>
          ))}
          <p className="fine">
            Parcelado no cartão com juros da maquininha de {JUROS_TEXTO} por parcela, desde a 1ª parcela. O preço à vista não tem juros.
          </p>
        </div>
      )}
    </div>
  );
}
