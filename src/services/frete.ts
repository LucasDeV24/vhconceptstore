/**
 * Estimativa de entrega por CEP. REGRAS DE EXEMPLO — ajuste às condições reais da loja
 * (ou substitua por uma API de frete como Melhor Envio / Correios).
 */
export interface Frete {
  tipo: "maos" | "regiao" | "envio";
  titulo: string;
  detalhe: string;
}

export const limparCep = (cep: string) => cep.replace(/\D/g, "").slice(0, 8);
export const formatarCep = (cep: string) => {
  const d = limparCep(cep);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

export function calcularFrete(cep: string): Frete | null {
  const d = limparCep(cep);
  if (d.length !== 8) return null;
  const n = Number(d.slice(0, 5));
  if (n >= 27200 && n <= 27299)
    return { tipo: "maos", titulo: "Entrega em mãos em Volta Redonda", detalhe: "Grátis · hoje ou amanhã" };
  if (n >= 27000 && n <= 27999)
    return { tipo: "regiao", titulo: "Entrega na região Sul Fluminense", detalhe: "Combinada pelo WhatsApp · 1 a 2 dias" };
  return { tipo: "envio", titulo: "Envio para todo o Brasil", detalhe: "Com rastreio · 2 a 7 dias úteis" };
}
