import { useUI } from "@/context/UIContext";
import { Icon } from "@/components/ui/Icon";

export function Toast() {
  const { toast } = useUI();
  return (
    <div className="toast-zone" role="status" aria-live="polite">
      {toast && (
        <div className="toast" key={toast.id}>
          <span className="toast-ico"><Icon nome="check" tamanho={14} /></span>
          <span>
            <b>{toast.titulo}</b>
            {toast.texto && <small>{toast.texto}</small>}
          </span>
        </div>
      )}
    </div>
  );
}
