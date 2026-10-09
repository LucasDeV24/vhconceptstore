const fmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const fmtInt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

/** R$ 4.499 (sem centavos quando inteiro) ou R$ 374,92 */
export const brl = (v: number) => (Number.isInteger(v) ? fmtInt.format(v) : fmt.format(v));
export const brlCentavos = (v: number) => fmt.format(v);

export const descontoPct = (preco: number, anterior?: number) =>
  anterior && anterior > preco ? Math.round((1 - preco / anterior) * 100) : 0;

export const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;
