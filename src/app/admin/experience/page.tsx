import Link from "next/link";
import { isOk } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { getCareerAdminUseCases } from "@/composition/career";
import { AdminPageHeader, EmptyState, LoadError, StatusBadge } from "@/app/admin/_components/page-parts";
import { DeleteButton } from "@/app/admin/_components/delete-button";
import { archiveExperienceAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const admin = await getAdminOrRedirect();
  const result = await getCareerAdminUseCases().experiences.list.execute({ admin });

  return (
    <div>
      <AdminPageHeader
        title="Kinh nghiệm"
        description="Lịch sử công việc. Ẩn/hiện bằng cờ hiển thị; lưu trữ để xoá mềm."
        actionHref="/admin/experience/new"
        actionLabel="Thêm kinh nghiệm"
      />
      {!isOk(result) ? (
        <LoadError message={result.error.message} />
      ) : result.value.length === 0 ? (
        <EmptyState message="Chưa có kinh nghiệm nào." />
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-lg border border-border">
          {result.value.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <Link href={`/admin/experience/${e.id}`} className="font-medium text-fg hover:text-accent">
                  {e.organization}
                </Link>
                <span className="ml-2 text-xs text-fg-subtle">
                  {e.startDate}
                  {e.isCurrent ? " → nay" : e.endDate ? ` → ${e.endDate}` : ""}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge kind={e.isVisible ? "on" : "off"} label={e.isVisible ? "Hiển thị" : "Ẩn"} />
                <DeleteButton action={archiveExperienceAction} id={e.id} confirmLabel="Lưu trữ mục này?" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
