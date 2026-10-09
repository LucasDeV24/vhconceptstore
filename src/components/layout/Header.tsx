import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { SearchBox } from "./SearchBox";
import { asset } from "@/utils/base";
import { MAX_PARCELAS } from "@/data/parcelamento";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/context/CartContext";
import { useFavoritos } from "@/context/FavoritesContext";
import { useUI } from "@/context/UIContext";
import { useCep } from "@/hooks/useCep";
import { formatarCep, limparCep } from "@/services/frete";

export const MENU = [
  { rotulo: "Início", to: "/" },
  { rotulo: "iPhones Lacrados", to: "/loja?condicao=novo" },
  { rotulo: "iPhones Seminovos", to: "/loja?semi=1" },
  { rotulo: "Acessórios", to: "/loja?categoria=acessorio" },
  { rotulo: "Ofertas", to: "/loja?ofertas=1", destaque: true },
  { rotulo: "Troque seu iPhone", to: "/troca" },
  { rotulo: "Garantia", to: "/garantia" },
  { rotulo: "Suporte", to: "/suporte" },
];

function CepButton() {
  const { cep, setCep, frete } = useCep();
  const [aberto, setAberto] = useState(false);
  const [rascunho, setRascunho] = useState(cep);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fora = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setAberto(false);
    document.addEventListener("mousedown", fora);
    return () => document.removeEventListener("mousedown", fora);
  }, []);

  return (
    <div className="hd-cep" ref={ref}>
      <button type="button" className="hd-cep-btn" onClick={() => setAberto((a) => !a)} aria-expanded={aberto}>
        <Icon nome="pin" tamanho={20} />
        <span>
          <small>{cep ? "Entregar em" : "Calcule a entrega"}</small>
          <b>{cep ? formatarCep(cep) : "Informe seu CEP"}</b>
        </span>
      </button>
      {aberto && (
        <form
          className="pop hd-cep-pop"
          onSubmit={(e) => {
            e.preventDefault();
            setCep(limparCep(rascunho));
          }}
        >
          <label htmlFor="cep-hd">Seu CEP</label>
          <div className="inline-field">
            <input id="cep-hd" inputMode="numeric" placeholder="00000-000" value={formatarCep(rascunho)}
              onChange={(e) => setRascunho(e.target.value)} autoFocus />
            <button className="btn btn-dark btn-sm">OK</button>
          </div>
          {frete && (
            <div className={`frete frete--${frete.tipo}`}>
              <Icon nome="caminhao" tamanho={18} />
              <span><b>{frete.titulo}</b><small>{frete.detalhe}</small></span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export function Header() {
  const { quantidadeTotal } = useCart();
  const { ids } = useFavoritos();
  const { abrirCarrinho } = useUI();
  const [menu, setMenu] = useState(false);
  const [rolou, setRolou] = useState(false);
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [pulo, setPulo] = useState(false);
  const loc = useLocation();
  const anterior = useRef(quantidadeTotal);

  useEffect(() => {
    setMenu(false);
    setBuscaAberta(false);
  }, [loc.pathname, loc.search]);

  useEffect(() => {
    const on = () => setRolou(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (quantidadeTotal > anterior.current) {
      setPulo(true);
      const t = setTimeout(() => setPulo(false), 500);
      anterior.current = quantidadeTotal;
      return () => clearTimeout(t);
    }
    anterior.current = quantidadeTotal;
  }, [quantidadeTotal]);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  const ativo = (to: string) => (to === "/" ? loc.pathname === "/" : `${loc.pathname}${loc.search}` === to);

  return (
    <header className={`hd ${rolou ? "is-scrolled" : ""} ${buscaAberta ? "busca-aberta" : ""}`}>
      <div className="hd-bar">
        <div className="wrap hd-bar-in">
          <span><Icon nome="cartao" tamanho={14} /> Parcele em até {MAX_PARCELAS}x</span>
          <span><Icon nome="pix" tamanho={14} /> Preço à vista</span>
          <span className="hide-sm"><Icon nome="caminhao" tamanho={14} /> Volta Redonda e região · Enviamos para todo o Brasil</span>
        </div>
      </div>

      <div className="wrap hd-main">
        <button type="button" className="hd-burger" aria-label="Abrir menu" onClick={() => setMenu(true)}>
          <Icon nome="menu" tamanho={22} />
        </button>

        <Link to="/" className="logo" aria-label="VH Concept Store, página inicial">
          <img className="logo-img" src={asset("logo.webp")} alt="" width="41" height="44" />
          <span className="logo-sub">concept<br />store</span>
        </Link>

        <div className="hd-search"><SearchBox /></div>

        <div className="hd-actions">
          <CepButton />
          <button type="button" className="hd-ico hd-busca-m" aria-label="Buscar" aria-expanded={buscaAberta} onClick={() => setBuscaAberta((v) => !v)}>
            <Icon nome="busca" tamanho={22} />
          </button>
          <Link to="/favoritos" className="hd-ico" aria-label="Favoritos">
            <Icon nome="coracao" tamanho={22} />
            {ids.length > 0 && <span className="badge badge--soft">{ids.length}</span>}
          </Link>
          <Link to="/conta" className="hd-ico hide-sm" aria-label="Minha conta">
            <Icon nome="usuario" tamanho={22} />
          </Link>
          <button type="button" className={`hd-ico hd-cart ${pulo ? "bump" : ""}`} aria-label="Carrinho" onClick={abrirCarrinho}>
            <Icon nome="sacola" tamanho={22} />
            {quantidadeTotal > 0 && <span className="badge">{quantidadeTotal}</span>}
          </button>
        </div>
      </div>

      <div className="wrap hd-search-m"><SearchBox /></div>

      <nav className="hd-nav" aria-label="Categorias">
        <div className="wrap hd-nav-in">
          {MENU.map((m) => (
            <NavLink key={m.to} to={m.to} className={`${ativo(m.to) ? "is-on" : ""} ${m.destaque ? "is-hot" : ""}`}>
              {m.rotulo}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className={`drawer-mask ${menu ? "is-open" : ""}`} onClick={() => setMenu(false)} />
      <aside className={`side-menu ${menu ? "is-open" : ""}`} aria-hidden={!menu}>
        <div className="side-menu-hd">
          <img className="logo-img" src={asset("logo.webp")} alt="" width="41" height="44" />
          <button type="button" className="hd-ico" aria-label="Fechar menu" onClick={() => setMenu(false)}>
            <Icon nome="fechar" tamanho={22} />
          </button>
        </div>
        {MENU.map((m) => (
          <Link key={m.to} to={m.to} className={m.destaque ? "is-hot" : ""}>
            {m.rotulo} <Icon nome="seta" tamanho={16} />
          </Link>
        ))}
        <Link to="/favoritos">Favoritos <Icon nome="seta" tamanho={16} /></Link>
        <Link to="/conta">Minha conta <Icon nome="seta" tamanho={16} /></Link>
      </aside>
    </header>
  );
}
