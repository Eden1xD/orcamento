export function formatBRL(cents: number | null | undefined): string {
  if (cents == null) return "—";
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatDate(d: Date | string): string {
  return new Date(d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(d: Date | string): string {
  return new Date(d).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(d: Date | string): string {
  const diff = Date.now() - new Date(d).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  const days = Math.floor(h / 24);
  if (days === 1) return "ontem";
  if (days < 30) return `há ${days} dias`;
  return formatDate(d);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function generateProtocol(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return `VTR-${new Date().getFullYear()}-${out}`;
}

export function parseMoney(input: string): number {
  const cleaned = input.replace(/[^\d]/g, "");
  if (!cleaned) return 0;
  return parseInt(cleaned, 10) * 100;
}

export const QUOTE_STATUS_LABEL: Record<string, string> = {
  novo: "Novo",
  analise: "Em análise",
  aprovado: "Aprovado",
  recusado: "Recusado",
  concluido: "Concluído",
};

export const PROJECT_STATUS_LABEL: Record<string, string> = {
  planejamento: "Planejamento",
  andamento: "Em andamento",
  revisao: "Revisão",
  pausado: "Pausado",
  concluido: "Concluído",
};

export const TIMELINE_LABEL: Record<string, string> = {
  agora: "O quanto antes",
  "30-90": "1 a 3 meses",
  "90-180": "3 a 6 meses",
  flexivel: "Ainda explorando",
};
