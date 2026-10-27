import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";
import SidebarNav from "@/components/admin/SidebarNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/");

  const unread = await db
    .select({ id: notifications.id })
    .from(notifications)
    .where(eq(notifications.read, false));

  return (
    <div className="min-h-screen bg-ink">
      <SidebarNav
        unread={unread.length}
        name={user.name}
        email={user.email}
      />
      {/* topbar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-ink/85 px-5 backdrop-blur-xl lg:pl-[264px]">
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[11px] tracking-[0.22em] text-steel-dim sm:block">
            PAINEL / {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="link-underline hidden text-[13px] text-steel hover:text-ice sm:block"
          >
            Ver site
          </Link>
          <span className="h-4 w-px bg-line" />
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cobalt/20 font-mono text-[11px] font-medium text-cobalt-soft">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
            <span className="hidden text-[13px] text-steel md:block">
              {user.name}
            </span>
          </div>
        </div>
      </div>
      <main className="px-5 py-8 sm:px-8 lg:pl-[288px]">
        <div className="mx-auto w-full max-w-[1160px]">{children}</div>
      </main>
    </div>
  );
}
