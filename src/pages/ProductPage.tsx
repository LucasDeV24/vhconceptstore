import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProduto } from "@/hooks/useProdutos";
import { useComprar } from "@/hooks/useComprar";
import { useUI } from "@/context/UIContext";
import { abrirWhatsApp, descreverProduto, urlDoProduto } from "@/services/whatsapp";
import { useCep } from "@/hooks/useCep";
import { api } from "@/services/api";
import { variacoesDe } from "@/services/catalogo";
import { formatarCep, limparCep } from "@/services/frete";
import { Gallery } from "@/components/product/Gallery";
import { PriceBlock } from "@/components/product/PriceBlock";
import { GradeBadge } from "@/components/product/GradeBadge";
import { FavButton } from "@/components/product/FavButton";
import { Parcelamento } from "@/components/product/Parcelamento";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Estrelas, Icon } from "@/components/ui/Icon";
import { SectionHead } from "@/components/ui/SectionHead";
import { brl, brlCentavos } from "@/utils/format";
import type { Armazenamento, Produto } from "@/types";

const ORDEM_GB: Armazenamento[] = ["64GB", "128GB", "256GB", "512GB", "1TB"];

function Frete() {
  const { cep, setCep, frete } = useCep();
  const [v, setV] = useState(cep);
  return (
    <div className="pdp-ship">
      <form onSubmit={(e) => { e.preventDefault(); setCep(limparCep(v)); }} className="inline-field">
        <Icon nome="caminhao" tamanho={18} />
        <input inputMode="numeric" placeholder="Digite seu CEP" value={formatarCep(v)} onChange={(e) => setV(e.target.value)} aria-label="CEP" />
        <button className="btn btn-ghost btn-sm">Calcular</button>
      </form>
      {frete && (
        <div className={`frete frete--${frete.tipo}`}>
          <span><b>{frete.titulo}</b><small>{frete.detalhe}</small></span>
        </div>
      )}
    </div>
  );
}

function Seletores({ p }: { p: Produto }) {
  const nav = useNavigate();
  const vars = useMemo(() => variacoesDe(p, api.todos()), [p]);
  if (p.categoria !== "iphone") return null;

  const cores = vars.filter((v) => v.armazenamento === p.armazenamento);
  const gbs = ORDEM_GB.filter((g) => vars.some((v) => v.armazenamento === g));
  const opts = { replace: true, state: { manterScroll: true } };
  const irPara = (gb: Armazenamento) =>
    nav(`/produto/${(vars.find((v) => v.armazenamento === gb && v.cor.nome === p.cor.nome) ?? vars.find((v) => v.armazenamento === gb))!.id}`, opts);

  return (
    <div className="pdp-opts">
      <div className="opt">
        <span className="opt-label">Cor: <b>{p.cor.nome}</b></span>
        <div className="opt-colors">
          {cores.map((c) => (
            <button key={c.id} type="button" title={c.cor.nome} aria-label={c.cor.nome} aria-pressed={c.id === p.id}
              className={`opt-color ${c.id === p.id ? "is-on" : ""} ${c.estoque < 1 ? "is-out" : ""}`}
              style={{ "--c": c.cor.hex } as React.CSSProperties}
              onClick={() => nav(`/produto/${c.id}`, opts)} />
          ))}
        </div>
      </div>
      <div className="opt">
        <span className="opt-label">Armazenamento</span>
        <div className="opt-gbs">
          {gbs.map((g) => {
            const alvo = vars.find((v) => v.armazenamento === g && v.cor.nome === p.cor.nome) ?? vars.find((v) => v.armazenamento === g)!;
            return (
              <button key={g} type="button" aria-pressed={g === p.armazenamento} className={`opt-gb ${g === p.armazenamento ? "is-on" : ""}`} onClick={() => irPara(g)}>
                <b>{g}</b>
                <small>{alvo.sobConsulta ? "Consultar" : brl(alvo.preco)}</small>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const { produto: p, carregando } = useProduto(id);
  const comprar = useComprar();
  const { avisar } = useUI();
  const [qtd, setQtd] = useState(1);
  useEffect(() => setQtd(1), [id]);
  useEffect(() => {
    if (p) document.title = `${[p.nome, p.armazenamento, p.cor.nome].filter(Boolean).join(" ")} | VH Concept Store`;
  }, [p]);

  if (carregando && !p) {
    return (
      <div className="wrap pdp pdp--sk">
        <div className="sk" style={{ aspectRatio: "1/1", borderRadius: 24 }} />
        <div>
          <div className="sk sk-line lg" style={{ width: "70%" }} />
          <div className="sk sk-line" style={{ width: "40%" }} />
          <div className="sk sk-line lg" style={{ width: "50%", marginTop: 40 }} />
          <div className="sk sk-btn" style={{ marginTop: 40 }} />
        </div>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="wrap empty" style={{ padding: "80px 0" }}>
        <h1>Produto não encontrado</h1>
        <p className="muted">Ele pode ter sido vendido. Seminovos são unidades únicas.</p>
        <Link to="/loja" className="btn btn-dark">Ver produtos disponíveis</Link>
      </div>
    );
  }

  const semi = p.condicao !== "novo";
  const esgotado = p.estoque < 1;
  const relacionados = api
    .todos()
    .filter((x) => x.categoria === p.categoria && !x.sobConsulta && x.modelo !== p.modelo && (p.categoria === "acessorio" || Math.abs(x.preco - p.preco) < 2500))
    .sort((a, b) => b.vendidos - a.vendidos);
  const titulo = [p.nome, p.armazenamento, p.cor.nome].filter(Boolean).join(" ");

  return (
    <>
      <div className="wrap">
        <nav className="crumbs" aria-label="Você está em">
          <Link to="/">Início</Link> <span>/</span>
          <Link to={p.categoria === "acessorio" ? "/loja?categoria=acessorio" : semi ? "/loja?semi=1" : "/loja?condicao=novo"}>
            {p.categoria === "acessorio" ? "Acessórios" : semi ? "Seminovos" : "iPhones lacrados"}
          </Link>
          <span>/</span> <span>{p.nome}</span>
        </nav>
      </div>

      <div className="wrap pdp">
        <div className="pdp-gallery">
          <Gallery key={p.id} produto={p} />
          {semi && (
            <div className="photo-note">
              <Icon nome="info" tamanho={16} />
              <span>As fotos mostram o modelo. Quer ver <b>esta unidade</b>?</span>
              <button
                type="button"
                onClick={() => {
                  abrirWhatsApp(`Olá! Pode me mandar fotos reais deste aparelho?

📱 ${descreverProduto(p)}
🔗 ${urlDoProduto(p.id)}`);
                  avisar("Abrindo o WhatsApp", "O pedido de fotos já vai escrito.");
                }}
              >
                Pedir fotos reais
              </button>
            </div>
          )}
        </div>

        <div className="pdp-info">
          <div className="pdp-badges">
            <GradeBadge condicao={p.condicao} completo acessorio={p.categoria === "acessorio"} />
            {p.selo && <span className={`card-seal static ${p.selo === "Promoção" ? "is-off" : ""}`}>{p.selo}</span>}
            <FavButton id={p.id} nome={p.nome} />
          </div>

          <h1>{titulo}</h1>
          {p.avaliacao !== undefined && (
            <div className="pdp-rating">
              <Estrelas nota={p.avaliacao} tamanho={15} />
              <b>{p.avaliacao.toFixed(1)}</b>
              {p.quantidadeAvaliacoes !== undefined && <span className="muted">{p.quantidadeAvaliacoes} avaliações</span>}
            </div>
          )}

          {p.categoria === "iphone" && (
            <div className="pdp-facts">
              <div><Icon nome="revisado" tamanho={20} /><span><small>Condição</small><b>{semi ? "Seminovo" : "Lacrado"}</b></span></div>
              <div><Icon nome="escudo" tamanho={20} /><span><small>{semi ? "Aparelho" : "Embalagem"}</small><b>{semi ? "Testado" : "Na caixa"}</b></span></div>
              <div><Icon nome="caminhao" tamanho={20} /><span><small>Envio</small><b>Brasil todo</b></span></div>
            </div>
          )}

          <div className="pdp-price">
            <PriceBlock produto={p} tamanho="lg" />
            {!p.sobConsulta && <Parcelamento preco={p.preco} />}
          </div>

          <Seletores p={p} />

          <div className={`pdp-stock ${esgotado ? "is-out" : p.estoque <= 2 ? "is-low" : ""}`}>
            <i />
            {esgotado ? "Esgotado no momento" : p.sobConsulta ? "Chegou agora: consulte disponibilidade" : "Disponível"}
          </div>

          {p.sobConsulta ? (
            <button type="button" className="btn btn-wpp btn-lg btn-block" onClick={() => comprar(p)}>
              <Icon nome="whatsapp" tamanho={20} /> Consultar valor no WhatsApp
            </button>
          ) : (
            <>
          <div className="pdp-buy">
            {!semi && p.estoque > 1 && (
              <div className="stepper stepper--lg" aria-label="Quantidade">
                <button type="button" onClick={() => setQtd((q) => Math.max(1, q - 1))} aria-label="Diminuir"><Icon nome="menos" tamanho={16} /></button>
                <span>{qtd}</span>
                <button type="button" onClick={() => setQtd((q) => Math.min(p.estoque, q + 1))} aria-label="Aumentar"><Icon nome="mais" tamanho={16} /></button>
              </div>
            )}
            <button type="button" className="btn btn-dark btn-lg btn-grow" disabled={esgotado} onClick={() => comprar(p, { direto: true, quantidade: qtd })}>
              <Icon nome="whatsapp" tamanho={20} /> Comprar agora
            </button>
          </div>
          <button type="button" className="btn btn-ghost btn-lg btn-block" disabled={esgotado} onClick={() => comprar(p, { quantidade: qtd })}>
            <Icon nome="sacola" tamanho={18} /> Adicionar ao carrinho
          </button>
            </>
          )}

          <Frete />

          <ul className="pdp-perks">
            <li><Icon nome="escudo" tamanho={18} /> <span><b>{semi ? "Testado e garantido" : "Produto lacrado"}</b>{semi ? "" : " · pergunte pela garantia"}</span></li>
            <li><Icon nome="caminhao" tamanho={18} /> <span><b>Envio para todo o Brasil</b> · entrega em Volta Redonda e região</span></li>
            {p.categoria === "iphone" && <li><Icon nome="troca" tamanho={18} /> <span><b>Aceitamos seu usado</b> · <Link to="/troca">simular troca</Link></span></li>}
          </ul>
        </div>
      </div>

      <div className="wrap pdp-details">
        <section>
          <h3>Sobre este produto</h3>
          <p>{p.descricao}</p>
        </section>
        <section>
          <h3>Especificações</h3>
          <dl className="specs">
            {Object.entries(p.especificacoes).map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </section>
      </div>

      {relacionados.length > 0 && (
        <section className="sec wrap">
          <SectionHead titulo="Você também pode gostar" />
          <ProductGrid produtos={relacionados} limite={4} />
        </section>
      )}

      <div className="buybar">
        <div>
          <b>{p.sobConsulta ? "Consulte o valor" : brl(p.preco)}</b>
          <small>{p.sobConsulta ? "chegou agora" : `à vista · ${p.parcelas.quantidade}x de ${brlCentavos(p.parcelas.valor)}`}</small>
        </div>
        <button type="button" className="btn btn-dark" disabled={esgotado} onClick={() => comprar(p, { direto: true, quantidade: qtd })}>
          {esgotado ? "Esgotado" : p.sobConsulta ? "Consultar" : "Comprar agora"}
        </button>
      </div>
    </>
  );
}
