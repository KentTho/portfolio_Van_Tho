import Link from "next/link";
import { isOk } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { getCareerAdminUseCases } from "@/composition/career";
import { AdminPageHeader, EmptyState, LoadError, StatusBadge } from "@/app/admin/_components/page-parts";
import { DeleteButton } from "@/app/admin/_components/delete-button";
import { archiveEducationAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminEducationPage() {
  const admin = await getAdminOrRedirect();
  const result = await getCareerAdminUseCases().education.list.execute({ admin });

  return (
    <div>
      <AdminPageHeader
        title="Học vấn"
        description="Quá trình học tập."
        actionHref="/admin/education/new"
        actionLabel="Thêm học vấn"
      />
      {!isOk(result) ? (
        <LoadError message={result.error.message} />
      ) : result.value.length === 0 ? (
        <EmptyState message="Chưa có mục học vấn nào." />
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-lg border border-border">
          {result.value.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <Link href={`/admin/education/${e.id}`} className="font-medium text-fg hover:text-accent">
                  {e.institution}
                </Link>
                <span className="ml-2 text-xs text-fg-subtle">{e.degree ?? ""}</span>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge kind={e.isVisible ? "on" : "off"} label={e.isVisible ? "Hiển thị" : "Ẩn"} />
                <DeleteButton action={archiveEducationAction} id={e.id} confirmLabel="Lưu trữ mục này?" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
