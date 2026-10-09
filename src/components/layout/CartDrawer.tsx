import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import { ProductImage } from "@/components/product/ProductImage";
import { GradeBadge } from "@/components/product/GradeBadge";
import { Icon } from "@/components/ui/Icon";
import { brl, brlCentavos, plural } from "@/utils/format";
import { abrirWhatsApp, mensagemPedido } from "@/services/whatsapp";

export function CartDrawer() {
  const { linhas, subtotal, valorParcela, quantidadeTotal, maxParcelas, alterarQuantidade, remover } = useCart();
  const { carrinhoAberto, fecharCarrinho, avisar } = useUI();

  useEffect(() => {
    document.body.style.overflow = carrinhoAberto ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && fecharCarrinho();
    if (carrinhoAberto) window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [carrinhoAberto, fecharCarrinho]);

  const finalizar = () => {
    abrirWhatsApp(mensagemPedido(linhas, subtotal, valorParcela, maxParcelas));
    avisar("Abrindo o WhatsApp", "Seu pedido já vai escrito na conversa.");
  };

  return (
    <>
      <div className={`drawer-mask ${carrinhoAberto ? "is-open" : ""}`} onClick={fecharCarrinho} />
      <aside className={`cart ${carrinhoAberto ? "is-open" : ""}`} aria-hidden={!carrinhoAberto} aria-label="Carrinho">
        <header className="cart-hd">
          <h2>Carrinho <span className="muted">{quantidadeTotal > 0 && `· ${plural(quantidadeTotal, "item", "itens")}`}</span></h2>
          <button type="button" className="hd-ico" aria-label="Fechar carrinho" onClick={fecharCarrinho}>
            <Icon nome="fechar" tamanho={22} />
          </button>
        </header>

        {linhas.length === 0 ? (
          <div className="cart-empty">
            <Icon nome="sacola" tamanho={40} />
            <h3>Seu carrinho está vazio</h3>
            <p className="muted">Que tal começar pelos mais vendidos?</p>
            <Link to="/loja" className="btn btn-dark" onClick={fecharCarrinho}>Ver iPhones</Link>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {linhas.map(({ produto: p, quantidade }) => (
                <li key={p.id} className="cart-line">
                  <Link to={`/produto/${p.id}`} className="cart-thumb" onClick={fecharCarrinho}>
                    <ProductImage produto={p} />
                  </Link>
                  <div className="cart-info">
                    <Link to={`/produto/${p.id}`} onClick={fecharCarrinho}><b>{p.nome}</b></Link>
                    <small className="muted">{[p.armazenamento, p.cor.nome].filter(Boolean).join(" · ")}</small>
                    <GradeBadge condicao={p.condicao} dica={false} acessorio={p.categoria === "acessorio"} />
                    <div className="cart-row">
                      <div className="stepper" aria-label="Quantidade">
                        <button type="button" aria-label="Diminuir" onClick={() => alterarQuantidade(p.id, quantidade - 1)}>
                          <Icon nome={quantidade === 1 ? "lixo" : "menos"} tamanho={14} />
                        </button>
                        <span>{quantidade}</span>
                        <button type="button" aria-label="Aumentar" disabled={quantidade >= p.estoque} onClick={() => alterarQuantidade(p.id, quantidade + 1)}>
                          <Icon nome="mais" tamanho={14} />
                        </button>
                      </div>
                      <b className="cart-price">{brl(p.preco * quantidade)}</b>
                    </div>
                    {p.estoque === 1 && <small className="muted">Unidade única</small>}
                  </div>
                  <button type="button" className="cart-x" aria-label={`Remover ${p.nome}`} onClick={() => remover(p.id)}>
                    <Icon nome="fechar" tamanho={16} />
                  </button>
                </li>
              ))}
            </ul>

            <footer className="cart-ft">
              <div className="cart-total">
                <div>
                  <span className="muted">Total à vista</span>
                  <b>{brlCentavos(subtotal)}</b>
                </div>
                <small className="muted">ou em até {maxParcelas}x de {brlCentavos(valorParcela)} no cartão (com juros)</small>
              </div>
              <button type="button" className="btn btn-wpp btn-block btn-lg" onClick={finalizar}>
                <Icon nome="whatsapp" tamanho={20} /> Finalizar pelo WhatsApp
              </button>
              <button type="button" className="btn btn-ghost btn-block" onClick={fecharCarrinho}>Continuar comprando</button>
              <p className="cart-note"><Icon nome="escudo" tamanho={14} /> Pagamento e entrega combinados direto com a loja.</p>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
