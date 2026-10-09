import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";

interface Props {
  titulo: ReactNode;
  sub?: ReactNode;
  link?: { to: string; rotulo: string };
  extra?: ReactNode;
}

export function SectionHead({ titulo, sub, link, extra }: Props) {
  return (
    <div className="sec-head">
      <div>
        <h2>{titulo}</h2>
        {sub && <p>{sub}</p>}
      </div>
      <div className="sec-head-r">
        {extra}
        {link && (
          <Link to={link.to} className="see-all">
            {link.rotulo} <Icon nome="seta" tamanho={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
