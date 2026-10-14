import { useProdutos } from "@/hooks/useProdutos";
import { Hero } from "@/components/home/Hero";
import { CategoryShortcuts } from "@/components/home/CategoryShortcuts";
import { TrustBar } from "@/components/home/TrustBar";
import { WeeklyOffers } from "@/components/home/WeeklyOffers";
import { Compare } from "@/components/home/Compare";
import { TradeIn } from "@/components/home/TradeIn";
import { Faq } from "@/components/home/Faq";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHead } from "@/components/ui/SectionHead";

export default function Home() {
  const { produtos, carregando } = useProdutos({ ordenacao: "mais-vendidos" });
  const iphones = produtos.filter((p) => p.categoria === "iphone");
  const novos = iphones.filter((p) => p.condicao === "novo");
  const semis = iphones.filter((p) => p.condicao !== "novo");

  return (
    <>
      <Hero />
      <CategoryShortcuts />
      <TrustBar />

      <section className="sec wrap">
        <SectionHead titulo="Lacrados mais procurados" link={{ to: "/loja", rotulo: "Ver todos" }} />
        <ProductGrid produtos={novos} carregando={carregando} limite={8} />
      </section>

      <WeeklyOffers produtos={produtos} />

      <section className="sec semis-sec">
        <div className="wrap">
          <SectionHead
            titulo="Seminovos selecionados"
            sub="Testados e garantidos. Peça no WhatsApp as fotos reais e a saúde da bateria do aparelho que escolher."
            link={{ to: "/loja?semi=1", rotulo: "Ver todos os seminovos" }}
          />
          <ProductGrid produtos={semis} carregando={carregando} limite={8} />
        </div>
      </section>

      <Compare />
      <TradeIn />
      <Faq />
    </>
  );
}
