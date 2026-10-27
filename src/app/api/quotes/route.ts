import { db } from "@/db";
import { quotes, quoteEvents, notifications, services, addons as addonsTable } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { generateProtocol } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const clientName = String(body?.clientName || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const phone = String(body?.phone || "").trim();
    const company = String(body?.company || "").trim() || null;
    const serviceId = String(body?.serviceId || "");
    const addonIds = Array.isArray(body?.addons) ? body.addons.map(String) : [];
    const description = String(body?.description || "").trim() || null;
    const timeline = String(body?.timeline || "") || null;

    if (!clientName || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { ok: false, error: "Informe um nome e um e-mail válidos." },
        { status: 400 },
      );
    }

    const svcRows = serviceId
      ? await db.select().from(services).where(eq(services.id, serviceId)).limit(1)
      : [];
    const service = svcRows[0] || null;

    let addonSum = 0;
    if (addonIds.length > 0) {
      const aRows = await db.select().from(addonsTable).where(
        inArray(addonsTable.id, addonIds),
      );
      addonSum = aRows.reduce((acc, a) => acc + a.price, 0);
    }

    const baseValue = (service?.basePrice || 0) + addonSum;

    const protocol = generateProtocol();
    const inserted = await db
      .insert(quotes)
      .values({
        protocol,
        clientName,
        email,
        phone: phone || null,
        company,
        serviceId: service?.id ?? null,
        addons: addonIds,
        description,
        timeline,
        baseValue,
        status: "novo",
      })
      .returning({ id: quotes.id });

    await db.insert(quoteEvents).values({
      quoteId: inserted[0].id,
      status: "novo",
      note: "Solicitação recebida pelo site.",
    });

    await db.insert(notifications).values({
      title: `Novo orçamento ${protocol}`,
      body: `${clientName} solicitou uma estimativa${service ? ` para ${service.name}` : ""} de R$ ${(baseValue / 100).toLocaleString("pt-BR")}.`,
      type: "quote",
      link: `/admin/orcamentos/${inserted[0].id}`,
    });

    return Response.json({ ok: true, protocol, baseValue });
  } catch {
    return Response.json({ ok: false, error: "Erro ao enviar a solicitação." }, { status: 500 });
  }
}
