import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { portfolio } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSettings, buildWhatsAppLink } from "@/lib/settings";
import { formatDate } from "@/lib/format";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { Reveal, MaskLines, RevealImage } from "@/components/motion";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const rows = await db
    .select({ title: portfolio.title })
    .from(portfolio)
    .where(eq(portfolio.slug, slug))
    .limit(1);
  return { title: rows[0]?.title ?? "Projeto" };
}

export default async function PortfolioCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [rows, settings] = await Promise.all([
    db.select().from(portfolio).where(eq(portfolio.slug, slug)).limit(1),
    getSettings(),
  ]);
  const item = rows[0];
  if (!item || !item.published) notFound();

  const whatsappHref = buildWhatsAppLink(settings);
  const gallery = item.gallery.length > 0 ? item.gallery : [];

  return (
    <>
      <Header whatsappHref={whatsappHref} />
      <main className="pt-20">
        {/* hero */}
        <section className="relative overflow-hidden border-b border-line">
          {item.coverImage ? (
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.coverImage} alt="" className="h-full w-full object-cover opacity-35" />
              <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/80 to-ink" />
            </div>
          ) : (
            <div className="absolute inset-0 grid-lines" />
          )}
          <div className="relative mx-auto max-w-[1400px] px-5 pb-20 pt-24 sm:px-8 lg:pb-28 lg:pt-36">
            <Reveal>
              <p className="eyebrow text-steel">
                <Link href="/portfolio" className="transition-colors hover:text-ice">
                  PORTFÓLIO
                </Link>{" "}
                <span className="text-cobalt">/ {item.category.toUpperCase()}</span>
              </p>
            </Reveal>
            <MaskLines
              className="mt-8 max-w-4xl text-[clamp(2.6rem,6.5vw,5.4rem)] font-medium leading-[0.98] tracking-[-0.045em] text-ice"
              lines={[<>
                {item.title.length > 26 ? (
                  <>
                    {item.title.slice(0, item.title.lastIndexOf(" ", 26)) || item.title}
                    <br />
                    {item.title.slice(item.title.lastIndexOf(" ", 26) + 1)}
                  </>
                ) : (
                  item.title
                )}
              </>]}
            />
            {item.tagline && (
              <Reveal delay={0.2}>
                <p className="mt-7 max-w-xl text-[16px] leading-relaxed text-steel">
                  {item.tagline}
                </p>
              </Reveal>
            )}
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {item.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line px-3 py-1 font-mono text-[10px] text-steel"
                  >
                    {t}
                  </span>
                ))}
                <span className="font-mono text-[10px] text-steel-dim">
                  PUBLICADO EM {formatDate(item.createdAt).toUpperCase()}
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* body */}
        <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-[220px_1fr]">
            {/* sticky index */}
            <div className="hidden lg:block">
              <div className="sticky top-28 space-y-5 font-mono text-[11px] text-steel-dim">
                {["Contexto", "Desafio", "Solução", "Funcionalidades", "Galeria", "Tecnologias"].map(
                  (t, i) => (
                    <p key={t} className="flex items-center gap-3">
                      <span className="text-cobalt">0{i + 1}</span> {t.toUpperCase()}
                    </p>
                  ),
                )}
              </div>
            </div>
            <div className="max-w-3xl">
              <Reveal>
                <p className="eyebrow mb-4 text-steel">01 — Contexto</p>
              </Reveal>
              <Reveal delay={0.05}>
                <p className="text-[17px] leading-[1.8] text-ice/90">
                  {item.description ||
                    `${item.title} é um projeto ${item.category.toLowerCase()} desenvolvido pelo estúdio, do primeiro rascunho ao lançamento.`}
                </p>
              </Reveal>

              {item.challenge && (
                <>
                  <div className="mt-16">
                    <Reveal>
                      <p className="eyebrow mb-4 text-steel">02 — O desafio</p>
                    </Reveal>
                  </div>
                  <Reveal>
                    <p className="text-[17px] leading-[1.8] text-ice/90">
                      {item.challenge}
                    </p>
                  </Reveal>
                </>
              )}

              {item.solution && (
                <>
                  <div className="mt-16">
                    <Reveal>
                      <p className="eyebrow mb-4 text-steel">
                        03 — A solução
                      </p>
                    </Reveal>
                  </div>
                  <Reveal>
                    <p className="text-[17px] leading-[1.8] text-ice/90">
                      {item.solution}
                    </p>
                  </Reveal>
                </>
              )}

              {item.features.length > 0 && (
                <>
                  <div className="mt-16">
                    <Reveal>
                      <p className="eyebrow mb-6 text-steel">
                        04 — Funcionalidades
                      </p>
                    </Reveal>
                  </div>
                  <div className="divide-y divide-line border-y border-line">
                    {item.features.map((f, i) => (
                      <Reveal key={f} delay={0.03 * i}>
                        <div className="flex items-baseline gap-5 py-4">
                          <span className="font-mono text-[11px] text-cobalt">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-[15px] text-ice/85">{f}</span>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </>
              )}

              {gallery.length > 0 && (
                <>
                  <div className="mt-16">
                    <Reveal>
                      <p className="eyebrow mb-6 text-steel">05 — Galeria</p>
                    </Reveal>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {gallery.map((src, i) => (
                      <RevealImage
                        key={i}
                        src={src}
                        alt={`Tela ${i + 1} — ${item.title}`}
                        fill
                        className="aspect-[4/3] overflow-hidden rounded-lg border border-line"
                        imgClassName="transition-transform duration-700 hover:scale-[1.03]"
                      />
                    ))}
                  </div>
                </>
              )}

              <div className="mt-20 rounded-lg border border-line bg-charcoal p-8">
                <Reveal>
                  <p className="eyebrow mb-3 text-steel">Tecnologias</p>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.length > 0 ? (
                      item.technologies.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-ice"
                        >
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-[13px] text-steel">
                        Definido pela equipe durante o projeto.
                      </span>
                    )}
                  </div>
                </Reveal>
                {item.link && (
                  <Reveal delay={0.1}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-cobalt-soft"
                    >
                      Acessar o projeto ao vivo
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    </a>
                  </Reveal>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* next cta */}
        <section className="border-t border-line">
          <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-6 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow text-steel">Gostou do padrão?</p>
              <h3 className="mt-3 text-2xl font-medium tracking-tight text-ice sm:text-3xl">
                Seu projeto pode ser o próximo case.
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/orcamento"
                className="inline-flex h-11 items-center rounded-md bg-cobalt px-6 text-[14px] font-medium text-ice transition-colors hover:bg-cobalt-soft"
              >
                Iniciar um projeto
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex h-11 items-center rounded-md border border-line px-6 text-[14px] font-medium text-ice transition-colors hover:bg-ice/5"
              >
                Ver todos os cases
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer whatsappHref={whatsappHref} email={settings.email_contact} />
    </>
  );
}
