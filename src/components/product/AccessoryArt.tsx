import { useId } from "react";
import { tom } from "@/utils/cor";

interface Props {
  tipo: string;
  cor: string;
  detalhe?: boolean;
}

/** Ilustrações simples dos acessórios, até entrarem as fotos reais. */
export function AccessoryArt({ tipo, cor, detalhe }: Props) {
  const id = useId().replace(/:/g, "");
  const vb = detalhe ? "50 30 100 100" : "0 0 200 200";

  const desenho = () => {
    switch (tipo) {
      case "capa":
        return (
          <g>
            <rect x="58" y="14" width="84" height="172" rx="20" fill={cor} opacity={cor.startsWith("#D") || cor.startsWith("#E") ? 0.7 : 1} />
            <rect x="58" y="14" width="84" height="172" rx="20" fill={`url(#${id}-s)`} />
            <rect x="66" y="22" width="40" height="40" rx="12" fill={tom(cor, -0.3)} opacity=".55" />
            <circle cx="100" cy="112" r="24" fill="none" stroke={tom(cor, -0.25)} strokeWidth="2" opacity=".6" />
            <path d="M100 136v10" stroke={tom(cor, -0.25)} strokeWidth="2" opacity=".6" />
          </g>
        );
      case "carregador":
        return (
          <g>
            <rect x="62" y="56" width="76" height="76" rx="14" fill="#fbfbf9" stroke="#d9d7d0" />
            <rect x="62" y="56" width="76" height="76" rx="14" fill={`url(#${id}-s)`} />
            <rect x="86" y="88" width="28" height="10" rx="5" fill="#2a2a2c" />
            <rect x="80" y="132" width="9" height="26" rx="4" fill="#c8c6bf" />
            <rect x="111" y="132" width="9" height="26" rx="4" fill="#c8c6bf" />
          </g>
        );
      case "cabo":
        return (
          <g fill="none" strokeLinecap="round">
            <path d="M48 150 C 20 90, 120 40, 150 80 S 110 170, 70 120 S 120 40, 160 60" stroke="#ecebe6" strokeWidth="9" />
            <path d="M48 150 C 20 90, 120 40, 150 80 S 110 170, 70 120 S 120 40, 160 60" stroke="#d3d1ca" strokeWidth="9" strokeDasharray="2 4" />
            <rect x="38" y="148" width="20" height="34" rx="6" fill="#f7f6f2" stroke="#cfcdc6" />
            <rect x="152" y="34" width="20" height="34" rx="6" fill="#f7f6f2" stroke="#cfcdc6" transform="rotate(20 162 51)" />
          </g>
        );
      case "pelicula":
        return (
          <g>
            <rect x="56" y="14" width="88" height="172" rx="22" fill="#e9f0f3" stroke="#c4d0d6" />
            <path d="M70 40 L120 20 M66 90 L140 52 M70 150 L140 112" stroke="#fff" strokeWidth="6" opacity=".8" />
            <rect x="84" y="22" width="32" height="8" rx="4" fill="#c4d0d6" />
          </g>
        );
      case "magsafe":
        return (
          <g>
            <path d="M100 136 C 100 170, 160 160, 170 190" fill="none" stroke="#ecebe6" strokeWidth="6" strokeLinecap="round" />
            <circle cx="100" cy="90" r="52" fill="#f7f6f2" stroke="#d6d4cd" />
            <circle cx="100" cy="90" r="40" fill="none" stroke="#d6d4cd" strokeWidth="2" />
            <circle cx="100" cy="90" r="52" fill={`url(#${id}-s)`} />
          </g>
        );
      default: // fone
        return (
          <g>
            <rect x="54" y="52" width="92" height="100" rx="30" fill="#fbfbf9" stroke="#d9d7d0" />
            <path d="M54 88 h92" stroke="#d9d7d0" />
            <rect x="54" y="52" width="92" height="100" rx="30" fill={`url(#${id}-s)`} />
            <circle cx="100" cy="112" r="3" fill="#7bd88f" />
          </g>
        );
    }
  };

  return (
    <div className="phone-art phone-art--acc">
      <svg viewBox={vb} role="img" aria-label="Acessório">
        <defs>
          <linearGradient id={`${id}-s`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".45" />
            <stop offset=".5" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity=".12" />
          </linearGradient>
        </defs>
        {desenho()}
      </svg>
    </div>
  );
}
