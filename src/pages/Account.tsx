import { Link } from "react-router-dom";
import { LOJA } from "@/data/conteudo";
import { useCart } from "@/context/CartContext";
import { useFavoritos } from "@/context/FavoritesContext";
import { useUI } from "@/context/UIContext";
import { Icon } from "@/components/ui/Icon";

export default function Account() {
  const { quantidadeTotal } = useCart();
  const { ids } = useFavoritos();
  const { abrirCarrinho } = useUI();

  return (
    <div className="wrap page page--narrow">
      <h1>Minha conta</h1>
      <p className="muted">Seus pedidos são fechados e acompanhados direto com a gente pelo WhatsApp.</p>
      <div className="acct">
        <a href={LOJA.whatsapp} target="_blank" rel="noopener" className="acct-card">
          <Icon nome="whatsapp" tamanho={26} />
          <b>Acompanhar pedido</b>
          <small>Status e rastreio</small>
        </a>
        <button type="button" className="acct-card" onClick={abrirCarrinho}>
          <Icon nome="sacola" tamanho={26} />
          <b>Carrinho</b>
          <small>{quantidadeTotal} {quantidadeTotal === 1 ? "item" : "itens"}</small>
        </button>
        <Link to="/favoritos" className="acct-card">
          <Icon nome="coracao" tamanho={26} />
          <b>Favoritos</b>
          <small>{ids.length} salvos</small>
        </Link>
        <Link to="/garantia" className="acct-card">
          <Icon nome="escudo" tamanho={26} />
          <b>Acionar garantia</b>
          <small>Como funciona</small>
        </Link>
      </div>
    </div>
  );
}
