import { Icon } from "@/components/ui/Icon";
import { MAX_PARCELAS } from "@/data/parcelamento";

const ITENS = [
  { ico: "revisado", t: "Testados e garantidos", s: "Lacrados e seminovos" },
  { ico: "escudo", t: "Alta qualidade", s: "Aparelhos selecionados" },
  { ico: "caminhao", t: "Envio para todo o Brasil", s: "Entrega em Volta Redonda e região" },
  { ico: "cartao", t: `Parcele em até ${MAX_PARCELAS}x`, s: "No cartão, com juros da maquininha" },
  { ico: "pix", t: "Preço à vista", s: "PIX ou dinheiro" },
  { ico: "troca", t: "Seu usado na troca", s: "Avaliação pelo WhatsApp" },
];

export function TrustBar() {
  return (
    <section className="trust" aria-label="Garantias da loja">
      <div className="wrap trust-in">
        {ITENS.map((i) => (
          <div key={i.t} className="trust-item">
            <Icon nome={i.ico} tamanho={22} />
            <span><b>{i.t}</b><small>{i.s}</small></span>
          </div>
        ))}
      </div>
    </section>
  );
}
