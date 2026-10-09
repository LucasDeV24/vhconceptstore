import { Link } from "react-router-dom";
import { LOJA } from "@/data/conteudo";
import { asset } from "@/utils/base";
import { Icon } from "@/components/ui/Icon";

const PAGAMENTOS = ["PIX", "Visa", "Mastercard", "Elo", "Amex", "Hipercard"];

export function Footer() {
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="ft-top">
          <div className="ft-brand">
            <Link to="/" className="logo logo--light">
              <img className="logo-img" src={asset("logo.webp")} alt="" width="41" height="44" />
              <span className="logo-sub">concept<br />store</span>
            </Link>
            <p>iPhones lacrados e seminovos, testados e garantidos. {LOJA.cidade} e região, com envio para todo o Brasil.</p>
            <a href={LOJA.whatsapp} target="_blank" rel="noopener" className="btn btn-wpp btn-sm">
              <Icon nome="whatsapp" tamanho={18} /> Falar no WhatsApp
            </a>
          </div>

          <nav className="ft-cols">
            <div>
              <h4>Loja</h4>
              <Link to="/loja?condicao=novo">iPhones lacrados</Link>
              <Link to="/loja?semi=1">iPhones seminovos</Link>
              <Link to="/loja?categoria=acessorio">Acessórios</Link>
              <Link to="/troca">Troque seu iPhone</Link>
            </div>
            <div>
              <h4>Atendimento</h4>
              <Link to="/suporte">Central de suporte</Link>
              <a href={LOJA.whatsapp} target="_blank" rel="noopener">WhatsApp</a>
              <Link to="/conta">Meus pedidos</Link>
            </div>
            <div>
              <h4>Políticas</h4>
              <Link to="/garantia">Garantia</Link>
              <Link to="/trocas-e-devolucoes">Trocas e devoluções</Link>
              <Link to="/privacidade">Privacidade</Link>
              <Link to="/termos">Termos de uso</Link>
            </div>
          </nav>
        </div>

        <div className="ft-pay">
          <span className="ft-label">Formas de pagamento</span>
          <div className="pay-list">
            {PAGAMENTOS.map((p) => <span key={p} className={`pay ${p === "PIX" ? "pay--pix" : ""}`}>{p}</span>)}
          </div>
        </div>

        <div className="ft-legal">
          <span>© {new Date().getFullYear()} {LOJA.nome}</span>
          <span>Não somos afiliados à Apple Inc. iPhone e AirPods são marcas da Apple Inc.</span>
        </div>
      </div>
    </footer>
  );
}
