/* Crisp CSS-built device frames and product screens.
   Built in HTML/CSS (not images) so every pixel stays legible and
   coherent with the design system. */

import type { ReactNode } from "react";

/* ------------------------------- Frames ------------------------------- */

export function MonitorFrame({
  children,
  className = "",
  url = "vetor.studio",
  showChrome = true,
}: {
  children: ReactNode;
  className?: string;
  url?: string;
  showChrome?: boolean;
}) {
  return (
    <div
      className={`relative rounded-xl border border-ice/12 bg-[#0b0d13] p-2 shadow-[0_40px_120px_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,0,0,0.4)] ${className}`}
    >
      <div className="relative overflow-hidden rounded-lg bg-ink">
        {showChrome && <BrowserBar url={url} />}
        {children}
        {/* glass reflection */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, rgba(245,246,248,0.045) 0%, rgba(245,246,248,0) 38%)",
          }}
        />
      </div>
    </div>
  );
}

export function BrowserBar({ url, light }: { url: string; light?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 border-b px-3 py-2 ${
        light ? "border-line-dark bg-ice-dim" : "border-line bg-charcoal"
      }`}
    >
      <div className="flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
      </div>
      <div
        className={`ml-2 flex h-5 flex-1 items-center rounded-full px-2.5 font-mono text-[9px] ${
          light ? "bg-white text-steel" : "bg-ink text-steel"
        }`}
      >
        <svg width="7" height="7" viewBox="0 0 10 10" className="mr-1 opacity-60">
          <rect x="1" y="4" width="8" height="5" rx="1" stroke="currentColor" fill="none" />
          <path d="M3 4V3a2 2 0 014 0v1" stroke="currentColor" fill="none" />
        </svg>
        {url}
      </div>
      <span className={`h-3 w-3 rounded-sm ${light ? "bg-ink/15" : "bg-ice/15"}`} />
    </div>
  );
}

export function PhoneFrame({
  children,
  className = "",
  light,
}: {
  children: ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <div
      className={`relative rounded-[2.4rem] border-[6px] p-0 ${
        light ? "border-[#0c0e13] bg-[#0c0e13]" : "border-[#0b0d12] bg-[#0b0d12]"
      } ${className}`}
      style={{
        boxShadow:
          "0_30px_80px_rgba(0,0,0,0.55), inset 0_0_4px rgba(255,255,255,0.08)",
      }}
    >
      <div className="relative overflow-hidden rounded-[1.95rem] bg-ink">
        {/* dynamic island */}
        <div className="absolute left-1/2 top-2 z-20 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
        {children}
      </div>
    </div>
  );
}

/* --------------------------- Screen content --------------------------- */

export function DashboardScreen() {
  const bars = [38, 52, 44, 66, 58, 74, 62, 84, 70, 92, 78, 100];
  const rows = [
    ["Ativação de clientes", "R$ 12.480"],
    ["Assinaturas recorrentes", "R$ 38.900"],
    ["Novos contratos", "R$ 9.120"],
    ["Projetos entregues", "R$ 15.360"],
  ];
  return (
    <div className="flex h-full min-h-[300px] text-ice">
      {/* sidebar */}
      <div className="hidden w-[15%] min-w-[74px] flex-col gap-3 border-r border-line bg-charcoal/70 p-3 sm:flex">
        <div className="mb-2 flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded-sm bg-cobalt" />
          <span className="font-mono text-[8px] tracking-widest">VETOR OS</span>
        </div>
        {["Visão geral", "Orçamentos", "Clientes", "Projetos", "Relatórios"].map(
          (item, i) => (
            <div
              key={item}
              className={`flex items-center gap-1.5 rounded px-1.5 py-1 text-[8px] ${
                i === 0 ? "bg-cobalt/15 text-cobalt-soft" : "text-steel"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-[2px] ${i === 0 ? "bg-cobalt" : "bg-steel/40"}`}
              />
              {item}
            </div>
          ),
        )}
      </div>
      {/* main */}
      <div className="flex-1 p-3.5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-medium">Visão geral</p>
          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[7px] text-steel">
            ATUALIZADO AGORA
          </span>
        </div>
        <div className="mb-3 grid grid-cols-3 gap-2">
          {[
            ["Receita mensal", "R$ 75,8k", "+18%"],
            ["Orçamentos abertos", "12", "+4"],
            ["Projetos ativos", "7", "2 em revisão"],
          ].map(([label, value, delta]) => (
            <div key={label} className="rounded-md border border-line bg-charcoal p-2">
              <p className="truncate text-[7px] text-steel">{label}</p>
              <p className="mt-1 font-mono text-[12px] font-medium">{value}</p>
              <p className="mt-0.5 text-[7px] text-cobalt-soft">{delta}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-2">
          <div className="col-span-3 rounded-md border border-line bg-charcoal p-2.5">
            <p className="mb-2 text-[7px] text-steel">RECEITA · 12 MESES</p>
            <div className="flex h-[72px] items-end gap-1">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-[2px] ${
                    i === bars.length - 1 ? "bg-cobalt" : "bg-ice/15"
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <div className="col-span-2 rounded-md border border-line bg-charcoal p-2.5">
            <p className="mb-2 text-[7px] text-steel">ÚLTIMAS ENTRADAS</p>
            <div className="space-y-1.5">
              {rows.map(([name, value]) => (
                <div key={name} className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-1 text-[7px] text-steel">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                    <span className="truncate">{name}</span>
                  </span>
                  <span className="font-mono text-[7px] text-ice">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppScreen() {
  const list = [
    ["Transferência PIX", "Para Marina Costa", "14:02"],
    ["Pix recebido", "Loja Aurora", "11:47"],
    ["Investimento", "Renda fixa", "09:15"],
  ];
  return (
    <div className="flex h-full min-h-[420px] flex-col bg-[#0a0c11] px-4 pb-3 pt-3 text-ice">
      <div className="flex items-center justify-between font-mono text-[8px] text-steel">
        <span>9:41</span>
        <span className="flex items-center gap-1">
          <svg width="8" height="8" viewBox="0 0 10 10"><path d="M5 8.5L1.5 5A5 5 0 015 3.5 5 5 0 018.5 5L5 8.5z" fill="currentColor"/></svg>
          5G
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cobalt to-cobalt-dim" />
        <div>
          <p className="text-[9px] font-medium leading-tight">Boa tarde, Marina</p>
          <p className="text-[7px] text-steel">Conta · **** 4821</p>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-gradient-to-br from-cobalt to-cobalt-dim p-3">
        <p className="text-[7px] uppercase tracking-widest text-ice/70">Saldo disponível</p>
        <p className="mt-1 font-mono text-[16px] font-medium">R$ 24.860,40</p>
        <div className="mt-3 flex gap-1.5">
          {["Pagar", "Pix", "Investir"].map((t) => (
            <span
              key={t}
              className="rounded-full bg-ice/15 px-2 py-0.5 text-[7px] font-medium"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <p className="mb-1.5 mt-4 text-[7px] uppercase tracking-widest text-steel">
        Movimentações
      </p>
      <div className="space-y-1.5">
        {list.map(([title, sub, time]) => (
          <div
            key={title}
            className="flex items-center gap-2 rounded-lg border border-line bg-charcoal px-2.5 py-2"
          >
            <span className="h-5 w-5 rounded-md bg-cobalt/20" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[8px] font-medium">{title}</span>
              <span className="block truncate text-[7px] text-steel">{sub}</span>
            </span>
            <span className="font-mono text-[7px] text-steel">{time}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-around rounded-xl border border-line bg-charcoal/60 px-2 py-2">
        {["home", "chart", "plus", "user"].map((t, i) => (
          <span key={t} className={i === 0 ? "h-1.5 w-4 rounded-full bg-cobalt" : "h-1.5 w-4 rounded-full bg-ice/20"} />
        ))}
      </div>
    </div>
  );
}

export function SitePreview() {
  return (
    <div className="h-full min-h-[300px] bg-ice text-ink">
      {/* nav */}
      <div className="flex items-center justify-between border-b border-line-dark px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-ink" />
          <span className="font-mono text-[8px] font-medium tracking-widest">AURORA</span>
        </div>
        <div className="hidden gap-3 text-[7px] text-steel sm:flex">
          <span>Estúdio</span>
          <span>Trabalhos</span>
          <span>Contato</span>
        </div>
        <span className="rounded-full bg-ink px-2.5 py-1 text-[7px] font-medium text-ice">
          Agendar visita
        </span>
      </div>
      {/* hero */}
      <div className="grid grid-cols-5 gap-3 px-4 pt-5">
        <div className="col-span-3">
          <p className="text-[19px] font-medium leading-[1.08] tracking-tight sm:text-[22px]">
            Interiores que
            <br />
            contam a sua
            <br />
            <span className="text-cobalt">história.</span>
          </p>
          <p className="mt-2 text-[7.5px] leading-relaxed text-steel">
            Estúdio de arquitetura e design de interiores com projetos autorais
            desde 2016.
          </p>
          <div className="mt-3 flex gap-2">
            <span className="rounded-md bg-ink px-3 py-1.5 text-[7.5px] font-medium text-ice">
              Ver projetos
            </span>
            <span className="rounded-md border border-line-dark px-3 py-1.5 text-[7.5px]">
              Falar com o estúdio
            </span>
          </div>
        </div>
        <div className="col-span-2 overflow-hidden rounded-lg">
          <div
            className="h-full min-h-[110px] w-full"
            style={{
              background:
                "linear-gradient(150deg,#e4e6ec 0%,#b9c0d0 45%,#245BFF 130%)",
            }}
          />
        </div>
      </div>
      {/* cards */}
      <div className="grid grid-cols-3 gap-2 px-4 py-4">
        {["Residencial", "Comercial", "Hoteleiro"].map((c) => (
          <div key={c} className="rounded-lg border border-line-dark bg-white p-2">
            <div className="mb-2 h-9 rounded-md bg-ice-dim" />
            <p className="text-[7.5px] font-medium">{c}</p>
            <p className="text-[6.5px] text-steel">ver coleção →</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Flow diagram --------------------------- */

export function FlowDiagram() {
  return (
    <div className="relative w-full">
      <svg
        className="pointer-events-none absolute left-0 top-1/2 hidden h-10 w-full -translate-y-1/2 md:block"
        viewBox="0 0 600 40"
        preserveAspectRatio="none"
      >
        <path d="M0 20 H200" stroke="#245BFF" strokeWidth="1.5" className="flow-line" fill="none" />
        <path d="M250 20 H390" stroke="#245BFF" strokeWidth="1.5" className="flow-line" fill="none" />
        <path d="M440 20 H600" stroke="#245BFF" strokeWidth="1.5" className="flow-line" fill="none" />
      </svg>
      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        <FlowNode
          step="01"
          title="Entrada"
          subtitle="Pedidos, CSV e APIs"
          body={
            <div className="space-y-1.5 font-mono text-[10px] text-steel">
              <div className="flex justify-between"><span>pedidos.csv</span><span className="text-ice">1.284</span></div>
              <div className="flex justify-between"><span>api/lojas</span><span className="text-ice">live</span></div>
              <div className="flex justify-between"><span>erros</span><span className="text-amber-300">2</span></div>
            </div>
          }
        />
        <FlowNode
          step="02"
          title="Processamento"
          subtitle="Python · validação + enriquecimento"
          accent
          body={
            <div className="space-y-1.5 font-mono text-[10px] text-steel">
              <div className="flex justify-between"><span>validar CNPJ</span><span className="text-emerald-300">ok</span></div>
              <div className="flex justify-between"><span>enriquecer CEP</span><span className="text-emerald-300">ok</span></div>
              <div className="flex justify-between"><span>deduplicar</span><span className="text-ice">312</span></div>
            </div>
          }
        />
        <FlowNode
          step="03"
          title="Resultado"
          subtitle="Emissão e sincronização"
          body={
            <div className="space-y-1.5 font-mono text-[10px] text-steel">
              <div className="flex justify-between"><span>notas emitidas</span><span className="text-ice">1.031</span></div>
              <div className="flex justify-between"><span>ERP sync</span><span className="text-emerald-300">ok</span></div>
              <div className="flex justify-between"><span>tempo</span><span className="text-cobalt-soft">4,2 min</span></div>
            </div>
          }
        />
      </div>
    </div>
  );
}

function FlowNode({
  step,
  title,
  subtitle,
  body,
  accent,
}: {
  step: string;
  title: string;
  subtitle: string;
  body: ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative rounded-lg border p-4 backdrop-blur-sm ${
        accent ? "border-cobalt/50 bg-cobalt/10" : "border-line bg-charcoal/80"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className={`font-mono text-[10px] ${accent ? "text-cobalt-soft" : "text-steel"}`}>
          {step}
        </span>
        <span
          className={`h-1.5 w-1.5 rounded-full ${accent ? "bg-cobalt" : "bg-steel/50"}`}
        />
      </div>
      <p className="text-[15px] font-medium text-ice">{title}</p>
      <p className="mb-3 mt-0.5 text-[11px] text-steel">{subtitle}</p>
      {body}
    </div>
  );
}
