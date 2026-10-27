"use client";

import Link from "next/link";
import { Eyebrow, Button } from "@/components/ui";
import { MaskLines, Drift, Reveal } from "@/components/motion";
import {
  MonitorFrame,
  PhoneFrame,
  SitePreview,
  DashboardScreen,
  AppScreen,
  FlowDiagram,
} from "@/components/mockups";

function CTA({ label }: { label: string }) {
  return (
    <div>
      <Button href="/orcamento" size="lg" variant="primary">
        {label}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </Button>
    </div>
  );
}

export default function ServiceSections() {
  return (
    <div id="servicos">
      {/* ------------------------- 01 · WEBSITES ------------------------- */}
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0 grid-lines opacity-60" />
        <div
          className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full opacity-15 blur-[130px]"
          style={{ background: "radial-gradient(circle,#245BFF 0%,transparent 65%)" }}
        />
        <div className="relative mx-auto grid max-w-[1400px] items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-36">
          <div>
            <Reveal>
              <Eyebrow>
                Websites <span className="text-cobalt">/ 01</span>
              </Eyebrow>
            </Reveal>
            <MaskLines
              className="mt-7 text-[clamp(2.2rem,5vw,4.2rem)] font-medium leading-[1.0] tracking-[-0.04em] text-ice"
              lines={[<>A primeira impressão</>, <>não tem segunda chance.</>]}
            />
            <Reveal delay={0.2}>
              <p className="mt-7 max-w-md text-[15px] leading-relaxed text-steel">
                Sites institucionais, landing pages de conversão, lojas
                virtuais e portfólios — desenhados como campanhas e construídos
                para performar em qualquer tela.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-9 flex flex-wrap items-center gap-6">
                <CTA label="Desenvolver meu site" />
                <span className="font-mono text-[11px] text-steel-dim">
                  LANDING · E-COMMERCE · INSTITUCIONAL
                </span>
              </div>
            </Reveal>
          </div>
          <Drift amount={36}>
            <Reveal delay={0.15}>
              <div className="relative">
                <div className="absolute -inset-6 -z-10 rounded-2xl bg-cobalt/8 blur-2xl" />
                <MonitorFrame url="aurora.studio" showChrome>
                  <div className="h-[300px] sm:h-[360px]">
                    <SitePreview />
                  </div>
                </MonitorFrame>
                <div className="float-slower absolute -right-4 -top-5 z-20 hidden rounded-md border border-line bg-charcoal px-3 py-2 sm:block">
                  <p className="font-mono text-[9px] text-steel">
                    LCP <span className="text-emerald-300">0,9s</span> · SCORE{" "}
                    <span className="text-emerald-300">98</span>
                  </p>
                </div>
              </div>
            </Reveal>
          </Drift>
        </div>
      </section>

      {/* ----------------------- 02 · APPLICATIONS ----------------------- */}
      <section className="relative overflow-hidden bg-ice text-ink">
        <div className="absolute inset-0 grid-lines-dark" />
        <div
          className="pointer-events-none absolute -right-40 -top-24 h-[560px] w-[560px] rounded-full opacity-40 blur-[150px]"
          style={{ background: "radial-gradient(circle,rgba(36,91,255,0.5) 0%,transparent 65%)" }}
        />
        <div className="relative mx-auto grid max-w-[1400px] items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-36">
          {/* phones — visual first on desktop, mirrored */}
          <div className="order-2 lg:order-1">
            <Drift amount={30}>
              <Reveal>
                <div className="relative mx-auto flex max-w-[480px] items-end justify-center pt-8">
                  <div className="float-slower absolute left-0 z-0 hidden w-[170px] -rotate-[7deg] sm:block lg:w-[185px]">
                    <PhoneFrame light>
                      <div className="h-[340px]">
                        <div className="flex h-full flex-col gap-2 bg-[#0a0c11] p-4 text-ice">
                          <p className="font-mono text-[8px] text-steel">ANALYTICS</p>
                          <div className="rounded-xl border border-line bg-charcoal p-3">
                            <p className="text-[8px] text-steel">Retenção</p>
                            <p className="font-mono text-[15px]">87,2%</p>
                            <div className="mt-2 flex h-8 items-end gap-1">
                              {[40, 55, 48, 70, 62, 85, 92].map((h, i) => (
                                <span key={i} className="flex-1 rounded-[2px] bg-cobalt/80" style={{ height: `${h}%` }} />
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            {["Push entregue", "Sessão ativa", "Upgrade feito"].map((t) => (
                              <div key={t} className="flex items-center gap-2 rounded-lg border border-line bg-charcoal px-2.5 py-2 text-[8px] text-steel">
                                <span className="h-1 w-1 rounded-full bg-emerald-400" /> {t}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </PhoneFrame>
                  </div>
                  <div className="float-slow relative z-10 w-[200px] rotate-[3deg] lg:w-[220px]">
                    <PhoneFrame light>
                      <div className="h-[400px]">
                        <AppScreen />
                      </div>
                    </PhoneFrame>
                  </div>
                </div>
              </Reveal>
            </Drift>
          </div>
          <div className="order-1 lg:order-2">
            <Reveal>
              <Eyebrow light>
                Applications <span className="text-cobalt">/ 02</span>
              </Eyebrow>
            </Reveal>
            <MaskLines
              className="mt-7 text-[clamp(2.2rem,5vw,4.2rem)] font-medium leading-[1.0] tracking-[-0.04em] text-ink"
              lines={[<>Seu negócio</>, <>na palma da mão.</>]}
            />
            <Reveal delay={0.2}>
              <p className="mt-7 max-w-md text-[15px] leading-relaxed text-ink/60">
                Aplicativos iOS e Android com a fluidez de produto de tecnologia:
                offline-first, push, pagamentos e métricas embutidas — da loja
                ao dia a dia da operação.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-9 flex flex-wrap items-center gap-6">
                <CTA label="Criar meu aplicativo" />
                <span className="font-mono text-[11px] text-ink/40">
                  iOS · ANDROID · REACT NATIVE
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* -------------------------- 03 · SYSTEMS ------------------------- */}
      <section className="relative overflow-hidden bg-charcoal">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/systems-dark.jpg"
            alt=""
            aria-hidden
            className="h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/70 to-charcoal" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:py-36">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <Reveal>
                <Eyebrow>
                  Systems <span className="text-cobalt">/ 03</span>
                </Eyebrow>
              </Reveal>
              <MaskLines
                className="mt-7 text-[clamp(2.2rem,5vw,4.2rem)] font-medium leading-[1.0] tracking-[-0.04em] text-ice"
                lines={[<>Complexidade por trás.</>, <>Simplicidade na frente.</>]}
              />
            </div>
            <Reveal delay={0.15}>
              <p className="max-w-md text-[15px] leading-relaxed text-steel">
                Sistemas administrativos, ERPs, CRMs e plataformas sob medida.
                Dashboards com dados em tempo real, permissões por papel e
                relatórios que a diretoria realmente abre.
              </p>
            </Reveal>
          </div>
          <Drift amount={40}>
            <Reveal delay={0.2}>
              <div className="relative mt-14">
                <div className="absolute -inset-8 -z-10 rounded-3xl bg-cobalt/10 blur-3xl" />
                <MonitorFrame className="shadow-[0_60px_140px_rgba(0,0,0,0.65)]" url="vetor.studio/admin">
                  <div className="h-[340px] sm:h-[420px]">
                    <DashboardScreen />
                  </div>
                </MonitorFrame>
                <div className="absolute -bottom-5 left-8 z-20 rounded-md border border-line bg-ink/90 px-3 py-2 backdrop-blur">
                  <p className="font-mono text-[9px] text-steel">
                    PERMISSÕES POR PAPEL ·{" "}
                    <span className="text-ice">AUDITORIA</span> ·{" "}
                    <span className="text-ice">API REST</span>
                  </p>
                </div>
              </div>
            </Reveal>
          </Drift>
          <div className="mt-12">
            <Reveal>
              <CTA label="Desenvolver meu sistema" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------- 04 · AUTOMATION ----------------------- */}
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/flow-dark.jpg"
            alt=""
            aria-hidden
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/60 to-ink" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:py-36">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <Reveal>
                <Eyebrow>
                  Automation <span className="text-cobalt">/ 04</span>
                </Eyebrow>
              </Reveal>
              <MaskLines
                className="mt-7 text-[clamp(2.2rem,5vw,4.2rem)] font-medium leading-[1.0] tracking-[-0.04em] text-ice"
                lines={[<>Deixe a tecnologia</>, <>fazer o trabalho pesado.</>]}
              />
              <Reveal delay={0.2}>
                <p className="mt-7 max-w-md text-[15px] leading-relaxed text-steel">
                  Pipelines em Python, integrações entre sistemas e tarefas que
                  somem para sempre da planilha: entrada, processamento e
                  resultado — monitorados de ponta a ponta.
                </p>
              </Reveal>
            </div>
            {/* coherent terminal snippet */}
            <Reveal delay={0.25}>
              <div className="rounded-lg border border-line bg-charcoal/80 backdrop-blur">
                <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                  <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                  <span className="h-2 w-2 rounded-full bg-[#28c840]" />
                  <span className="ml-2 font-mono text-[10px] text-steel">
                    pipeline · produção
                  </span>
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-[1.9] text-steel">
                  <span className="block"><span className="text-cobalt-soft">$</span> python emit_notas.py --batch 1284</span>
                  <span className="block text-steel-dim">▸ lendo pedidos.csv .......... ok</span>
                  <span className="block text-steel-dim">▸ validando fornecedores ...... 1.282/1.284</span>
                  <span className="block text-steel-dim">▸ emitindo notas (SEFAZ) ........ 1.282</span>
                  <span className="block text-steel-dim">▸ sincronizando ERP ........... ok</span>
                  <span className="block text-emerald-300">✓ concluído em 4m12s — 2 pendências alertadas</span>
                </pre>
              </div>
            </Reveal>
          </div>

          <Drift amount={36}>
            <Reveal delay={0.2}>
              <div className="mt-16">
                <FlowDiagram />
              </div>
            </Reveal>
          </Drift>

          <div className="mt-14">
            <Reveal>
              <CTA label="Automatizar meu processo" />
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
