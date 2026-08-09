import Link from "next/link";
import { isOk } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { getRevisionUseCases } from "@/composition/revisions";
import { AdminPageHeader, EmptyState, LoadError } from "@/app/admin/_components/page-parts";

export const dynamic = "force-dynamic";

export default async function AdminRevisionsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; id?: string; revision?: string }>;
}) {
  const admin = await getAdminOrRedirect();
  const { type, id, revision } = await searchParams;

  if (!type || !id) {
    return (
      <div>
        <AdminPageHeader title="Phiên bản nội dung" description="Ảnh chụp bất biến của nội dung theo thời gian." />
        <EmptyState message="Mở lịch sử phiên bản từ trang chi tiết của một bài viết hoặc dự án." />
      </div>
    );
  }

  const uc = getRevisionUseCases();

  // Viewing a single snapshot (read-only preview restore — never mutates).
  if (revision) {
    const r = await uc.previewRestore.execute({ admin, id: revision });
    return (
      <div>
        <AdminPageHeader title="Xem phiên bản" description={`${type} · ${id}`} />
        <Link href={`/admin/revisions?type=${type}&id=${id}`} className="text-sm text-fg-muted hover:text-fg">
          ← Danh sách phiên bản
        </Link>
        {!isOk(r) ? (
          <LoadError message={r.error.message} />
        ) : (
          <>
            <p className="mt-4 text-sm text-fg-muted">
              Phiên bản v{r.value.revision.version} · {r.value.revision.createdAt.toISOString()}
            </p>
            <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-elevated p-4 text-xs text-fg">
              {JSON.stringify(r.value.snapshot, null, 2)}
            </pre>
            <p className="mt-3 text-xs text-fg-subtle">
              Khôi phục là một thao tác chỉnh sửa mới trên thực thể sống (không ghi đè lịch sử).
            </p>
          </>
        )}
      </div>
    );
  }

  // Listing revisions for one entity.
  const list = await uc.list.execute({ admin, ref: { contentType: type, contentId: id } });
  return (
    <div>
      <AdminPageHeader title="Lịch sử phiên bản" description={`${type} · ${id}`} />
      {!isOk(list) ? (
        <LoadError message={list.error.message} />
      ) : list.value.length === 0 ? (
        <EmptyState message="Chưa có phiên bản nào cho nội dung này." />
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-lg border border-border">
          {list.value.map((rev) => (
            <li key={rev.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-sm text-fg">
                v{rev.version}
                {rev.locale ? <span className="ml-2 text-xs text-fg-subtle">{rev.locale}</span> : null}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-fg-subtle">{rev.createdAt.toISOString()}</span>
                <Link
                  href={`/admin/revisions?type=${type}&id=${id}&revision=${rev.id}`}
                  className="text-xs text-accent hover:underline"
                >
                  Xem
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
