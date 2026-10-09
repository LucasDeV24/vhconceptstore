/**
 * PARCELAMENTO NO CARTÃO: juros da maquininha, desde a 1ª parcela.
 *
 * O preço do site é À VISTA (PIX ou dinheiro, sem juros). No cartão vale a regra da loja:
 * JUROS SIMPLES de 1,59% por parcela, ou seja:
 *
 *     total no cartão = preço à vista × (1 + 1,59% × nº de parcelas)
 *     parcela         = total ÷ nº de parcelas
 *
 * Exemplo, iPhone de R$ 4.199 em 12x: fator 1,1908 → total R$ 5.000,17 → 12x de R$ 416,68.
 * Para mudar a taxa ou o máximo de parcelas, edite as duas constantes abaixo.
 */
export const JUROS_POR_PARCELA = 0.0159;
export const MAX_PARCELAS = 18;

export const PARCELAS_DISPONIVEIS = Array.from({ length: MAX_PARCELAS }, (_, i) => i + 1);

export const fatorDoCartao = (n: number) => 1 + JUROS_POR_PARCELA * n;

const arredonda = (v: number) => Math.round(v * 100) / 100;

export const valorParcela = (aVista: number, n: number) => arredonda((aVista * fatorDoCartao(n)) / n);

export interface OpcaoParcela {
  n: number;
  valor: number;
  total: number;
}

/** Todas as opções de parcelamento de um preço à vista (1x até MAX_PARCELAS). */
export function opcoesDeParcelamento(aVista: number): OpcaoParcela[] {
  return PARCELAS_DISPONIVEIS.map((n) => {
    const valor = valorParcela(aVista, n);
    return { n, valor, total: arredonda(valor * n) };
  });
}

/** "1,59%" */
export const JUROS_TEXTO = `${(JUROS_POR_PARCELA * 100).toFixed(2).replace(".", ",")}%`;
