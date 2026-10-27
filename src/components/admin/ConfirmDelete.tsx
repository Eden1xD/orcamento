"use client";

import { useState } from "react";

type ServerFormAction = (formData: FormData) => Promise<void>;

export default function ConfirmDelete({
  action,
  id,
  label = "Excluir",
  className = "",
}: {
  action: ServerFormAction;
  id: string;
  label?: string;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);

  if (!armed) {
    return (
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className={`rounded-md border border-line px-3 py-1.5 text-[12px] text-steel transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 ${className}`}
        >
          {label}
        </button>
      </form>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <button
        onClick={() => setArmed(false)}
        className="rounded-md border border-line px-3 py-1.5 text-[12px] text-steel transition-colors hover:text-ice"
      >
        Cancelar
      </button>
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="rounded-md bg-red-500 px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-red-400"
        >
          Confirmar exclusão
        </button>
      </form>
    </span>
  );
}
