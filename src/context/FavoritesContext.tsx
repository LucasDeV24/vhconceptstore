import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface FavValue {
  ids: string[];
  ehFavorito: (id: string) => boolean;
  alternar: (id: string) => boolean; // retorna true se passou a ser favorito
}

const FavoritesContext = createContext<FavValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useLocalStorage<string[]>("vh-favoritos", []);

  const alternar = (id: string) => {
    const vaiFavoritar = !ids.includes(id);
    setIds(vaiFavoritar ? [...ids, id] : ids.filter((x) => x !== id));
    return vaiFavoritar;
  };

  return (
    <FavoritesContext.Provider value={{ ids, ehFavorito: (id) => ids.includes(id), alternar }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritos() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavoritos precisa estar dentro de FavoritesProvider");
  return ctx;
}
