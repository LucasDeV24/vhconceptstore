/**
 * Roda depois do "vite build" (faz parte do `npm run build`).
 *
 * O WhatsApp, o Instagram e o Google só leem o HTML inicial da página (não rodam o site). Por isso,
 * para o link de cada aparelho aparecer no WhatsApp com FOTO, NOME e PREÇO, este script gera:
 *   - dist/og/<produto>.jpg            imagem de compartilhamento (1200x630) com a foto do iPhone, nome e preço
 *   - dist/produto/<produto>/index.html  a mesma página do site, com as tags do cartão de prévia (Open Graph)
 *   - dist/og/home.jpg                 imagem da página inicial
 *
 * O endereço público vem de LOJA.site (src/data/conteudo.ts) ou da variável SITE_URL.
 */
import { createServer } from "vite";
import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(RAIZ, "dist");
const BASE = process.env.VITE_BASE ?? "/";

// ---- carrega os dados do site (TypeScript) com o próprio Vite ----
const vite = await createServer({ root: RAIZ, appType: "custom", server: { middlewareMode: true }, logLevel: "error", optimizeDeps: { noDiscovery: true } });
const { PRODUTOS } = await vite.ssrLoadModule("/src/data/produtos.ts");
const { LOJA, CONDICOES } = await vite.ssrLoadModule("/src/data/conteudo.ts");
await vite.close();

const SITE = (process.env.SITE_URL ?? LOJA.site).replace(/\/$/, "");

// ---- utilidades ----
const nf0 = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const nf2 = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const reais = (v) => (Number.isInteger(v) ? nf0 : nf2).format(v).replace(/ /g, " ");
const reais2 = (v) => nf2.format(v).replace(/ /g, " ");
const xml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const attr = xml;

const ARQ_FOTOS = (src) => path.join(RAIZ, "public", src.startsWith(BASE) ? src.slice(BASE.length) : src.replace(/^\//, ""));

// ---- imagem de compartilhamento 1200x630 ----
async function imagemProduto(p) {
  const condicao = p.categoria === "acessorio" ? "Novo" : CONDICOES[p.condicao].rotulo;
  const nome = p.nome;
  const tamNome = nome.length > 22 ? 40 : nome.length > 16 ? 50 : 60;
  const spec = [p.armazenamento, p.cor.nome].filter(Boolean).join("  ·  ");
  const preco = p.sobConsulta
    ? `<text x="64" y="470" font-size="64" font-weight="800" fill="#ecd48a">Consulte o valor</text>
       <text x="64" y="522" font-size="28" fill="#bdb7a6">Chame no WhatsApp</text>`
    : `<text x="64" y="430" font-size="20" font-weight="700" letter-spacing="4" fill="#ecd48a">À VISTA</text>
       <text x="64" y="508" font-size="88" font-weight="800" fill="#ffffff" letter-spacing="-2">${xml(reais(p.preco))}</text>
       <text x="64" y="560" font-size="29" fill="#cfc9ba">ou ${p.parcelas.quantidade}x de <tspan font-weight="700" fill="#ffffff">${xml(reais2(p.parcelas.valor))}</tspan> no cartão</text>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" font-family="Arial, Helvetica, sans-serif">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a0a"/><stop offset="1" stop-color="#1a160a"/></linearGradient>
      <radialGradient id="glow" cx="75%" cy="45%" r="50%"><stop offset="0" stop-color="#d4af37" stop-opacity=".30"/><stop offset="1" stop-color="#d4af37" stop-opacity="0"/></radialGradient>
      <linearGradient id="ouro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3dc93"/><stop offset=".5" stop-color="#d4af37"/><stop offset="1" stop-color="#a8832a"/></linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect width="1200" height="630" fill="url(#glow)"/>
    <rect x="14" y="14" width="1172" height="602" rx="30" fill="none" stroke="#d4af37" stroke-opacity=".5" stroke-width="2"/>
    <rect x="640" y="62" width="496" height="506" rx="38" fill="#f6f5f8"/>
    <text x="64" y="190" font-size="21" font-weight="700" letter-spacing="3" fill="#8d8878">VH CONCEPT STORE</text>
    <text x="64" y="262" font-size="${tamNome}" font-weight="800" fill="#ffffff" letter-spacing="-1">${xml(nome)}</text>
    <text x="64" y="312" font-size="30" font-weight="600" fill="#ecd48a">${xml(spec)}</text>
    <rect x="64" y="338" width="${condicao.length * 15 + 40}" height="38" rx="19" fill="url(#ouro)"/>
    <text x="${64 + (condicao.length * 15 + 40) / 2}" y="364" font-size="21" font-weight="800" fill="#15110a" text-anchor="middle">${xml(condicao)}</text>
    ${preco}
    <text x="1138" y="602" font-size="19" fill="#8d8878" text-anchor="end">${xml(SITE.replace(/^https?:\/\//, ""))}</text>
  </svg>`;

  const camadas = [];
  if (p.imagens[0]?.tipo === "foto") {
    const foto = await sharp(ARQ_FOTOS(p.imagens[0].src)).resize(470, 470, { fit: "contain", background: { r: 246, g: 245, b: 248, alpha: 1 } }).png().toBuffer();
    camadas.push({ input: foto, left: 653, top: 80 });
  } else {
    const logo = await sharp(path.join(RAIZ, "public", "logo-grande.png")).resize({ height: 300 }).toBuffer();
    camadas.push({ input: logo, left: 740, top: 165 });
  }
  const logoPeq = await sharp(path.join(RAIZ, "public", "logo-grande.png")).resize({ height: 92 }).toBuffer();
  camadas.push({ input: logoPeq, left: 60, top: 56 });
  return sharp(Buffer.from(svg)).composite(camadas).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
}

async function imagemHome() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" font-family="Arial, Helvetica, sans-serif">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a0a"/><stop offset="1" stop-color="#1a160a"/></linearGradient>
      <radialGradient id="glow" cx="72%" cy="48%" r="48%"><stop offset="0" stop-color="#d4af37" stop-opacity=".38"/><stop offset="1" stop-color="#d4af37" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/><rect width="1200" height="630" fill="url(#glow)"/>
    <rect x="14" y="14" width="1172" height="602" rx="30" fill="none" stroke="#d4af37" stroke-opacity=".5" stroke-width="2"/>
    <text x="72" y="300" font-size="22" font-weight="700" letter-spacing="4" fill="#ecd48a">VH CONCEPT STORE</text>
    <text x="72" y="378" font-size="64" font-weight="800" fill="#ffffff" letter-spacing="-1">iPhones lacrados</text>
    <text x="72" y="452" font-size="64" font-weight="800" fill="#ffffff" letter-spacing="-1">e seminovos</text>
    <text x="72" y="512" font-size="28" fill="#cfc9ba">Parcele em até 18x · Envio para todo o Brasil</text>
    <text x="72" y="566" font-size="24" fill="#8d8878">Volta Redonda e região</text>
  </svg>`;
  const foto = await sharp(path.join(RAIZ, "public", "fotos", "iphone-17-pro", "laranja-cosmico.webp")).resize(500, 500, { fit: "contain" }).png().toBuffer();
  const logo = await sharp(path.join(RAIZ, "public", "logo-grande.png")).resize({ height: 150 }).toBuffer();
  return sharp(Buffer.from(svg)).composite([{ input: foto, left: 640, top: 70 }, { input: logo, left: 66, top: 70 }]).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
}

// ---- tags do cartão de prévia ----
function bloco({ titulo, descricao, imagem, url }) {
  return `<!--og-->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="VH Concept Store" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:title" content="${attr(titulo)}" />
    <meta property="og:description" content="${attr(descricao)}" />
    <meta property="og:url" content="${attr(url)}" />
    <meta property="og:image" content="${attr(imagem)}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${attr(titulo)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${attr(titulo)}" />
    <meta name="twitter:description" content="${attr(descricao)}" />
    <meta name="twitter:image" content="${attr(imagem)}" />
    <link rel="canonical" href="${attr(url)}" />
    <!--/og-->`;
}

const base = await readFile(path.join(DIST, "index.html"), "utf8");
const comTags = (t, d, og) =>
  base
    .replace(/<title>.*?<\/title>/s, `<title>${xml(t)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${attr(d)}" />`)
    .replace(/<!--og-->.*?<!--\/og-->/s, bloco(og));

await mkdir(path.join(DIST, "og"), { recursive: true });

// página inicial
{
  const url = `${SITE}${BASE}`;
  await writeFile(path.join(DIST, "og", "home.jpg"), await imagemHome());
  const t = "VH Concept Store | iPhones lacrados e seminovos";
  const d = "iPhones lacrados e seminovos, testados e garantidos. Parcele em até 18x. Volta Redonda e região, enviamos para todo o Brasil.";
  await writeFile(path.join(DIST, "index.html"), comTags(t, d, { titulo: t, descricao: d, imagem: `${SITE}${BASE}og/home.jpg`, url }));
}

// uma página + uma imagem por produto
let feitos = 0;
const fila = [...PRODUTOS];
async function trabalhador() {
  while (fila.length) {
    const p = fila.shift();
    const condicao = p.categoria === "acessorio" ? "Novo" : CONDICOES[p.condicao].rotulo;
    const nomeCompleto = [p.nome, p.armazenamento, p.cor.nome].filter(Boolean).join(" ");
    const titulo = p.sobConsulta ? `${nomeCompleto} | VH Concept Store` : `${nomeCompleto} por ${reais(p.preco)} à vista | VH Concept Store`;
    const descricao = p.sobConsulta
      ? `${condicao} · Chegou agora: consulte o valor no WhatsApp · Envio para todo o Brasil`
      : `${condicao} · À vista ${reais(p.preco)} ou ${p.parcelas.quantidade}x de ${reais2(p.parcelas.valor)} no cartão · Envio para todo o Brasil`;
    await writeFile(path.join(DIST, "og", `${p.id}.jpg`), await imagemProduto(p));
    const dir = path.join(DIST, "produto", p.id);
    await mkdir(dir, { recursive: true });
    const url = `${SITE}${BASE}produto/${p.id}`;
    await writeFile(path.join(dir, "index.html"), comTags(titulo, descricao, { titulo, descricao, imagem: `${SITE}${BASE}og/${p.id}.jpg`, url }));
    feitos++;
  }
}
await Promise.all(Array.from({ length: 4 }, trabalhador));
console.log(`Prévia de link (WhatsApp): ${feitos} páginas e imagens geradas em dist/ (endereço: ${SITE}${BASE})`);
