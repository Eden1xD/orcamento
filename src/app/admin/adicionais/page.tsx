import type { Metadata } from "next";
import { db } from "@/db";
import { addons } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { formatBRL } from "@/lib/format";
import { PageHead, MsgBanner, EmptyState, Button } from "@/components/ui";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { saveAddon, deleteAddon } from "@/server/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Adicionais" };

export default async function AdicionaisPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string; editar?: string; novo?: string }>;
}) {
  const { msg, editar, novo } = await searchParams;
  const [all, editing] = await Promise.all([
    db.select().from(addons).orderBy(asc(addons.order)),
    editar
      ? db.select().from(addons).where(eq(addons.id, editar)).limit(1)
      : Promise.resolve([] as (typeof addons.$inferSelect)[]),
  ]);
  const edit = editing[0] ?? null;
  const showForm = Boolean(edit) || novo === "1";

  return (
    <div>
      <MsgBanner msg={msg} />
      <PageHead
        index="07 — CONTEÚDO"
        title="Adicionais"
        description="Opcionais que o cliente pode selecionar na etapa 2 do orçamento."
      >
        {!showForm && (
          <Button href="/admin/adicionais?novo=1" size="sm">
            + Novo adicional
          </Button>
        )}
      </PageHead>

      {showForm && (
        <form action={saveAddon} className="mb-6 rounded-lg border border-cobalt/30 bg-charcoal p-5">
          <input type="hidden" name="id" value={edit?.id ?? ""} />
          <div className="mb-1 font-mono text-[10px] tracking-[0.2em] text-cobalt-soft">
            {edit ? "EDITAR ADICIONAL" : "NOVO ADICIONAL"}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">Nome *</label>
              <input name="name" className="field" defaultValue={edit?.name ?? ""} required />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">Preço (R$)</label>
              <input name="price" type="number" min={0} className="field" defaultValue={edit ? edit.price / 100 : 0} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[12px] text-steel">Descrição</label>
              <input name="description" className="field" defaultValue={edit?.description ?? ""} />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">Ordem</label>
              <input name="order" type="number" className="field" defaultValue={edit?.order ?? 0} />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ice">
                <input
                  type="checkbox"
                  name="active"
                  className="h-4 w-4 accent-cobalt"
                  defaultChecked={edit?.active ?? true}
                />
                Ativo
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button type="submit" size="sm">
              {edit ? "Salvar adicional" : "Criar adicional"}
            </Button>
            <Button href="/admin/adicionais" variant="ghost" size="sm">
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {all.length === 0 ? (
        <EmptyState
          title="Nenhum adicional cadastrado"
          description="Adicionais aparecem como opções no orçamento: identidade visual, integrações, suporte…"
        >
          <Button href="/admin/adicionais?novo=1" size="sm">Criar adicional</Button>
        </EmptyState>
      ) : (
        <div className="grid gap-2">
          {all.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center gap-4 rounded-lg border border-line bg-charcoal p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[14px] font-medium text-ice">{a.name}</p>
                  {!a.active && (
                    <span className="rounded-full border border-line px-2 py-0.5 text-[10px] text-steel-dim">
                      Inativo
                    </span>
                  )}
                </div>
                {a.description && (
                  <p className="mt-0.5 truncate text-[12px] text-steel">{a.description}</p>
                )}
              </div>
              <span className="font-mono text-[13px] font-medium text-cobalt-soft">
                + {formatBRL(a.price)}
              </span>
              <div className="flex items-center gap-2">
                <a href={`/admin/adicionais?editar=${a.id}`} className="rounded-md border border-line px-3 py-1.5 text-[12px] text-steel transition-colors hover:border-steel/40 hover:text-ice">
                  Editar
                </a>
                <ConfirmDelete action={deleteAddon} id={a.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
