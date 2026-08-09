import Link from "next/link";
import { isOk } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { getProjectAdminUseCases } from "@/composition/projects";
import { AdminPageHeader, EmptyState, LoadError, StatusBadge } from "@/app/admin/_components/page-parts";
import { ActionButton } from "@/app/admin/_components/action-button";
import { archiveProjectAction, publishProjectAction, unpublishProjectAction } from "./actions";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { kind: "on" | "off" | "warn"; label: string }> = {
  published: { kind: "on", label: "Đã đăng" },
  draft: { kind: "warn", label: "Nháp" },
  review: { kind: "warn", label: "Duyệt" },
  archived: { kind: "off", label: "Lưu trữ" },
};

export default async function AdminProjectsPage() {
  const admin = await getAdminOrRedirect();
  const result = await getProjectAdminUseCases().list.execute({ admin });

  return (
    <div>
      <AdminPageHeader
        title="Dự án"
        description="Bằng chứng năng lực. Công khai chỉ khi trạng thái đã đăng + hiển thị công khai."
        actionHref="/admin/projects/new"
        actionLabel="Tạo dự án"
      />
      {!isOk(result) ? (
        <LoadError message={result.error.message} />
      ) : result.value.length === 0 ? (
        <EmptyState message="Chưa có dự án nào." />
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-lg border border-border">
          {result.value.map((p) => {
            const s = STATUS[p.status] ?? { kind: "off" as const, label: p.status };
            return (
              <li key={p.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <Link href={`/admin/projects/${p.id}`} className="font-medium text-fg hover:text-accent">
                    {p.slug}
                  </Link>
                  <span className="ml-2 text-xs text-fg-subtle">{p.visibility}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge kind={s.kind} label={s.label} />
                  {p.status !== "published" && p.status !== "archived" ? (
                    <ActionButton action={publishProjectAction} id={p.id} rowVersion={p.rowVersion} label="Đăng" pendingLabel="Đang đăng…" />
                  ) : null}
                  {p.status === "published" ? (
                    <ActionButton action={unpublishProjectAction} id={p.id} rowVersion={p.rowVersion} label="Gỡ đăng" />
                  ) : null}
                  {p.status !== "archived" ? (
                    <ActionButton action={archiveProjectAction} id={p.id} rowVersion={p.rowVersion} label="Lưu trữ" danger />
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
