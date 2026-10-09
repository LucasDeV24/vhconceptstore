import { useLocalStorage } from "./useLocalStorage";
import { calcularFrete } from "@/services/frete";

/** CEP compartilhado entre header e página de produto */
export function useCep() {
  const [cep, setCep] = useLocalStorage<string>("vh-cep", "");
  return { cep, setCep, frete: calcularFrete(cep) };
}
