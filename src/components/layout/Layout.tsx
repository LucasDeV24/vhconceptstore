import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { Toast } from "./Toast";

export function Layout() {
  const { pathname, state } = useLocation();
  const manterScroll = (state as { manterScroll?: boolean } | null)?.manterScroll;
  useEffect(() => {
    if (!manterScroll) window.scrollTo({ top: 0 });
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
    </>
  );
}
