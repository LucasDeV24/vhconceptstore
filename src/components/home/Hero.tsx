import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import { getModelo } from "@/data/modelos";
import { Icon } from "@/components/ui/Icon";
import { urlFoto } from "@/utils/fotos";
import { brl, brlCentavos } from "@/utils/format";
import { useComprar } from "@/hooks/useComprar";

const MODELO_HERO = "iphone-17-pro";
const GB_HERO = "256GB";
const COR_INICIAL = "laranja-cosmico";

export function Hero() {
  const modelo = getModelo(MODELO_HERO)!;
  const [corSlug, setCorSlug] = useState(COR_INICIAL);
  const cor = modelo.cores.find((c) => c.slug === corSlug) ?? modelo.cores[0];
  const p = api.produtoPorId(`${MODELO_HERO}-novo-${GB_HERO.toLowerCase()}-${cor.slug}`)!;
  const comprar = useComprar();
  const semiMenor = Math.min(...api.todos().filter((x) => x.condicao === "seminovo").map((x) => x.preco));
  const modeloSemi = getModelo("iphone-17-pro")!;

  return (
    <section className="hero wrap">
      <article className="hero-main">
        <div className="hero-copy">
          <span className="hero-tag"><i /> Lacrado · envio para todo o Brasil</span>
          <h1>
            {p.nome} <span>{p.armazenamento}</span>
          </h1>
          <p className="hero-specs">Câmera tripla 48MP · Chip A19 Pro · Até {modelo.bateriaVideo}h de vídeo</p>

          <div className="hero-price">
            <div className="hero-was">À vista</div>
            <div className="hero-now">{brl(p.preco)}</div>
            <div className="hero-inst">ou em até {p.parcelas.quantidade}x de <b>{brlCentavos(p.parcelas.valor)}</b> <span className="com-juros">com juros</span></div>
          </div>

          <div className="hero-cta">
            <button type="button" className="btn btn-dark btn-lg" onClick={() => comprar(p, { direto: true })}>
              Comprar agora <Icon nome="seta" tamanho={18} />
            </button>
            <Link to="/loja?condicao=novo" className="btn btn-ghost btn-lg">Ver modelos</Link>
          </div>
        </div>

        <div className="hero-art">
          <div className="hero-aura" aria-hidden="true" />
          <img key={cor.slug} className="hero-photo" src={urlFoto(modelo.id, cor)} alt={`${p.nome} na cor ${cor.nome}`} loading="eager" decoding="async" />
          <div className="hero-colors" role="radiogroup" aria-label="Cor do iPhone">
            {modelo.cores.map((c) => (
              <button
                key={c.slug}
                type="button"
                role="radio"
                aria-checked={c.slug === cor.slug}
                aria-label={c.nome}
                title={c.nome}
                className={c.slug === cor.slug ? "is-on" : ""}
                style={{ "--c": c.hex } as React.CSSProperties}
                onClick={() => setCorSlug(c.slug!)}
                onMouseEnter={() => setCorSlug(c.slug!)}
              />
            ))}
            <span>{cor.nome}</span>
          </div>
        </div>
      </article>

      <div className="hero-side">
        <Link to="/loja?semi=1" className="hero-semi">
          <div>
            <span className="hero-semi-k">Seminovos</span>
            <h2>iPhones seminovos selecionados</h2>
            <p>Testados, revisados e com garantia.</p>
            <span className="hero-semi-from">
              a partir de <b>{brl(semiMenor)}</b>
            </span>
          </div>
          <img className="hero-semi-art" src={urlFoto(modeloSemi.id, modeloSemi.cores[0])} alt="" loading="eager" decoding="async" />
          <span className="round-arrow"><Icon nome="seta" tamanho={18} /></span>
        </Link>

        <Link to="/troca" className="hero-trade">
          <Icon nome="troca" tamanho={26} />
          <div>
            <b>Seu iPhone usado vale desconto</b>
            <span>Simule a troca em 30 segundos</span>
          </div>
          <Icon nome="seta" tamanho={18} />
        </Link>
      </div>
    </section>
  );
}
