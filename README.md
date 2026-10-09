# VH Concept Store

Loja virtual de iPhones novos e seminovos (React + TypeScript + Vite). Visual preto e dourado.

## Rodar

```bash
npm install
npm run dev        # desenvolvimento (http://localhost:5173)
npm run build      # gera a versão para publicar na pasta dist/
npm run preview    # testa a versão publicada localmente
```

## Onde mexer

| O que | Onde |
| --- | --- |
| **Tabela de preços** (lacrados e seminovos), parcelas, "consulte o valor" | `src/data/produtos.ts` (listas `LACRADOS` e `SEMINOVOS`) |
| Especificações dos modelos | `src/data/modelos.ts` |
| Cores e fotos (gerado, não edite à mão) | `src/data/cores.ts` |
| Textos, FAQ, avaliações, tabela de troca | `src/data/conteudo.ts` |
| Link do WhatsApp | `src/data/conteudo.ts` (`LOJA.whatsapp`) |
| Cores do tema (preto e dourado) | `src/styles/base.css` (bloco `:root`) |
| Trocar os dados por uma API | `src/services/api.ts` |

Os preços de iPhones em `produtos.ts` vêm da tabela de valores da loja (preço **à vista**). O parcelamento no cartão (1x a 18x, juros simples de 1,59% por parcela) é calculado em `src/data/parcelamento.ts`. Produtos sem preço (`sobConsulta: true`) mostram "Consulte o valor" e levam ao WhatsApp. **Acessórios, estoque e prazo de garantia dos seminovos não vieram da tabela** e são exemplos: confira antes de publicar.

## Fotos dos iPhones

As fotos ficam em `public/fotos/<modelo>/<cor>.webp` e são baixadas do servidor de imagens da Apple por um script:

```bash
npm run fotos            # baixa só o que falta
npm run fotos -- --refazer
```

O script recorta o aparelho, padroniza o tamanho, converte para WebP e gera `src/data/cores.ts`. Para incluir um modelo novo (por exemplo, quando sair o iPhone 18 comum), adicione uma entrada em `MODELOS` no topo de `scripts/baixar-fotos.mjs` e em `src/data/modelos.ts`.

> **Direitos de imagem:** as fotos de produto são da Apple Inc. Revendedores costumam usá-las para anunciar, mas o uso comercial formal depende das regras da Apple para revendedores. Para seminovos, o ideal é fotografar a unidade real; o site já tem o botão "Pedir fotos reais" e aceita `{ tipo: "foto", src: "..." }` em `imagens` de cada produto.

## Finalizar a compra

O botão "Comprar agora" abre o WhatsApp da loja (`wa.me/NÚMERO?text=...`) já com o iPhone escolhido, a cor, o valor à vista, a parcela e o link da página dele. O carrinho faz o mesmo com todos os aparelhos. O número fica em `LOJA.telefone` (`src/data/conteudo.ts`) e as mensagens em `src/services/whatsapp.ts`.
