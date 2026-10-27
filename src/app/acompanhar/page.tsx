import type { Metadata } from "next";
import { getSettings, buildWhatsAppLink } from "@/lib/settings";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import TrackClient from "@/components/quote/TrackClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Acompanhar orçamento" };

export default async function AcompanharPage({
  searchParams,
}: {
  searchParams: Promise<{ protocol?: string }>;
}) {
  const { protocol } = await searchParams;
  const settings = await getSettings();
  const whatsappHref = buildWhatsAppLink(settings);

  return (
    <>
      <Header whatsappHref={whatsappHref} />
      <main className="pt-20">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 grid-lines opacity-40" />
          <div className="relative mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
            <p className="eyebrow flex items-center gap-3 text-steel">
              <span className="h-px w-8 bg-steel/40" />
              Acompanhamento
            </p>
            <h1 className="mt-7 text-[clamp(2rem,5vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.04em] text-ice">
              Onde está a sua ideia?
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-steel">
              Digite o protocolo recebido e o e-mail utilizado na solicitação
              para ver o status em tempo real.
            </p>
            <TrackClient initialProtocol={protocol ?? ""} />
          </div>
        </div>
      </main>
      <Footer whatsappHref={whatsappHref} email={settings.email_contact} />
    </>
  );
}
