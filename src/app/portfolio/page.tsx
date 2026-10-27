import type { Metadata } from "next";
import { db } from "@/db";
import { portfolio } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { getSettings, buildWhatsAppLink } from "@/lib/settings";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import PortfolioSection from "@/components/home/PortfolioSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Portfólio" };

export default async function PortfolioIndexPage() {
  const [settings, items] = await Promise.all([
    getSettings(),
    db
      .select()
      .from(portfolio)
      .where(eq(portfolio.published, true))
      .orderBy(asc(portfolio.order), desc(portfolio.createdAt)),
  ]);

  const whatsappHref = buildWhatsAppLink(settings);
  const lite = items.map((i) => ({
    id: i.id,
    slug: i.slug,
    title: i.title,
    category: i.category,
    tagline: i.tagline,
    technologies: i.technologies,
    coverImage: i.coverImage,
    featured: i.featured,
  }));

  return (
    <>
      <Header whatsappHref={whatsappHref} />
      <main className="pt-20">
        <PortfolioSection items={lite} />
      </main>
      <Footer whatsappHref={whatsappHref} email={settings.email_contact} />
    </>
  );
}
