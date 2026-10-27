"use client";

import Link from "next/link";
import { Eyebrow, Button } from "@/components/ui";
import { MaskLines, RevealImage, Reveal } from "@/components/motion";

export type PortfolioItemLite = {
  id: string;
  slug: string;
  title: string;
  category: string;
  tagline: string | null;
  technologies: string[];
  coverImage: string | null;
  featured: boolean;
};

function EmptyShowcase() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-28 pt-4 sm:px-8">
      <div className="relative overflow-hidden rounded-lg border border-dashed border-line px-6 py-20 text-center sm:py-28">
        <div className="absolute inset-0 grid-lines opacity-50" />
        <div className="relative">
          <p className="eyebrow text-steel">Showcase — em montagem</p>
          <h3 className="mx-auto mt-6 max-w-2xl text-[clamp(1.8rem,4vw,3rem)] font-medium leading-tight tracking-[-0.03em] text-ice">
            Os cases aparecem aqui conforme os projetos
            <span className="text-cobalt"> são publicados</span>.
          </h3>
          <p className="mx-auto mt-5 max-w-md text-[14px] leading-relaxed text-steel">
            Não publicamos projetos fictícios. A equipe adiciona cada entrega
            real pelo painel administrativo — com telas, contexto e resultado.
          </p>
          <div className="mt-9">
            <Button href="/orcamento">Quero que o meu esteja aqui</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShowcaseRow({
  item,
  index,
  flip,
}: {
  item: PortfolioItemLite;
  index: number;
  flip: boolean;
}) {
  const hasImage = Boolean(item.coverImage);
  return (
    <Reveal delay={0.05}>
      <Link
        href={`/portfolio/${item.slug}`}
        className={`group grid items-center gap-8 py-14 lg:grid-cols-2 lg:gap-16 ${
          flip ? "" : ""
        }`}
      >
        <div className={`${flip ? "lg:order-2" : ""}`}>
          {hasImage ? (
            <RevealImage
              src={item.coverImage!}
              alt={item.title}
              fill
              className={`overflow-hidden rounded-lg border border-line ${
                item.featured ? "aspect-[16/10]" : "aspect-[4/3] lg:aspect-[16/11]"
              }`}
              imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-line bg-charcoal lg:aspect-[16/11]">
              <div className="absolute inset-0 grid-lines" />
              <span className="text-outline font-mono text-[clamp(3rem,6vw,5rem)] font-medium">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          )}
        </div>
        <div className={`${flip ? "lg:order-1" : ""}`}>
          <p className="font-mono text-[11px] tracking-[0.25em] text-steel">
            {String(index + 1).padStart(2, "0")} — {item.category.toUpperCase()}
          </p>
          <h3 className="mt-4 text-[clamp(1.8rem,3.6vw,3rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ice transition-colors duration-300 group-hover:text-cobalt-soft">
            {item.title}
          </h3>
          {item.tagline && (
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-steel">
              {item.tagline}
            </p>
          )}
          {item.technologies.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {item.technologies.slice(0, 5).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line px-3 py-1 font-mono text-[10px] text-steel"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <span className="link-underline mt-7 inline-flex items-center gap-2 text-[13px] font-medium text-ice">
            Explorar o case
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export default function PortfolioSection({
  items,
  heading = true,
}: {
  items: PortfolioItemLite[];
  heading?: boolean;
}) {
  return (
    <section className="relative border-t border-line bg-ink">
      <div className="mx-auto max-w-[1400px] px-5 pt-24 sm:px-8 lg:pt-32">
        {heading && (
          <div className="mb-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Reveal>
                <Eyebrow>Portfólio</Eyebrow>
              </Reveal>
              <MaskLines
                className="mt-7 max-w-3xl text-[clamp(2.2rem,5vw,4.4rem)] font-medium leading-[1.0] tracking-[-0.04em] text-ice"
                lines={[
                  <>Selecionados para impressionar.</>,
                  <>
                    <span className="text-steel">Construídos</span> para{" "}
                    <span className="text-cobalt">funcionar</span>.
                  </>,
                ]}
              />
            </div>
            {items.length > 0 && (
              <Reveal delay={0.2}>
                <span className="font-mono text-[11px] text-steel-dim">
                  {items.length} CASE{items.length > 1 ? "S" : ""} PUBLICADO
                  {items.length > 1 ? "S" : ""}
                </span>
              </Reveal>
            )}
          </div>
        )}
      </div>
      {items.length === 0 ? (
        <EmptyShowcase />
      ) : (
        <div className="mx-auto max-w-[1400px] px-5 pb-28 sm:px-8">
          <div className="divide-y divide-line">
            {items.map((item, i) => (
              <ShowcaseRow key={item.id} item={item} index={i} flip={i % 2 === 1} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
