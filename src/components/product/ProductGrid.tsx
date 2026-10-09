import type { Produto } from "@/types";
import { agruparVitrine } from "@/services/catalogo";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";

interface Props {
  produtos: Produto[];
  carregando?: boolean;
  limite?: number;
  agrupar?: boolean;
  colunas?: number;
}

export function ProductGrid({ produtos, carregando, limite, agrupar = true, colunas = 4 }: Props) {
  const itens = (agrupar ? agruparVitrine(produtos) : produtos.map((p) => ({ produto: p, variantes: [p] }))).slice(0, limite);

  return (
    <div className="grid" style={{ "--cols": colunas } as React.CSSProperties}>
      {carregando
        ? Array.from({ length: limite ?? 8 }, (_, i) => <ProductCardSkeleton key={i} />)
        : itens.map((it) => <ProductCard key={it.produto.id} item={it} />)}
    </div>
  );
}
