import { useState } from "react";
import { FAQ } from "@/data/conteudo";
import { Icon } from "@/components/ui/Icon";
import { linkWhatsApp } from "@/services/whatsapp";

export function Faq() {
  const [aberto, setAberto] = useState<number | null>(0);
  return (
    <section className="sec wrap faq" id="faq">
      <div className="faq-side">
        <h2>Perguntas frequentes</h2>
        <p>Não achou sua dúvida? A gente responde rápido.</p>
        <a href={linkWhatsApp()} target="_blank" rel="noopener" className="btn btn-ghost">
          <Icon nome="whatsapp" tamanho={18} /> Perguntar no WhatsApp
        </a>
      </div>
      <div className="faq-list">
        {FAQ.map((f, i) => (
          <div key={f.p} className={`acc ${aberto === i ? "is-open" : ""}`}>
            <button type="button" aria-expanded={aberto === i} onClick={() => setAberto(aberto === i ? null : i)}>
              {f.p}
              <Icon nome="mais" tamanho={18} />
            </button>
            <div className="acc-body"><div><p>{f.r}</p></div></div>
          </div>
        ))}
      </div>
    </section>
  );
}
