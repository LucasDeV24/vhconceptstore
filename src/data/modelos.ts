import type { Cor, Modelo } from "@/types";
import { CORES } from "./cores";

/**
 * Especificações segundo a Apple (apple.com/br). Autonomia = reprodução de vídeo.
 * As cores e fotos vêm de cores.ts (gerado por scripts/baixar-fotos.mjs).
 * Observação: ainda não existe um "iPhone 18" comum, só o 18 Pro e o 18 Pro Max.
 */
type Def = Omit<Modelo, "cores">;

const DEFS: Def[] = [
  { id: "iphone-18-pro-max", nome: "iPhone 18 Pro Max", linha: "18", ano: 2026, tela: 6.9, painel: "OLED ProMotion 120Hz", chip: "A20 Pro", camera: "Tripla Fusion 48MP, zoom 4x", qtdCameras: 3, bateriaVideo: 43, conector: "USB-C (USB 3)", cincoG: true, dynamicIsland: true },
  { id: "iphone-18-pro", nome: "iPhone 18 Pro", linha: "18", ano: 2026, tela: 6.3, painel: "OLED ProMotion 120Hz", chip: "A20 Pro", camera: "Tripla Fusion 48MP, zoom 4x", qtdCameras: 3, bateriaVideo: 34, conector: "USB-C (USB 3)", cincoG: true, dynamicIsland: true },
  { id: "iphone-17-pro-max", nome: "iPhone 17 Pro Max", linha: "17", ano: 2025, tela: 6.9, painel: "OLED ProMotion 120Hz", chip: "A19 Pro", camera: "Tripla 48MP, zoom 4x", qtdCameras: 3, bateriaVideo: 39, conector: "USB-C (USB 3)", cincoG: true, dynamicIsland: true },
  { id: "iphone-17-pro", nome: "iPhone 17 Pro", linha: "17", ano: 2025, tela: 6.3, painel: "OLED ProMotion 120Hz", chip: "A19 Pro", camera: "Tripla 48MP, zoom 4x", qtdCameras: 3, bateriaVideo: 33, conector: "USB-C (USB 3)", cincoG: true, dynamicIsland: true },
  { id: "iphone-17", nome: "iPhone 17", linha: "17", ano: 2025, tela: 6.3, painel: "OLED ProMotion 120Hz", chip: "A19", camera: "Dupla Fusion 48MP", qtdCameras: 2, bateriaVideo: 30, conector: "USB-C (USB 2)", cincoG: true, dynamicIsland: true },
  { id: "iphone-16-pro-max", nome: "iPhone 16 Pro Max", linha: "16", ano: 2024, tela: 6.9, painel: "OLED ProMotion 120Hz", chip: "A18 Pro", camera: "Tripla 48MP, zoom 5x", qtdCameras: 3, bateriaVideo: 33, conector: "USB-C (USB 3)", cincoG: true, dynamicIsland: true },
  { id: "iphone-16-pro", nome: "iPhone 16 Pro", linha: "16", ano: 2024, tela: 6.3, painel: "OLED ProMotion 120Hz", chip: "A18 Pro", camera: "Tripla 48MP, zoom 5x", qtdCameras: 3, bateriaVideo: 27, conector: "USB-C (USB 3)", cincoG: true, dynamicIsland: true },
  { id: "iphone-16", nome: "iPhone 16", linha: "16", ano: 2024, tela: 6.1, painel: "OLED Super Retina XDR", chip: "A18", camera: "Dupla 48MP, zoom 2x", qtdCameras: 2, bateriaVideo: 22, conector: "USB-C (USB 2)", cincoG: true, dynamicIsland: true },
  { id: "iphone-15-pro-max", nome: "iPhone 15 Pro Max", linha: "15", ano: 2023, tela: 6.7, painel: "OLED ProMotion 120Hz", chip: "A17 Pro", camera: "Tripla 48MP, zoom 5x", qtdCameras: 3, bateriaVideo: 29, conector: "USB-C (USB 3)", cincoG: true, dynamicIsland: true },
  { id: "iphone-15-pro", nome: "iPhone 15 Pro", linha: "15", ano: 2023, tela: 6.1, painel: "OLED ProMotion 120Hz", chip: "A17 Pro", camera: "Tripla 48MP, zoom 3x", qtdCameras: 3, bateriaVideo: 23, conector: "USB-C (USB 3)", cincoG: true, dynamicIsland: true },
  { id: "iphone-15", nome: "iPhone 15", linha: "15", ano: 2023, tela: 6.1, painel: "OLED Super Retina XDR", chip: "A16 Bionic", camera: "Dupla 48MP, zoom 2x", qtdCameras: 2, bateriaVideo: 20, conector: "USB-C (USB 2)", cincoG: true, dynamicIsland: true },
  { id: "iphone-14-pro", nome: "iPhone 14 Pro", linha: "14", ano: 2022, tela: 6.1, painel: "OLED ProMotion 120Hz", chip: "A16 Bionic", camera: "Tripla 48MP, zoom 3x", qtdCameras: 3, bateriaVideo: 23, conector: "Lightning", cincoG: true, dynamicIsland: true },
  { id: "iphone-14", nome: "iPhone 14", linha: "14", ano: 2022, tela: 6.1, painel: "OLED Super Retina XDR", chip: "A15 Bionic", camera: "Dupla 12MP", qtdCameras: 2, bateriaVideo: 20, conector: "Lightning", cincoG: true, dynamicIsland: false },
  { id: "iphone-13-pro", nome: "iPhone 13 Pro", linha: "13", ano: 2021, tela: 6.1, painel: "OLED ProMotion 120Hz", chip: "A15 Bionic", camera: "Tripla 12MP, zoom 3x", qtdCameras: 3, bateriaVideo: 22, conector: "Lightning", cincoG: true, dynamicIsland: false },
  { id: "iphone-13", nome: "iPhone 13", linha: "13", ano: 2021, tela: 6.1, painel: "OLED Super Retina XDR", chip: "A15 Bionic", camera: "Dupla 12MP", qtdCameras: 2, bateriaVideo: 19, conector: "Lightning", cincoG: true, dynamicIsland: false },
  { id: "iphone-air", nome: "iPhone Air", linha: "17", ano: 2025, tela: 6.5, painel: "OLED ProMotion 120Hz", chip: "A19 Pro", camera: "Fusion 48MP", qtdCameras: 1, bateriaVideo: 27, conector: "USB-C (USB 2)", cincoG: true, dynamicIsland: true },
  { id: "iphone-15-plus", nome: "iPhone 15 Plus", linha: "15", ano: 2023, tela: 6.7, painel: "OLED Super Retina XDR", chip: "A16 Bionic", camera: "Dupla 48MP, zoom 2x", qtdCameras: 2, bateriaVideo: 26, conector: "USB-C (USB 2)", cincoG: true, dynamicIsland: true },
  { id: "iphone-14-pro-max", nome: "iPhone 14 Pro Max", linha: "14", ano: 2022, tela: 6.7, painel: "OLED ProMotion 120Hz", chip: "A16 Bionic", camera: "Tripla 48MP, zoom 3x", qtdCameras: 3, bateriaVideo: 29, conector: "Lightning", cincoG: true, dynamicIsland: true },
  { id: "iphone-14-plus", nome: "iPhone 14 Plus", linha: "14", ano: 2022, tela: 6.7, painel: "OLED Super Retina XDR", chip: "A15 Bionic", camera: "Dupla 12MP", qtdCameras: 2, bateriaVideo: 26, conector: "Lightning", cincoG: true, dynamicIsland: false },
  { id: "iphone-13-pro-max", nome: "iPhone 13 Pro Max", linha: "13", ano: 2021, tela: 6.7, painel: "OLED ProMotion 120Hz", chip: "A15 Bionic", camera: "Tripla 12MP, zoom 3x", qtdCameras: 3, bateriaVideo: 28, conector: "Lightning", cincoG: true, dynamicIsland: false },
  { id: "iphone-12-pro-max", nome: "iPhone 12 Pro Max", linha: "12", ano: 2020, tela: 6.7, painel: "OLED Super Retina XDR", chip: "A14 Bionic", camera: "Tripla 12MP, zoom 2,5x", qtdCameras: 3, bateriaVideo: 20, conector: "Lightning", cincoG: true, dynamicIsland: false },
  { id: "iphone-12-pro", nome: "iPhone 12 Pro", linha: "12", ano: 2020, tela: 6.1, painel: "OLED Super Retina XDR", chip: "A14 Bionic", camera: "Tripla 12MP, zoom 2x", qtdCameras: 3, bateriaVideo: 17, conector: "Lightning", cincoG: true, dynamicIsland: false },
  { id: "iphone-12", nome: "iPhone 12", linha: "12", ano: 2020, tela: 6.1, painel: "OLED Super Retina XDR", chip: "A14 Bionic", camera: "Dupla 12MP", qtdCameras: 2, bateriaVideo: 17, conector: "Lightning", cincoG: true, dynamicIsland: false },
  { id: "iphone-11", nome: "iPhone 11", linha: "11", ano: 2019, tela: 6.1, painel: "LCD Liquid Retina", chip: "A13 Bionic", camera: "Dupla 12MP", qtdCameras: 2, bateriaVideo: 17, conector: "Lightning", cincoG: false, dynamicIsland: false },
];

/** Sem foto oficial da Apple disponível: o site mostra o quadro "Foto em breve" até você enviar fotos. */
const SEM_FOTO: Record<string, Cor[]> = {
  "iphone-12-pro-max": [
    { nome: "Dourado", slug: "dourado", hex: "#E3C9A5" }, { nome: "Grafite", slug: "grafite", hex: "#54524F" },
    { nome: "Azul-pacífico", slug: "azul-pacifico", hex: "#2E4A5F" }, { nome: "Prateado", slug: "prateado", hex: "#E3E3E0" },
  ],
  "iphone-12-pro": [
    { nome: "Grafite", slug: "grafite", hex: "#54524F" }, { nome: "Azul-pacífico", slug: "azul-pacifico", hex: "#2E4A5F" },
    { nome: "Dourado", slug: "dourado", hex: "#E3C9A5" }, { nome: "Prateado", slug: "prateado", hex: "#E3E3E0" },
  ],
};

export const MODELOS: Modelo[] = DEFS.map((d) => ({ ...d, cores: CORES[d.id] ?? SEM_FOTO[d.id] }));

export const getModelo = (id: string) => MODELOS.find((m) => m.id === id);
export const LINHAS = ["18", "17", "16", "15", "14", "13", "12", "11"];
