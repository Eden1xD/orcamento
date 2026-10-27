import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { services, addons } from "@/db/schema";
import { asc } from "drizzle-orm";
import { formatBRL } from "@/lib/format";
import { PageHead, MsgBanner } from "@/components/ui";
import { saveService, saveAddon } from "@/server/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Preços base" };

export default async function PrecosPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  const { msg } = await searchParams;
  const [svc, ad] = await Promise.all([
    db.select().from(services).orderBy(asc(services.order)),
    db.select().from(addons).orderBy(asc(addons.order)),
  ]);

  return (
    <div>
      <MsgBanner msg={msg} />
      <PageHead
        index="08 — CONTEÚDO"
        title="Preços base"
        description="Valores que alimentam a estimativa em tempo real no site. Ajuste aqui; a alteração vale para novos orçamentos."
      >
        <Link href="/admin/servicos" className="link-underline text-[13px] text-cobalt-soft">
          Gerenciar serviços →
        </Link>
      </PageHead>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-line bg-charcoal">
          <header className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-[14px] font-medium text-ice">Serviços — valor base</h2>
            <span className="font-mono text-[10px] text-steel-dim">{svc.length} ITENS</span>
          </header>
          <div className="divide-y divide-line/50">
            {svc.map((s) => (
              <PriceRow
                key={s.id}
                name={s.name}
                slug={s.slug}
                tagline={s.tagline ?? ""}
                order={s.order}
                active={s.active ? "on" : ""}
                description={s.description ?? ""}
                value={s.basePrice / 100}
                action={saveService}
              />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-charcoal">
          <header className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-[14px] font-medium text-ice">Adicionais — acréscimos</h2>
            <Link
              href="/admin/adicionais"
              className="link-underline font-mono text-[11px] text-cobalt-soft"
            >
              GERENCIAR →
            </Link>
          </header>
          <div className="divide-y divide-line/50">
            {ad.map((a) => (
              <PriceRow
                key={a.id}
                name={a.name}
                slug={a.id}
                tagline={a.description ?? ""}
                order={a.order}
                active={a.active ? "on" : ""}
                value={a.price / 100}
                action={saveAddon}
                isAddon
              />
            ))}
          </div>
        </section>
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-steel-dim">
        A estimativa exibida no site é sempre “valor base do serviço + adicionais
        selecionados”. O valor final de cada proposta é definido individualmente na
        tela do orçamento.
      </p>
    </div>
  );
}

function PriceRow({
  name,
  slug,
  tagline,
  order,
  active,
  description,
  value,
  action,
  isAddon,
}: {
  name: string;
  slug: string;
  tagline: string;
  order: number;
  active: string;
  description?: string;
  value: number;
  action: (formData: FormData) => Promise<void>;
  isAddon?: boolean;
}) {
  return (
    <form action={action} className="flex items-center gap-4 px-5 py-3.5">
      <input type="hidden" name="id" value={slug} />
      {!isAddon && (
        <>
          <input type="hidden" name="name" value={name} />
          <input type="hidden" name="tagline" value={tagline} />
          <input type="hidden" name="description" value={description} />
          <input type="hidden" name="order" value={order} />
        </>
      )}
      {isAddon && (
        <>
          <input type="hidden" name="name" value={name} />
          <input type="hidden" name="description" value={tagline} />
          <input type="hidden" name="order" value={order} />
        </>
      )}
      <input type="hidden" name="active" value={active} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-ice">{name}</p>
        <p className="truncate text-[11px] text-steel-dim">{tagline}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[12px] text-steel-dim">R$</span>
        <input
          type="number"
          min={0}
          step="100"
          name={isAddon ? "price" : "basePrice"}
          defaultValue={value}
          className="field w-28 !py-2 text-right font-mono text-[13px]"
        />
        <button
          type="submit"
          className="rounded-md border border-line px-3 py-1.5 text-[12px] text-ice transition-colors hover:border-cobalt hover:bg-cobalt/10"
        >
          Salvar
        </button>
      </div>
      <span className="hidden w-24 text-right font-mono text-[12px] text-steel sm:block">
        {formatBRL(value * 100)}
      </span>
    </form>
  );
}
