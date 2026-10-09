import { useState } from "react";
import { useFavoritos } from "@/context/FavoritesContext";
import { useUI } from "@/context/UIContext";
import { Icon } from "@/components/ui/Icon";

export function FavButton({ id, nome }: { id: string; nome: string }) {
  const { ehFavorito, alternar } = useFavoritos();
  const { avisar } = useUI();
  const [pulso, setPulso] = useState(false);
  const ativo = ehFavorito(id);

  return (
    <button
      type="button"
      className={`fav ${ativo ? "is-on" : ""} ${pulso ? "pulse" : ""}`}
      aria-label={ativo ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      aria-pressed={ativo}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const agora = alternar(id);
        if (agora) {
          setPulso(true);
          setTimeout(() => setPulso(false), 450);
          avisar("Salvo nos favoritos", nome);
        }
      }}
    >
      <Icon nome="coracao" tamanho={18} preenchido={ativo} />
    </button>
  );
}
