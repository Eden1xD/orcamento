import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, createSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!name || !email || password.length < 6) {
      return Response.json(
        { ok: false, error: "Preencha nome, e-mail e uma senha com pelo menos 6 caracteres." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { ok: false, error: "Informe um e-mail válido." },
        { status: 400 },
      );
    }

    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return Response.json(
        { ok: false, error: "Este e-mail já está cadastrado." },
        { status: 409 },
      );
    }

    const inserted = await db
      .insert(users)
      .values({ name, email, passwordHash: hashPassword(password), role: "client" })
      .returning({ id: users.id });

    await createSession(inserted[0].id);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Erro ao criar conta." }, { status: 500 });
  }
}
