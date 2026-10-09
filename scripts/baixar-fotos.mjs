/**
 * Baixa as fotos oficiais dos iPhones (servidor de imagens da Apple), recorta o aparelho,
 * padroniza o tamanho, converte para WebP leve e gera src/data/cores.ts.
 *
 * Uso:  node scripts/baixar-fotos.mjs            (baixa só o que falta)
 *       node scripts/baixar-fotos.mjs --refazer  (baixa tudo de novo)
 *
 * Para adicionar um modelo novo, inclua uma entrada em MODELOS abaixo e rode o script.
 * As imagens são propriedade da Apple Inc. Veja o aviso no README antes de publicar.
 */
import sharp from "sharp";
import { mkdir, writeFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is";
const REFAZER = process.argv.includes("--refazer");
const LADO = 760; // lado do quadrado final
const MARGEM = 0.07; // respiro em volta do aparelho
const CINZA = { r: 245, g: 245, b: 247 }; // fundo padrão das fotos da Apple (#F5F5F7)

// [slug, nome em português (como na loja da Apple Brasil), chave usada no nome da imagem, hex da bolinha (opcional)]
// Sem hex, a cor é medida na própria foto.
const MODELOS = [
  { id: "iphone-air", img: (k) => `iphone-air-finish-select-${k}-202509`, cores: [["preto-espacial", "Preto-espacial", "spaceblack"], ["branco-nuvem", "Branco-nuvem", "cloudwhite"], ["dourado-claro", "Dourado-claro", "lightgold"], ["azul-ceu", "Azul-céu", "skyblue"]] },
  { id: "iphone-15-plus", img: (k) => `iphone-15-finish-select-202309-6-7inch-${k}`, cores: [["rosa", "Rosa", "pink", "#F4D8DC"], ["amarelo", "Amarelo", "yellow", "#F3EBC6"], ["verde", "Verde", "green", "#D5E3CF"], ["azul", "Azul", "blue", "#D3DEE6"], ["preto", "Preto", "black", "#3A3D40"]] },
  { id: "iphone-14-pro-max", img: (k) => `iphone-14-pro-finish-select-202209-6-7inch-${k}`, cores: [["roxo-profundo", "Roxo-profundo", "deeppurple", "#594F63"], ["dourado", "Dourado", "gold", "#F4E8CE"], ["prateado", "Prateado", "silver", "#E8E8E3"], ["preto-espacial", "Preto-espacial", "spaceblack", "#403E3D"]] },
  { id: "iphone-14-plus", img: (k) => `iphone-14-finish-select-202209-6-7inch-${k}`, cores: [["azul", "Azul", "blue", "#A0B4C7"], ["roxo", "Roxo", "purple", "#E5DDEA"], ["meia-noite", "Meia-noite", "midnight", "#2F333A"], ["estelar", "Estelar", "starlight", "#F0EAE2"], ["amarelo", "Amarelo", "yellow", "#F9E484"], ["vermelho", "(PRODUCT)RED", "product-red", "#D52B32"]] },
  { id: "iphone-13-pro-max", img: (k) => `iphone-13-pro-finish-select-202207-6-7inch-${k}`, cores: [["azul-sierra", "Azul-sierra", "sierrablue", "#9BB5CE"], ["grafite", "Grafite", "graphite", "#54524F"], ["dourado", "Dourado", "gold", "#F9E5C9"], ["prateado", "Prateado", "silver", "#F1F2ED"], ["verde-alpino", "Verde-alpino", "alpinegreen", "#576856"]] },
  { id: "iphone-18-pro-max", img: (k) => `iphone-18-pro-max-finish-select-${k}-202609`, cores: [["preto", "Preto", "black"], ["prateado", "Prateado", "silver"], ["glacial", "Glacial", "glacier"], ["bordo", "Bordô", "burgundy"]] },
  { id: "iphone-18-pro", img: (k) => `iphone-18-pro-finish-select-${k}-202609`, cores: [["preto", "Preto", "black"], ["prateado", "Prateado", "silver"], ["glacial", "Glacial", "glacier"], ["bordo", "Bordô", "burgundy"]] },
  { id: "iphone-17-pro-max", img: (k) => `iphone-17-pro-max-finish-select-${k}-202509`, cores: [["laranja-cosmico", "Laranja-cósmico", "cosmicorange"], ["azul-profundo", "Azul-profundo", "deepblue"], ["prateado", "Prateado", "silver"]] },
  { id: "iphone-17-pro", img: (k) => `iphone-17-pro-finish-select-${k}-202509`, cores: [["laranja-cosmico", "Laranja-cósmico", "cosmicorange"], ["azul-profundo", "Azul-profundo", "deepblue"], ["prateado", "Prateado", "silver"]] },
  { id: "iphone-17", img: (k) => `iphone-17-finish-select-${k}-202509`, cores: [["preto", "Preto", "black"], ["branco", "Branco", "white"], ["azul-nevoa", "Azul-névoa", "mistblue"], ["salvia", "Sálvia", "sage"], ["lavanda", "Lavanda", "lavender"]] },
  { id: "iphone-16-pro-max", img: (k) => `iphone-16-pro-finish-select-202409-6-9inch-${k}`, cores: [["titanio-deserto", "Titânio-deserto", "deserttitanium", "#BFA48F"], ["titanio-natural", "Titânio natural", "naturaltitanium", "#C2BCB2"], ["titanio-branco", "Titânio branco", "whitetitanium", "#F2F1ED"], ["titanio-preto", "Titânio preto", "blacktitanium", "#3C3C3D"]] },
  { id: "iphone-16-pro", img: (k) => `iphone-16-pro-finish-select-202409-6-3inch-${k}`, cores: [["titanio-deserto", "Titânio-deserto", "deserttitanium", "#BFA48F"], ["titanio-natural", "Titânio natural", "naturaltitanium", "#C2BCB2"], ["titanio-branco", "Titânio branco", "whitetitanium", "#F2F1ED"], ["titanio-preto", "Titânio preto", "blacktitanium", "#3C3C3D"]] },
  { id: "iphone-16", img: (k) => `iphone-16-finish-select-202409-6-1inch-${k}`, cores: [["ultramarino", "Ultramarino", "ultramarine", "#9AADF6"], ["verde-acinzentado", "Verde-acinzentado", "teal", "#B0D4D2"], ["rosa", "Rosa", "pink", "#F2ADDA"], ["branco", "Branco", "white", "#FAFAFA"], ["preto", "Preto", "black", "#3C4042"]] },
  { id: "iphone-15-pro-max", img: (k) => `iphone-15-pro-finish-select-202309-6-7inch-${k}`, cores: [["titanio-natural", "Titânio natural", "naturaltitanium", "#BAB4A9"], ["titanio-azul", "Titânio azul", "bluetitanium", "#3F4A58"], ["titanio-branco", "Titânio branco", "whitetitanium", "#F2F1EB"], ["titanio-preto", "Titânio preto", "blacktitanium", "#3B3B3C"]] },
  { id: "iphone-15-pro", img: (k) => `iphone-15-pro-finish-select-202309-6-1inch-${k}`, cores: [["titanio-natural", "Titânio natural", "naturaltitanium", "#BAB4A9"], ["titanio-azul", "Titânio azul", "bluetitanium", "#3F4A58"], ["titanio-branco", "Titânio branco", "whitetitanium", "#F2F1EB"], ["titanio-preto", "Titânio preto", "blacktitanium", "#3B3B3C"]] },
  { id: "iphone-15", img: (k) => `iphone-15-finish-select-202309-6-1inch-${k}`, cores: [["rosa", "Rosa", "pink", "#F4D8DC"], ["amarelo", "Amarelo", "yellow", "#F3EBC6"], ["verde", "Verde", "green", "#D5E3CF"], ["azul", "Azul", "blue", "#D3DEE6"], ["preto", "Preto", "black", "#3A3D40"]] },
  { id: "iphone-14-pro", img: (k) => `iphone-14-pro-finish-select-202209-6-1inch-${k}`, cores: [["roxo-profundo", "Roxo-profundo", "deeppurple", "#594F63"], ["dourado", "Dourado", "gold", "#F4E8CE"], ["prateado", "Prateado", "silver", "#E8E8E3"], ["preto-espacial", "Preto-espacial", "spaceblack", "#403E3D"]] },
  { id: "iphone-14", img: (k) => `iphone-14-finish-select-202209-6-1inch-${k}`, cores: [["azul", "Azul", "blue", "#A0B4C7"], ["roxo", "Roxo", "purple", "#E5DDEA"], ["meia-noite", "Meia-noite", "midnight", "#2F333A"], ["estelar", "Estelar", "starlight", "#F0EAE2"], ["amarelo", "Amarelo", "yellow", "#F9E484"], ["vermelho", "(PRODUCT)RED", "product-red", "#D52B32"]] },
  { id: "iphone-13-pro", img: (k) => `iphone-13-pro-finish-select-202207-6-1inch-${k}`, cores: [["azul-sierra", "Azul-sierra", "sierrablue", "#9BB5CE"], ["grafite", "Grafite", "graphite", "#54524F"], ["dourado", "Dourado", "gold", "#F9E5C9"], ["prateado", "Prateado", "silver", "#F1F2ED"], ["verde-alpino", "Verde-alpino", "alpinegreen", "#576856"]] },
  { id: "iphone-13", img: (k) => `iphone-13-finish-select-202207-6-1inch-${k}`, cores: [["rosa", "Rosa", "pink", "#FADDD7"], ["azul", "Azul", "blue", "#276787"], ["meia-noite", "Meia-noite", "midnight", "#232A31"], ["estelar", "Estelar", "starlight", "#FAF6F2"], ["verde", "Verde", "green", "#394C38"], ["vermelho", "(PRODUCT)RED", "product-red", "#D52B32"]] },
  {
    id: "iphone-12",
    img: (k) => (k === "red" ? "iphone-12-red-select-2020" : `iphone-12-finish-select-202207-6-1inch-${k}`),
    cores: [["azul", "Azul", "blue", "#023B63"], ["preto", "Preto", "black", "#25212B"], ["branco", "Branco", "white", "#F6F2EF"], ["verde", "Verde", "green", "#D8EFD5"], ["roxo", "Roxo", "purple", "#B7AFE6"], ["vermelho", "(PRODUCT)RED", "red", "#D52B32"]],
  },
  { id: "iphone-11", img: (k) => `iphone-11-finish-select-202207-${k}`, cores: [["roxo", "Roxo", "purple", "#D1CDDA"], ["amarelo", "Amarelo", "yellow", "#FFE681"], ["verde", "Verde", "green", "#AEE1CD"], ["preto", "Preto", "black", "#1F2020"], ["branco", "Branco", "white", "#F9F6EF"]] },
];

const existe = (p) => access(p).then(() => true, () => false);

async function baixar(nome, lado = 2000) {
  const url = `${BASE}/${nome}?wid=${lado}&hei=${lado}&fmt=png-alpha`;
  for (let tentativa = 1; tentativa <= 3; tentativa++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (r.status === 404) return null;
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return Buffer.from(await r.arrayBuffer());
    } catch (e) {
      if (tentativa === 3) throw new Error(`${nome}: ${e.message}`);
      await new Promise((r) => setTimeout(r, 600 * tentativa));
    }
  }
}

const hex2 = (v) => Math.round(v).toString(16).padStart(2, "0");

async function pixel(buf, x, y) {
  const { data, info } = await sharp(buf).extract({ left: x, top: y, width: 1, height: 1 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { r: data[0], g: data[1], b: data[2], a: data[3], canais: info.channels };
}

/**
 * Recorta o aparelho e centraliza num quadrado.
 *  - fotos novas (17/18): fundo transparente, mantido transparente
 *  - fotos antigas: faixa 16:9 cinza #F5F5F7, recortada e centralizada no mesmo cinza
 */
async function normalizarPar(png) {
  // 1) tira a borda transparente
  let { data: a, info: ia } = await sharp(png).trim({ threshold: 8 }).toBuffer({ resolveWithObject: true });
  const canto = await pixel(a, 2, 2);
  const opaco = canto.a > 250; // faixa cinza de fundo
  let fundo = { r: 0, g: 0, b: 0, alpha: 0 };
  if (opaco) {
    // 2) tira o cinza em volta do aparelho
    const t = await sharp(a).trim({ background: { r: canto.r, g: canto.g, b: canto.b }, threshold: 6 }).toBuffer({ resolveWithObject: true });
    a = t.data;
    ia = t.info;
    fundo = { ...CINZA, alpha: 1 };
  }
  const maior = Math.max(ia.width, ia.height);
  const alvo = Math.round(LADO * (1 - MARGEM * 2));
  const escalado = await sharp(a).resize({ width: Math.round((ia.width / maior) * alvo), height: Math.round((ia.height / maior) * alvo), fit: "fill", kernel: "lanczos3" }).toBuffer({ resolveWithObject: true });
  const esq = Math.round((LADO - escalado.info.width) / 2);
  const topo = Math.round((LADO - escalado.info.height) / 2);
  return sharp({ create: { width: LADO, height: LADO, channels: 4, background: fundo } })
    .composite([{ input: escalado.data, left: esq, top: topo }])
    .png()
    .toBuffer();
}

/** Vistas de detalhe: tira a moldura transparente e iguala o fundo ao cinza #F5F5F7 */
async function normalizarDetalhe(png) {
  const t = await sharp(png).trim({ threshold: 8 }).toBuffer({ resolveWithObject: true });
  const canto = await pixel(t.data, 2, 2);
  let img = sharp(t.data).flatten({ background: CINZA });
  if (canto.a > 250 && canto.r > 252 && canto.g > 252 && canto.b > 252) {
    // fundo branco puro: "multiplica" pelo cinza para o fundo ficar #F5F5F7
    const base = await img.png().toBuffer();
    const { width, height } = t.info;
    img = sharp(base).composite([{ input: { create: { width, height, channels: 3, background: CINZA } }, blend: "multiply" }]);
  }
  return img.resize(LADO, LADO, { fit: "inside" });
}

/** média de cor de um trecho liso da traseira, só para as cores sem hex oficial */
async function corMedida(pngNormalizado) {
  const regiao = { left: Math.round(LADO * 0.2), top: Math.round(LADO * 0.6), width: Math.round(LADO * 0.18), height: Math.round(LADO * 0.1) };
  const { data, info } = await sharp(pngNormalizado).extract(regiao).raw().toBuffer({ resolveWithObject: true });
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    if (info.channels === 4 && data[i + 3] < 240) continue;
    r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
  }
  return n ? `#${hex2(r / n)}${hex2(g / n)}${hex2(b / n)}` : "#888888";
}

async function processar(modelo, [slug, nome, chave, hexManual]) {
  const dir = path.join(RAIZ, "public", "fotos", modelo.id);
  await mkdir(dir, { recursive: true });
  const nomeImg = modelo.img(chave);
  const principal = path.join(dir, `${slug}.webp`);

  const bruto = await baixar(nomeImg);
  if (!bruto) throw new Error(`Imagem não encontrada: ${nomeImg}`);
  const par = await normalizarPar(bruto);
  const hex = hexManual ?? (await corMedida(par));

  if (REFAZER || !(await existe(principal))) {
    await sharp(par).webp({ quality: 88, alphaQuality: 95, effort: 5 }).toFile(principal);
  }

  // vistas extras (detalhe das câmeras etc.): _AV1, _AV2, _AV3 quando existirem
  const extras = [];
  // só a vista completa (AV1, traseira + lateral) dos modelos até o 16: as de detalhe (AV2/AV3) vêm cortadas pela Apple
  // e, nos 17 e 18, a AV1 só repete a foto principal
  const vistas = /iphone-1[78]/.test(modelo.id) ? [] : [1];
  for (const n of vistas) {
    const arq = path.join(dir, `${slug}-av${n}.webp`);
    if (!REFAZER && (await existe(arq))) { extras.push(n); continue; }
    const av = await baixar(`${nomeImg}_AV${n}`, 1400);
    if (!av || av.length < 20000) continue;
    // AV1 = traseira + lateral (aparelho pequeno na moldura): recorta como a foto principal
    const img = n === 1 ? sharp(await normalizarPar(av)) : await normalizarDetalhe(av);
    await img.webp({ quality: 86, effort: 5 }).toFile(arq);
    extras.push(n);
  }
  return { nome, slug, hex, extras };
}

async function lote(itens, fn, limite = 6) {
  const out = new Array(itens.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: limite }, async () => {
      while (i < itens.length) {
        const k = i++;
        out[k] = await fn(itens[k]);
      }
    })
  );
  return out;
}

const tarefas = MODELOS.flatMap((m) => m.cores.map((c) => ({ m, c })));
let feitas = 0;
const resultados = await lote(tarefas, async ({ m, c }) => {
  const r = await processar(m, c);
  process.stdout.write(`\r${++feitas}/${tarefas.length} ${m.id} ${c[0]}                 `);
  return { id: m.id, ...r };
});
console.log("\nfotos prontas.");

const porModelo = {};
for (const r of resultados) (porModelo[r.id] ??= []).push({ nome: r.nome, slug: r.slug, hex: r.hex, extras: r.extras });

const linhas = MODELOS.map((m) => {
  const cs = m.cores.map(([slug]) => porModelo[m.id].find((c) => c.slug === slug));
  return `  "${m.id}": [\n${cs.map((c) => `    { nome: "${c.nome}", slug: "${c.slug}", hex: "${c.hex}", extras: [${c.extras.join(", ")}] },`).join("\n")}\n  ],`;
});
const ts = `// GERADO por scripts/baixar-fotos.mjs. Não edite à mão: rode o script de novo.
import type { Cor } from "@/types";

export const CORES: Record<string, Cor[]> = {
${linhas.join("\n")}
};
`;
await writeFile(path.join(RAIZ, "src", "data", "cores.ts"), ts, "utf8");
console.log("src/data/cores.ts gerado.");
