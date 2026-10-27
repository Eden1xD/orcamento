import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { quotes, services } from "@/db/schema";
import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { formatBRL, timeAgo, QUOTE_STATUS_LABEL } from "@/lib/format";
import { PageHead, StatusBadge, MsgBanner, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Orçamentos" };

const FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "novo", label: "Novos" },
  { id: "analise", label: "Em análise" },
  { id: "aprovado", label: "Aprovados" },
  { id: "concluido", label: "Concluídos" },
  { id: "recusado", label: "Recusados" },
];

export default async function OrcamentosAdmin({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;

  const where = and(
    q
      ? or(
          like(quotes.protocol, `%${q}%`),
          like(quotes.clientName, `%${q}%`),
          like(quotes.email, `%${q}%`),
        )
      : undefined,
    status && status !== "todos" ? eq(quotes.status, status as never) : undefined,
  );

  const rows = await db
    .select({
      id: quotes.id,
      protocol: quotes.protocol,
      clientName: quotes.clientName,
      email: quotes.email,
      serviceId: quotes.serviceId,
      serviceName: services.name,
      baseValue: quotes.baseValue,
      finalValue: quotes.finalValue,
      status: quotes.status,
      createdAt: quotes.createdAt,
    })
    .from(quotes)
    .leftJoin(services, eq(quotes.serviceId, services.id))
    .where(where)
    .orderBy(desc(quotes.createdAt))
    .limit(100);

  const counts = await db
    .select({ status: quotes.status, n: sql<number>`count(*)` })
    .from(quotes)
    .groupBy(quotes.status);
  const countBy = (s: string) => counts.find((c) => c.status === s)?.n ?? 0;

  return (
    <div>
      <MsgBanner msg={undefined} />
      <PageHead
        index="02 — PIPELINE"
        title="Orçamentos"
        description="Solicitações recebidas pelo site, do primeiro contato ao fechamento."
      />

      {/* filters */}
      <form className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          className="field sm:max-w-xs"
          placeholder="Buscar por protocolo, cliente ou e-mail…"
          defaultValue={q ?? ""}
          name="q"
        />
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => {
            const active = (status ?? "todos") === f.id;
            const count =
              f.id === "todos"
                ? counts.reduce((a, c) => a + c.n, 0)
                : countBy(f.id);
            return (
              <Link
                key={f.id}
                href={
                  "/admin/orcamentos" +
                  (f.id !== "todos" ? `?status=${f.id}` : "") +
                  (q ? `&q=${encodeURIComponent(q)}` : "")
                }
                className={`rounded-full border px-3 py-1.5 text-[12px] transition-colors ${
                  active
                    ? "border-cobalt bg-cobalt/10 text-ice"
                    : "border-line text-steel hover:border-steel/40 hover:text-ice"
                }`}
              >
                {f.label} <span className="font-mono text-[10px] opacity-70">{count}</span>
              </Link>
            );
          })}
        </div>
      </form>

      {rows.length === 0 ? (
        <EmptyState
          title={q || (status && status !== "todos") ? "Nenhum resultado com esses filtros" : "Nenhum orçamento ainda"}
          description={
            q || (status && status !== "todos")
              ? "Tente outra busca ou remova os filtros."
              : "Assim que alguém enviar uma solicitação pelo site, ela aparece aqui com protocolo e estimativa."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-charcoal">
          {/* desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-line font-mono text-[10px] tracking-wider text-steel-dim">
                  <th className="px-5 py-3 font-medium">PROTOCOLO</th>
                  <th className="px-4 py-3 font-medium">CLIENTE</th>
                  <th className="px-4 py-3 font-medium">SERVIÇO</th>
                  <th className="px-4 py-3 font-medium">ESTIMATIVA</th>
                  <th className="px-4 py-3 font-medium">FINAL</th>
                  <th className="px-4 py-3 font-medium">STATUS</th>
                  <th className="px-4 py-3 font-medium">RECEBIDO</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="group border-b border-line/50 transition-colors last:border-0 hover:bg-ice/[0.03]">
                    <td className="px-5 py-3.5" colSpan={7}>
                      <Link href={`/admin/orcamentos/${row.id}`} className="block">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="font-mono text-[12px] font-medium text-cobalt-soft group-hover:underline">
                            {row.protocol}
                          </span>
                          <span className="text-[13px] text-ice">{row.clientName}</span>
                          <span className="text-[12px] text-steel">{row.serviceName || "—"}</span>
                          <span className="font-mono text-[12px] text-ice">{formatBRL(row.baseValue)}</span>
                          <span className="font-mono text-[12px] text-steel-dim">
                            {formatBRL(row.finalValue)}
                          </span>
                          <StatusBadge status={row.status} label={QUOTE_STATUS_LABEL[row.status]} />
                          <span className="ml-auto font-mono text-[11px] text-steel-dim">
                            {timeAgo(row.createdAt)}
                          </span>
                        </div>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* mobile cards */}
          <div className="divide-y divide-line md:hidden">
            {rows.map((row) => (
              <Link key={row.id} href={`/admin/orcamentos/${row.id}`} className="block p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[12px] font-medium text-cobalt-soft">{row.protocol}</span>
                  <StatusBadge status={row.status} label={QUOTE_STATUS_LABEL[row.status]} />
                </div>
                <p className="mt-2 text-[14px] font-medium text-ice">{row.clientName}</p>
                <p className="mt-0.5 text-[12px] text-steel">{row.serviceName || "Serviço não definido"}</p>
                <div className="mt-2 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-steel-dim">{timeAgo(row.createdAt)}</span>
                  <span className="text-ice">{formatBRL(row.baseValue)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
