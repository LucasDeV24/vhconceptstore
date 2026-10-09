import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Armazenamento, Condicao, FiltrosCatalogo, Ordenacao } from "@/types";
import { useProdutos } from "@/hooks/useProdutos";
import { api } from "@/services/api";
import { aplicarFiltros, agruparVitrine } from "@/services/catalogo";
import { CONDICOES } from "@/data/conteudo";
import { LINHAS, MODELOS } from "@/data/modelos";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Icon } from "@/components/ui/Icon";
import { brl, plural } from "@/utils/format";

const GBS: Armazenamento[] = ["64GB", "128GB", "256GB", "512GB", "1TB"];
const CONDS: Condicao[] = ["novo", "seminovo"];
const SEMIS: Condicao[] = ["seminovo"];
const TELAS = [6.1, 6.3, 6.5, 6.7, 6.9];
const ORDENS: { v: Ordenacao; r: string }[] = [
  { v: "mais-vendidos", r: "Mais vendidos" },
  { v: "menor-preco", r: "Menor preço" },
  { v: "maior-preco", r: "Maior preço" },
  { v: "maior-desconto", r: "Maior desconto" },
  { v: "lancamentos", r: "Lançamentos" },
];

const lista = (v: string | null) => (v ? v.split(",").filter(Boolean) : undefined);

function lerFiltros(sp: URLSearchParams): FiltrosCatalogo {
  const categoria = (sp.get("categoria") as FiltrosCatalogo["categoria"]) ?? undefined;
  const q = sp.get("q") ?? undefined;
  const ofertas = sp.get("ofertas") === "1";
  return {
    busca: q,
    categoria: categoria ?? (!q && !ofertas ? "iphone" : undefined),
    linhas: lista(sp.get("linha")),
    condicoes: (lista(sp.get("condicao")) as Condicao[]) ?? (sp.get("semi") === "1" ? SEMIS : undefined),
    armazenamentos: lista(sp.get("gb")) as Armazenamento[] | undefined,
    cores: lista(sp.get("cor")),
    telas: lista(sp.get("tela"))?.map(Number),
    cameras: lista(sp.get("cam"))?.map(Number),
    precoMax: sp.get("max") ? Number(sp.get("max")) : undefined,
    apenasEmEstoque: sp.get("estoque") === "1",
    apenasOfertas: ofertas,
    ordenacao: (sp.get("ordem") as Ordenacao) ?? "mais-vendidos",
  };
}

function titulo(f: FiltrosCatalogo, sp: URLSearchParams) {
  if (f.busca) return `Resultados para “${f.busca}”`;
  if (f.categoria === "acessorio") return "Acessórios";
  if (f.apenasOfertas) return "Ofertas";
  if (sp.get("semi") === "1" || (f.condicoes?.length && f.condicoes.every((c) => c !== "novo")))
    return "iPhones seminovos";
  if (f.condicoes?.length === 1 && f.condicoes[0] === "novo") return "iPhones lacrados";
  if (f.linhas?.length === 1) return `iPhone ${f.linhas[0]}`;
  return "Todos os iPhones";
}

function Grupo({ titulo, children, aberto = true }: { titulo: string; children: React.ReactNode; aberto?: boolean }) {
  const [open, setOpen] = useState(aberto);
  return (
    <div className={`fgroup ${open ? "is-open" : ""}`}>
      <button type="button" className="fgroup-hd" onClick={() => setOpen(!open)} aria-expanded={open}>
        {titulo} <Icon nome="baixo" tamanho={16} />
      </button>
      {open && <div className="fgroup-body">{children}</div>}
    </div>
  );
}

export default function Catalog() {
  const [sp, setSp] = useSearchParams();
  const filtros = useMemo(() => lerFiltros(sp), [sp]);
  const { produtos, carregando } = useProdutos(filtros);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
  }, [drawer]);

  const base = useMemo(() => aplicarFiltros(api.todos(), { categoria: filtros.categoria, busca: filtros.busca }), [filtros.categoria, filtros.busca]);
  const precoTeto = Math.max(1000, ...base.map((p) => p.preco));
  const coresDisponiveis = useMemo(() => {
    const m = new Map<string, string>();
    base.forEach((p) => m.set(p.cor.nome, p.cor.hex));
    return [...m.entries()];
  }, [base]);

  /** quantos resultados teria ao ativar uma opção (mantendo os outros filtros) */
  const contar = (patch: Partial<FiltrosCatalogo>) => agruparVitrine(aplicarFiltros(api.todos(), { ...filtros, ...patch })).length;

  const set = (chave: string, valor: string | null) => {
    const n = new URLSearchParams(sp);
    if (valor === null || valor === "") n.delete(chave);
    else n.set(chave, valor);
    if (chave === "condicao") n.delete("semi");
    setSp(n, { replace: true });
  };

  const alternar = (chave: string, valor: string, atuais?: (string | number)[]) => {
    const arr = (atuais ?? []).map(String);
    const prox = arr.includes(valor) ? arr.filter((x) => x !== valor) : [...arr, valor];
    set(chave, prox.join(","));
  };

  const ativos: { rotulo: string; remover: () => void }[] = [
    ...(filtros.linhas ?? []).map((l) => ({ rotulo: `iPhone ${l}`, remover: () => alternar("linha", l, filtros.linhas) })),
    ...(sp.get("condicao") ? (filtros.condicoes ?? []).map((c) => ({ rotulo: CONDICOES[c].rotulo, remover: () => alternar("condicao", c, filtros.condicoes) })) : []),
    ...(sp.get("semi") === "1" ? [{ rotulo: "Seminovos", remover: () => set("semi", null) }] : []),
    ...(filtros.armazenamentos ?? []).map((g) => ({ rotulo: g, remover: () => alternar("gb", g, filtros.armazenamentos) })),
    ...(filtros.cores ?? []).map((c) => ({ rotulo: c, remover: () => alternar("cor", c, filtros.cores) })),
    ...(filtros.telas ?? []).map((t) => ({ rotulo: `${String(t).replace(".", ",")}"`, remover: () => alternar("tela", String(t), filtros.telas) })),
    ...(filtros.cameras ?? []).map((c) => ({ rotulo: c === 3 ? "Câmera tripla" : "Câmera dupla", remover: () => alternar("cam", String(c), filtros.cameras) })),
    ...(filtros.precoMax ? [{ rotulo: `Até ${brl(filtros.precoMax)}`, remover: () => set("max", null) }] : []),
    ...(filtros.apenasEmEstoque ? [{ rotulo: "Em estoque", remover: () => set("estoque", null) }] : []),
    ...(filtros.apenasOfertas ? [{ rotulo: "Ofertas", remover: () => set("ofertas", null) }] : []),
  ];

  const limparTudo = () => {
    const n = new URLSearchParams();
    if (sp.get("q")) n.set("q", sp.get("q")!);
    if (sp.get("categoria")) n.set("categoria", sp.get("categoria")!);
    setSp(n, { replace: true });
  };

  const ehIphone = filtros.categoria !== "acessorio";
  const qtd = agruparVitrine(produtos).length;

  const Check = ({ chave, valor, atuais, rotulo, patch }: { chave: string; valor: string; atuais?: (string | number)[]; rotulo: React.ReactNode; patch: Partial<FiltrosCatalogo> }) => {
    const on = (atuais ?? []).map(String).includes(valor);
    const n = on ? null : contar(patch);
    return (
      <label className={`fcheck ${!on && n === 0 ? "is-off" : ""}`}>
        <input type="checkbox" checked={on} onChange={() => alternar(chave, valor, atuais)} />
        <span className="fbox"><Icon nome="check" tamanho={12} /></span>
        <span className="flabel">{rotulo}</span>
        {n !== null && <span className="fcount">{n}</span>}
      </label>
    );
  };

  const painel = (
    <>
      {ehIphone && (
        <>
          <Grupo titulo="Modelo">
            {LINHAS.map((l) => (
              <Check key={l} chave="linha" valor={l} atuais={filtros.linhas} rotulo={`iPhone ${l}`} patch={{ linhas: [l] }} />
            ))}
          </Grupo>
          <Grupo titulo="Condição">
            {CONDS.map((c) => (
              <Check key={c} chave="condicao" valor={c} atuais={sp.get("condicao") ? filtros.condicoes : []} rotulo={CONDICOES[c].rotulo} patch={{ condicoes: [c] }} />
            ))}
          </Grupo>
          <Grupo titulo="Armazenamento">
            <div className="fchips">
              {GBS.map((g) => {
                const on = filtros.armazenamentos?.includes(g);
                return (
                  <button type="button" key={g} className={`fchip ${on ? "is-on" : ""}`} onClick={() => alternar("gb", g, filtros.armazenamentos)}
                    disabled={!on && contar({ armazenamentos: [g] }) === 0}>
                    {g}
                  </button>
                );
              })}
            </div>
          </Grupo>
        </>
      )}

      <Grupo titulo="Preço">
        <div className="frange">
          <input type="range" min={100} max={precoTeto} step={100} value={filtros.precoMax ?? precoTeto}
            onChange={(e) => set("max", Number(e.target.value) >= precoTeto ? null : e.target.value)} aria-label="Preço máximo" />
          <div className="frange-val"><span>Até</span><b>{brl(filtros.precoMax ?? precoTeto)}</b></div>
        </div>
      </Grupo>

      <Grupo titulo="Cor">
        <div className="fcolors">
          {coresDisponiveis.map(([nome, hex]) => {
            const on = filtros.cores?.includes(nome);
            return (
              <button type="button" key={nome} title={nome} aria-label={nome} aria-pressed={on}
                className={`fcolor ${on ? "is-on" : ""}`} style={{ "--c": hex } as React.CSSProperties}
                onClick={() => alternar("cor", nome, filtros.cores)} />
            );
          })}
        </div>
      </Grupo>

      {ehIphone && (
        <>
          <Grupo titulo="Tela" aberto={false}>
            {TELAS.map((t) => (
              <Check key={t} chave="tela" valor={String(t)} atuais={filtros.telas} rotulo={`${String(t).replace(".", ",")} polegadas`} patch={{ telas: [t] }} />
            ))}
          </Grupo>
          <Grupo titulo="Câmeras" aberto={false}>
            <Check chave="cam" valor="2" atuais={filtros.cameras} rotulo="Dupla" patch={{ cameras: [2] }} />
            <Check chave="cam" valor="3" atuais={filtros.cameras} rotulo="Tripla (Pro)" patch={{ cameras: [3] }} />
          </Grupo>
        </>
      )}

      <Grupo titulo="Disponibilidade">
        <label className="fswitch">
          <input type="checkbox" checked={!!filtros.apenasEmEstoque} onChange={(e) => set("estoque", e.target.checked ? "1" : null)} />
          <span className="track" /> Somente em estoque
        </label>
        <label className="fswitch">
          <input type="checkbox" checked={!!filtros.apenasOfertas} onChange={(e) => set("ofertas", e.target.checked ? "1" : null)} />
          <span className="track" /> Somente ofertas
        </label>
      </Grupo>
    </>
  );

  return (
    <div className="wrap catalog">
      <nav className="crumbs" aria-label="Você está em">
        <Link to="/">Início</Link> <span>/</span> <span>{titulo(filtros, sp)}</span>
      </nav>

      <div className="cat-head">
        <div>
          <h1>{titulo(filtros, sp)}</h1>
          <p className="muted">{carregando ? "Carregando…" : plural(qtd, "produto", "produtos")}</p>
        </div>
        <div className="cat-tools">
          <button type="button" className="btn btn-ghost btn-sm only-m" onClick={() => setDrawer(true)}>
            <Icon nome="filtro" tamanho={16} /> Filtrar {ativos.length > 0 && <span className="badge badge--inline">{ativos.length}</span>}
          </button>
          <label className="sort">
            <span>Ordenar por</span>
            <select value={filtros.ordenacao} onChange={(e) => set("ordem", e.target.value === "mais-vendidos" ? null : e.target.value)}>
              {ORDENS.map((o) => <option key={o.v} value={o.v}>{o.r}</option>)}
            </select>
          </label>
        </div>
      </div>

      {ehIphone && (
        <div className="quick-models">
          {MODELOS.filter((m) => base.some((p) => p.modelo === m.id)).map((m) => (
            <Link key={m.id} to={`/loja?q=${encodeURIComponent(m.nome)}`} className={filtros.busca === m.nome ? "is-on" : ""}>{m.nome}</Link>
          ))}
        </div>
      )}

      {ativos.length > 0 && (
        <div className="active-filters">
          {ativos.map((a) => (
            <button type="button" key={a.rotulo} onClick={a.remover}>{a.rotulo} <Icon nome="fechar" tamanho={12} /></button>
          ))}
          <button type="button" className="clear" onClick={limparTudo}>Limpar filtros</button>
        </div>
      )}

      <div className="cat-body">
        <aside className="filters">{painel}</aside>

        <div className="cat-results">
          {!carregando && produtos.length === 0 ? (
            <div className="empty">
              <Icon nome="busca" tamanho={36} />
              <h3>Nenhum produto com esses filtros</h3>
              <p className="muted">Tente remover algum filtro ou buscar só pelo número do modelo.</p>
              <button type="button" className="btn btn-dark" onClick={limparTudo}>Limpar filtros</button>
            </div>
          ) : (
            <ProductGrid produtos={produtos} carregando={carregando} colunas={3} limite={carregando ? 6 : undefined} />
          )}
        </div>
      </div>

      <div className={`drawer-mask ${drawer ? "is-open" : ""}`} onClick={() => setDrawer(false)} />
      <aside className={`filter-drawer ${drawer ? "is-open" : ""}`} aria-hidden={!drawer}>
        <header>
          <h2>Filtros</h2>
          <button type="button" className="hd-ico" onClick={() => setDrawer(false)} aria-label="Fechar filtros"><Icon nome="fechar" tamanho={22} /></button>
        </header>
        <div className="filter-drawer-body">{painel}</div>
        <footer>
          <button type="button" className="btn btn-ghost" onClick={limparTudo}>Limpar</button>
          <button type="button" className="btn btn-dark" onClick={() => setDrawer(false)}>Ver {plural(qtd, "produto", "produtos")}</button>
        </footer>
      </aside>
    </div>
  );
}
