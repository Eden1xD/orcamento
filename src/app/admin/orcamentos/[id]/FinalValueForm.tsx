"use client";

import { useState } from "react";
import { updateQuoteFinalValue } from "@/server/actions";

export default function FinalValueForm({
  quoteId,
  current,
}: {
  quoteId: string;
  current: number | null;
}) {
  const [value, setValue] = useState(
    current != null ? (current / 100).toString() : "",
  );

  return (
    <form action={updateQuoteFinalValue} className="flex gap-2">
      <input type="hidden" name="id" value={quoteId} />
      <input
        type="hidden"
        name="finalValue"
        value={Math.round((parseFloat(value.replace(/\D/g, "")) || 0) * 100)}
      />
      <input
        className="field flex-1"
        inputMode="numeric"
        placeholder="Valor final (R$) — vazio = sem fechamento"
        value={value}
        onChange={(e) => setValue(e.target.value.replace(/[^\d.,]/g, "").replace(",", "."))}
      />
      <button
        type="submit"
        className="h-10 rounded-md border border-line px-4 text-[12px] font-medium text-ice transition-colors hover:border-cobalt hover:bg-cobalt/10"
      >
        Salvar
      </button>
    </form>
  );
}
