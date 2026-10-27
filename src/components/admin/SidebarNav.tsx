"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Wordmark } from "@/components/ui";

const NAV: { section: string; items: [string, string, string?][] }[] = [
  {
    section: "Visão geral",
    items: [["Dashboard", "/admin"]],
  },
  {
    section: "Pipeline",
    items: [
      ["Orçamentos", "/admin/orcamentos"],
      ["Clientes", "/admin/clientes"],
      ["Projetos", "/admin/projetos"],
    ],
  },
  {
    section: "Conteúdo",
    items: [
      ["Portfólio", "/admin/portfolio"],
      ["Serviços", "/admin/servicos"],
      ["Adicionais", "/admin/adicionais"],
      ["Preços base", "/admin/precos"],
    ],
  },
  {
    section: "Sistema",
    items: [
      ["Configurações", "/admin/configuracoes"],
      ["Notificações", "/admin/notificacoes"],
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export default function SidebarNav({
  unread,
  name,
  email,
}: {
  unread: number;
  name: string;
  email: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const reduced = useReducedMotion();

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-line px-5">
        <Link href="/admin" className="text-ice" onClick={() => setOpen(false)}>
          <Wordmark />
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {NAV.map((group) => (
          <div key={group.section} className="mb-6">
            <p className="mb-2 px-2 font-mono text-[10px] tracking-[0.22em] text-steel-dim">
              {group.section.toUpperCase()}
            </p>
            <div className="space-y-0.5">
              {group.items.map(([label, href, badge]) => {
                const active = isActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`group relative flex items-center justify-between rounded-md px-3 py-2 text-[13px] transition-colors ${
                      active
                        ? "bg-cobalt/12 font-medium text-ice"
                        : "text-steel hover:bg-ice/5 hover:text-ice"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {active && (
                        <span className="absolute left-0 h-4 w-0.5 rounded-full bg-cobalt" />
                      )}
                      {label}
                    </span>
                    {badge === "unread" && unread > 0 && (
                      <span className="rounded-full bg-cobalt px-1.5 py-0.5 font-mono text-[9px] font-medium text-ice">
                        {unread}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-line p-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cobalt/20 font-mono text-[12px] font-medium text-cobalt-soft">
            {name.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium text-ice">{name}</p>
            <p className="truncate font-mono text-[10px] text-steel-dim">{email}</p>
          </div>
          <button
            onClick={logout}
            disabled={loggingOut}
            title="Sair"
            aria-label="Sair da conta"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-steel transition-colors hover:border-steel/50 hover:text-ice"
          >
            {loggingOut ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border border-steel/40 border-t-ice" />
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M6 11H2.5A1.5 1.5 0 011 9.5v-5A1.5 1.5 0 012.5 3H6M10.5 10.5L13 7l-2.5-3.5M13 7H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-line bg-charcoal/60 backdrop-blur lg:block">
        {content}
      </aside>

      {/* mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menu do painel"
        className="fixed left-4 top-[calc(3.5rem+0.75rem)] z-40 flex h-9 w-9 items-center justify-center rounded-md border border-line bg-charcoal lg:hidden"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1.5 3.5h11M1.5 7h11M1.5 10.5h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={reduced ? { opacity: 0 } : { x: -260 }}
              animate={reduced ? { opacity: 1 } : { x: 0 }}
              exit={reduced ? { opacity: 0 } : { x: -260 }}
              transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] border-r border-line bg-charcoal lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
