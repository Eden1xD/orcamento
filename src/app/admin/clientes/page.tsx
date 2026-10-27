import type { Metadata } from "next";
import { db } from "@/db";
import { clients, quotes } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { formatDate } from "@/lib/format";
import { PageHead, MsgBanner, EmptyState, Button } from "@/components/ui";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { saveClient, deleteClient } from "@/server/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Clientes" };

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string; editar?: string; novo?: string }>;
}) {
  const { msg, editar, novo } = await searchParams;
  const [all, editing] = await Promise.all([
    db
      .select({
        client: clients,
        quoteCount: sql<number>`count(${quotes.id})`,
      })
      .from(clients)
      .leftJoin(quotes, sql`${quotes.email} = ${clients.email}`)
      .groupBy(clients.id)
      .orderBy(desc(clients.createdAt)),
    editar
      ? db.select().from(clients).where(eq(clients.id, editar)).limit(1)
      : Promise.resolve([] as (typeof clients.$inferSelect)[]),
  ]);
  const edit = editing[0] ?? null;
  const showForm = Boolean(edit) || novo === "1";

  return (
    <div>
      <MsgBanner msg={msg} />
      <PageHead
        index="03 — PIPELINE"
        title="Clientes"
        description="Base de clientes do estúdio."
      >
        {!showForm && (
          <Button href="/admin/clientes?novo=1" size="sm">
            + Novo cliente
          </Button>
        )}
      </PageHead>

      {showForm && (
        <form
          action={saveClient}
          className="mb-6 rounded-lg border border-cobalt/30 bg-charcoal p-5"
        >
          <input type="hidden" name="id" value={edit?.id ?? ""} />
          <div className="mb-1 font-mono text-[10px] tracking-[0.2em] text-cobalt-soft">
            {edit ? "EDITAR CLIENTE" : "NOVO CLIENTE"}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">Nome *</label>
              <input name="name" className="field" defaultValue={edit?.name ?? ""} required />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">Empresa</label>
              <input name="company" className="field" defaultValue={edit?.company ?? ""} />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">E-mail</label>
              <input name="email" type="email" className="field" defaultValue={edit?.email ?? ""} />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">Telefone / WhatsApp</label>
              <input name="phone" className="field" defaultValue={edit?.phone ?? ""} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[12px] text-steel">Notas internas</label>
              <textarea name="notes" rows={2} className="field" defaultValue={edit?.notes ?? ""} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button type="submit" size="sm">
              {edit ? "Salvar alterações" : "Criar cliente"}
            </Button>
            <Button href="/admin/clientes" variant="ghost" size="sm">
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {all.length === 0 ? (
        <EmptyState
          title="Nenhum cliente cadastrado"
          description="Cadastre clientes manualmente ou acompanhe os contatos que chegam pelos orçamentos."
        >
          <Button href="/admin/clientes?novo=1" size="sm">
            Cadastrar cliente
          </Button>
        </EmptyState>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-charcoal">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[680px] text-left">
              <thead>
                <tr className="border-b border-line font-mono text-[10px] tracking-wider text-steel-dim">
                  <th className="px-5 py-3 font-medium">NOME</th>
                  <th className="px-4 py-3 font-medium">EMPRESA</th>
                  <th className="px-4 py-3 font-medium">CONTATO</th>
                  <th className="px-4 py-3 font-medium">ORÇAMENTOS</th>
                  <th className="px-4 py-3 font-medium">CRIADO</th>
                  <th className="px-4 py-3 text-right font-medium">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {all.map(({ client, quoteCount }) => (
                  <tr key={client.id} className="border-b border-line/50 last:border-0 hover:bg-ice/[0.03]">
                    <td className="px-5 py-3.5 text-[13px] font-medium text-ice">{client.name}</td>
                    <td className="px-4 py-3.5 text-[13px] text-steel">{client.company || "—"}</td>
                    <td className="px-4 py-3.5">
                      <span className="block text-[12px] text-steel">{client.email || "—"}</span>
                      <span className="block font-mono text-[11px] text-steel-dim">{client.phone || ""}</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[12px] text-ice">{quoteCount}</td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-steel-dim">{formatDate(client.createdAt)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <a href={`/admin/clientes?editar=${client.id}`} className="rounded-md border border-line px-3 py-1.5 text-[12px] text-steel transition-colors hover:border-steel/40 hover:text-ice">
                          Editar
                        </a>
                        <ConfirmDelete action={deleteClient} id={client.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="divide-y divide-line md:hidden">
            {all.map(({ client, quoteCount }) => (
              <div key={client.id} className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-medium text-ice">{client.name}</p>
                  <span className="font-mono text-[11px] text-steel-dim">
                    {quoteCount} orç.
                  </span>
                </div>
                <p className="mt-1 text-[12px] text-steel">{client.company || "—"}</p>
                <p className="text-[12px] text-steel">{client.email || ""}</p>
                <div className="mt-3 flex items-center gap-2">
                  <a href={`/admin/clientes?editar=${client.id}`} className="rounded-md border border-line px-3 py-1.5 text-[12px] text-steel">
                    Editar
                  </a>
                  <ConfirmDelete action={deleteClient} id={client.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
