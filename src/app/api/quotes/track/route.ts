import { db } from "@/db";
import { quotes, quoteEvents, services } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { QUOTE_STATUS_LABEL } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const protocol = String(body?.protocol || "").trim().toUpperCase();
    const email = String(body?.email || "").trim().toLowerCase();
    if (!protocol || !email) {
      return Response.json(
        { ok: false, error: "Informe o protocolo e o e-mail utilizados na solicitação." },
        { status: 400 },
      );
    }

    const rows = await db
      .select({
        id: quotes.id,
        protocol: quotes.protocol,
        status: quotes.status,
        baseValue: quotes.baseValue,
        finalValue: quotes.finalValue,
        createdAt: quotes.createdAt,
        serviceId: quotes.serviceId,
        clientName: quotes.clientName,
        email: quotes.email,
      })
      .from(quotes)
      .where(and(eq(quotes.protocol, protocol), eq(quotes.email, email)))
      .limit(1);

    const quote = rows[0];
    if (!quote) {
      return Response.json(
        { ok: false, error: "Nenhuma solicitação encontrada com esses dados." },
        { status: 404 },
      );
    }

    const svc = quote.serviceId
      ? await db.select().from(services).where(eq(services.id, quote.serviceId)).limit(1)
      : [];

    const events = await db
      .select({ status: quoteEvents.status, note: quoteEvents.note, createdAt: quoteEvents.createdAt })
      .from(quoteEvents)
      .where(eq(quoteEvents.quoteId, quote.id))
      .orderBy(asc(quoteEvents.createdAt));

    return Response.json({
      ok: true,
      quote: {
        ...quote,
        statusLabel: QUOTE_STATUS_LABEL[quote.status] || quote.status,
        serviceName: svc[0]?.name ?? null,
        events,
      },
    });
  } catch {
    return Response.json({ ok: false, error: "Erro ao consultar." }, { status: 500 });
  }
}
