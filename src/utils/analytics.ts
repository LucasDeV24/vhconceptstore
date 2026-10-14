/**
 * Google Analytics 4. Só liga se existir o ID (VITE_GA_ID, ex.: G-ABC123XYZ) na hora do build:
 * no Netlify, em Site configuration > Environment variables. Sem o ID, nada é carregado nem enviado.
 */
const ID = import.meta.env.VITE_GA_ID as string | undefined;

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: Gtag;
  }
}

export function iniciarAnalytics() {
  if (!ID || window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // o GA exige o objeto "arguments" (não um array)
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  // as visitas de página são enviadas à mão (o site troca de página sem recarregar)
  window.gtag("config", ID, { send_page_view: false });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ID)}`;
  document.head.appendChild(s);
}

export const registrarVisita = (caminho: string) => window.gtag?.("event", "page_view", { page_path: caminho, page_location: location.href, page_title: document.title });

/** Evento de conversão: o cliente abriu o WhatsApp (de um produto, do carrinho, da troca...). */
export const registrarWhatsApp = () => window.gtag?.("event", "whatsapp_click");
