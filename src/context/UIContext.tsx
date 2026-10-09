import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

interface Toast {
  id: number;
  titulo: string;
  texto?: string;
}

interface UIValue {
  carrinhoAberto: boolean;
  abrirCarrinho: () => void;
  fecharCarrinho: () => void;
  toast: Toast | null;
  avisar: (titulo: string, texto?: string) => void;
}

const UIContext = createContext<UIValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<number>(undefined);

  const avisar = useCallback((titulo: string, texto?: string) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), titulo, texto });
    timer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  return (
    <UIContext.Provider
      value={{
        carrinhoAberto,
        abrirCarrinho: () => setCarrinhoAberto(true),
        fecharCarrinho: () => setCarrinhoAberto(false),
        toast,
        avisar,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI precisa estar dentro de UIProvider");
  return ctx;
}
