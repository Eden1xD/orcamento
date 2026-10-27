"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { Wordmark, Button } from "@/components/ui";

const NAV = [
  { href: "#servicos", label: "Serviços" },
  { href: "/portfolio", label: "Portfólio" },
  { href: "/acompanhar", label: "Acompanhar" },
];

export default function Header({ whatsappHref }: { whatsappHref: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const onHome = pathname === "/";

  return (
    <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-cobalt"
      />
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-line bg-ink/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1400px] items-center justify-between px-5 transition-all duration-500 sm:px-8 ${
            scrolled ? "h-14" : "h-20"
          }`}
        >
          <Link
            href="/"
            className="text-ice transition-opacity hover:opacity-80"
            aria-label="VETOR — início"
          >
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={onHome ? item.href : `/${item.href}`}
                className="link-underline text-[13px] text-steel transition-colors hover:text-ice"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="text-[13px] text-steel transition-colors hover:text-ice"
            >
              Entrar
            </Link>
            <Button href="/orcamento" size="sm">
              Tirar minha ideia do papel
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </Button>
          </div>

          <button
            className="relative z-[70] flex h-10 w-10 items-center justify-center md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 top-0 h-px w-5 bg-ice transition-all duration-300 ${
                  open ? "top-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-px w-5 bg-ice transition-opacity duration-300 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-3 h-px w-5 bg-ice transition-all duration-300 ${
                  open ? "top-1.5 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* fullscreen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={
              reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }
            }
            exit={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-[65] flex flex-col bg-ink noise md:hidden"
          >
            <div className="flex-1 px-6 pt-28">
              <nav className="flex flex-col">
                {[
                  { href: onHome ? "#servicos" : "/#servicos", label: "Serviços", n: "01" },
                  { href: "/portfolio", label: "Portfólio", n: "02" },
                  { href: "/acompanhar", label: "Acompanhar", n: "03" },
                  { href: "/orcamento", label: "Orçamento", n: "04" },
                  { href: "/login", label: "Entrar", n: "05" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={reduced ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
                    className="border-b border-line"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between py-5"
                    >
                      <span className="text-3xl font-medium tracking-tight text-ice">
                        {item.label}
                      </span>
                      <span className="font-mono text-[11px] text-steel">{item.n}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between border-t border-line px-6 py-5"
            >
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="text-[13px] text-steel">
                WhatsApp do estúdio
              </a>
              <span className="font-mono text-[10px] text-steel-dim">
                INDEPENDENT DIGITAL DEVELOPMENT STUDIO
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
