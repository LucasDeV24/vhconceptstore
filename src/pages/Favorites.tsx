import { Link } from "react-router-dom";
import { useFavoritos } from "@/context/FavoritesContext";
import { api } from "@/services/api";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Icon } from "@/components/ui/Icon";
import { plural } from "@/utils/format";
import type { Produto } from "@/types";

export default function Favorites() {
  const { ids } = useFavoritos();
  const produtos = ids.map((id) => api.produtoPorId(id)).filter((p): p is Produto => !!p);

  return (
    <div className="wrap page">
      <h1>Favoritos</h1>
      <p className="muted">{plural(produtos.length, "produto salvo", "produtos salvos")} neste navegador</p>
      {produtos.length ? (
        <ProductGrid produtos={produtos} agrupar={false} />
      ) : (
        <div className="empty">
          <Icon nome="coracao" tamanho={36} />
          <h3>Nenhum favorito ainda</h3>
          <p className="muted">Toque no coração de um produto para salvar e comparar depois.</p>
          <Link to="/loja" className="btn btn-dark">Ver iPhones</Link>
        </div>
      )}
    </div>
  );
}
