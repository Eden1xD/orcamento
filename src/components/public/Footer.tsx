import Link from "next/link";
import { Eyebrow, Wordmark, LogoMark } from "@/components/ui";
import { MaskLines, Reveal } from "@/components/motion";
import WhatsAppFloat from "./WhatsAppFloat";

export default function Footer({
  whatsappHref,
  email,
}: {
  whatsappHref: string;
  email: string;
}) {
  return (
    <>
      {/* Big CTA */}
      <section className="relative overflow-hidden bg-ice text-ink noise">
        <div className="absolute inset-0 grid-lines-dark" />
        <div className="relative mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
          <Reveal>
            <Eyebrow light>Próximo capítulo</Eyebrow>
          </Reveal>
          <MaskLines
            as="h2"
            className="mt-8 max-w-5xl text-[clamp(2.6rem,7.5vw,6.5rem)] font-medium leading-[0.98] tracking-[-0.045em]"
            lines={[
              <>A próxima grande ideia</>,
              <>
                pode ser <span className="italic text-cobalt">a sua.</span>
              </>,
            ]}
          />
          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Reveal delay={0.15}>
              <p className="max-w-md text-[15px] leading-relaxed text-ink/70">
                Vamos transformar o que você imagina em algo que as pessoas
                realmente possam usar.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/orcamento"
                  className="group inline-flex h-14 items-center gap-3 rounded-md bg-ink px-7 text-[15px] font-medium text-ice transition-all duration-300 hover:bg-cobalt hover:shadow-[0_16px_48px_rgba(36,91,255,0.35)]"
                >
                  Vamos criar juntos.
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline text-[14px] font-medium text-ink"
                >
                  Ou chame no WhatsApp
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line bg-ink">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Wordmark className="text-ice" />
              <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-steel">
                Estúdio independente de desenvolvimento digital. Websites,
                aplicativos, sistemas e automações — do conceito ao
                lançamento.
              </p>
              <p className="mt-6 font-mono text-[10px] tracking-widest text-steel-dim">
                INDEPENDENT DIGITAL DEVELOPMENT STUDIO
              </p>
            </div>
            <FooterCol
              title="Explorar"
              links={[
                ["Serviços", "/#servicos"],
                ["Portfólio", "/portfolio"],
                ["Orçamento", "/orcamento"],
                ["Acompanhar pedido", "/acompanhar"],
              ]}
            />
            <FooterCol
              title="Estúdio"
              links={[
                [`E-mail — ${email}`, `mailto:${email}`],
                ["WhatsApp", whatsappHref],
                ["Criar conta", "/cadastro"],
                ["Entrar", "/login"],
              ]}
            />
            <div>
              <p className="eyebrow mb-4 text-steel">Status</p>
              <div className="flex items-center gap-2 text-[13px] text-ice">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Aceitando novos projetos
              </div>
              <p className="mt-3 text-[12px] text-steel">
                Resposta em até 1 dia útil.
              </p>
            </div>
          </div>
          <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[10px] text-steel-dim">
              © {new Date().getFullYear()} VETOR STUDIO — TODOS OS DIREITOS RESERVADOS
            </p>
            <p className="flex items-center gap-2 font-mono text-[10px] text-steel-dim">
              <LogoMark size={12} />
              FEITO COM PRECISÃO NO BRASIL
            </p>
          </div>
        </div>
      </footer>

      <WhatsAppFloat href={whatsappHref} />
    </>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: string[][];
}) {
  return (
    <div>
      <p className="eyebrow mb-4 text-steel">{title}</p>
      <ul className="space-y-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              className="link-underline text-[13px] text-steel transition-colors hover:text-ice"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
