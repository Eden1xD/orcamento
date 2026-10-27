import type { Metadata } from "next";
import Link from "next/link";
import { getSettings, buildWhatsAppLink } from "@/lib/settings";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Solicitação enviada" };

export default async function ConfirmacaoPage({
  searchParams,
}: {
  searchParams: Promise<{ protocol?: string }>;
}) {
  const { protocol } = await searchParams;
  return (
    <Wrapper>
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cobalt/40 bg-cobalt/10">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 11.5l5 5L18 6.5" stroke="#4D79FF" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="mt-8 text-3xl font-medium tracking-tight text-ice sm:text-4xl">
          Solicitação recebida.
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-steel">
          Guarde seu protocolo de acompanhamento — com ele e o e-mail informado
          você vê o status a qualquer momento.
        </p>
        {protocol && (
          <div className="mt-8 rounded-lg border border-line bg-charcoal px-8 py-5">
            <p className="font-mono text-[10px] tracking-[0.25em] text-steel-dim">
              PROTOCOLO
            </p>
            <p className="mt-2 font-mono text-2xl font-medium tracking-widest text-cobalt-soft">
              {protocol}
            </p>
          </div>
        )}
        <div className="mt-10 grid w-full max-w-md gap-3 text-left sm:grid-cols-3">
          {[
            ["01", "Equipe analisa"],
            ["02", "Conversa de escopo"],
            ["03", "Proposta final"],
          ].map(([n, t]) => (
            <div key={t} className="rounded-md border border-line bg-charcoal/60 p-4">
              <p className="font-mono text-[10px] text-cobalt">{n}</p>
              <p className="mt-1 text-[12px] text-ice">{t}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`/acompanhar?protocol=${protocol ?? ""}`}
            className="inline-flex h-11 items-center rounded-md bg-cobalt px-6 text-[14px] font-medium text-ice transition-colors hover:bg-cobalt-soft"
          >
            Acompanhar solicitação
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-md border border-line px-6 text-[14px] font-medium text-ice transition-colors hover:bg-ice/5"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </Wrapper>
  );
}

async function Wrapper({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const whatsappHref = buildWhatsAppLink(settings);
  return (
    <>
      <Header whatsappHref={whatsappHref} />
      <main className="pt-20">{children}</main>
      <Footer whatsappHref={whatsappHref} email={settings.email_contact} />
    </>
  );
}
