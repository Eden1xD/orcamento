import { db } from "@/db";
import { services, addons as addonsTable } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const serviceId = String(body?.serviceId || "");
    const addonIds = Array.isArray(body?.addons) ? body.addons.map(String) : [];

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

    return Response.json({
      ok: true,
      serviceId: service?.id ?? null,
      serviceName: service?.name ?? null,
      serviceBase: service?.basePrice ?? 0,
      addonsSum: addonSum,
      total: (service?.basePrice ?? 0) + addonSum,
    });
  } catch {
    return Response.json({ ok: false, total: 0 }, { status: 500 });
  }
}
