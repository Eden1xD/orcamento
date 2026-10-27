"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { formatBRL, formatDate, formatDateTime, QUOTE_STATUS_LABEL, TIMELINE_LABEL } from "@/lib/format";

type Tracked = {
  protocol: string;
  status: string;
  statusLabel: string;
  baseValue: number;
  finalValue: number | null;
  createdAt: string;
  clientName: string;
  serviceName: string | null;
  timeline: string | null;
  events: { status: string; note: string | null; createdAt: string }[];
};

const STATUS_STEP: Record<string, number> = {
  novo: 1,
  analise: 2,
  aprovado: 3,
  concluido: 4,
  recusado: 2,
};

export default function TrackClient({
  initialProtocol,
}: {
  initialProtocol: string;
}) {
  const [protocol, setProtocol] = useState(initialProtocol);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Tracked | null>(null);
  const reduced = useReducedMotion();

  async function search() {
    if (!protocol.trim() || !email.trim()) {
      setError("Preencha o protocolo e o e-mail.");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/quotes/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ protocol: protocol.trim().toUpperCase(), email: email.trim() }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error || "Não encontramos essa solicitação.");
        return;
      }
      setData(json.quote);
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const step = data ? STATUS_STEP[data.status] ?? 1 : 0;

  return (
    <div className="mt-10">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <input
          className="field"
          placeholder="Protocolo — ex.: VTR-2025-AB3K9X"
          value={protocol}
          onChange={(e) => setProtocol(e.target.value.toUpperCase())}
          style={{ fontFamily: "var(--font-geist-mono)" }}
        />
        <input
          className="field"
          placeholder="E-mail utilizado"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={search}
          disabled={loading}
          className="inline-flex h-[46px] items-center justify-center gap-2 rounded-md bg-cobalt px-6 text-[14px] font-medium text-ice transition-all hover:bg-cobalt-soft disabled:opacity-50"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-ice/30 border-t-ice" />
          ) : (
            "Buscar"
          )}
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-md border border-red-500/25 bg-red-500/10 px-4 py-2.5 text-[13px] text-red-300">
          {error}
        </p>
      )}

      <AnimatePresence>
        {data && (
          <motion.div
            key={data.protocol}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="mt-8 overflow-hidden rounded-lg border border-line bg-charcoal/80"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-5">
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-steel-dim">
                  PROTOCOLO
                </p>
                <p className="mt-1 font-mono text-lg font-medium tracking-wider text-ice">
                  {data.protocol}
                </p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-[12px] font-medium ${
                  data.status === "aprovado" || data.status === "concluido"
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                    : data.status === "recusado"
                      ? "border-red-400/30 bg-red-400/10 text-red-300"
                      : "border-cobalt/30 bg-cobalt/10 text-cobalt-soft"
                }`}
              >
                {data.statusLabel}
              </span>
            </div>

            <div className="grid gap-6 px-6 py-6 sm:grid-cols-3">
              <div>
                <p className="text-[12px] text-steel">Serviço</p>
                <p className="mt-1 text-[14px] font-medium text-ice">
                  {data.serviceName || "A definir"}
                </p>
              </div>
              <div>
                <p className="text-[12px] text-steel">Recebido em</p>
                <p className="mt-1 text-[14px] font-medium text-ice">
                  {formatDate(data.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-[12px] text-steel">
                  {data.finalValue ? "Valor acordado" : "Estimativa inicial"}
                </p>
                <p className="mt-1 font-mono text-[14px] font-medium text-cobalt-soft">
                  {formatBRL(data.finalValue ?? data.baseValue)}
                </p>
              </div>
            </div>

            {/* pipeline */}
            <div className="border-t border-line px-6 py-6">
              <p className="mb-4 font-mono text-[10px] tracking-[0.2em] text-steel-dim">
                LINHA DO TEMPO
              </p>
              {data.status === "recusado" ? (
                <p className="rounded-md border border-red-500/25 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
                  Esta solicitação não avançou para proposta. Fale com a equipe
                  para entender os próximos passos.
                </p>
              ) : (
                <div className="flex items-center gap-0">
                  {["Recebido", "Em análise", "Aprovado", "Concluído"].map((label, i) => {
                    const n = i + 1;
                    const done = n < step;
                    const current = n === step;
                    return (
                      <div key={label} className="flex flex-1 items-center last:flex-none">
                        <div className="flex flex-col items-center">
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-medium ${
                              done
                                ? "border-cobalt bg-cobalt text-ice"
                                : current
                                  ? "border-cobalt bg-cobalt/15 text-cobalt-soft"
                                  : "border-line text-steel-dim"
                            }`}
                          >
                            {done ? (
                              <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                                <path d="M1.5 5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.6" />
                              </svg>
                            ) : (
                              n
                            )}
                          </span>
                          <span
                            className={`mt-2 whitespace-nowrap text-[11px] ${
                              current ? "font-medium text-ice" : "text-steel-dim"
                            }`}
                          >
                            {label}
                          </span>
                        </div>
                        {i < 3 && (
                          <div
                            className={`mx-2 mb-6 h-px flex-1 ${
                              n < step ? "bg-cobalt" : "bg-line"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {data.events.length > 0 && (
                <div className="mt-6 space-y-2">
                  {[...data.events].reverse().map((e, i) => (
                    <div
                      key={i}
                      className="flex items-baseline justify-between gap-4 rounded-md border border-line bg-ink/40 px-4 py-2.5"
                    >
                      <span className="text-[12px] text-ice">
                        {QUOTE_STATUS_LABEL[e.status] || e.status}
                        {e.note ? <span className="text-steel"> — {e.note}</span> : null}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] text-steel-dim">
                        {formatDateTime(e.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
