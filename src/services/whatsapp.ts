import { LOJA, CONDICOES } from "@/data/conteudo";
import type { Produto } from "@/types";
import { brl, brlCentavos } from "@/utils/format";

/**
 * O link wa.me/message/... não aceita texto pré-preenchido.
 * Copiamos a mensagem para a área de transferência e abrimos o chat.
 * Se tiver o número, troque por `https://wa.me/55DDDNUMERO?text=${encodeURIComponent(msg)}`.
 */
export async function abrirWhatsApp(mensagem: string): Promise<boolean> {
  let copiou = false;
  try {
    await navigator.clipboard.writeText(mensagem);
    copiou = true;
  } catch {
    /* navegador sem permissão de clipboard: abre o chat mesmo assim */
  }
  window.open(LOJA.whatsapp, "_blank", "noopener");
  return copiou;
}

export function descreverProduto(p: Produto) {
  const partes = [p.nome, p.armazenamento, p.cor.nome, CONDICOES[p.condicao].rotulo];
  return partes.filter(Boolean).join(" · ");
}

export function mensagemPedido(itens: { produto: Produto; quantidade: number }[], total: number, parcela: number, n: number) {
  const linhas = itens.map(
    ({ produto, quantidade }) => `• ${quantidade}x ${descreverProduto(produto)} (${brl(produto.preco)}) [ref ${produto.id}]`
  );
  return [
    `Olá, ${LOJA.nome}! Quero finalizar este pedido:`,
    "",
    ...linhas,
    "",
    `Total à vista: ${brl(total)}`,
    `Ou em até ${n}x de ${brlCentavos(parcela)} no cartão (com juros da maquininha)`,
  ].join("\n");
}
