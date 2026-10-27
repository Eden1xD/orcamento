"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  clients,
  projects,
  portfolio,
  services,
  addons,
  settings,
  notifications,
  quotes,
  quoteEvents,
} from "@/db/schema";
import { eq, and, sql, inArray } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/format";

type QuoteStatus = "novo" | "analise" | "aprovado" | "recusado" | "concluido";

async function assertAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    redirect("/login?next=/admin");
  }
  return user;
}

function flash(path: string, msg: string) {
  const url = new URL(path, "http://local");
  url.searchParams.set("msg", msg);
  return redirect(url.pathname + url.search);
}

/* ------------------------------- quotes ------------------------------- */

export async function updateQuoteStatus(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  const note = String(formData.get("note") || "").trim() || null;
  if (!id || !status) return flash("/admin/orcamentos", "status-invalido");

  await db
    .update(quotes)
    .set({ status: status as QuoteStatus, updatedAt: new Date() })
    .where(eq(quotes.id, id));
  await db.insert(quoteEvents).values({ quoteId: id, status, note });

  if (status === "aprovado" || status === "concluido") {
    const q = await db.select().from(quotes).where(eq(quotes.id, id)).limit(1);
    if (q[0]) {
      await db.insert(notifications).values({
        title: `Orçamento ${q[0].protocol} aprovado`,
        body: `${q[0].clientName} · estimativa base de R$ ${(q[0].baseValue / 100).toLocaleString("pt-BR")}.`,
        type: "quote",
        link: `/admin/orcamentos/${id}`,
      });
    }
  }
  revalidatePath("/admin/orcamentos");
  revalidatePath(`/admin/orcamentos/${id}`);
  flash(`/admin/orcamentos/${id}`, "status-atualizado");
}

export async function updateQuoteFinalValue(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  const value = Number(formData.get("finalValue") || 0);
  if (!id) return flash("/admin/orcamentos", "valor-invalido");
  await db
    .update(quotes)
    .set({ finalValue: value > 0 ? Math.round(value) : null, updatedAt: new Date() })
    .where(eq(quotes.id, id));
  revalidatePath(`/admin/orcamentos/${id}`);
  flash(`/admin/orcamentos/${id}`, "valor-atualizado");
}

export async function deleteQuote(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  if (id) await db.delete(quotes).where(eq(quotes.id, id));
  revalidatePath("/admin/orcamentos");
  flash("/admin/orcamentos", "orcamento-removido");
}

/* ------------------------------- clients ------------------------------ */

export async function saveClient(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  if (!name) return flash("/admin/clientes", "campo-obrigatorio");
  const data = {
    name,
    company: String(formData.get("company") || "").trim() || null,
    email: String(formData.get("email") || "").trim() || null,
    phone: String(formData.get("phone") || "").trim() || null,
    notes: String(formData.get("notes") || "").trim() || null,
  };
  if (id) {
    await db.update(clients).set(data).where(eq(clients.id, id));
    revalidatePath("/admin/clientes");
    return flash("/admin/clientes", "cliente-atualizado");
  }
  await db.insert(clients).values(data);
  revalidatePath("/admin/clientes");
  return flash("/admin/clientes", "cliente-criado");
}

export async function deleteClient(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  if (id) await db.delete(clients).where(eq(clients.id, id));
  revalidatePath("/admin/clientes");
  flash("/admin/clientes", "cliente-removido");
}

/* ------------------------------- projects ----------------------------- */

export async function saveProject(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  if (!name) return flash("/admin/projetos", "campo-obrigatorio");
  const clientId = String(formData.get("clientId") || "") || null;
  const status = String(formData.get("status") || "planejamento");
  const budgetRaw = String(formData.get("budget") || "").trim();
  const budget = budgetRaw ? Math.round(Number(budgetRaw)) * 100 : null;
  const dueDate = String(formData.get("dueDate") || "");
  const description = String(formData.get("description") || "").trim() || null;

  const data = {
    name,
    clientId,
    status: status as "planejamento" | "andamento" | "revisao" | "pausado" | "concluido",
    budget,
    dueDate: dueDate ? new Date(dueDate + "T12:00:00") : null,
    description,
    updatedAt: new Date(),
  };
  if (id) {
    await db.update(projects).set(data).where(eq(projects.id, id));
    revalidatePath("/admin/projetos");
    return flash("/admin/projetos", "projeto-atualizado");
  }
  await db.insert(projects).values(data);
  revalidatePath("/admin/projetos");
  return flash("/admin/projetos", "projeto-criado");
}

export async function deleteProject(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  if (id) await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/admin/projetos");
  flash("/admin/projetos", "projeto-removido");
}

/* ------------------------------- portfolio ---------------------------- */

export async function savePortfolio(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  if (!title) return flash("/admin/portfolio", "campo-obrigatorio");

  const listToArr = (raw: string) =>
    raw
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

  let slug = String(formData.get("slug") || "").trim() || slugify(title);
  if (!/^[a-z0-9-]+$/.test(slug)) slug = slugify(slug);
  const clash = await db.select({ id: portfolio.id }).from(portfolio)
    .where(and(eq(portfolio.slug, slug), id ? sql`${portfolio.id} != ${id}` : sql`1=1`))
    .limit(1);
  if (clash.length > 0) slug = `${slug}-${Date.now().toString(36)}`;

  const data = {
    slug,
    title,
    category: String(formData.get("category") || "Website").trim() || "Website",
    tagline: String(formData.get("tagline") || "").trim() || null,
    description: String(formData.get("description") || "").trim() || null,
    challenge: String(formData.get("challenge") || "").trim() || null,
    solution: String(formData.get("solution") || "").trim() || null,
    features: listToArr(String(formData.get("features") || "")),
    technologies: listToArr(String(formData.get("technologies") || "")),
    coverImage: String(formData.get("coverImage") || "").trim() || null,
    gallery: listToArr(String(formData.get("gallery") || "")),
    link: String(formData.get("link") || "").trim() || null,
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
    order: Number(formData.get("order") || 0) || 0,
  };

  if (id) {
    await db.update(portfolio).set(data).where(eq(portfolio.id, id));
    revalidatePath("/admin/portfolio");
    revalidatePath("/");
    revalidatePath(`/portfolio/${slug}`);
    return flash("/admin/portfolio", "projeto-atualizado");
  }
  await db.insert(portfolio).values(data);
  revalidatePath("/admin/portfolio");
  revalidatePath("/");
  flash(`/portfolio/${slug}`, "projeto-criado");
}

export async function deletePortfolio(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  if (id) await db.delete(portfolio).where(eq(portfolio.id, id));
  revalidatePath("/admin/portfolio");
  revalidatePath("/");
  flash("/admin/portfolio", "projeto-removido");
}

/* ------------------------------ services ------------------------------ */

export async function saveService(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  if (!name) return flash("/admin/servicos", "campo-obrigatorio");
  const slug = String(formData.get("slug") || "").trim() || slugify(name);
  const price = Math.round(Number(formData.get("basePrice") || 0) * 100);
  const data = {
    name,
    slug: slug.replace(/[^a-z0-9-]/g, "-"),
    tagline: String(formData.get("tagline") || "").trim() || null,
    description: String(formData.get("description") || "").trim() || null,
    basePrice: price,
    order: Number(formData.get("order") || 0) || 0,
    active: formData.get("active") === "on",
  };
  if (id) {
    await db.update(services).set(data).where(eq(services.id, id));
    revalidatePath("/admin/servicos");
    revalidatePath("/admin/precos");
    return flash("/admin/servicos", "servico-atualizado");
  }
  const clash = await db.select({ id: services.id }).from(services).where(eq(services.slug, data.slug)).limit(1);
  if (clash.length > 0) data.slug = `${data.slug}-${Date.now().toString(36)}`;
  await db.insert(services).values(data);
  revalidatePath("/admin/servicos");
  revalidatePath("/admin/precos");
  flash("/admin/servicos", "servico-criado");
}

export async function deleteService(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  if (id) await db.delete(services).where(eq(services.id, id));
  revalidatePath("/admin/servicos");
  revalidatePath("/admin/precos");
  flash("/admin/servicos", "servico-removido");
}

/* ------------------------------- addons ------------------------------- */

export async function saveAddon(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  if (!name) return flash("/admin/adicionais", "campo-obrigatorio");
  const price = Math.round(Number(formData.get("price") || 0) * 100);
  const data = {
    name,
    description: String(formData.get("description") || "").trim() || null,
    price,
    order: Number(formData.get("order") || 0) || 0,
    active: formData.get("active") === "on",
  };
  if (id) {
    await db.update(addons).set(data).where(eq(addons.id, id));
    revalidatePath("/admin/adicionais");
    return flash("/admin/adicionais", "adicional-atualizado");
  }
  await db.insert(addons).values(data);
  revalidatePath("/admin/adicionais");
  flash("/admin/adicionais", "adicional-criado");
}

export async function deleteAddon(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  if (id) await db.delete(addons).where(eq(addons.id, id));
  revalidatePath("/admin/adicionais");
  flash("/admin/adicionais", "adicional-removido");
}

/* ------------------------------- settings ----------------------------- */

export async function saveSettings(formData: FormData) {
  await assertAdmin();
  const keys = [
    "studio_name",
    "studio_tagline",
    "email_contact",
    "whatsapp_number",
    "whatsapp_message",
  ];
  for (const key of keys) {
    const value = String(formData.get(key) || "").trim();
    const existing = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
    if (existing.length > 0) {
      await db.update(settings).set({ value }).where(eq(settings.key, key));
    } else {
      await db.insert(settings).values({ key, value });
    }
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin");
  flash("/admin/configuracoes", "configuracoes-salvas");
}

/* ----------------------------- notifications -------------------------- */

export async function markNotificationRead(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  if (id) await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));
  revalidatePath("/admin/notificacoes");
  revalidatePath("/admin");
}

export async function markAllNotificationsRead(formData: FormData) {
  await assertAdmin();
  await db.update(notifications).set({ read: true }).where(eq(notifications.read, false));
  revalidatePath("/admin/notificacoes");
  revalidatePath("/admin");
  flash("/admin/notificacoes", "tudo-marcado-como-lido");
}

export async function deleteNotification(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  if (id) await db.delete(notifications).where(eq(notifications.id, id));
  revalidatePath("/admin/notificacoes");
  flash("/admin/notificacoes", "notificacao-removida");
}

/* -------------------------------- misc -------------------------------- */

export async function getAdminQuotesById(id: string) {
  const rows = await db
    .select({
      quote: quotes,
      serviceName: services.name,
      serviceSlug: services.slug,
    })
    .from(quotes)
    .leftJoin(services, eq(quotes.serviceId, services.id))
    .where(eq(quotes.id, id))
    .limit(1);
  return rows[0] ?? null;
}
