import type { Metadata } from "next";
import { db } from "@/db";
import { portfolio } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { PageHead, MsgBanner, EmptyState, Button } from "@/components/ui";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { savePortfolio, deletePortfolio } from "@/server/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Portfólio" };

export default async function PortfolioAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string; editar?: string; novo?: string }>;
}) {
  const { msg, editar, novo } = await searchParams;
  const [all, editing] = await Promise.all([
    db.select().from(portfolio).orderBy(desc(portfolio.createdAt)),
    editar
      ? db.select().from(portfolio).where(eq(portfolio.id, editar)).limit(1)
      : Promise.resolve([] as (typeof portfolio.$inferSelect)[]),
  ]);
  const edit = editing[0] ?? null;
  const showForm = Boolean(edit) || novo === "1";

  return (
    <div>
      <MsgBanner msg={msg} />
      <PageHead
        index="05 — CONTEÚDO"
        title="Portfólio"
        description="Cases publicados no site. Só o que estiver 'publicado' aparece para visitantes."
      >
        {!showForm && (
          <Button href="/admin/portfolio?novo=1" size="sm">
            + Novo case
          </Button>
        )}
      </PageHead>

      {showForm && (
        <form
          action={savePortfolio}
          className="mb-6 space-y-4 rounded-lg border border-cobalt/30 bg-charcoal p-5"
        >
          <input type="hidden" name="id" value={edit?.id ?? ""} />
          <div className="font-mono text-[10px] tracking-[0.2em] text-cobalt-soft">
            {edit ? "EDITAR CASE" : "NOVO CASE"}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">Título *</label>
              <input name="title" className="field" defaultValue={edit?.title ?? ""} required />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">Slug (URL)</label>
              <input
                name="slug"
                className="field"
                placeholder="gerado automaticamente se vazio"
                defaultValue={edit?.slug ?? ""}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">Categoria</label>
              <input
                name="category"
                className="field"
                defaultValue={edit?.category ?? "Website"}
                placeholder="Website, App, Sistema, Automação…"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">Ordem no site</label>
              <input
                name="order"
                type="number"
                className="field"
                defaultValue={edit?.order ?? 0}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] text-steel">Frase de destaque (tagline)</label>
            <input
              name="tagline"
              className="field"
              defaultValue={edit?.tagline ?? ""}
              placeholder="Uma linha que resume o resultado do projeto"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] text-steel">Descrição geral</label>
            <textarea
              name="description"
              rows={3}
              className="field"
              defaultValue={edit?.description ?? ""}
              placeholder="Contexto do projeto: quem é o cliente, o que o produto faz…"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">O desafio</label>
              <textarea
                name="challenge"
                rows={3}
                className="field"
                defaultValue={edit?.challenge ?? ""}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">A solução</label>
              <textarea
                name="solution"
                rows={3}
                className="field"
                defaultValue={edit?.solution ?? ""}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">
                Funcionalidades — uma por linha
              </label>
              <textarea
                name="features"
                rows={4}
                className="field"
                defaultValue={edit?.features.join("\n") ?? ""}
                placeholder={"Agenda inteligente\nRelatórios em tempo real"}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">
                Tecnologias — separadas por vírgula
              </label>
              <textarea
                name="technologies"
                rows={4}
                className="field"
                defaultValue={edit?.technologies.join(", ") ?? ""}
                placeholder="Next.js, PostgreSQL, React Native"
              />
            </div>
          </div>

          {/* images editor */}
          <div className="rounded-md border border-line bg-ink/40 p-4">
            <p className="mb-3 font-mono text-[10px] tracking-[0.2em] text-steel-dim">
              IMAGENS — CAPA, SCREENSHOTS E MOCKUPS
            </p>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">
                URL da imagem de capa (foto de campanha ou mockup)
              </label>
              <input
                name="coverImage"
                className="field"
                defaultValue={edit?.coverImage ?? ""}
                placeholder="https://…/capa.jpg"
              />
              {edit?.coverImage && (
                <ImagePreview src={edit.coverImage} label="capa atual" />
              )}
            </div>
            <div className="mt-3">
              <label className="mb-1.5 block text-[12px] text-steel">
                Galeria — uma URL por linha
              </label>
              <textarea
                name="gallery"
                rows={4}
                className="field"
                defaultValue={edit?.gallery.join("\n") ?? ""}
                placeholder={"https://…/tela-1.jpg\nhttps://…/tela-2.jpg"}
              />
              {edit && edit.gallery.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {edit.gallery.slice(0, 4).map((src, i) => (
                    <ImagePreview key={i} src={src} label={`tela ${i + 1}`} small />
                  ))}
                </div>
              )}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-steel-dim">
              Use capturas reais dos produtos sempre que possível. Imagens hospedadas
              em CDN ou no bucket do estúdio funcionam melhor que links de pastas locais.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] text-steel">
              Link para acessar o projeto (opcional)
            </label>
            <input
              name="link"
              className="field"
              defaultValue={edit?.link ?? ""}
              placeholder="https://produto.com.br"
            />
          </div>

          <div className="flex flex-wrap gap-5 pt-1">
            <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ice">
              <input
                type="checkbox"
                name="published"
                className="h-4 w-4 accent-cobalt"
                defaultChecked={edit?.published ?? false}
              />
              Publicado no site
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ice">
              <input
                type="checkbox"
                name="featured"
                className="h-4 w-4 accent-cobalt"
                defaultChecked={edit?.featured ?? false}
              />
              Destaque (capa maior)
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" size="sm">
              {edit ? "Salvar case" : "Criar case"}
            </Button>
            <Button href="/admin/portfolio" variant="ghost" size="sm">
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {all.length === 0 ? (
        <EmptyState
          title="Nenhum case no portfólio"
          description="Cadastre os projetos que deseja exibir. Cada case tem capa, desafio, solução, funcionalidades, galeria e tecnologias."
        >
          <Button href="/admin/portfolio?novo=1" size="sm">
            Criar primeiro case
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-3">
          {all.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-4 rounded-lg border border-line bg-charcoal p-4"
            >
              {p.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.coverImage}
                  alt=""
                  className="h-14 w-20 rounded-md border border-line object-cover"
                />
              ) : (
                <span className="flex h-14 w-20 items-center justify-center rounded-md border border-dashed border-line font-mono text-[10px] text-steel-dim">
                  sem capa
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[14px] font-medium text-ice">{p.title}</p>
                  <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-steel">
                    {p.category}
                  </span>
                  {p.published ? (
                    <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                      Publicado
                    </span>
                  ) : (
                    <span className="rounded-full border border-line px-2 py-0.5 text-[10px] text-steel-dim">
                      Rascunho
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate font-mono text-[11px] text-steel-dim">
                  /portfolio/{p.slug}
                  {p.link ? ` · ${p.link}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/portfolio/${p.slug}`}
                  className="rounded-md border border-line px-3 py-1.5 text-[12px] text-steel transition-colors hover:border-steel/40 hover:text-ice"
                >
                  Ver
                </a>
                <a
                  href={`/admin/portfolio?editar=${p.id}`}
                  className="rounded-md border border-line px-3 py-1.5 text-[12px] text-steel transition-colors hover:border-steel/40 hover:text-ice"
                >
                  Editar
                </a>
                <ConfirmDelete action={deletePortfolio} id={p.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ImagePreview({
  src,
  label,
  small,
}: {
  src: string;
  label: string;
  small?: boolean;
}) {
  return (
    <figure className="overflow-hidden rounded-md border border-line">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={label}
        className={small ? "h-14 w-20 object-cover" : "max-h-28 w-full object-cover"}
      />
      <figcaption className="bg-ink px-2 py-1 font-mono text-[9px] text-steel-dim">
        {label}
      </figcaption>
    </figure>
  );
}
