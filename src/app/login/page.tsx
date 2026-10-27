import type { Metadata } from "next";
import { getSettings, buildWhatsAppLink } from "@/lib/settings";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import AuthShell from "@/components/auth/AuthShell";
import LoginClient from "@/components/auth/LoginClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const settings = await getSettings();
  const whatsappHref = buildWhatsAppLink(settings);
  return (
    <>
      <Header whatsappHref={whatsappHref} />
      <main className="pt-20">
        <AuthShell>
          <LoginClient next={next ?? ""} />
        </AuthShell>
      </main>
      <Footer whatsappHref={whatsappHref} email={settings.email_contact} />
    </>
  );
}
