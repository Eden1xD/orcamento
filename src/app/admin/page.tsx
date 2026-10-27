import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { quotes, projects, notifications, services } from "@/db/schema";
import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { formatBRL, timeAgo, QUOTE_STATUS_LABEL } from "@/lib/format";
import { PageHead, StatusBadge, Skeleton } from "@/components/ui";
import BarChart from "@/components/admin/BarChart";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Painel" };

const MONTH_LABEL = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
};

export default async function AdminDashboard() {
  const since = new Date();
  since.setMonth(since.getMonth() - 5);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const [
    totalQ,
    pendingQ,
    approvedQ,
    activeP,
    estimatedSum,
    closedSum,
    monthly,
    recentNotifs,
    recentQuotes,
  ] = await Promise.all([
    db.select({ n: sql<number>`count(*)` }).from(quotes),
    db
      .select({ n: sql<number>`count(*)` })
      .from(quotes)
      .where(inArray(quotes.status, ["novo", "analise"])),
    db
      .select({ n: sql<number>`count(*)` })
      .from(quotes)
      .where(inArray(quotes.status, ["aprovado", "concluido"])),
    db
      .select({ n: sql<number>`count(*)` })
      .from(projects)
      .where(inArray(projects.status, ["planejamento", "andamento", "revisao"])),
    db
      .select({ v: sql<number>`coalesce(sum(${quotes.baseValue}), 0)` })
      .from(quotes)
      .where(inArray(quotes.status, ["novo", "analise"])),
    db
      .select({ v: sql<number>`coalesce(sum(${quotes.finalValue}), 0)` })
      .from(quotes)
      .where(and(inArray(quotes.status, ["aprovado", "concluido"]), sql`${quotes.finalValue} is not null`)),
    db
      .select({
        ym: sql<string>`to_char(${quotes.createdAt}, 'YYYY-MM')`,
        count: sql<number>`count(*)`,
        value: sql<number>`coalesce(sum(${quotes.baseValue}), 0)`,
      })
      .from(quotes)
      .where(gte(quotes.createdAt, since))
      .groupBy(sql`to_char(${quotes.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`to_char(${quotes.createdAt}, 'YYYY-MM')`),
    db
      .select()
      .from(notifications)
      .orderBy(desc(notifications.createdAt))
      .limit(6),
    db
      .select({
        id: quotes.id,
        protocol: quotes.protocol,
        clientName: quotes.clientName,
        status: quotes.status,
        baseValue: quotes.baseValue,
        createdAt: quotes.createdAt,
        serviceName: services.name,
      })
      .from(quotes)
      .leftJoin(services, eq(quotes.serviceId, services.id))
      .orderBy(desc(quotes.createdAt))
      .limit(5),
  ]);

  // build 6-month window
  const months: { label: string; count: number; value: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    d.setDate(1);
    const ym = d.toISOString().slice(0, 7);
    const row = monthly.find((m) => m.ym === ym);
    months.push({
      label: MONTH_LABEL(ym).toUpperCase(),
      count: row ? Number(row.count) : 0,
      value: row ? Number(row.value) : 0,
    });
  }

  const stats = [
    { label: "Orçamentos recebidos", value: String(totalQ[0].n), sub: "total no período" },
    { label: "Aguardando análise", value: String(pendingQ[0].n), sub: "novo + em análise" },
    { label: "Propostas aprovadas", value: String(approvedQ[0].n), sub: "aprovado + concluído" },
    { label: "Projetos ativos", value: String(activeP[0].n), sub: "em produção" },
    { label: "Valores estimados", value: formatBRL(Number(estimatedSum[0].v)), sub: "pipeline aberto" },
    { label: "Valores fechados", value: formatBRL(Number(closedSum[0].v)), sub: "propostas aceitas" },
  ];

  return (
    <div>
      <PageHead index="01 — VISÃO GERAL" title="Dashboard" description="O pulso do estúdio, em tempo real." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-line bg-charcoal p-4">
            <p className="text-[11px] leading-snug text-steel">{s.label}</p>
            <p className="mt-2 font-mono text-xl font-medium tracking-tight text-ice sm:text-2xl">
              {s.value}
            </p>
            <p className="mt-1 font-mono text-[10px] text-steel-dim">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border border-line bg-charcoal p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-medium text-ice">Orçamentos por mês</h2>
              <p className="mt-0.5 text-[12px] text-steel">Últimos 6 meses</p>
            </div>
            <Link href="/admin/orcamentos" className="link-underline text-[12px] font-medium text-cobalt-soft">
              Ver todos →
            </Link>
          </div>
          <BarChart data={months} />
        </div>

        <div className="rounded-lg border border-line bg-charcoal p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-medium text-ice">Atividades recentes</h2>
            <Link href="/admin/notificacoes" className="link-underline text-[12px] font-medium text-cobalt-soft">
              Notificações →
            </Link>
          </div>
          {recentNotifs.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <p className="text-[13px] text-steel">Nada por aqui ainda.</p>
              <p className="mt-1 text-[11px] text-steel-dim">
                Novos orçamentos e aprovações aparecem nesta lista.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentNotifs.map((n) => (
                <Link
                  key={n.id}
                  href={n.link || "/admin"}
                  className="flex items-start gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-ice/5"
                >
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                      n.read ? "bg-steel-dim" : "bg-cobalt"
                    }`}
                  />
                  <span className="min-w-0">
                    <span className={`block truncate text-[13px] ${n.read ? "text-steel" : "font-medium text-ice"}`}>
                      {n.title}
                    </span>
                    <span className="block truncate text-[11px] text-steel-dim">{n.body}</span>
                  </span>
                  <span className="ml-auto shrink-0 font-mono text-[10px] text-steel-dim">
                    {timeAgo(n.createdAt)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-line bg-charcoal">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-[15px] font-medium text-ice">Últimos orçamentos</h2>
          <Link href="/admin/orcamentos" className="link-underline text-[12px] font-medium text-cobalt-soft">
            Abrir fila →
          </Link>
        </div>
        {recentQuotes.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-[13px] text-steel">Nenhum orçamento recebido ainda.</p>
            <p className="mt-1 text-[12px] text-steel-dim">
              Quando alguém enviar uma solicitação pelo site, ela aparece aqui.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-line font-mono text-[10px] tracking-wider text-steel-dim">
                  <th className="px-5 py-3 font-medium">PROTOCOLO</th>
                  <th className="px-4 py-3 font-medium">CLIENTE</th>
                  <th className="px-4 py-3 font-medium">SERVIÇO</th>
                  <th className="px-4 py-3 font-medium">ESTIMATIVA</th>
                  <th className="px-4 py-3 font-medium">STATUS</th>
                  <th className="px-4 py-3 font-medium">RECEBIDO</th>
                </tr>
              </thead>
              <tbody>
                {recentQuotes.map((q) => (
                  <tr key={q.id} className="border-b border-line/50 transition-colors last:border-0 hover:bg-ice/[0.03]">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orcamentos/${q.id}`} className="font-mono text-[12px] text-cobalt-soft hover:underline">
                        {q.protocol}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-ice">{q.clientName}</td>
                    <td className="px-4 py-3 text-[13px] text-steel">{q.serviceName || "—"}</td>
                    <td className="px-4 py-3 font-mono text-[12px] text-ice">{formatBRL(q.baseValue)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={q.status} label={QUOTE_STATUS_LABEL[q.status]} />
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-steel-dim">{timeAgo(q.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Skeleton className="hidden" />
    </div>
  );
}
