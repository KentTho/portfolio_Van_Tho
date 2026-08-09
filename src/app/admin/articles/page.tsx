import Link from "next/link";
import { isOk } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { getArticleAdminUseCases } from "@/composition/articles";
import { AdminPageHeader, EmptyState, LoadError, StatusBadge } from "@/app/admin/_components/page-parts";
import { ActionButton } from "@/app/admin/_components/action-button";
import { archiveArticleAction, publishArticleAction, unpublishArticleAction } from "./actions";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { kind: "on" | "off" | "warn"; label: string }> = {
  published: { kind: "on", label: "Đã đăng" },
  draft: { kind: "warn", label: "Nháp" },
  archived: { kind: "off", label: "Lưu trữ" },
};

export default async function AdminArticlesPage() {
  const admin = await getAdminOrRedirect();
  const result = await getArticleAdminUseCases().list.execute({ admin });

  return (
    <div>
      <AdminPageHeader
        title="Bài viết"
        description="Viết bằng Markdown. Bản nháp không bao giờ lộ ra công khai."
        actionHref="/admin/articles/new"
        actionLabel="Viết bài"
      />
      {!isOk(result) ? (
        <LoadError message={result.error.message} />
      ) : result.value.length === 0 ? (
        <EmptyState message="Chưa có bài viết nào." />
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-lg border border-border">
          {result.value.map((a) => {
            const s = STATUS[a.status] ?? { kind: "off" as const, label: a.status };
            return (
              <li key={a.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <Link href={`/admin/articles/${a.id}`} className="font-medium text-fg hover:text-accent">
                    {a.slug}
                  </Link>
                  {a.featured ? <span className="ml-2 text-xs text-accent">★</span> : null}
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge kind={s.kind} label={s.label} />
                  {a.status !== "published" && a.status !== "archived" ? (
                    <ActionButton action={publishArticleAction} id={a.id} rowVersion={a.rowVersion} label="Đăng" pendingLabel="Đang đăng…" />
                  ) : null}
                  {a.status === "published" ? (
                    <ActionButton action={unpublishArticleAction} id={a.id} rowVersion={a.rowVersion} label="Gỡ đăng" />
                  ) : null}
                  {a.status !== "archived" ? (
                    <ActionButton action={archiveArticleAction} id={a.id} rowVersion={a.rowVersion} label="Lưu trữ" danger />
                  ) : null}
                  <Link href={`/admin/revisions?type=article&id=${a.id}`} className="text-xs text-fg-muted hover:text-fg">
                    Lịch sử
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
