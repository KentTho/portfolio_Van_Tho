import Link from "next/link";
import { isOk } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { getTechnologyUseCases } from "@/composition/technologies";
import { AdminPageHeader, EmptyState, LoadError, StatusBadge } from "@/app/admin/_components/page-parts";
import { DeleteButton } from "@/app/admin/_components/delete-button";
import { archiveTechnologyAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminTechnologiesPage() {
  const admin = await getAdminOrRedirect();
  const result = await getTechnologyUseCases().list.execute({ admin });

  return (
    <div>
      <AdminPageHeader
        title="Công nghệ"
        description="Danh mục công nghệ dùng trong dự án."
        actionHref="/admin/technologies/new"
        actionLabel="Thêm công nghệ"
      />
      {!isOk(result) ? (
        <LoadError message={result.error.message} />
      ) : result.value.length === 0 ? (
        <EmptyState message="Chưa có công nghệ nào." />
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-lg border border-border">
          {result.value.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <Link href={`/admin/technologies/${t.id}`} className="font-medium text-fg hover:text-accent">
                  {t.name}
                </Link>
                <span className="ml-2 text-xs text-fg-subtle">{t.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge kind={t.isVisible ? "on" : "off"} label={t.isVisible ? "Hiển thị" : "Ẩn"} />
                <DeleteButton
                  action={archiveTechnologyAction}
                  id={t.id}
                  confirmLabel="Lưu trữ công nghệ này?"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
