import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { timeAgo } from "@/lib/format";
import { PageHead, MsgBanner, EmptyState, Button } from "@/components/ui";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import {
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "@/server/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Notificações" };

export default async function NotificacoesPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  const { msg } = await searchParams;
  const all = await db
    .select()
    .from(notifications)
    .orderBy(desc(notifications.createdAt));
  const unreadCount = all.filter((n) => !n.read).length;

  return (
    <div>
      <MsgBanner msg={msg} />
      <PageHead
        index="10 — SISTEMA"
        title="Notificações"
        description={
          unreadCount > 0
            ? `${unreadCount} não lida${unreadCount > 1 ? "s" : ""}.`
            : "Tudo em dia por aqui."
        }
      >
        {unreadCount > 0 && (
          <form action={markAllNotificationsRead}>
            <Button type="submit" variant="ghost" size="sm">
              Marcar todas como lidas
            </Button>
          </form>
        )}
      </PageHead>

      {all.length === 0 ? (
        <EmptyState
          title="Nenhuma notificação"
          description="Novos orçamentos e aprovações chegam aqui automaticamente."
        />
      ) : (
        <div className="space-y-2">
          {all.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                n.read ? "border-line bg-charcoal/50" : "border-cobalt/25 bg-cobalt/[0.06]"
              }`}
            >
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  n.read ? "bg-steel-dim" : "bg-cobalt"
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className={`text-[14px] ${n.read ? "text-steel" : "font-medium text-ice"}`}>
                  {n.title}
                </p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-steel">{n.body}</p>
                <p className="mt-1 font-mono text-[10px] text-steel-dim">
                  {timeAgo(n.createdAt)} · {n.type.toUpperCase()}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {n.link && (
                  <Link
                    href={n.link}
                    className="rounded-md border border-line px-3 py-1.5 text-[12px] text-ice transition-colors hover:border-cobalt hover:bg-cobalt/10"
                  >
                    Abrir
                  </Link>
                )}
                {!n.read && (
                  <form action={markNotificationRead}>
                    <input type="hidden" name="id" value={n.id} />
                    <button
                      type="submit"
                      className="rounded-md border border-line px-3 py-1.5 text-[12px] text-steel transition-colors hover:border-steel/40 hover:text-ice"
                    >
                      Lida
                    </button>
                  </form>
                )}
                <ConfirmDelete action={deleteNotification} id={n.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
