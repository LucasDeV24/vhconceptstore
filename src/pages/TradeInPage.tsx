import { TradeIn } from "@/components/home/TradeIn";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHead } from "@/components/ui/SectionHead";
import { useProdutos } from "@/hooks/useProdutos";

export default function TradeInPage() {
  const { produtos, carregando } = useProdutos({ categoria: "iphone", condicoes: ["novo"], ordenacao: "lancamentos" });
  return (
    <>
      <div className="page-top" />
      <TradeIn />
      <section className="sec wrap">
        <SectionHead titulo="Escolha seu próximo iPhone" link={{ to: "/loja", rotulo: "Ver todos" }} />
        <ProductGrid produtos={produtos} carregando={carregando} limite={4} />
      </section>
    </>
  );
}
