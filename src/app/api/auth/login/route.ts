import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, createSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!email || !password) {
      return Response.json({ ok: false, error: "Informe e-mail e senha." }, { status: 400 });
    }

    const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = rows[0];
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return Response.json(
        { ok: false, error: "Credenciais inválidas. Verifique e tente novamente." },
        { status: 401 },
      );
    }

    await createSession(user.id);
    return Response.json({ ok: true, role: user.role, redirect: user.role === "admin" ? "/admin" : "/" });
  } catch {
    return Response.json({ ok: false, error: "Erro ao entrar." }, { status: 500 });
  }
}