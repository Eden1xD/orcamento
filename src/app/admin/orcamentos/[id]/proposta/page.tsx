import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { quotes, services, addons as addonsTable } from "@/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import { getSettings } from "@/lib/settings";
import { formatBRL, formatDate, TIMELINE_LABEL } from "@/lib/format";
import PrintButton from "@/components/admin/PrintButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Proposta" };

export default async function PropostaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await db
    .select({
      quote: quotes,
      serviceName: services.name,
      serviceTagline: services.tagline,
    })
    .from(quotes)
    .leftJoin(services, eq(quotes.serviceId, services.id))
    .where(eq(quotes.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) notFound();
  const quote = row.quote;

  const [settings, addonRows] = await Promise.all([
    getSettings(),
    quote.addons.length > 0
      ? db.select().from(addonsTable).where(inArray(addonsTable.id, quote.addons))
      : Promise.resolve([] as (typeof addonsTable.$inferSelect)[]),
  ]);

  return (
    <div className="min-h-screen bg-[#e9ebf0] py-10 print:bg-white print:py-0">
      {/* toolbar */}
      <div className="no-print mx-auto mb-6 flex w-full max-w-[800px] items-center justify-between px-4">
        <Link
          href={`/admin/orcamentos/${quote.id}`}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-ink/15 bg-white px-4 text-[13px] font-medium text-ink transition-colors hover:bg-ink/5"
        >
          ← Voltar ao orçamento
        </Link>
        <PrintButton />
      </div>

      {/* document */}
      <article className="print-doc mx-auto w-full max-w-[800px] bg-white px-10 py-12 text-ink shadow-[0_30px_80px_rgba(8,9,12,0.18)] sm:px-14">
        {/* header */}
        <div className="flex items-start justify-between border-b-2 border-ink pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-ink">
                <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                  <path d="M9 9l14 14M23 9L9 23" stroke="#245BFF" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
              <span className="font-mono text-lg font-medium tracking-[0.3em]">
                {settings.studio_name}
              </span>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-ink/60">
              {settings.studio_tagline}
              <br />
              {settings.email_contact} · WhatsApp {settings.whatsapp_number}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] tracking-[0.25em] text-ink/50">PROPOSTA</p>
            <p className="mt-1 font-mono text-[13px] font-medium">{quote.protocol}</p>
            <p className="mt-1 text-[11px] text-ink/60">
              {formatDate(new Date().toISOString())}
            </p>
          </div>
        </div>

        {/* parties */}
        <div className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-ink/50">PREPARADA PARA</p>
            <p className="mt-2 text-[15px] font-semibold">{quote.clientName}</p>
            {quote.company && <p className="text-[13px] text-ink/70">{quote.company}</p>}
            <p className="mt-1 text-[13px] text-ink/70">{quote.email}</p>
            {quote.phone && <p className="text-[13px] text-ink/70">{quote.phone}</p>}
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] tracking-[0.22em] text-ink/50">OBJETO</p>
            <p className="mt-2 text-[15px] font-semibold">{row.serviceName || "Desenvolvimento digital"}</p>
            {row.serviceTagline && (
              <p className="mt-1 text-[13px] text-ink/70">{row.serviceTagline}</p>
            )}
            {quote.timeline && (
              <p className="mt-1 text-[13px] text-ink/70">
                Início: {TIMELINE_LABEL[quote.timeline] || quote.timeline}
              </p>
            )}
          </div>
        </div>

        {/* scope */}
        <section className="mt-10">
          <p className="font-mono text-[10px] tracking-[0.22em] text-ink/50">01 — CONTEXTUALIZAÇÃO</p>
          <p className="mt-3 whitespace-pre-wrap text-[13px] leading-relaxed text-ink/85">
            {quote.description ||
              "Projeto de desenvolvimento digital a ser detalhado em conversa com a equipe."}
          </p>
        </section>

        {/* items */}
        <section className="mt-8">
          <p className="font-mono text-[10px] tracking-[0.22em] text-ink/50">02 — ESCOPO E INVESTIMENTO</p>
          <table className="mt-3 w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-ink/20 text-left">
                <th className="py-2 pr-4 font-medium">Item</th>
                <th className="py-2 text-right font-medium">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-ink/10">
                <td className="py-2.5">
                  {row.serviceName || "Serviço"} — desenvolvimento base
                </td>
                <td className="py-2.5 text-right font-mono">{formatBRL(quote.baseValue - addonRows.reduce((a, x) => a + x.price, 0))}</td>
              </tr>
              {addonRows.map((a) => (
                <tr key={a.id} className="border-b border-ink/10">
                  <td className="py-2.5">
                    Adicional: {a.name}
                  </td>
                  <td className="py-2.5 text-right font-mono">{formatBRL(a.price)}</td>
                </tr>
              ))}
              <tr>
                <td className="py-3 font-semibold">
                  {quote.finalValue
                    ? "Investimento total (acordado)"
                    : "Estimativa inicial"}
                </td>
                <td className="py-3 text-right font-mono text-[15px] font-semibold">
                  {formatBRL(quote.finalValue ?? quote.baseValue)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* terms */}
        <section className="mt-8">
          <p className="font-mono text-[10px] tracking-[0.22em] text-ink/50">03 — CONDIÇÕES</p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[12px] leading-relaxed text-ink/75">
            <li>
              {quote.finalValue
                ? "Valor total acordado entre as partes, referente ao escopo descrito nesta proposta."
                : "Valor de estimativa inicial, sujeito a ajuste após análise técnica do escopo completo."}
            </li>
            <li>Escopo final, cronograma e forma de pagamento serão definidos em contrato após a aprovação desta proposta.</li>
            <li>
              A proposta está vinculada ao protocolo {quote.protocol} e ao e-mail {quote.email}.
            </li>
            <li>Validade da proposta: 15 dias a partir da data de emissão.</li>
          </ul>
        </section>

        {/* signature */}
        <div className="mt-14 grid grid-cols-2 gap-8 text-center">
          <div>
            <div className="mx-auto w-56 border-t border-ink/40 pt-2">
              <p className="text-[12px] font-medium">{settings.studio_name} Studio</p>
              <p className="text-[10px] text-ink/50">{settings.email_contact}</p>
            </div>
          </div>
          <div>
            <div className="mx-auto w-56 border-t border-ink/40 pt-2">
              <p className="text-[12px] font-medium">{quote.clientName}</p>
              <p className="text-[10px] text-ink/50">De acordo — cliente</p>
            </div>
          </div>
        </div>

        <p className="mt-12 border-t border-ink/15 pt-4 text-center font-mono text-[9px] tracking-[0.2em] text-ink/40">
          {settings.studio_name} STUDIO · {quote.protocol} · GERADO EM {formatDate(new Date().toISOString()).toUpperCase()}
        </p>
      </article>
    </div>
  );
}
