import { useCallback, useEffect, useState } from "react";

const EVENTO = "vh-storage";

function ler<T>(chave: string, inicial: T): T {
  try {
    const salvo = localStorage.getItem(chave);
    return salvo ? (JSON.parse(salvo) as T) : inicial;
  } catch {
    return inicial;
  }
}

/** Estado persistido no navegador e sincronizado entre componentes que usam a mesma chave. */
export function useLocalStorage<T>(chave: string, inicial: T) {
  const [valor, setValorLocal] = useState<T>(() => ler(chave, inicial));

  useEffect(() => {
    const sync = (e: Event) => {
      const det = (e as CustomEvent<{ chave: string; valor: T }>).detail;
      if (det?.chave === chave) setValorLocal(det.valor);
    };
    window.addEventListener(EVENTO, sync);
    return () => window.removeEventListener(EVENTO, sync);
  }, [chave]);

  const setValor = useCallback(
    (novo: T | ((atual: T) => T)) => {
      setValorLocal((atual) => {
        const proximo = typeof novo === "function" ? (novo as (a: T) => T)(atual) : novo;
        try {
          localStorage.setItem(chave, JSON.stringify(proximo));
        } catch {
          /* modo privado ou armazenamento bloqueado */
        }
        queueMicrotask(() => window.dispatchEvent(new CustomEvent(EVENTO, { detail: { chave, valor: proximo } })));
        return proximo;
      });
    },
    [chave]
  );

  return [valor, setValor] as const;
}
