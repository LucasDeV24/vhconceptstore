import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="wrap page empty" style={{ padding: "100px 0" }}>
      <h1>Página não encontrada</h1>
      <p className="muted">O link pode estar errado ou o produto já foi vendido.</p>
      <Link to="/loja" className="btn btn-dark">Ver iPhones</Link>
    </div>
  );
}
