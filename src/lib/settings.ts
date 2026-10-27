import { db } from "@/db";
import { settings } from "@/db/schema";

export const DEFAULT_SETTINGS: Record<string, string> = {
  studio_name: "VETOR",
  studio_tagline: "Independent digital development studio",
  email_contact: "oi@vetor.studio",
  whatsapp_number: "5511999990000",
  whatsapp_message:
    "Olá! Vim pelo site do estúdio e quero tirar minha ideia do papel. Podemos conversar?",
};

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const rows = await db.select().from(settings);
    const map = { ...DEFAULT_SETTINGS };
    for (const row of rows) map[row.key] = row.value;
    return map;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function buildWhatsAppLink(
  settings: Record<string, string>,
  message?: string,
): string {
  const number = (settings.whatsapp_number || "")
    .replace(/[^\d]/g, "")
    .padStart(13, "0");
  const text = message || settings.whatsapp_message || "";
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
