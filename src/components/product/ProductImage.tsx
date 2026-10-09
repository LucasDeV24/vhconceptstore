import type { ImagemProduto, Produto } from "@/types";
import { AccessoryArt } from "./AccessoryArt";

interface Props {
  produto: Produto;
  imagem?: ImagemProduto;
  /** carrega já (imagens acima da dobra); por padrão carrega só ao aparecer na tela */
  prioridade?: boolean;
}

export function ProductImage({ produto, imagem, prioridade }: Props) {
  const img = imagem ?? produto.imagens[0];

  if (img?.tipo === "foto") {
    const descricao = [produto.nome, produto.armazenamento, produto.cor.nome].filter(Boolean).join(" ");
    return (
      <img
        className="product-photo"
        src={img.src}
        alt={img.legenda ? `${descricao} (${img.legenda})` : descricao}
        loading={prioridade ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
      />
    );
  }

  return <AccessoryArt tipo={produto.modelo} cor={produto.cor.hex} detalhe={img?.legenda === "Detalhe"} />;
}
