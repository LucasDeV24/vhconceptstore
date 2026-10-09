/** "novo" = lacrado */
export type Condicao = "novo" | "seminovo";
export type Armazenamento = "64GB" | "128GB" | "256GB" | "512GB" | "1TB";
export type Categoria = "iphone" | "acessorio";
export interface Cor {
  nome: string;
  hex: string;
  /** nome do arquivo em public/fotos/<modelo>/<slug>.webp (iPhones) */
  slug?: string;
  /** vistas extras disponíveis: public/fotos/<modelo>/<slug>-av<n>.webp */
  extras?: number[];
}

/** Imagem do produto: foto (arquivo local ou URL vinda da API) ou ilustração (acessórios sem foto) */
export type ImagemProduto =
  | { tipo: "foto"; src: string; legenda?: string }
  | { tipo: "ilustracao"; legenda?: string };

export interface Modelo {
  id: string;
  nome: string;
  linha: string; // "16", "15"... usado nos filtros
  ano: number;
  tela: number; // polegadas
  painel: string;
  chip: string;
  camera: string;
  qtdCameras: 1 | 2 | 3;
  bateriaVideo: number; // horas de reprodução de vídeo (dado da Apple)
  conector: string;
  cincoG: boolean;
  dynamicIsland: boolean;
  cores: Cor[];
}

export interface ItemInspecao {
  item: string;
  status: string;
  ok: boolean;
}

export interface Produto {
  id: string;
  nome: string;
  modelo: string; // id do Modelo (ou tipo do acessório)
  categoria: Categoria;
  condicao: Condicao;
  armazenamento?: Armazenamento;
  cor: Cor;
  preco: number;
  precoPix: number;
  precoAnterior?: number;
  /** maior parcelamento disponível (com juros da maquininha) */
  parcelas: { quantidade: number; valor: number; semJuros: boolean };
  saudeBateria?: number;
  garantia: number; // meses
  estoque: number;
  imagens: ImagemProduto[];
  /** só aparecem no site quando existirem avaliações reais */
  avaliacao?: number;
  quantidadeAvaliacoes?: number;
  descricao: string;
  especificacoes: Record<string, string>;
  inspecao?: ItemInspecao[];
  selo?: string;
  /** sem preço na tabela: o site mostra "Consulte o valor" e leva ao WhatsApp */
  sobConsulta?: boolean;
  vendidos: number;
  lancamento: number; // ano, para ordenação
}

export type Ordenacao = "mais-vendidos" | "menor-preco" | "maior-preco" | "maior-desconto" | "lancamentos";

export interface FiltrosCatalogo {
  busca?: string;
  categoria?: Categoria;
  linhas?: string[];
  condicoes?: Condicao[];
  armazenamentos?: Armazenamento[];
  cores?: string[];
  telas?: number[];
  cameras?: number[];
  bateriaMin?: number;
  precoMax?: number;
  apenasEmEstoque?: boolean;
  apenasOfertas?: boolean;
  ordenacao?: Ordenacao;
}

export interface ItemCarrinho {
  produtoId: string;
  quantidade: number;
}

export interface Avaliacao {
  nome: string;
  cidade: string;
  nota: number;
  texto: string;
  produto: string;
}
