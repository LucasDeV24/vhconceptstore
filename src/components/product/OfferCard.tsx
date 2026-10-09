import { Link } from "react-router-dom";
import type { Produto } from "@/types";
import { ProductImage } from "./ProductImage";
import { GradeBadge } from "./GradeBadge";
import { Icon } from "@/components/ui/Icon";
import { brl, brlCentavos, descontoPct } from "@/utils/format";
import { useComprar } from "@/hooks/useComprar";

export function OfferCard({ produto: p, destaque }: { produto: Produto; destaque?: boolean }) {
  const comprar = useComprar();
  const economia = (p.precoAnterior ?? p.preco) - p.preco;
  const off = descontoPct(p.preco, p.precoAnterior);

  return (
    <article className={`offer ${destaque ? "offer--big" : ""}`}>
      <Link to={`/produto/${p.id}`} className="offer-media" aria-label={p.nome}>
        <ProductImage produto={p} />
        <span className="offer-off">-{off}%</span>
      </Link>
      <div className="offer-body">
        <div className="offer-save">Economize {brl(economia)}</div>
        <GradeBadge condicao={p.condicao} />
        <Link to={`/produto/${p.id}`}>
          <h3>{p.nome}</h3>
          <p className="muted">{[p.armazenamento, p.cor.nome].filter(Boolean).join(" · ")}</p>
        </Link>
        <div className="offer-prices">
          <span className="offer-de">de <s>{brl(p.precoAnterior!)}</s></span>
          <span className="offer-por">
            <small>por</small> {brl(p.preco)}
          </span>
          <span className="muted">
            à vista · ou {p.parcelas.quantidade}x de {brlCentavos(p.parcelas.valor)} com juros
          </span>
        </div>
        <button type="button" className="btn btn-accent" onClick={() => comprar(p, { abrir: true })} disabled={p.estoque < 1}>
          Aproveitar oferta <Icon nome="seta" tamanho={16} />
        </button>
      </div>
    </article>
  );
}
