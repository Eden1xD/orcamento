"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { MonitorFrame, PhoneFrame, DashboardScreen, AppScreen } from "@/components/mockups";

const EASE = [0.65, 0, 0.35, 1] as const;

export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* campaign background */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-studio.jpg"
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/78 to-ink/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
        <div className="absolute inset-0 grid-lines" />
        {/* cobalt glow */}
        <div
          className="absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full opacity-25 blur-[140px]"
          style={{ background: "radial-gradient(circle, #245BFF 0%, transparent 65%)" }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-5 pb-10 pt-28 sm:px-8 lg:pb-16 lg:pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* copy */}
          <div>
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="eyebrow flex items-center gap-3 text-steel"
            >
              <span className="h-px w-8 bg-cobalt" />
              Independent digital development studio
            </motion.p>

            <h1 className="mt-7 text-[clamp(2.7rem,7.2vw,5.6rem)] font-medium leading-[0.98] tracking-[-0.045em] text-ice">
              <span className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
                <motion.span
                  className="block"
                  initial={reduced ? false : { y: "112%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.05, delay: 0.25, ease: EASE }}
                >
                  Ideias grandes
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
                <motion.span
                  className="block"
                  initial={reduced ? false : { y: "112%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.05, delay: 0.4, ease: EASE }}
                >
                  merecem códigos
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
                <motion.span
                  className="block"
                  initial={reduced ? false : { y: "112%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.05, delay: 0.55, ease: EASE }}
                >
                  <span className="text-outline">extraordinários</span>
                  <span className="text-cobalt">.</span>
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
              className="mt-7 max-w-md text-[15px] leading-relaxed text-steel sm:text-base"
            >
              Desenvolvimento de experiências digitais, aplicativos, sistemas e
              automações feitos para ir além do comum.
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/orcamento"
                className="group inline-flex h-12 items-center gap-3 rounded-md bg-cobalt px-6 text-[15px] font-medium text-ice shadow-[0_10px_36px_rgba(36,91,255,0.35)] transition-all duration-300 hover:bg-cobalt-soft hover:shadow-[0_14px_44px_rgba(36,91,255,0.5)]"
              >
                Tirar minha ideia do papel
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex h-12 items-center rounded-md border border-line px-6 text-[14px] font-medium text-ice transition-all duration-300 hover:border-steel/50 hover:bg-ice/5"
              >
                Descobrir os projetos
              </Link>
            </motion.div>
          </div>

          {/* device composition */}
          <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: EASE }}
              className="relative"
            >
              <MonitorFrame className="relative z-10" url="vetor.studio/admin">
                <div className="h-[300px] sm:h-[340px]">
                  <DashboardScreen />
                </div>
              </MonitorFrame>

              <motion.div
                initial={reduced ? false : { opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.95, ease: EASE }}
                className="float-slow absolute -bottom-10 -left-3 z-20 hidden w-[168px] sm:block lg:-left-10 lg:w-[184px]"
              >
                <PhoneFrame className="rotate-[-4deg]">
                  <div className="h-[330px]">
                    <AppScreen />
                  </div>
                </PhoneFrame>
              </motion.div>

              {/* spec tags */}
              <motion.div
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="absolute -right-3 top-16 z-30 hidden rounded border border-line bg-ink/80 px-3 py-2 backdrop-blur lg:block"
              >
                <p className="font-mono text-[9px] leading-relaxed text-steel">
                  DASHBOARD REAL
                  <br />
                  <span className="text-ice">7 projetos ativos</span>
                </p>
              </motion.div>
              <motion.div
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.55 }}
                className="absolute -left-4 bottom-24 z-30 hidden rounded border border-line bg-ink/80 px-3 py-2 backdrop-blur lg:block"
              >
                <p className="font-mono text-[9px] leading-relaxed text-steel">
                  APP NATIVO
                  <br />
                  <span className="text-ice">iOS · Android</span>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* scroll hint */}
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="relative mx-auto flex w-full max-w-[1400px] items-center justify-between px-5 pb-6 sm:px-8"
      >
        <span className="font-mono text-[10px] tracking-widest text-steel-dim">
          23.5505° S — 46.6333° W
        </span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-widest text-steel-dim">
            ESCROLE PARA EXPLORAR
          </span>
          <span className="relative h-8 w-px overflow-hidden bg-line">
            <motion.span
              className="absolute left-0 top-0 h-3 w-px bg-cobalt"
              animate={reduced ? undefined : { y: [-12, 32] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </div>
      </motion.div>
    </section>
  );
}
