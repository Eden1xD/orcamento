"use client";

import { motion, useReducedMotion } from "framer-motion";

export type BarDatum = { label: string; count: number; value: number };

export default function BarChart({ data }: { data: BarDatum[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const reduced = useReducedMotion();

  return (
    <div>
      <div className="flex h-[180px] items-end gap-3 sm:gap-5">
        {data.map((d, i) => (
          <div key={d.label} className="group flex h-full flex-1 flex-col justify-end">
            <div className="relative flex h-full items-end">
              <motion.div
                initial={reduced ? false : { height: 0 }}
                whileInView={{ height: `${Math.max(4, (d.count / max) * 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.07, ease: [0.65, 0, 0.35, 1] }}
                className={`relative w-full rounded-t-md transition-colors ${
                  d.count > 0
                    ? "bg-cobalt group-hover:bg-cobalt-soft"
                    : "bg-ice/8"
                }`}
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-steel opacity-0 transition-opacity group-hover:opacity-100">
                  {d.count}
                </span>
              </motion.div>
            </div>
            <p className="mt-2 text-center font-mono text-[9px] tracking-wider text-steel-dim">
              {d.label}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-line pt-3">
        {data.map((d) => (
          <span key={d.label} className="font-mono text-[10px] text-steel-dim">
            {d.label} · {d.count} orç. · R$ {(d.value / 100).toLocaleString("pt-BR")}
          </span>
        ))}
      </div>
    </div>
  );
}
