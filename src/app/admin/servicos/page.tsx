import type { Metadata } from "next";
import { db } from "@/db";
import { services } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { formatBRL } from "@/lib/format";
import { PageHead, MsgBanner, EmptyState, Button } from "@/components/ui";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { saveService, deleteService } from "@/server/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Serviços" };

export default async function ServicosPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string; editar?: string; novo?: string }>;
}) {
  const { msg, editar, novo } = await searchParams;
  const [all, editing] = await Promise.all([
    db.select().from(services).orderBy(asc(services.order)),
    editar
      ? db.select().from(services).where(eq(services.id, editar)).limit(1)
      : Promise.resolve([] as (typeof services.$inferSelect)[]),
  ]);
  const edit = editing[0] ?? null;
  const showForm = Boolean(edit) || novo === "1";

  return (
    <div>
      <MsgBanner msg={msg} />
      <PageHead
        index="06 — CONTEÚDO"
        title="Serviços"
        description="Serviços ofertados no site e no wizard de orçamento, com valor base."
      >
        {!showForm && (
          <Button href="/admin/servicos?novo=1" size="sm">
            + Novo serviço
          </Button>
        )}
      </PageHead>

      {showForm && (
        <form action={saveService} className="mb-6 rounded-lg border border-cobalt/30 bg-charcoal p-5">
          <input type="hidden" name="id" value={edit?.id ?? ""} />
          <div className="mb-1 font-mono text-[10px] tracking-[0.2em] text-cobalt-soft">
            {edit ? "EDITAR SERVIÇO" : "NOVO SERVIÇO"}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">Nome *</label>
              <input name="name" className="field" defaultValue={edit?.name ?? ""} required />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">Slug</label>
              <input
                name="slug"
                className="field"
                defaultValue={edit?.slug ?? ""}
                placeholder="websites"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[12px] text-steel">Tagline</label>
              <input
                name="tagline"
                className="field"
                defaultValue={edit?.tagline ?? ""}
                placeholder="Uma linha resumindo o serviço"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[12px] text-steel">Descrição</label>
              <textarea name="description" rows={2} className="field" defaultValue={edit?.description ?? ""} />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">Valor base (R$)</label>
              <input
                name="basePrice"
                type="number"
                min={0}
                className="field"
                defaultValue={edit ? edit.basePrice / 100 : 0}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">Ordem</label>
              <input name="order" type="number" className="field" defaultValue={edit?.order ?? 0} />
            </div>
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ice">
                <input
                  type="checkbox"
                  name="active"
                  className="h-4 w-4 accent-cobalt"
                  defaultChecked={edit?.active ?? true}
                />
                Ativo (aparece no site e no orçamento)
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button type="submit" size="sm">
              {edit ? "Salvar serviço" : "Criar serviço"}
            </Button>
            <Button href="/admin/servicos" variant="ghost" size="sm">
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {all.length === 0 ? (
        <EmptyState
          title="Nenhum serviço cadastrado"
          description="Crie os serviços que aparecem na seção de serviços e na etapa 1 do orçamento."
        >
          <Button href="/admin/servicos?novo=1" size="sm">Criar serviço</Button>
        </EmptyState>
      ) : (
        <div className="grid gap-3">
          {all.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center gap-4 rounded-lg border border-line bg-charcoal p-5">
              <span className="font-mono text-[11px] text-steel-dim">
                {String(s.order).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[14px] font-medium text-ice">{s.name}</p>
                  <span className="font-mono text-[11px] text-steel-dim">/{s.slug}</span>
                  {!s.active && (
                    <span className="rounded-full border border-line px-2 py-0.5 text-[10px] text-steel-dim">
                      Inativo
                    </span>
                  )}
                </div>
                {s.tagline && <p className="mt-1 truncate text-[12px] text-steel">{s.tagline}</p>}
              </div>
              <span className="font-mono text-[14px] font-medium text-cobalt-soft">
                {formatBRL(s.basePrice)}
              </span>
              <div className="flex items-center gap-2">
                <a href={`/admin/servicos?editar=${s.id}`} className="rounded-md border border-line px-3 py-1.5 text-[12px] text-steel transition-colors hover:border-steel/40 hover:text-ice">
                  Editar
                </a>
                <ConfirmDelete action={deleteService} id={s.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
