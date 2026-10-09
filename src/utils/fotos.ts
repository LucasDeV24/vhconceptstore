import type { Cor, ImagemProduto } from "@/types";
import { asset } from "./base";

/** Caminho da foto de um iPhone em public/fotos (gerada por scripts/baixar-fotos.mjs). */
export const urlFoto = (modeloId: string, cor: Cor, extra?: number) =>
  cor.extras ? asset(`fotos/${modeloId}/${cor.slug}${extra ? `-av${extra}` : ""}.webp`) : asset("fotos/sem-foto.webp");

const LEGENDAS: Record<number, string> = { 1: "Traseira e lateral" };

export const FOTO_EM_BREVE = asset("fotos/sem-foto.webp");

/** Galeria de um iPhone: foto principal (frente e traseira) + vistas de detalhe disponíveis. */
export function galeriaIphone(modeloId: string, cor: Cor): ImagemProduto[] {
  if (!cor.slug || !cor.extras) return [{ tipo: "foto", src: FOTO_EM_BREVE, legenda: "Foto em breve" }];
  return [
    { tipo: "foto", src: urlFoto(modeloId, cor), legenda: "Frente e traseira" },
    ...(cor.extras ?? []).map((n): ImagemProduto => ({ tipo: "foto", src: urlFoto(modeloId, cor, n), legenda: LEGENDAS[n] })),
  ];
}
