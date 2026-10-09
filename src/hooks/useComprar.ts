import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import type { Produto } from "@/types";
import { abrirWhatsApp, descreverProduto, mensagemInteresse } from "@/services/whatsapp";

/** Adiciona ao carrinho com feedback. `abrir` = comportamento de "Comprar agora". */
export function useComprar() {
  const { adicionar, linhas } = useCart();
  const { abrirCarrinho, avisar } = useUI();

  return (produto: Produto, opcoes: { abrir?: boolean; quantidade?: number; direto?: boolean } = {}) => {
    // sem preço na tabela (ou "Comprar agora"): em vez de carrinho, abre o WhatsApp já com este iPhone
    if (produto.sobConsulta || opcoes.direto) {
      abrirWhatsApp(mensagemInteresse(produto, opcoes.quantidade ?? 1));
      avisar("Abrindo o WhatsApp", "O iPhone que você escolheu já vai escrito na conversa.");
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
