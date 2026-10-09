import type { Condicao } from "@/types";

export const LOJA = {
  nome: "VH Concept Store",
  whatsapp: "https://wa.me/message/46DJAV7J3JPIK1",
  cidade: "Volta Redonda, RJ",
};

export const CONDICOES: Record<Condicao, { rotulo: string; curto: string; resumo: string[] }> = {
  novo: { rotulo: "Lacrado", curto: "Lacrado", resumo: ["Novo, na caixa lacrada"] },
  seminovo: { rotulo: "Seminovo", curto: "Seminovo", resumo: ["Testado e garantido"] },
};

export const FAQ = [
  { p: "Os iPhones seminovos têm garantia?", r: "Sim. Nossos aparelhos são testados e garantidos. O prazo é combinado com você no WhatsApp antes de fechar." },
  { p: "Qual a diferença entre lacrado e seminovo?", r: "Lacrado é novo, na caixa fechada. Seminovo já teve dono, foi testado e por isso sai por um preço menor. O site mostra os dois, bem separados." },
  { p: "Posso ver fotos e a bateria do seminovo?", r: "Pode. Chame no WhatsApp e peça as fotos reais e a saúde da bateria do aparelho que você escolheu." },
  { p: "Posso parcelar?", r: "Sim, em até 18x no cartão, com juros da maquininha de 1,59% por parcela, desde a 1ª parcela. O preço do site é à vista (PIX ou dinheiro), sem juros. Na página de cada aparelho tem a tabela de 1x a 18x." },
  { p: "Vocês aceitam meu iPhone usado?", r: "Aceitamos. Faça uma simulação na seção Troque seu iPhone e a gente confirma o valor ao avaliar o aparelho." },
  { p: "Vocês enviam para todo o Brasil?", r: "Enviamos. Em Volta Redonda e região, combinamos entrega ou retirada." },
];

// Base da estimativa de troca (valor de um aparelho 128GB em ótimo estado). EXEMPLO: ajuste à sua tabela real.
export const TROCA_BASE: Record<string, number> = {
  "iPhone 18 Pro Max": 9400, "iPhone 18 Pro": 8300,
  "iPhone 17 Pro Max": 7900, "iPhone 17 Pro": 6900, "iPhone 17": 5000,
  "iPhone 16 Pro Max": 5800, "iPhone 16 Pro": 4900, "iPhone 16": 3700,
  "iPhone 15 Pro Max": 4500, "iPhone 15 Pro": 3800, "iPhone 15": 2900,
  "iPhone 14 Pro Max": 3500, "iPhone 14 Pro": 3000, "iPhone 14": 2200,
  "iPhone 13 Pro Max": 2700, "iPhone 13 Pro": 2400, "iPhone 13": 1700,
  "iPhone 12 Pro": 1600, "iPhone 12": 1150, "iPhone 11": 850,
};
