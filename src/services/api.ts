/**
 * Camada de acesso a dados. Hoje lê o mock local; para usar uma API real,
 * troque o corpo destas funções por fetch(`${API_URL}/produtos`), mantendo as assinaturas.
 */
import type { FiltrosCatalogo, Produto } from "@/types";
import { PRODUTOS } from "@/data/produtos";
import { aplicarFiltros } from "./catalogo";

const LATENCIA = 450; // simula a rede para exibir o skeleton
const esperar = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(v), LATENCIA));

export const api = {
  listarProdutos(filtros: FiltrosCatalogo = {}): Promise<Produto[]> {
    return esperar(aplicarFiltros(PRODUTOS, filtros));
  },
  obterProduto(id: string): Promise<Produto | undefined> {
    return esperar(PRODUTOS.find((p) => p.id === id));
  },
  /** acesso síncrono usado por carrinho/favoritos (com API real, guarde o produto no item) */
  produtoPorId(id: string): Produto | undefined {
    return PRODUTOS.find((p) => p.id === id);
  },
  todos(): Produto[] {
    return PRODUTOS;
  },
};
