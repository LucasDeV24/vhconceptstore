/**
 * CATÁLOGO COM A TABELA DE VALORES DA LOJA.
 *
 * Preço = valor À VISTA (PIX/dinheiro), exatamente como na tabela. As parcelas no cartão (com os juros
 * da maquininha, 1,59% por parcela) vêm de parcelamento.ts.
 * Para trocar preços, edite as listas abaixo.
 *
 * ATENÇÃO: a tabela não traz estoque, nem bateria/estado dos seminovos. Por isso o site não mostra
 * esses dados. Os acessórios (final do arquivo) NÃO fazem parte da tabela: são só exemplos.
 */
import type { Armazenamento, Condicao, Cor, Produto } from "@/types";
import { getModelo } from "./modelos";
import { galeriaIphone } from "@/utils/fotos";
import { MAX_PARCELAS, valorParcela } from "./parcelamento";

const slug = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function seed(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return ((h >>> 0) % 10000) / 10000;
}

function specsDoModelo(modeloId: string, armazenamento: Armazenamento) {
  const m = getModelo(modeloId)!;
  return {
    Tela: `${m.tela.toString().replace(".", ",")}" ${m.painel}`,
    Chip: m.chip,
    "Câmera traseira": m.camera,
    Armazenamento: armazenamento,
    Bateria: `Até ${m.bateriaVideo}h de vídeo`,
    Conector: m.conector,
    "5G": m.cincoG ? "Sim" : "Não",
    "Dynamic Island": m.dynamicIsland ? "Sim" : "Não",
    Lançamento: String(m.ano),
  };
}

// ---------------------------------------------------------------------------
// TABELA DE VALORES  (modelo, armazenamento, preço à vista por cor)
// precos: número = vale para todas as cores do modelo; objeto = preço por cor (slug da cor)
// ---------------------------------------------------------------------------
interface Linha {
  modelo: string;
  gb: Armazenamento;
  precos: number | Record<string, number>;
  /** preço anterior (mostra "de/por") */
  de?: Record<string, number>;
  /** nome de exibição diferente do modelo (ex.: "iPhone 14 CPO") */
  nome?: string;
  selo?: string;
  /** sem preço na tabela: mostra "Consulte o valor" */
  sobConsulta?: boolean;
  /** só estas cores (por padrão, todas as cores do modelo com foto) */
  cores?: string[];
  /** peso na ordenação "mais vendidos" */
  peso?: number;
}

// ----- LACRADOS -----
const LACRADOS: Linha[] = [
  // iPhone 18 Pro: lançamento de set/2026, ainda sem preço na tabela da loja
  { modelo: "iphone-18-pro-max", gb: "256GB", precos: 0, sobConsulta: true, selo: "Lançamento", peso: 380 },
  { modelo: "iphone-18-pro-max", gb: "512GB", precos: 0, sobConsulta: true, selo: "Lançamento", peso: 280 },
  { modelo: "iphone-18-pro-max", gb: "1TB", precos: 0, sobConsulta: true, selo: "Lançamento", peso: 200 },
  { modelo: "iphone-18-pro", gb: "256GB", precos: 0, sobConsulta: true, selo: "Lançamento", peso: 420 },
  { modelo: "iphone-18-pro", gb: "512GB", precos: 0, sobConsulta: true, selo: "Lançamento", peso: 300 },
  { modelo: "iphone-18-pro", gb: "1TB", precos: 0, sobConsulta: true, selo: "Lançamento", peso: 200 },

  { modelo: "iphone-17-pro-max", gb: "256GB", precos: { prateado: 7600, "azul-profundo": 7500, "laranja-cosmico": 7500 }, peso: 600 },
  { modelo: "iphone-17-pro-max", gb: "512GB", precos: 8399, peso: 500 },
  { modelo: "iphone-17-pro", gb: "256GB", precos: 7249, peso: 650 },
  { modelo: "iphone-17", gb: "256GB", precos: { salvia: 5550, "azul-nevoa": 5700, preto: 5750, lavanda: 5750, branco: 5750 }, peso: 800 },
  { modelo: "iphone-air", gb: "256GB", precos: { "dourado-claro": 5800, "azul-ceu": 5800, "preto-espacial": 5800, "branco-nuvem": 5850 }, peso: 450 },

  { modelo: "iphone-16-pro-max", gb: "256GB", precos: 6899, peso: 550 },
  { modelo: "iphone-16", gb: "256GB", precos: 4999, peso: 700 },
  { modelo: "iphone-16", gb: "128GB", precos: 4850, peso: 760 },
  { modelo: "iphone-15", gb: "128GB", precos: 4199, peso: 720 },
];

// ----- SEMINOVOS (itens da tabela sem "Lacrado") -----
const SEMINOVOS: Linha[] = [
  { modelo: "iphone-16-pro", gb: "256GB", precos: { "titanio-preto": 4650, "titanio-branco": 4750, "titanio-deserto": 4750 }, peso: 500 },
  { modelo: "iphone-16-pro", gb: "128GB", precos: { "titanio-preto": 4350, "titanio-branco": 4499, "titanio-natural": 4499, "titanio-deserto": 4499 }, peso: 520 },
  { modelo: "iphone-16", gb: "128GB", precos: { "verde-acinzentado": 3750, preto: 3650 }, de: { preto: 3750 }, peso: 540 },
  { modelo: "iphone-15-pro-max", gb: "512GB", precos: { "titanio-preto": 4399, "titanio-azul": 4399 }, peso: 480 },
  { modelo: "iphone-15-pro-max", gb: "256GB", precos: { "titanio-preto": 4050, "titanio-azul": 4050, "titanio-branco": 4199, "titanio-natural": 4199 }, peso: 530 },
  { modelo: "iphone-15-pro", gb: "128GB", precos: { "titanio-azul": 3450, "titanio-natural": 3599 }, peso: 470 },
  { modelo: "iphone-15-plus", gb: "128GB", precos: { rosa: 2850, preto: 2850 }, peso: 400 },
  { modelo: "iphone-15", gb: "128GB", precos: 2899, peso: 510 },
  { modelo: "iphone-14-pro-max", gb: "256GB", precos: 3550, cores: ["preto-espacial", "roxo-profundo"], peso: 380 },
  { modelo: "iphone-14-pro-max", gb: "128GB", precos: 3250, cores: ["preto-espacial", "roxo-profundo"], peso: 390 },
  { modelo: "iphone-14-pro", gb: "256GB", precos: 3050, cores: ["preto-espacial", "roxo-profundo"], peso: 390 },
  { modelo: "iphone-14-pro", gb: "128GB", precos: 2949, cores: ["preto-espacial", "roxo-profundo"], peso: 400 },
  { modelo: "iphone-14-plus", gb: "128GB", precos: 2270, cores: ["vermelho", "meia-noite", "roxo"], peso: 300 },
  { modelo: "iphone-14", gb: "128GB", precos: 2399, peso: 410 },
  { modelo: "iphone-14", gb: "128GB", precos: 3649, nome: "iPhone 14 CPO", selo: "CPO", cores: ["estelar"], peso: 405 },
  { modelo: "iphone-13-pro-max", gb: "256GB", precos: 3200, cores: ["grafite"], peso: 280 },
  { modelo: "iphone-13-pro-max", gb: "128GB", precos: 2980, cores: ["grafite"], peso: 290 },
  { modelo: "iphone-13", gb: "128GB", precos: { rosa: 2050, vermelho: 2050, "meia-noite": 2050, estelar: 2099 }, peso: 330 },
  { modelo: "iphone-12-pro-max", gb: "256GB", precos: 2499, cores: ["dourado"], peso: 200 },
  { modelo: "iphone-12-pro", gb: "512GB", precos: 2150, cores: ["grafite", "azul-pacifico"], peso: 190 },
  { modelo: "iphone-12-pro", gb: "256GB", precos: 2099, cores: ["grafite", "azul-pacifico"], peso: 195 },
  { modelo: "iphone-12-pro", gb: "128GB", precos: 1999, cores: ["grafite"], peso: 200 },
  { modelo: "iphone-12", gb: "256GB", precos: { roxo: 1899, verde: 1899, azul: 1899, vermelho: 1899, preto: 1899, branco: 1950 }, peso: 250 },
];

const GARANTIA: Record<Condicao, number> = { novo: 12, seminovo: 3 };

function montar(linhas: Linha[], condicao: Condicao): Produto[] {
  return linhas.flatMap((l) => {
    const m = getModelo(l.modelo)!;
    let cores: Cor[] = l.cores ? l.cores.map((s) => m.cores.find((c) => c.slug === s)!).filter(Boolean) : m.cores;
    // preço por cor: só existem as cores que aparecem na tabela
    if (typeof l.precos !== "number") cores = cores.filter((c) => (l.precos as Record<string, number>)[c.slug!] !== undefined);
    const nome = l.nome ?? m.nome;
    return cores.map((cor): Produto => {
      const preco = typeof l.precos === "number" ? l.precos : (l.precos[cor.slug!] ?? 0);
      const id = `${m.id}${l.nome ? "-cpo" : ""}-${condicao}-${l.gb.toLowerCase()}-${cor.slug}`;
      const r = seed(id);
      const anterior = l.de?.[cor.slug!];
      return {
        id,
        nome,
        modelo: m.id,
        categoria: "iphone",
        condicao,
        armazenamento: l.gb,
        cor,
        preco,
        precoPix: preco,
        precoAnterior: anterior,
        parcelas: { quantidade: MAX_PARCELAS, valor: l.sobConsulta ? 0 : valorParcela(preco, MAX_PARCELAS), semJuros: false },
        garantia: GARANTIA[condicao],
        estoque: 5,
        imagens: galeriaIphone(m.id, cor),
        descricao:
          condicao === "novo"
            ? `${nome} lacrado. Pergunte pelo prazo de entrega e pela garantia no WhatsApp.`
            : `${nome} seminovo, testado e garantido. Peça no WhatsApp as fotos reais e a saúde da bateria do aparelho.`,
        especificacoes: specsDoModelo(m.id, l.gb),
        selo: anterior ? "Promoção" : l.selo,
        sobConsulta: l.sobConsulta,
        vendidos: (l.peso ?? 300) + Math.floor(r * 40),
        lancamento: m.ano,
      };
    });
  });
}

// ---------------------------------------------------------------------------
// ACESSÓRIOS: EXEMPLOS (não estão na tabela da loja). Edite ou remova.
// ---------------------------------------------------------------------------
interface DefAcc {
  modelo: string;
  nome: string;
  cor: Cor;
  preco: number;
  garantia: number;
  specs: Record<string, string>;
  descricao: string;
}

const ACESSORIOS: DefAcc[] = [
  { modelo: "capa", nome: "Capa de silicone com MagSafe", cor: { nome: "Azul-tempestade", hex: "#4A5B7A" }, preco: 249, garantia: 3,
    specs: { Compatibilidade: "iPhone 15, 16 e 17", Material: "Silicone", MagSafe: "Sim" }, descricao: "Interior em microfibra, encaixe preciso e ímãs alinhados para MagSafe." },
  { modelo: "carregador", nome: "Carregador USB-C 20W", cor: { nome: "Branco", hex: "#F5F5F2" }, preco: 169, garantia: 12,
    specs: { Potência: "20W", Entrada: "USB-C", "Carga rápida": "50% em ~30 min" }, descricao: "Carregamento rápido para iPhones com USB-C ou Lightning." },
  { modelo: "cabo", nome: "Cabo USB-C trançado 1m", cor: { nome: "Branco", hex: "#F5F5F2" }, preco: 129, garantia: 6,
    specs: { Comprimento: "1 metro", Conectores: "USB-C / USB-C", Revestimento: "Trançado" }, descricao: "Revestimento trançado que não embola." },
  { modelo: "pelicula", nome: "Película de vidro 3D", cor: { nome: "Transparente", hex: "#E6ECEF" }, preco: 79, garantia: 1,
    specs: { Material: "Vidro temperado 9H", Cobertura: "Tela inteira", Aplicação: "Com gabarito" }, descricao: "Cobre a tela inteira e vem com gabarito para aplicar sem bolhas." },
  { modelo: "magsafe", nome: "Carregador MagSafe", cor: { nome: "Branco", hex: "#F5F5F2" }, preco: 349, garantia: 12,
    specs: { Potência: "Até 25W", Cabo: "1 metro USB-C", Compatibilidade: "iPhone 12 ao 18" }, descricao: "Encaixa magneticamente e carrega sem fio." },
  { modelo: "fone", nome: "AirPods Pro (2ª geração)", cor: { nome: "Branco", hex: "#F5F5F2" }, preco: 1899, garantia: 12,
    specs: { Cancelamento: "Ativo de ruído", Estojo: "USB-C com MagSafe", Bateria: "Até 6h por carga" }, descricao: "Cancelamento ativo de ruído, modo ambiente e áudio espacial." },
];

const acessorios: Produto[] = ACESSORIOS.map((a) => {
  const id = `acessorio-${slug(a.nome)}`;
  const r = seed(id);
  return {
    id,
    nome: a.nome,
    modelo: a.modelo,
    categoria: "acessorio",
    condicao: "novo",
    cor: a.cor,
    preco: a.preco,
    precoPix: a.preco,
    parcelas: { quantidade: MAX_PARCELAS, valor: valorParcela(a.preco, MAX_PARCELAS), semJuros: false },
    garantia: a.garantia,
    estoque: Math.floor(5 + r * 30),
    imagens: [{ tipo: "ilustracao", legenda: "Produto" }, { tipo: "ilustracao", legenda: "Detalhe" }],
    descricao: a.descricao,
    especificacoes: a.specs,
    vendidos: Math.floor(r * 100),
    lancamento: 2024,
  };
});

export const PRODUTOS: Produto[] = [...montar(LACRADOS, "novo"), ...montar(SEMINOVOS, "seminovo"), ...acessorios];
