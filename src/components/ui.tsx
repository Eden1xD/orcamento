import Link from "next/link";
import type { ReactNode } from "react";

/* ------------------------------- Button ------------------------------- */

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-300 select-none whitespace-nowrap";

const buttonVariants: Record<string, string> = {
  primary:
    "bg-cobalt text-ice hover:bg-cobalt-soft shadow-[0_8px_28px_rgba(36,91,255,0.28)] hover:shadow-[0_10px_34px_rgba(36,91,255,0.4)] active:translate-y-px",
  ghost:
    "border border-line text-ice hover:border-steel/50 hover:bg-ice/5 active:translate-y-px",
  "ghost-dark":
    "border border-line-dark text-ink hover:border-ink/40 hover:bg-ink/5 active:translate-y-px",
  light:
    "bg-ink text-ice hover:bg-ink/85 active:translate-y-px",
  danger: "bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20",
  "danger-solid": "bg-red-500 text-white hover:bg-red-400",
};

const buttonSizes: Record<string, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  className?: string;
  target?: string;
  disabled?: boolean;
  title?: string;
};

export function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  target,
  disabled,
  title,
}: ButtonProps) {
  const cls = `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${
    disabled ? "opacity-50 pointer-events-none" : ""
  } ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls} target={target} title={title}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled} title={title}>
      {children}
    </button>
  );
}

/* ------------------------------- Eyebrow ------------------------------ */

export function Eyebrow({
  children,
  className = "",
  light,
}: {
  children: ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <p
      className={`eyebrow flex items-center gap-3 ${
        light ? "text-ink/60" : "text-steel"
      } ${className}`}
    >
      <span className={`h-px w-8 ${light ? "bg-ink/40" : "bg-steel/40"}`} />
      {children}
    </p>
  );
}

/* ------------------------------ Msg banner ----------------------------- */

const MSG_LABEL: Record<string, string> = {
  "status-atualizado": "Status atualizado.",
  "valor-atualizado": "Valor final salvo.",
  "orcamento-removido": "Orçamento removido.",
  "cliente-criado": "Cliente criado.",
  "cliente-atualizado": "Cliente atualizado.",
  "cliente-removido": "Cliente removido.",
  "projeto-criado": "Projeto criado.",
  "projeto-atualizado": "Projeto atualizado.",
  "projeto-removido": "Projeto removido.",
  "projeto-criado-portfolio": "Projeto de portfólio criado.",
  "servico-criado": "Serviço criado.",
  "servico-atualizado": "Serviço atualizado.",
  "servico-removido": "Serviço removido.",
  "adicional-criado": "Adicional criado.",
  "adicional-atualizado": "Adicional atualizado.",
  "adicional-removido": "Adicional removido.",
  "configuracoes-salvas": "Configurações salvas.",
  "tudo-marcado-como-lido": "Todas as notificações marcadas como lidas.",
  "notificacao-removida": "Notificação removida.",
  "campo-obrigatorio": "Verifique os campos obrigatórios.",
};

export function MsgBanner({ msg }: { msg?: string }) {
  if (!msg) return null;
  const label = MSG_LABEL[msg];
  if (!label) return null;
  const isError = msg === "campo-obrigatorio";
  return (
    <div
      className={`mb-5 flex items-center gap-3 rounded-md border px-4 py-2.5 text-[13px] ${
        isError
          ? "border-red-500/25 bg-red-500/10 text-red-300"
          : "border-cobalt/30 bg-cobalt/10 text-cobalt-soft"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isError ? "bg-red-400" : "bg-cobalt"}`} />
      {label}
    </div>
  );
}

/* ----------------------------- Status badge ---------------------------- */

const STATUS_STYLE: Record<string, string> = {
  novo: "bg-cobalt/15 text-cobalt-soft border-cobalt/30",
  analise: "bg-amber-400/10 text-amber-300 border-amber-400/25",
  aprovado: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25",
  recusado: "bg-red-400/10 text-red-300 border-red-400/25",
  concluido: "bg-ice/10 text-ice border-ice/20",
  planejamento: "bg-ice/10 text-steel border-ice/15",
  andamento: "bg-cobalt/15 text-cobalt-soft border-cobalt/30",
  revisao: "bg-amber-400/10 text-amber-300 border-amber-400/25",
  pausado: "bg-red-400/10 text-red-300 border-red-400/25",
};

export function StatusBadge({ status, label }: { status: string; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
        STATUS_STYLE[status] || "bg-ice/10 text-steel border-ice/15"
      }`}
    >
      <span className="h-1 w-1 rounded-full bg-current" />
      {label}
    </span>
  );
}

/* ------------------------------ Empty state ---------------------------- */

export function EmptyState({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-line px-8 py-16 text-center ${className}`}
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-line">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 8l4 4 8-8" stroke="#9197A5" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-[15px] font-medium text-ice">{title}</h3>
      <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-steel">{description}</p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

/* ------------------------------- Skeleton ------------------------------ */

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-ice/5 ${className}`} />;
}

/* --------------------------------- Logo -------------------------------- */

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect x="1" y="1" width="30" height="30" rx="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 9l14 14M23 9L9 23" stroke="#245BFF" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={26} />
      <span className="font-mono text-[15px] font-medium tracking-[0.28em]">VETOR</span>
    </span>
  );
}

/* ------------------------------ Page header ---------------------------- */

export function PageHead({
  index,
  title,
  description,
  children,
}: {
  index: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="eyebrow mb-2 text-steel">{index}</p>
        <h1 className="text-2xl font-medium tracking-tight text-ice">{title}</h1>
        {description && <p className="mt-1.5 text-[13px] text-steel">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
