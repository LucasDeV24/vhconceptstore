import { LOJA, CONDICOES } from "@/data/conteudo";
import type { Produto } from "@/types";
import { brl, brlCentavos } from "@/utils/format";

/** Link do WhatsApp da loja com a mensagem já escrita (wa.me/NÚMERO?text=...). */
export function linkWhatsApp(mensagem = "Olá! Vim pelo site da VH Concept Store.") {
  return `https://wa.me/${LOJA.telefone}?text=${encodeURIComponent(mensagem)}`;
}

/** Abre o WhatsApp da loja com a mensagem pronta. Precisa ser chamado direto de um clique (senão o navegador bloqueia). */
export function abrirWhatsApp(mensagem: string) {
  window.open(linkWhatsApp(mensagem), "_blank", "noopener");
}

/** Endereço da página do produto neste site (a loja abre e vê foto, cor e preço na hora). */
export const urlDoProduto = (id: string) => `${window.location.origin}${import.meta.env.BASE_URL}produto/${id}`;

export function descreverProduto(p: Produto) {
  const condicao = p.categoria === "acessorio" ? "" : CONDICOES[p.condicao].rotulo;
  return [p.nome, p.armazenamento, p.cor.nome, condicao].filter(Boolean).join(" · ");
}

/** "Tenho interesse neste iPhone": vai quando o cliente quer um aparelho específico. */
export function mensagemInteresse(p: Produto, quantidade = 1) {
  const linhas = [`Olá! Tenho interesse neste ${p.categoria === "acessorio" ? "produto" : "iPhone"}:`, "", `📱 ${quantidade > 1 ? `${quantidade}x ` : ""}${descreverProduto(p)}`];
  if (!p.sobConsulta) {
    linhas.push(`💰 À vista: ${brl(p.preco)}`, `💳 Ou em até ${p.parcelas.quantidade}x de ${brlCentavos(p.parcelas.valor)} no cartão (com juros)`);
  }
  linhas.push(`🔗 ${urlDoProduto(p.id)}`, "", p.sobConsulta ? "Qual o valor e a disponibilidade?" : "Ainda está disponível?");
  return linhas.join("\n");
}

export function mensagemPedido(itens: { produto: Produto; quantidade: number }[], total: number, parcela: number, n: number) {
  const linhas = itens.flatMap(({ produto, quantidade }) => [
    `📱 ${quantidade}x ${descreverProduto(produto)} — ${brl(produto.preco)} à vista`,
    `🔗 ${urlDoProduto(produto.id)}`,
  ]);
  return [
    `Olá, ${LOJA.nome}! Quero finalizar este pedido:`,
    "",
    ...linhas,
    "",
    `💰 Total à vista: ${brl(total)}`,
    `💳 Ou em até ${n}x de ${brlCentavos(parcela)} no cartão (com juros da maquininha)`,
  ].join("\n");
}
