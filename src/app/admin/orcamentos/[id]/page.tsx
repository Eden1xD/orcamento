import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { quotes, services, addons as addonsTable, quoteEvents } from "@/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import { getSettings, buildWhatsAppLink } from "@/lib/settings";
import { formatBRL, formatDate, formatDateTime, QUOTE_STATUS_LABEL, TIMELINE_LABEL } from "@/lib/format";
import { PageHead, StatusBadge, MsgBanner, Button } from "@/components/ui";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { updateQuoteStatus, updateQuoteFinalValue, deleteQuote } from "@/server/actions";
import FinalValueForm from "./FinalValueForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Orçamento" };

const STATUS_OPTIONS = ["novo", "analise", "aprovado", "recusado", "concluido"];

export default async function QuoteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ msg?: string }>;
}) {
  const { id } = await params;
  const { msg } = await searchParams;

  const [rows, settings] = await Promise.all([
    db
      .select({
        quote: quotes,
        serviceName: services.name,
      })
      .from(quotes)
      .leftJoin(services, eq(quotes.serviceId, services.id))
      .where(eq(quotes.id, id))
      .limit(1),
    getSettings(),
  ]);
  const row = rows[0];
  if (!row) notFound();
  const quote = row.quote;

  const [events, addonNames] = await Promise.all([
    db
      .select()
      .from(quoteEvents)
      .where(eq(quoteEvents.quoteId, id))
      .orderBy(desc(quoteEvents.createdAt)),
    quote.addons.length > 0
      ? db.select().from(addonsTable).where(inArray(addonsTable.id, quote.addons))
      : [],
  ]);

  const waMessage = `${settings.whatsapp_message}\n\nProtocolo da solicitação: ${quote.protocol}`;
  const waHref = buildWhatsAppLink(settings, waMessage);

  return (
    <div>
      <MsgBanner msg={msg} />
      <Link
        href="/admin/orcamentos"
        className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] text-steel-dim transition-colors hover:text-ice"
      >
        ← ORÇAMENTOS
      </Link>
      <PageHead
        index={`PROTOCOLO — ${quote.protocol}`}
        title={quote.clientName}
        description={`Recebido em ${formatDate(quote.createdAt)} · ${row.serviceName || "Serviço não definido"}`}
      >
        <StatusBadge status={quote.status} label={QUOTE_STATUS_LABEL[quote.status]} />
      </PageHead>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        {/* left column */}
        <div className="space-y-4">
          <section className="rounded-lg border border-line bg-charcoal p-5">
            <h2 className="mb-4 font-mono text-[10px] tracking-[0.2em] text-steel-dim">
              INFORMAÇÕES DO CLIENTE
            </h2>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Info label="E-mail" value={quote.email} href={`mailto:${quote.email}`} />
              <Info label="Telefone" value={quote.phone || "—"} href={quote.phone ? `tel:${quote.phone}` : undefined} />
              <Info label="Empresa" value={quote.company || "—"} />
              <Info
                label="Prazo pretendido"
                value={quote.timeline ? TIMELINE_LABEL[quote.timeline] || quote.timeline : "—"}
              />
            </dl>
          </section>

          <section className="rounded-lg border border-line bg-charcoal p-5">
            <h2 className="mb-3 font-mono text-[10px] tracking-[0.2em] text-steel-dim">
              DESCRIÇÃO DO PROJETO
            </h2>
            <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-ice/90">
              {quote.description || "Sem descrição fornecida."}
            </p>
          </section>

          <section className="rounded-lg border border-line bg-charcoal p-5">
            <h2 className="mb-3 font-mono text-[10px] tracking-[0.2em] text-steel-dim">
              FUNCIONALIDADES / ADICIONAIS
            </h2>
            {addonNames.length === 0 ? (
              <p className="text-[13px] text-steel">Nenhum adicional selecionado — apenas o escopo base do serviço.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {addonNames.map((a) => (
                  <span key={a.id} className="rounded-md border border-line bg-ink/40 px-3 py-1.5 text-[12px] text-ice">
                    {a.name} <span className="font-mono text-[11px] text-cobalt-soft">+{formatBRL(a.price)}</span>
                  </span>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-lg border border-line bg-charcoal p-5">
            <h2 className="mb-4 font-mono text-[10px] tracking-[0.2em] text-steel-dim">
              HISTÓRICO
            </h2>
            {events.length === 0 ? (
              <p className="text-[13px] text-steel">Sem eventos registrados.</p>
            ) : (
              <ol className="relative space-y-4 border-l border-line pl-5">
                {events.map((e) => (
                  <li key={e.id} className="relative">
                    <span className="absolute -left-[23px] top-1.5 h-2 w-2 rounded-full bg-cobalt" />
                    <p className="text-[13px] font-medium text-ice">
                      {QUOTE_STATUS_LABEL[e.status] || e.status}
                    </p>
                    {e.note && <p className="mt-0.5 text-[12px] text-steel">{e.note}</p>}
                    <p className="mt-0.5 font-mono text-[10px] text-steel-dim">{formatDateTime(e.createdAt)}</p>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        {/* right column */}
        <div className="space-y-4">
          <section className="rounded-lg border border-line bg-charcoal p-5">
            <h2 className="mb-4 font-mono text-[10px] tracking-[0.2em] text-steel-dim">VALORES</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-steel">Valor base (estimativa)</span>
                <span className="font-mono text-[15px] font-medium text-ice">{formatBRL(quote.baseValue)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-[13px] text-steel">Valor final fechado</span>
                <span className={`font-mono text-[15px] font-medium ${quote.finalValue ? "text-emerald-300" : "text-steel-dim"}`}>
                  {formatBRL(quote.finalValue)}
                </span>
              </div>
              <FinalValueForm quoteId={id} current={quote.finalValue} />
            </div>
          </section>

          <section className="rounded-lg border border-line bg-charcoal p-5">
            <h2 className="mb-4 font-mono text-[10px] tracking-[0.2em] text-steel-dim">STATUS</h2>
            <form action={updateQuoteStatus} className="space-y-3">
              <input type="hidden" name="id" value={id} />
              <select name="status" defaultValue={quote.status} className="field">
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {QUOTE_STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              <input
                name="note"
                className="field"
                placeholder="Observação (opcional) — entra no histórico"
              />
              <Button type="submit" variant="primary" size="md" className="w-full">
                Atualizar status
              </Button>
            </form>
          </section>

          <section className="rounded-lg border border-line bg-charcoal p-5">
            <h2 className="mb-4 font-mono text-[10px] tracking-[0.2em] text-steel-dim">AÇÕES</h2>
            <div className="space-y-2.5">
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-emerald-400/30 bg-emerald-400/10 text-[13px] font-medium text-emerald-300 transition-colors hover:bg-emerald-400/20"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chamar cliente no WhatsApp
              </a>
              <Button
                href={`/admin/orcamentos/${id}/proposta`}
                variant="ghost"
                size="md"
                className="w-full"
              >
                Gerar proposta em PDF
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v8M4 7l3 3 3-3M2.5 11.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </Button>
              <ConfirmDelete action={deleteQuote} id={id} label="Remover orçamento" />
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-steel-dim">
              A mensagem do WhatsApp é definida em Configurações → WhatsApp.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div>
      <dt className="text-[11px] text-steel-dim">{label}</dt>
      <dd className="mt-0.5 break-words text-[14px] text-ice">
        {href ? (
          <a href={href} className="link-underline text-cobalt-soft">{value}</a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
