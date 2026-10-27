import type { Metadata } from "next";
import { db } from "@/db";
import { projects, clients } from "@/db/schema";
import { desc, eq, asc } from "drizzle-orm";
import { formatBRL, formatDate, PROJECT_STATUS_LABEL } from "@/lib/format";
import { PageHead, MsgBanner, EmptyState, Button, StatusBadge } from "@/components/ui";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { saveProject, deleteProject } from "@/server/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Projetos" };

const STATUS_OPTIONS = Object.entries(PROJECT_STATUS_LABEL);

export default async function ProjetosPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string; editar?: string; novo?: string }>;
}) {
  const { msg, editar, novo } = await searchParams;
  const [all, clientList, editing] = await Promise.all([
    db
      .select({
        project: projects,
        clientName: clients.name,
      })
      .from(projects)
      .leftJoin(clients, eq(projects.clientId, clients.id))
      .orderBy(desc(projects.updatedAt)),
    db.select().from(clients).orderBy(asc(clients.name)),
    editar
      ? db.select().from(projects).where(eq(projects.id, editar)).limit(1)
      : Promise.resolve([] as (typeof projects.$inferSelect)[]),
  ]);
  const edit = editing[0] ?? null;
  const showForm = Boolean(edit) || novo === "1";

  return (
    <div>
      <MsgBanner msg={msg} />
      <PageHead
        index="04 — PIPELINE"
        title="Projetos"
        description="Projetos em produção e sua evolução."
      >
        {!showForm && (
          <Button href="/admin/projetos?novo=1" size="sm">
            + Novo projeto
          </Button>
        )}
      </PageHead>

      {showForm && (
        <form action={saveProject} className="mb-6 rounded-lg border border-cobalt/30 bg-charcoal p-5">
          <input type="hidden" name="id" value={edit?.id ?? ""} />
          <div className="mb-1 font-mono text-[10px] tracking-[0.2em] text-cobalt-soft">
            {edit ? "EDITAR PROJETO" : "NOVO PROJETO"}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[12px] text-steel">Nome *</label>
              <input name="name" className="field" defaultValue={edit?.name ?? ""} required />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">Cliente</label>
              <select name="clientId" className="field" defaultValue={edit?.clientId ?? ""}>
                <option value="">Sem cliente vinculado</option>
                {clientList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">Status</label>
              <select name="status" className="field" defaultValue={edit?.status ?? "planejamento"}>
                {STATUS_OPTIONS.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">Orçamento (R$)</label>
              <input
                name="budget"
                className="field"
                inputMode="numeric"
                defaultValue={
                  edit?.budget != null ? (edit.budget / 100).toString() : ""
                }
                placeholder="ex.: 15000"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">Previsão de entrega</label>
              <input
                name="dueDate"
                type="date"
                className="field"
                defaultValue={edit?.dueDate ? edit.dueDate.toISOString().slice(0, 10) : ""}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[12px] text-steel">Descrição</label>
              <textarea name="description" rows={3} className="field" defaultValue={edit?.description ?? ""} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button type="submit" size="sm">
              {edit ? "Salvar alterações" : "Criar projeto"}
            </Button>
            <Button href="/admin/projetos" variant="ghost" size="sm">
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {all.length === 0 ? (
        <EmptyState
          title="Nenhum projeto cadastrado"
          description="Quando uma proposta é aprovada, transforme-a em projeto para acompanhar produção, prazo e orçamento."
        >
          <Button href="/admin/projetos?novo=1" size="sm">
            Criar projeto
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-3">
          {all.map(({ project, clientName }) => (
            <div key={project.id} className="rounded-lg border border-line bg-charcoal p-5">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-[15px] font-medium text-ice">{project.name}</h3>
                <StatusBadge status={project.status} label={PROJECT_STATUS_LABEL[project.status]} />
                <div className="ml-auto flex items-center gap-2">
                  <a href={`/admin/projetos?editar=${project.id}`} className="rounded-md border border-line px-3 py-1.5 text-[12px] text-steel transition-colors hover:border-steel/40 hover:text-ice">
                    Editar
                  </a>
                  <ConfirmDelete action={deleteProject} id={project.id} />
                </div>
              </div>
              <div className="mt-3 grid gap-2 text-[12px] text-steel sm:grid-cols-4">
                <span>
                  Cliente: <span className="text-ice">{clientName || "—"}</span>
                </span>
                <span>
                  Orçamento:{" "}
                  <span className="font-mono text-ice">
                    {project.budget != null ? formatBRL(project.budget) : "—"}
                  </span>
                </span>
                <span>
                  Entrega:{" "}
                  <span className="text-ice">
                    {project.dueDate ? formatDate(project.dueDate) : "—"}
                  </span>
                </span>
                <span>
                  Criado: <span className="font-mono text-steel-dim">{formatDate(project.createdAt)}</span>
                </span>
              </div>
              {project.description && (
                <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-steel">
                  {project.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
