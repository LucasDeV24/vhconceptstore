import { useEffect, useRef, useState } from "react";
import type { FiltrosCatalogo, Produto } from "@/types";
import { api } from "@/services/api";

export function useProdutos(filtros: FiltrosCatalogo) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const chave = JSON.stringify(filtros);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    api.listarProdutos(JSON.parse(chave)).then((r) => {
      if (!ativo) return;
      setProdutos(r);
      setCarregando(false);
    });
    return () => {
      ativo = false;
    };
  }, [chave]);

  return { produtos, carregando };
}

export function useProduto(id: string | undefined) {
  const [produto, setProduto] = useState<Produto | undefined>();
  const [carregando, setCarregando] = useState(true);
  const jaCarregou = useRef(false);

  useEffect(() => {
    if (!id) return;
    // troca de variação (cor/GB) dentro da página: sem skeleton, resposta imediata
    if (jaCarregou.current) {
      setProduto(api.produtoPorId(id));
      return;
    }
    jaCarregou.current = true;
    let ativo = true;
    setCarregando(true);
    api.obterProduto(id).then((p) => {
      if (!ativo) return;
      setProduto(p);
      setCarregando(false);
    });
    return () => {
      ativo = false;
    };
  }, [id]);

  return { produto, carregando };
}
