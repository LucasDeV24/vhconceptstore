import { Link, useLocation } from "react-router-dom";
import { LOJA } from "@/data/conteudo";
import { Icon } from "@/components/ui/Icon";
import { Faq } from "@/components/home/Faq";
import { linkWhatsApp } from "@/services/whatsapp";

// Textos-base. Revise com as políticas reais da loja (e um advogado, no caso de Privacidade e Termos).
const PAGINAS: Record<string, { titulo: string; blocos: { h: string; p: string }[] }> = {
  garantia: {
    titulo: "Garantia",
    blocos: [
      { h: "iPhones lacrados", p: "Aparelhos novos, na caixa lacrada. Pergunte pela garantia do modelo que você escolher; a gente informa tudo antes de fechar." },
      { h: "Seminovos", p: "Todos os seminovos são testados e garantidos. O prazo da garantia é informado no WhatsApp junto com o pedido. A garantia não cobre queda, contato com líquido ou mau uso." },
      { h: "Como acionar", p: "Chame no WhatsApp com o número do pedido e uma descrição do problema. A gente orienta o próximo passo." },
    ],
  },
  "trocas-e-devolucoes": {
    titulo: "Trocas e devoluções",
    blocos: [
      { h: "Arrependimento", p: "Compras feitas à distância podem ser devolvidas em até 7 dias após o recebimento, conforme o Código de Defesa do Consumidor." },
      { h: "Condições", p: "O aparelho deve voltar nas mesmas condições em que foi enviado, com acessórios e caixa." },
      { h: "Defeito", p: "Se o produto chegar com defeito, a troca é feita sem custo para você." },
    ],
  },
  privacidade: {
    titulo: "Privacidade",
    blocos: [
      { h: "O que guardamos", p: "Carrinho, favoritos e CEP ficam salvos apenas no seu navegador. Os dados do pedido são tratados na conversa pelo WhatsApp." },
      { h: "Uso dos dados", p: "Usamos suas informações apenas para concluir a venda e fazer a entrega." },
    ],
  },
  termos: {
    titulo: "Termos de uso",
    blocos: [
      { h: "Preços e estoque", p: "Preços e disponibilidade podem mudar sem aviso. O valor válido é o confirmado no fechamento do pedido." },
      { h: "Imagens", p: "As ilustrações são representativas. Em seminovos, solicite fotos reais da unidade antes de fechar." },
    ],
  },
  suporte: {
    titulo: "Suporte",
    blocos: [
      { h: "WhatsApp", p: "Nosso canal principal para dúvidas, pedidos, rastreio e garantia." },
      { h: "Atendimento local", p: `${LOJA.cidade} e região. Enviamos para todo o Brasil.` },
    ],
  },
};

export default function InfoPage() {
  const slug = useLocation().pathname.replace("/", "");
  const pg = PAGINAS[slug];
  if (!pg) return null;

  return (
    <>
      <div className="wrap page page--narrow">
        <nav className="crumbs"><Link to="/">Início</Link> <span>/</span> <span>{pg.titulo}</span></nav>
        <h1>{pg.titulo}</h1>
        <div className="info-blocks">
          {pg.blocos.map((b) => (
            <section key={b.h}>
              <h3>{b.h}</h3>
              <p>{b.p}</p>
            </section>
          ))}
        </div>
        <a href={linkWhatsApp()} target="_blank" rel="noopener" className="btn btn-wpp">
          <Icon nome="whatsapp" tamanho={18} /> Falar com a loja
        </a>
      </div>
      {(slug === "suporte" || slug === "garantia") && <Faq />}
    </>
  );
}
