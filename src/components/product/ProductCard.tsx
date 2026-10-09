import { useState } from "react";
import { Link } from "react-router-dom";
import type { Produto } from "@/types";
import type { ItemVitrine } from "@/services/catalogo";
import { ProductImage } from "./ProductImage";
import { PriceBlock } from "./PriceBlock";
import { GradeBadge } from "./GradeBadge";
import { FavButton } from "./FavButton";
import { Estrelas, Icon } from "@/components/ui/Icon";
import { useComprar } from "@/hooks/useComprar";

export function ProductCard({ item }: { item: ItemVitrine }) {
  const [atual, setAtual] = useState<Produto>(item.produto);
  const [ok, setOk] = useState(false);
  const comprar = useComprar();
  const p = atual;
  const esgotado = p.estoque < 1;

  const onComprar = (e: React.MouseEvent) => {
    e.preventDefault();
    comprar(p, { abrir: true });
    if (p.sobConsulta) return;
    setOk(true);
    setTimeout(() => setOk(false), 1400);
  };

  return (
    <article className="card">
      <Link to={`/produto/${p.id}`} className="card-media" aria-label={`${p.nome} ${p.armazenamento ?? ""} ${p.cor.nome}`}>
        <div className="card-img">
          <ProductImage produto={p} />
        </div>
        {p.selo && <span className={`card-seal ${p.selo === "Promoção" ? "is-off" : ""}`}>{p.selo}</span>}
        {esgotado && <span className="card-soldout">Esgotado</span>}
      </Link>
      <FavButton id={p.id} nome={p.nome} />

      <div className="card-body">
        {item.variantes.length > 1 && (
          <div className="swatches" role="radiogroup" aria-label="Cores">
            {item.variantes.map((v) => (
              <button
                key={v.id}
                type="button"
                role="radio"
                aria-checked={v.id === p.id}
                aria-label={v.cor.nome}
                title={v.cor.nome}
                className={`sw ${v.id === p.id ? "is-on" : ""}`}
                style={{ "--c": v.cor.hex } as React.CSSProperties}
                onMouseEnter={() => setAtual(v)}
                onFocus={() => setAtual(v)}
                onClick={() => setAtual(v)}
              />
            ))}
          </div>
        )}

        <div className="card-top">
          <GradeBadge condicao={p.condicao} acessorio={p.categoria === "acessorio"} />
          {p.categoria === "iphone" && p.condicao === "seminovo" && <span className="tested">Testado e garantido</span>}
        </div>

        <Link to={`/produto/${p.id}`} className="card-title">
          <h3>{p.nome}</h3>
          <p>{[p.armazenamento, p.cor.nome].filter(Boolean).join(" · ")}</p>
        </Link>

        {p.avaliacao !== undefined && (
          <div className="card-rating">
            <Estrelas nota={p.avaliacao} />
            <span>{p.avaliacao.toFixed(1)}</span>
            {p.quantidadeAvaliacoes !== undefined && <span className="muted">({p.quantidadeAvaliacoes})</span>}
          </div>
        )}

        <PriceBlock produto={p} tamanho="sm" />

        {p.sobConsulta ? (
          <button type="button" className="btn btn-wpp btn-block" onClick={onComprar}>
            <Icon nome="whatsapp" tamanho={17} /> Consultar valor
          </button>
        ) : (
          <button type="button" className={`btn btn-dark btn-block ${ok ? "is-ok" : ""}`} disabled={esgotado} onClick={onComprar}>
            {esgotado ? "Esgotado" : ok ? <><Icon nome="check" tamanho={16} /> Adicionado</> : <>Comprar <Icon nome="sacola" tamanho={16} /></>}
          </button>
        )}
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card card--sk" aria-hidden="true">
      <div className="card-media sk" />
      <div className="card-body">
        <div className="sk sk-line" style={{ width: "40%" }} />
        <div className="sk sk-line lg" style={{ width: "75%" }} />
        <div className="sk sk-line" style={{ width: "55%" }} />
        <div className="sk sk-line lg" style={{ width: "50%", marginTop: 18 }} />
        <div className="sk sk-btn" />
      </div>
    </div>
  );
}
