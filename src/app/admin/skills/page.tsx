import Link from "next/link";
import { isOk } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { getSkillAdminUseCases } from "@/composition/skills";
import { AdminPageHeader, EmptyState, LoadError, StatusBadge } from "@/app/admin/_components/page-parts";
import { DeleteButton } from "@/app/admin/_components/delete-button";
import { deleteSkillAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const admin = await getAdminOrRedirect();
  const result = await getSkillAdminUseCases().list.execute({ admin });

  return (
    <div>
      <AdminPageHeader
        title="Kỹ năng"
        description="Danh mục kỹ năng có bằng chứng. Ẩn/hiện bằng cờ hiển thị."
        actionHref="/admin/skills/new"
        actionLabel="Thêm kỹ năng"
      />
      {!isOk(result) ? (
        <LoadError message={result.error.message} />
      ) : result.value.length === 0 ? (
        <EmptyState message="Chưa có kỹ năng nào." />
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-lg border border-border">
          {result.value.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <Link href={`/admin/skills/${s.id}`} className="font-medium text-fg hover:text-accent">
                  {s.name}
                </Link>
                <span className="ml-2 text-xs text-fg-subtle">{s.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge kind={s.isVisible ? "on" : "off"} label={s.isVisible ? "Hiển thị" : "Ẩn"} />
                <DeleteButton action={deleteSkillAction} id={s.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
