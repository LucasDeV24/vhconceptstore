import { Link } from "react-router-dom";
import type { Produto } from "@/types";
import { api } from "@/services/api";
import { getModelo } from "@/data/modelos";
import { AccessoryArt } from "@/components/product/AccessoryArt";
import { urlFoto } from "@/utils/fotos";
import { brl } from "@/utils/format";

const menorPreco = (f: (p: Produto) => boolean) => {
  const precos = api.todos().filter((p) => f(p) && !p.sobConsulta).map((p) => p.preco);
  return precos.length ? Math.min(...precos) : null;
};
const aPartirDe = (v: number | null) => (v === null ? "Consulte o valor" : `a partir de ${brl(v)}`);
const linha = (n: string) => (p: Produto) => p.categoria === "iphone" && getModelo(p.modelo)?.linha === n;

interface Atalho {
  rotulo: string;
  to: string;
  foto: [modeloId: string, corSlug: string];
  filtro: (p: Produto) => boolean;
  tag?: string;
}

const ATALHOS: Atalho[] = [
  { rotulo: "iPhone 18", to: "/loja?linha=18", foto: ["iphone-18-pro", "bordo"], filtro: linha("18"), tag: "Novo" },
  { rotulo: "iPhone 17", to: "/loja?linha=17", foto: ["iphone-17-pro", "laranja-cosmico"], filtro: linha("17") },
  { rotulo: "iPhone 16", to: "/loja?linha=16", foto: ["iphone-16", "ultramarino"], filtro: linha("16") },
  { rotulo: "iPhone 15", to: "/loja?linha=15", foto: ["iphone-15", "rosa"], filtro: linha("15") },
  { rotulo: "iPhone 14", to: "/loja?linha=14", foto: ["iphone-14-pro", "roxo-profundo"], filtro: linha("14") },
  { rotulo: "iPhone 13", to: "/loja?linha=13", foto: ["iphone-13", "azul"], filtro: linha("13") },
  { rotulo: "iPhone 12", to: "/loja?linha=12", foto: ["iphone-12", "roxo"], filtro: linha("12") },
  { rotulo: "Seminovos", to: "/loja?semi=1", foto: ["iphone-16-pro", "titanio-deserto"], filtro: (p) => p.condicao === "seminovo", tag: "Garantia" },
];

export function CategoryShortcuts() {
  return (
    <nav className="cats wrap" aria-label="Atalhos por categoria">
      {ATALHOS.map((a) => {
        const cor = getModelo(a.foto[0])!.cores.find((c) => c.slug === a.foto[1])!;
        return (
          <Link key={a.rotulo} to={a.to} className="cat">
            <span className="cat-art">
              <img src={urlFoto(a.foto[0], cor)} alt="" loading="lazy" decoding="async" draggable={false} />
              {a.tag && <span className="cat-tag">{a.tag}</span>}
            </span>
            <b>{a.rotulo}</b>
            <small>{aPartirDe(menorPreco(a.filtro))}</small>
          </Link>
        );
      })}
      <Link to="/loja?categoria=acessorio" className="cat">
        <span className="cat-art cat-art--acc"><AccessoryArt tipo="capa" cor="#4A5B7A" /></span>
        <b>Acessórios</b>
        <small>{aPartirDe(menorPreco((p) => p.categoria === "acessorio"))}</small>
      </Link>
    </nav>
  );
}
