import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { ItemCarrinho, Produto } from "@/types";
import { api } from "@/services/api";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface LinhaCarrinho {
  produto: Produto;
  quantidade: number;
}

interface CartValue {
  linhas: LinhaCarrinho[];
  quantidadeTotal: number;
  subtotal: number;
  /** soma do que o cliente paga no cartão (com as taxas da parcela) */
  totalParcelado: number;
  valorParcela: number;
  maxParcelas: number;
  adicionar: (produtoId: string, quantidade?: number) => void;
  alterarQuantidade: (produtoId: string, quantidade: number) => void;
  remover: (produtoId: string) => void;
  limpar: () => void;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useLocalStorage<ItemCarrinho[]>("vh-carrinho", []);

  const valor = useMemo<CartValue>(() => {
    const linhas = itens
      .map((i) => ({ produto: api.produtoPorId(i.produtoId), quantidade: i.quantidade }))
      .filter((l): l is LinhaCarrinho => !!l.produto);

    const subtotal = linhas.reduce((s, l) => s + l.produto.preco * l.quantidade, 0);
    const totalParcelado = linhas.reduce((s, l) => s + l.produto.parcelas.valor * l.produto.parcelas.quantidade * l.quantidade, 0);
    const maxParcelas = linhas.length ? Math.max(...linhas.map((l) => l.produto.parcelas.quantidade)) : 12;
    const limite = (p: Produto) => Math.max(1, p.estoque);

    return {
      linhas,
      quantidadeTotal: linhas.reduce((s, l) => s + l.quantidade, 0),
      subtotal,
      totalParcelado,
      valorParcela: Math.round((totalParcelado / maxParcelas) * 100) / 100,
      maxParcelas,
      adicionar: (produtoId, quantidade = 1) =>
        setItens((atual) => {
          const p = api.produtoPorId(produtoId);
          if (!p) return atual;
          const existente = atual.find((i) => i.produtoId === produtoId);
          if (existente)
            return atual.map((i) =>
              i.produtoId === produtoId ? { ...i, quantidade: Math.min(limite(p), i.quantidade + quantidade) } : i
            );
          return [...atual, { produtoId, quantidade: Math.min(limite(p), quantidade) }];
        }),
      alterarQuantidade: (produtoId, quantidade) =>
        setItens((atual) => {
          const p = api.produtoPorId(produtoId);
          if (!p) return atual;
          if (quantidade < 1) return atual.filter((i) => i.produtoId !== produtoId);
          return atual.map((i) => (i.produtoId === produtoId ? { ...i, quantidade: Math.min(limite(p), quantidade) } : i));
        }),
      remover: (produtoId) => setItens((atual) => atual.filter((i) => i.produtoId !== produtoId)),
      limpar: () => setItens([]),
    };
  }, [itens, setItens]);

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de CartProvider");
  return ctx;
}
