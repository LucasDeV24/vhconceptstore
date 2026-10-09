import { useRef, useState } from "react";
import type { Produto } from "@/types";
import { ProductImage } from "./ProductImage";
import { Icon } from "@/components/ui/Icon";

/** Galeria com miniaturas e zoom que acompanha o cursor (toque para ampliar no celular). */
export function Gallery({ produto }: { produto: Produto }) {
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origem, setOrigem] = useState("50% 50%");
  const palco = useRef<HTMLDivElement>(null);
  const img = produto.imagens[idx] ?? produto.imagens[0];

  const mover = (e: React.PointerEvent) => {
    const r = palco.current!.getBoundingClientRect();
    setOrigem(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div className={`gallery ${produto.imagens.length > 1 ? "" : "gallery--solo"}`}>
      {produto.imagens.length > 1 && (
      <div className="gallery-thumbs" role="tablist">
        {produto.imagens.map((im, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === idx}
            className={`thumb ${i === idx ? "is-on" : ""}`}
            onClick={() => setIdx(i)}
          >
            <ProductImage produto={produto} imagem={im} />
            <span>{im.legenda}</span>
          </button>
        ))}
      </div>
      )}

      <div
        ref={palco}
        className={`gallery-stage ${zoom ? "is-zoom" : ""}`}
        onPointerMove={mover}
        onPointerEnter={(e) => e.pointerType === "mouse" && setZoom(true)}
        onPointerLeave={() => setZoom(false)}
        onClick={() => setZoom((z) => !z)}
      >
        <div className="gallery-inner" key={idx} style={{ transformOrigin: origem }}>
          <ProductImage produto={produto} imagem={img} />
        </div>
        <span className="gallery-hint">
          <Icon nome="lupa" tamanho={15} /> {zoom ? "Mova para explorar" : <><span className="hint-mouse">Passe o mouse</span><span className="hint-touch">Toque</span> para ampliar</>}
        </span>
        {img.legenda && <span className="gallery-cap">{img.legenda}</span>}
      </div>
    </div>
  );
}
