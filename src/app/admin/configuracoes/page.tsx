import type { Metadata } from "next";
import { getSettings, buildWhatsAppLink } from "@/lib/settings";
import { PageHead, MsgBanner, Button } from "@/components/ui";
import { saveSettings } from "@/server/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Configurações" };

export default async function ConfiguracoesPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  const { msg } = await searchParams;
  const s = await getSettings();
  const preview = buildWhatsAppLink(s);

  return (
    <div>
      <MsgBanner msg={msg} />
      <PageHead
        index="09 — SISTEMA"
        title="Configurações"
        description="Identidade do estúdio e canal de contato usado no site e no painel."
      />

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <form
          action={saveSettings}
          className="space-y-4 rounded-lg border border-line bg-charcoal p-5"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">Nome do estúdio</label>
              <input name="studio_name" className="field" defaultValue={s.studio_name} />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">Tagline</label>
              <input
                name="studio_tagline"
                className="field"
                defaultValue={s.studio_tagline}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">E-mail de contato</label>
              <input
                name="email_contact"
                type="email"
                className="field"
                defaultValue={s.email_contact}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-steel">
                Número do WhatsApp (com DDI, só números)
              </label>
              <input
                name="whatsapp_number"
                className="field font-mono"
                defaultValue={s.whatsapp_number}
                placeholder="5511999990000"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] text-steel">
              Mensagem predefinida do WhatsApp
            </label>
            <textarea
              name="whatsapp_message"
              rows={3}
              className="field"
              defaultValue={s.whatsapp_message}
            />
            <p className="mt-1.5 text-[11px] text-steel-dim">
              Usada no botão flutuante do site. Nos detalhes do orçamento, o
              protocolo da solicitação é anexado automaticamente.
            </p>
          </div>
          <div className="flex items-center gap-3 border-t border-line pt-4">
            <Button type="submit" size="md">
              Salvar configurações
            </Button>
            <p className="text-[11px] text-steel-dim">
              As mudanças valem imediatamente no site.
            </p>
          </div>
        </form>

        <div className="space-y-4">
          <div className="rounded-lg border border-line bg-charcoal p-5">
            <p className="font-mono text-[10px] tracking-[0.2em] text-steel-dim">
              PRÉVIA DO BOTÃO WHATSAPP
            </p>
            <a
              href={preview}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-ice text-ink transition-transform hover:scale-105"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <blockquote className="mt-4 rounded-md border border-line bg-ink/50 p-3 text-[12px] leading-relaxed text-steel">
              “{s.whatsapp_message}”
            </blockquote>
            <a
              href={preview}
              target="_blank"
              rel="noreferrer"
              className="link-underline mt-3 inline-block text-[12px] font-medium text-cobalt-soft"
            >
              Testar conversa no WhatsApp →
            </a>
          </div>
          <div className="rounded-lg border border-line bg-charcoal p-5">
            <p className="font-mono text-[10px] tracking-[0.2em] text-steel-dim">
              CONTEXTO DO SISTEMA
            </p>
            <ul className="mt-3 space-y-2 text-[12px] text-steel">
              <li className="flex gap-2">
                <span className="text-cobalt">·</span> Estoque de dados: PostgreSQL + Drizzle ORM
              </li>
              <li className="flex gap-2">
                <span className="text-cobalt">·</span> Sessões por cookie httpOnly, expiração de 30 dias
              </li>
              <li className="flex gap-2">
                <span className="text-cobalt">·</span> Protocolos de orçamento no formato VTR-ANO-XXXXXX
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
