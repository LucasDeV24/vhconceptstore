import { useState } from "react";
import { TROCA_BASE } from "@/data/conteudo";
import { api } from "@/services/api";
import { abrirWhatsApp } from "@/services/whatsapp";
import { useUI } from "@/context/UIContext";
import { Icon } from "@/components/ui/Icon";
import { brl } from "@/utils/format";

const GB = { "64GB": 0.9, "128GB": 1, "256GB": 1.12, "512GB": 1.25, "1TB": 1.38 } as const;
const ESTADO = { "Perfeito, sem marcas": 1, "Marcas leves de uso": 0.9, "Marcas visíveis": 0.78, "Tela ou traseira trincada": 0.55 } as const;
const BATERIA = { "90% ou mais": 1, "85% a 89%": 0.94, "80% a 84%": 0.88, "Abaixo de 80%": 0.78 } as const;

const arred = (v: number) => Math.round(v / 50) * 50;

function Campo<T extends string>({ rotulo, valor, opcoes, onChange }: { rotulo: string; valor: T; opcoes: readonly T[]; onChange: (v: T) => void }) {
  return (
    <label className="field">
      <span>{rotulo}</span>
      <select value={valor} onChange={(e) => onChange(e.target.value as T)}>
        {opcoes.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

export function TradeIn() {
  const modelos = Object.keys(TROCA_BASE);
  const [modelo, setModelo] = useState("iPhone 13");
  const [gb, setGb] = useState<keyof typeof GB>("128GB");
  const [estado, setEstado] = useState<keyof typeof ESTADO>("Marcas leves de uso");
  const [bateria, setBateria] = useState<keyof typeof BATERIA>("85% a 89%");
  const [caixa, setCaixa] = useState<"Sim" | "Não">("Não");
  const [resultado, setResultado] = useState<{ min: number; max: number } | null>(null);
  const { avisar } = useUI();

  const calcular = () => {
    const v = TROCA_BASE[modelo] * GB[gb] * ESTADO[estado] * BATERIA[bateria] * (caixa === "Sim" ? 1.03 : 1);
    setResultado({ min: arred(v * 0.94), max: arred(v * 1.04) });
  };

  const limpar = <T,>(f: (v: T) => void) => (v: T) => {
    f(v);
    setResultado(null);
  };

  const alvo = api.produtoPorId("iphone-17-novo-256gb-preto");

  const enviar = () => {
    if (!resultado) return;
    const msg = `Olá! Quero dar meu iPhone na troca: ${modelo} ${gb}, ${estado.toLowerCase()}, bateria ${bateria}, caixa: ${caixa.toLowerCase()}. A simulação no site deu entre ${brl(resultado.min)} e ${brl(resultado.max)}. Podem avaliar?`;
    abrirWhatsApp(msg);
    avisar("Abrindo o WhatsApp", "Sua simulação já vai escrita na conversa.");
  };

  return (
    <section className="trade wrap" id="troca">
      <div className="trade-copy">
        <span className="kicker"><Icon nome="troca" tamanho={16} /> Trade-in</span>
        <h2>Seu iPhone vale dinheiro.</h2>
        <p>Use seu aparelho atual como parte do pagamento.</p>
        <ol className="trade-steps">
          <li><b>1</b> Simule aqui</li>
          <li><b>2</b> A gente confirma vendo o aparelho</li>
          <li><b>3</b> O valor sai na hora do seu novo iPhone</li>
        </ol>
      </div>

      <form className="trade-form" onSubmit={(e) => { e.preventDefault(); calcular(); }}>
        <Campo rotulo="Qual seu iPhone?" valor={modelo} opcoes={modelos} onChange={limpar(setModelo)} />
        <div className="field-row">
          <Campo rotulo="Armazenamento" valor={gb} opcoes={Object.keys(GB) as (keyof typeof GB)[]} onChange={limpar(setGb)} />
          <div className="field">
            <span>Possui caixa?</span>
            <div className="seg-mini" role="radiogroup">
              {(["Sim", "Não"] as const).map((c) => (
                <button type="button" key={c} role="radio" aria-checked={caixa === c} className={caixa === c ? "is-on" : ""} onClick={() => limpar(setCaixa)(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Campo rotulo="Estado" valor={estado} opcoes={Object.keys(ESTADO) as (keyof typeof ESTADO)[]} onChange={limpar(setEstado)} />
        <Campo rotulo="Saúde da bateria" valor={bateria} opcoes={Object.keys(BATERIA) as (keyof typeof BATERIA)[]} onChange={limpar(setBateria)} />

        {resultado ? (
          <div className="trade-result">
            <span>Estimativa para o seu {modelo}</span>
            <b>{brl(resultado.min)} – {brl(resultado.max)}</b>
            {alvo && (
              <small>
                Exemplo: um {alvo.nome} {alvo.armazenamento} novo sairia a partir de{" "}
                <strong>{brl(Math.max(0, alvo.preco - resultado.max))}</strong>
              </small>
            )}
            <button type="button" className="btn btn-wpp btn-block" onClick={enviar}>
              <Icon nome="whatsapp" tamanho={18} /> Confirmar avaliação no WhatsApp
            </button>
            <p className="fine">Valor estimado. O valor final é confirmado após a avaliação do aparelho.</p>
          </div>
        ) : (
          <button className="btn btn-accent btn-block btn-lg">Calcular valor</button>
        )}
      </form>
    </section>
  );
}
