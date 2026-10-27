"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { Eyebrow } from "@/components/ui";
import { Reveal } from "@/components/motion";

const STAGES = [
  {
    word: "ESTRATÉGIA.",
    title: "Antes de qualquer linha de código,",
    body: "nós mapeamos o problema, o público e a lógica do negócio. O produto nasce com um porquê — e isso muda tudo, do escopo ao retorno.",
  },
  {
    word: "DESIGN.",
    title: "Interfaces que parecem produto,",
    body: "não template. Tipografia, ritmo e microinterações são decididos como um sistema, para que cada tela sirva à experiência inteira.",
  },
  {
    word: "TECNOLOGIA.",
    title: "Arquitetura feita para durar,",
    body: "escolhas de stack justificadas, código revisado, testes e deploy contínuo. A base invisível que sustenta tudo o que o usuário vê.",
  },
  {
    word: "EXECUÇÃO.",
    title: "Do protótipo ao lançamento,",
    body: "entregas em ciclos curtos, comunicação direta e métricas reais. Você acompanha o produto crescer — sem surpresas no fim.",
  },
];

export default function Editorial() {
  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start 0.85", "end 0.45"],
  });
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(3, Math.max(0, Math.floor(v * 4)));
    setActive(idx);
  });

  return (
    <section className="relative bg-ice text-ink noise" id="manifesto">
      <div className="absolute inset-0 grid-lines-dark" />
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="border-b border-line-dark py-20 sm:py-28">
          <Reveal>
            <Eyebrow light>Manifesto</Eyebrow>
          </Reveal>
          <h2 className="mt-8 max-w-5xl text-[clamp(2.2rem,5.6vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.04em]">
            <Reveal y={24} delay={0.05}>
              Não é só sobre escrever código.
            </Reveal>
            <Reveal y={24} delay={0.15}>
              É sobre{" "}
              <span className="italic text-cobalt">criar possibilidades</span>.
            </Reveal>
          </h2>
          <Reveal delay={0.25}>
            <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-ink/60">
              Quatro movimentos, um padrão: trabalho de estúdio em cada camada
              do produto digital que entregamos.
            </p>
          </Reveal>
        </div>

        {/* scroll-driven stages */}
        <div ref={target} className="grid gap-8 py-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
          <div>
            {STAGES.map((stage, i) => (
              <div
                key={stage.word}
                className="flex min-h-[44vh] flex-col justify-center border-b border-line-dark pb-16 last:border-0 lg:min-h-[52vh]"
              >
                <p className="font-mono text-[11px] text-cobalt">
                  0{i + 1} / 04
                </p>
                <h3 className="mt-4 max-w-md text-2xl font-medium leading-snug tracking-tight sm:text-[28px]">
                  {stage.title}
                </h3>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/65">
                  {stage.body}
                </p>
              </div>
            ))}
          </div>

          {/* sticky word */}
          <div className="relative hidden lg:block">
            <div className="sticky top-1/2 -translate-y-1/2">
              <div className="relative flex h-[220px] items-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={active}
                    initial={reduced ? { opacity: 0 } : { y: 46, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={reduced ? { opacity: 0 } : { y: -46, opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
                    className={`block whitespace-nowrap text-[clamp(4rem,7vw,6.8rem)] font-medium tracking-[-0.05em] ${
                      active === 0 ? "text-cobalt" : "text-ink"
                    }`}
                  >
                    {STAGES[active].word}
                  </motion.span>
                </AnimatePresence>
                <div className="mt-6 flex gap-2">
                  {STAGES.map((_, i) => (
                    <span
                      key={i}
                      className={`h-0.5 transition-all duration-500 ${
                        i === active ? "w-10 bg-cobalt" : "w-5 bg-ink/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
