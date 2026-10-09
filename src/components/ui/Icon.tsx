const PATHS: Record<string, string> = {
  busca: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4",
  pin: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 11.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  coracao: "M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.2 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z",
  usuario: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5c1-3.6 4-5.5 7.5-5.5s6.5 1.9 7.5 5.5",
  sacola: "M5 8h14l-1 12.5H6L5 8zM9 8V6.5a3 3 0 0 1 6 0V8",
  seta: "M5 12h14M13 6l6 6-6 6",
  baixo: "M6 9l6 6 6-6",
  check: "M5 12.5l4.5 4.5L19 7.5",
  escudo: "M12 3l7 3v5.5c0 4.5-3 7.7-7 9.5-4-1.8-7-5-7-9.5V6l7-3zM9 12l2 2 4-4",
  caminhao: "M3 6.5h11v9H3zM14 9.5h4l3 3v3h-7M7 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  cartao: "M3 6.5h18v11H3zM3 10h18M6.5 14.5h4",
  pix: "M12 3.5l3.6 3.6-3.6 3.6-3.6-3.6L12 3.5zM12 13.3l3.6 3.6-3.6 3.6-3.6-3.6 3.6-3.6zM3.5 12l3.6-3.6 3.6 3.6-3.6 3.6L3.5 12zM13.3 12l3.6-3.6 3.6 3.6-3.6 3.6-3.6-3.6z",
  troca: "M4 9h13l-3-3M20 15H7l3 3",
  lupa: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4M11 8v6M8 11h6",
  fechar: "M6 6l12 12M18 6L6 18",
  mais: "M12 5v14M5 12h14",
  menos: "M5 12h14",
  lixo: "M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13",
  filtro: "M4 6h16M7 12h10M10 18h4",
  menu: "M4 7h16M4 12h16M4 17h16",
  bateria: "M3.5 8h15v8h-15zM20.5 10.5v3M6 10.5v3M9 10.5v3M12 10.5v3",
  revisado: "M9 12l2 2 4-4M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01",
  whatsapp:
    "M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5zM8.8 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.8 1.8c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5a6.5 6.5 0 0 0 3 2.6c.2.1.4 0 .5-.1l.7-.8c.2-.2.3-.2.5-.1l1.8.8c.2.1.3.2.3.4 0 .5-.2 1.2-.8 1.6-.6.4-1.5.5-2.7 0a9.6 9.6 0 0 1-4.6-4.3c-.7-1.3-.5-2.3-.1-2.9z",
};

interface Props {
  nome: keyof typeof PATHS | string;
  tamanho?: number;
  className?: string;
  preenchido?: boolean;
}

export function Icon({ nome, tamanho = 20, className, preenchido }: Props) {
  return (
    <svg
      className={className}
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill={preenchido ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[nome] ?? ""} />
    </svg>
  );
}

export function Estrelas({ nota, tamanho = 13 }: { nota: number; tamanho?: number }) {
  return (
    <span className="stars" aria-label={`${nota} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={tamanho} height={tamanho} viewBox="0 0 20 20" aria-hidden="true">
          <defs>
            <linearGradient id={`st${i}-${Math.round(nota * 10)}`}>
              <stop offset={`${Math.max(0, Math.min(1, nota - i + 1)) * 100}%`} stopColor="currentColor" />
              <stop offset={`${Math.max(0, Math.min(1, nota - i + 1)) * 100}%`} stopColor="var(--line-strong)" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#st${i}-${Math.round(nota * 10)})`}
            d="M10 1.8l2.5 5.2 5.6.7-4.1 3.9 1 5.6-5-2.7-5 2.7 1-5.6L1.9 7.7l5.6-.7z"
          />
        </svg>
      ))}
    </span>
  );
}
