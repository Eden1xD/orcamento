import { db } from "@/db";
import { portfolio } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { getSettings, buildWhatsAppLink } from "@/lib/settings";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import Editorial from "@/components/home/Editorial";
import ServiceSections from "@/components/home/ServiceSections";
import PortfolioSection from "@/components/home/PortfolioSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
      <main>
        <Hero />
        <Marquee />
        <Editorial />
        <ServiceSections />
        <PortfolioSection items={lite} />
      </main>
      <Footer whatsappHref={whatsappHref} email={settings.email_contact} />
    </>
  );
}
