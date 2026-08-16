import Link from "next/link";
import { isOk } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { getCareerAdminUseCases } from "@/composition/career";
import { AdminPageHeader, EmptyState, LoadError, StatusBadge } from "@/app/admin/_components/page-parts";
import { DeleteButton } from "@/app/admin/_components/delete-button";
import { archiveCertificationAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCertificationsPage() {
  const admin = await getAdminOrRedirect();
  const result = await getCareerAdminUseCases().certifications.list.execute({ admin });

  return (
    <div>
      <AdminPageHeader
        title="Chứng chỉ"
        description="Chứng chỉ có bằng chứng xác thực."
        actionHref="/admin/certifications/new"
        actionLabel="Thêm chứng chỉ"
      />
      {!isOk(result) ? (
        <LoadError message={result.error.message} />
      ) : result.value.length === 0 ? (
        <EmptyState message="Chưa có chứng chỉ nào." />
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-lg border border-border">
          {result.value.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <Link href={`/admin/certifications/${c.id}`} className="font-medium text-fg hover:text-accent">
                  {c.name}
                </Link>
                <span className="ml-2 text-xs text-fg-subtle">{c.issuer}</span>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge kind={c.isVisible ? "on" : "off"} label={c.isVisible ? "Hiển thị" : "Ẩn"} />
                <DeleteButton action={archiveCertificationAction} id={c.id} confirmLabel="Lưu trữ mục này?" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
