import Link from "next/link";
import { isOk } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { getTagUseCases } from "@/composition/tags";
import { AdminPageHeader, EmptyState, LoadError } from "@/app/admin/_components/page-parts";
import { DeleteButton } from "@/app/admin/_components/delete-button";
import { archiveTagAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminTagsPage() {
  const admin = await getAdminOrRedirect();
  const result = await getTagUseCases().list.execute({ admin });

  return (
    <div>
      <AdminPageHeader
        title="Thẻ"
        description="Phân loại dùng chung cho bài viết."
        actionHref="/admin/tags/new"
        actionLabel="Thêm thẻ"
      />
      {!isOk(result) ? (
        <LoadError message={result.error.message} />
      ) : result.value.length === 0 ? (
        <EmptyState message="Chưa có thẻ nào." />
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-lg border border-border">
          {result.value.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <Link href={`/admin/tags/${t.id}`} className="font-medium text-fg hover:text-accent">
                {t.name} <span className="text-xs text-fg-subtle">{t.slug}</span>
              </Link>
              <DeleteButton action={archiveTagAction} id={t.id} confirmLabel="Lưu trữ thẻ này?" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
