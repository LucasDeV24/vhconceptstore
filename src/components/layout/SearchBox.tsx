import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/services/api";
import { aplicarFiltros, agruparVitrine } from "@/services/catalogo";
import { ProductImage } from "@/components/product/ProductImage";
import { Icon } from "@/components/ui/Icon";
import { brl } from "@/utils/format";

const SUGESTOES = ["iPhone 16 Pro", "iPhone 15", "Seminovo", "256GB", "Capa MagSafe"];

export function SearchBox({ onFechar }: { onFechar?: () => void }) {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState(-1);
  const nav = useNavigate();
  const box = useRef<HTMLFormElement>(null);

  const resultados = useMemo(
    () => (q.trim().length < 2 ? [] : agruparVitrine(aplicarFiltros(api.todos(), { busca: q })).slice(0, 5)),
    [q]
  );

  useEffect(() => {
    const fora = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setAberto(false);
    document.addEventListener("mousedown", fora);
    return () => document.removeEventListener("mousedown", fora);
  }, []);

  const buscar = (termo: string) => {
    setAberto(false);
    onFechar?.();
    nav(termo.trim() ? `/loja?q=${encodeURIComponent(termo.trim())}` : "/loja");
  };

  return (
    <form
      ref={box}
      className={`search ${aberto ? "is-open" : ""}`}
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (ativo >= 0 && resultados[ativo]) {
          setAberto(false);
          onFechar?.();
          nav(`/produto/${resultados[ativo].produto.id}`);
        } else buscar(q);
      }}
    >
      <Icon nome="busca" tamanho={19} className="search-ico" />
      <input
        type="search"
        value={q}
        placeholder="Busque por iPhone 15, iPhone 14 Pro, 256GB..."
        aria-label="Buscar produtos"
        onFocus={() => setAberto(true)}
        onChange={(e) => {
          setQ(e.target.value);
          setAtivo(-1);
          setAberto(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setAtivo((a) => Math.min(resultados.length - 1, a + 1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setAtivo((a) => Math.max(-1, a - 1)); }
          if (e.key === "Escape") setAberto(false);
        }}
      />
      <button type="submit" className="search-go" aria-label="Buscar">
        <Icon nome="seta" tamanho={18} />
      </button>

      {aberto && (
        <div className="search-pop">
          {resultados.length > 0 ? (
            <>
              <p className="search-label">Produtos</p>
              {resultados.map(({ produto: p, variantes }, i) => (
                <Link
                  key={p.id}
                  to={`/produto/${p.id}`}
                  className={`search-item ${i === ativo ? "is-on" : ""}`}
                  onClick={() => { setAberto(false); onFechar?.(); }}
                  onMouseEnter={() => setAtivo(i)}
                >
                  <span className="search-thumb"><ProductImage produto={p} /></span>
                  <span className="search-txt">
                    <b>{p.nome} {p.armazenamento}</b>
                    <small>{(p.condicao === "novo" ? "Lacrado" : "Seminovo") + (variantes.length > 1 ? ` · ${variantes.length} cores` : ` · ${p.cor.nome}`)}</small>
                  </span>
                  <span className="search-price">{p.sobConsulta ? "Consultar" : brl(p.preco)}</span>
                </Link>
              ))}
              <button type="submit" className="search-all">Ver todos os resultados para “{q}”</button>
            </>
          ) : q.trim().length >= 2 ? (
            <p className="search-empty">Nada encontrado para “{q}”. Tente só o número do modelo, ex.: 13.</p>
          ) : (
            <>
              <p className="search-label">Mais buscados</p>
              <div className="search-chips">
                {SUGESTOES.map((s) => (
                  <button type="button" key={s} onClick={() => { setQ(s); buscar(s); }}>{s}</button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </form>
  );
}
