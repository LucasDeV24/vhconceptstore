import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UIProvider } from "@/context/UIContext";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import ProductPage from "@/pages/ProductPage";
import Favorites from "@/pages/Favorites";
import Account from "@/pages/Account";
import InfoPage from "@/pages/InfoPage";
import TradeInPage from "@/pages/TradeInPage";
import NotFound from "@/pages/NotFound";

const INFO = ["garantia", "suporte", "trocas-e-devolucoes", "privacidade", "termos"];

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <UIProvider>
        <FavoritesProvider>
          <CartProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="loja" element={<Catalog />} />
                <Route path="produto/:id" element={<ProductPage />} />
                <Route path="favoritos" element={<Favorites />} />
                <Route path="conta" element={<Account />} />
                <Route path="troca" element={<TradeInPage />} />
                {INFO.map((s) => <Route key={s} path={s} element={<InfoPage />} />)}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </CartProvider>
        </FavoritesProvider>
      </UIProvider>
    </BrowserRouter>
  );
}
