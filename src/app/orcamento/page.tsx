import type { Metadata } from "next";
import { db } from "@/db";
import { services, addons } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { getSettings, buildWhatsAppLink } from "@/lib/settings";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import QuoteWizard from "@/components/quote/QuoteWizard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Orçamento" };

export default async function OrcamentoPage() {
  const [settings, svc, ad] = await Promise.all([
    getSettings(),
    db
      .select()
      .from(services)
      .where(eq(services.active, true))
      .orderBy(asc(services.order)),
    db
      .select()
      .from(addons)
      .where(eq(addons.active, true))
      .orderBy(asc(addons.order)),
  ]);

  const whatsappHref = buildWhatsAppLink(settings);

  return (
    <>
      <Header whatsappHref={whatsappHref} />
      <main className="pt-20">
        <QuoteWizard
          services={svc.map((s) => ({
            id: s.id,
            slug: s.slug,
            name: s.name,
            tagline: s.tagline,
            basePrice: s.basePrice,
          }))}
          addons={ad.map((a) => ({
            id: a.id,
            name: a.name,
            description: a.description,
            price: a.price,
          }))}
        />
      </main>
      <Footer whatsappHref={whatsappHref} email={settings.email_contact} />
    </>
  );
}
