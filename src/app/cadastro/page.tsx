import type { Metadata } from "next";
import { getSettings, buildWhatsAppLink } from "@/lib/settings";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import AuthShell from "@/components/auth/AuthShell";
import RegisterClient from "@/components/auth/RegisterClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Criar conta" };

export default async function CadastroPage() {
  const settings = await getSettings();
  const whatsappHref = buildWhatsAppLink(settings);
  return (
    <>
      <Header whatsappHref={whatsappHref} />
      <main className="pt-20">
        <AuthShell>
          <RegisterClient />
        </AuthShell>
      </main>
      <Footer whatsappHref={whatsappHref} email={settings.email_contact} />
    </>
  );
}
