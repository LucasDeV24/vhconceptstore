import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import type { Produto } from "@/types";
import { abrirWhatsApp, descreverProduto } from "@/services/whatsapp";

/** Adiciona ao carrinho com feedback. `abrir` = comportamento de "Comprar agora". */
export function useComprar() {
  const { adicionar, linhas } = useCart();
  const { abrirCarrinho, avisar } = useUI();

  return (produto: Produto, opcoes: { abrir?: boolean; quantidade?: number } = {}) => {
    // sem preço na tabela: em vez de carrinho, leva direto para o WhatsApp
    if (produto.sobConsulta) {
      void abrirWhatsApp(`Olá! Quero saber o valor e a disponibilidade do ${descreverProduto(produto)}.`).then((ok) => {
        if (ok) avisar("Mensagem copiada", "Cole no WhatsApp para consultar o valor.");
      });
      return;
    }
    const noCarrinho = linhas.find((l) => l.produto.id === produto.id)?.quantidade ?? 0;
    if (noCarrinho >= Math.max(1, produto.estoque)) {
      avisar("Limite de estoque", "Você já tem todas as unidades disponíveis. Fale com a gente no WhatsApp para pedir mais.");
      if (opcoes.abrir) abrirCarrinho();
      return;
    }
    adicionar(produto.id, opcoes.quantidade ?? 1);
    if (opcoes.abrir) abrirCarrinho();
    else avisar("Adicionado ao carrinho", descreverProduto(produto));
  };
}
