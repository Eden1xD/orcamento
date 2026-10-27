"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Eyebrow } from "@/components/ui";
import { Reveal, MaskLines } from "@/components/motion";
import { formatBRL, TIMELINE_LABEL } from "@/lib/format";

type Service = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  basePrice: number;
};
type Addon = {
  id: string;
  name: string;
  description: string | null;
  price: number;
};

const STEPS = [
  "O que você quer desenvolver?",
  "Quais funcionalidades precisa?",
  "Conte mais sobre sua ideia.",
  "Quando pretende começar?",
  "Como podemos entrar em contato?",
  "Revise sua solicitação.",
];

const TIMELINES = [
  { id: "agora", label: "O quanto antes", sub: "Urgência real no projeto" },
  { id: "30-90", label: "1 a 3 meses", sub: "Planejado e viabilizado" },
  { id: "90-180", label: "3 a 6 meses", sub: "Tempo para amadurecer" },
  { id: "flexivel", label: "Ainda explorando", sub: "Quer conversar primeiro" },
];

const EASE = [0.65, 0, 0.35, 1] as const;

export default function QuoteWizard({
  services,
  addons,
}: {
  services: Service[];
  addons: Addon[];
}) {
  const router = useRouter();
  const reduced = useReducedMotion();

  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [timeline, setTimeline] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const service = services.find((s) => s.id === serviceId) || null;
  const addonsSum = useMemo(
    () =>
      addons
        .filter((a) => selectedAddons.includes(a.id))
        .reduce((acc, a) => acc + a.price, 0),
    [addons, selectedAddons],
  );
  const total = (service?.basePrice || 0) + addonsSum;

  const canNext = () => {
    if (step === 0) return serviceId !== null;
    if (step === 2) return description.trim().length >= 10;
    if (step === 3) return timeline !== null;
    if (step === 4)
      return (
        name.trim().length >= 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      );
    if (step === 5) return agreed;
    return true;
  };

  const next = () => {
    setError(null);
    if (!canNext()) {
      if (step === 4)
        setError("Confira o nome e o e-mail — precisamos de um contato válido.");
      return;
    }
    setStep((s) => Math.min(5, s + 1));
  };
  const back = () => {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  };

  async function submit() {
    if (!canNext() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          company: company.trim(),
          serviceId: serviceId,
          addons: selectedAddons,
          description: description.trim(),
          timeline,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Não foi possível enviar. Tente novamente.");
        setSubmitting(false);
        return;
      }
      router.push(`/orcamento/confirmacao?protocol=${data.protocol}`);
    } catch {
      setError("Falha de conexão. Verifique sua internet e tente novamente.");
      setSubmitting(false);
    }
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-40" />
      <div
        className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-15 blur-[150px]"
        style={{ background: "radial-gradient(circle,#245BFF 0%,transparent 65%)" }}
      />
      <div className="relative mx-auto max-w-[1400px] px-5 pb-28 pt-16 sm:px-8 lg:pt-24">
        <Reveal>
          <Eyebrow>Orçamento — sem compromisso</Eyebrow>
        </Reveal>
        <MaskLines
          className="mt-7 max-w-3xl text-[clamp(2.2rem,5.5vw,4.4rem)] font-medium leading-[1.0] tracking-[-0.045em] text-ice"
          lines={[<>Toda grande ideia</>, <>começa com uma conversa.</>]}
        />
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-steel">
            Conte o que você imagina. Nós ajudamos a transformar isso em
            realidade — em poucos minutos.
          </p>
        </Reveal>

        {/* progress */}
        <div className="mt-12 flex items-center gap-2 overflow-x-auto pb-2">
          {STEPS.map((label, i) => (
            <button
              key={label}
              onClick={() => i < step && setStep(i)}
              className={`group flex shrink-0 items-center gap-2.5 rounded-full border px-4 py-2 transition-all duration-300 ${
                i === step
                  ? "border-cobalt bg-cobalt/10"
                  : i < step
                    ? "border-line bg-charcoal hover:border-steel/40"
                    : "border-line opacity-50"
              }`}
              disabled={i > step}
            >
              <span
                className={`font-mono text-[10px] ${
                  i === step ? "text-cobalt-soft" : "text-steel"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`hidden text-[12px] lg:block ${
                  i === step ? "text-ice" : "text-steel"
                }`}
              >
                {label.replace("?", "")}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* step card */}
          <div className="relative min-h-[420px] rounded-lg border border-line bg-charcoal/70 p-6 backdrop-blur sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={reduced ? { opacity: 0 } : { opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, x: -40 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <p className="font-mono text-[11px] tracking-[0.2em] text-cobalt-soft">
                  ETAPA {String(step + 1).padStart(2, "0")} / 06
                </p>
                <h2 className="mt-3 text-2xl font-medium tracking-tight text-ice">
                  {STEPS[step]}
                </h2>

                {/* STEP 1 — service */}
                {step === 0 && (
                  <div className="mt-8 space-y-3">
                    {services.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setServiceId(s.id)}
                        className={`group flex w-full items-center justify-between gap-4 rounded-md border p-5 text-left transition-all duration-300 ${
                          serviceId === s.id
                            ? "border-cobalt bg-cobalt/10"
                            : "border-line bg-ink/40 hover:border-steel/40"
                        }`}
                      >
                        <span>
                          <span className="block text-[15px] font-medium text-ice">
                            {s.name}
                          </span>
                          {s.tagline && (
                            <span className="mt-1 block text-[12px] text-steel">
                              {s.tagline}
                            </span>
                          )}
                        </span>
                        <span className="flex items-center gap-3">
                          <span className="font-mono text-[13px] text-steel">
                            a partir de {formatBRL(s.basePrice)}
                          </span>
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                              serviceId === s.id
                                ? "border-cobalt bg-cobalt"
                                : "border-steel/40 group-hover:border-steel"
                            }`}
                          >
                            {serviceId === s.id && (
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M1.5 5l2.5 2.5 4.5-5" stroke="#F5F6F8" strokeWidth="1.6" />
                              </svg>
                            )}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* STEP 2 — addons */}
                {step === 1 && (
                  <div className="mt-8">
                    <p className="mb-4 text-[13px] text-steel">
                      Opcional — adicione ao que já está incluído.{" "}
                      <span className="text-ice">{selectedAddons.length} selecionado(s)</span>
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {addons.map((a) => {
                        const on = selectedAddons.includes(a.id);
                        return (
                          <button
                            key={a.id}
                            onClick={() =>
                              setSelectedAddons((cur) =>
                                on ? cur.filter((x) => x !== a.id) : [...cur, a.id],
                              )
                            }
                            className={`flex items-start gap-3 rounded-md border p-4 text-left transition-all duration-300 ${
                              on
                                ? "border-cobalt bg-cobalt/10"
                                : "border-line bg-ink/40 hover:border-steel/40"
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-all ${
                                on ? "border-cobalt bg-cobalt" : "border-steel/50"
                              }`}
                            >
                              {on && (
                                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                                  <path d="M1.5 5l2.5 2.5 4.5-5" stroke="#F5F6F8" strokeWidth="1.6" />
                                </svg>
                              )}
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[13px] font-medium text-ice">
                                {a.name}
                              </span>
                              {a.description && (
                                <span className="mt-0.5 block text-[11px] leading-snug text-steel">
                                  {a.description}
                                </span>
                              )}
                              <span className="mt-1.5 block font-mono text-[11px] text-cobalt-soft">
                                + {formatBRL(a.price)}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 3 — description */}
                {step === 2 && (
                  <div className="mt-8">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={8}
                      placeholder="Ex.: Preciso de um sistema para minha clínica controlar agenda, pacientes e pagamentos. Hoje usamos planilha e perdem muito tempo…"
                      className="field resize-y text-[14px] leading-relaxed"
                      autoFocus
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className={`font-mono text-[11px] ${
                          description.trim().length >= 10 ? "text-emerald-300" : "text-steel-dim"
                        }`}
                      >
                        {description.trim().length >= 10
                          ? "perfeito, temos contexto suficiente"
                          : "contar pelo menos 10 caracteres"}
                      </span>
                      <span className="font-mono text-[11px] text-steel-dim">
                        {description.trim().length} caracteres
                      </span>
                    </div>
                  </div>
                )}

                {/* STEP 4 — timeline */}
                {step === 3 && (
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {TIMELINES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTimeline(t.id)}
                        className={`rounded-md border p-5 text-left transition-all duration-300 ${
                          timeline === t.id
                            ? "border-cobalt bg-cobalt/10"
                            : "border-line bg-ink/40 hover:border-steel/40"
                        }`}
                      >
                        <span className="block text-[15px] font-medium text-ice">
                          {t.label}
                        </span>
                        <span className="mt-1 block text-[12px] text-steel">
                          {t.sub}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* STEP 5 — contact */}
                {step === 4 && (
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[12px] text-steel">Nome *</label>
                      <input
                        className="field"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[12px] text-steel">E-mail *</label>
                      <input
                        className="field"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="voce@empresa.com"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[12px] text-steel">WhatsApp / telefone</label>
                      <input
                        className="field"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(11) 99999-0000"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[12px] text-steel">Empresa (opcional)</label>
                      <input
                        className="field"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Nome da empresa"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 6 — review */}
                {step === 5 && (
                  <div className="mt-8 space-y-3">
                    <ReviewRow label="Serviço" value={service?.name || "—"} onEdit={() => setStep(0)} />
                    <ReviewRow
                      label="Adicionais"
                      value={
                        selectedAddons.length > 0
                          ? addons.filter((a) => selectedAddons.includes(a.id)).map((a) => a.name).join(" · ")
                          : "Nenhum"
                      }
                      onEdit={() => setStep(1)}
                    />
                    <ReviewRow label="Descrição" value={description} onEdit={() => setStep(2)} />
                    <ReviewRow
                      label="Início"
                      value={timeline ? TIMELINE_LABEL[timeline] : "—"}
                      onEdit={() => setStep(3)}
                    />
                    <ReviewRow
                      label="Contato"
                      value={`${name} — ${email}${company ? ` (${company})` : ""}`}
                      onEdit={() => setStep(4)}
                    />
                    <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-md border border-line bg-ink/40 p-4">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 h-4 w-4 accent-cobalt"
                      />
                      <span className="text-[12px] leading-relaxed text-steel">
                        Entendo que o valor exibido é uma{" "}
                        <strong className="text-ice">estimativa inicial</strong>, e
                        que o valor final será definido após a análise do projeto
                        pela equipe.
                      </span>
                    </label>
                  </div>
                )}

                {error && (
                  <p className="mt-5 rounded-md border border-red-500/25 bg-red-500/10 px-4 py-2.5 text-[13px] text-red-300">
                    {error}
                  </p>
                )}

                {/* nav */}
                <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
                  <button
                    onClick={back}
                    disabled={step === 0}
                    className={`inline-flex h-10 items-center gap-2 rounded-md border px-4 text-[13px] transition-all ${
                      step === 0
                        ? "cursor-not-allowed border-line text-steel-dim"
                        : "border-line text-ice hover:bg-ice/5"
                    }`}
                  >
                    ← Voltar
                  </button>
                  {step < 5 ? (
                    <button
                      onClick={next}
                      disabled={!canNext()}
                      className="inline-flex h-11 items-center gap-2 rounded-md bg-cobalt px-6 text-[14px] font-medium text-ice shadow-[0_8px_28px_rgba(36,91,255,0.3)] transition-all hover:bg-cobalt-soft disabled:opacity-40 disabled:shadow-none"
                    >
                      Continuar
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={submit}
                      disabled={!canNext() || submitting}
                      className="inline-flex h-11 items-center gap-2 rounded-md bg-cobalt px-7 text-[14px] font-medium text-ice shadow-[0_8px_28px_rgba(36,91,255,0.3)] transition-all hover:bg-cobalt-soft disabled:opacity-40 disabled:shadow-none"
                    >
                      {submitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-ice/30 border-t-ice" />
                          Enviando…
                        </>
                      ) : (
                        <>
                          Enviar solicitação
                          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* live summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-line bg-charcoal/80 p-6 backdrop-blur">
              <p className="eyebrow text-steel">Resumo da solicitação</p>
              <div className="mt-5 space-y-3 text-[13px]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-steel">Serviço</span>
                  <span className="truncate font-medium text-ice">
                    {service?.name || "Selecione acima"}
                  </span>
                </div>
                {service && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-steel">Valor base</span>
                    <span className="mono-num text-ice">
                      {formatBRL(service.basePrice)}
                    </span>
                  </div>
                )}
                {addonsSum > 0 && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-steel">
                      Adicionais ({selectedAddons.length})
                    </span>
                    <span className="mono-num text-ice">+ {formatBRL(addonsSum)}</span>
                  </div>
                )}
                {selectedAddons.length > 0 && (
                  <ul className="space-y-1.5 border-l border-line pl-4">
                    {addons
                      .filter((a) => selectedAddons.includes(a.id))
                      .map((a) => (
                        <li key={a.id} className="truncate text-[12px] text-steel">
                          + {a.name}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
              <div className="mt-6 border-t border-line pt-5">
                <p className="font-mono text-[10px] tracking-[0.2em] text-steel-dim">
                  ESTIMATIVA INICIAL
                </p>
                <p
                  key={total}
                  className="mt-2 text-3xl font-medium tracking-tight text-ice"
                >
                  {formatBRL(total)}
                </p>
                <p className="mt-3 text-[11px] leading-relaxed text-steel">
                  Estimativa inicial. O valor final depende da análise do
                  projeto e poderá ser ajustado.
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-line bg-ink/60 p-5">
              <p className="font-mono text-[10px] tracking-[0.2em] text-steel-dim">
                O QUE ACONTECE DEPOIS
              </p>
              <ol className="mt-3 space-y-2 text-[12px] text-steel">
                <li className="flex gap-2">
                  <span className="font-mono text-cobalt">01</span> A equipe lê seu
                  contexto em até 1 dia útil.
                </li>
                <li className="flex gap-2">
                  <span className="font-mono text-cobalt">02</span> Conversa para
                  alinhar escopo e expectativas.
                </li>
                <li className="flex gap-2">
                  <span className="font-mono text-cobalt">03</span> Proposta formal,
                  com prazo e valor final.
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-md border border-line bg-ink/40 p-4">
      <div className="min-w-0">
        <p className="font-mono text-[10px] tracking-[0.18em] text-steel-dim">
          {label.toUpperCase()}
        </p>
        <p className="mt-1 line-clamp-2 text-[13px] text-ice">{value}</p>
      </div>
      <button
        onClick={onEdit}
        className="link-underline shrink-0 text-[12px] font-medium text-cobalt-soft"
      >
        editar
      </button>
    </div>
  );
}
