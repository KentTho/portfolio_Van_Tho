import { isOk } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { getAuditUseCases } from "@/composition/audit";
import { AdminPageHeader, EmptyState, LoadError } from "@/app/admin/_components/page-parts";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const admin = await getAdminOrRedirect();
  const result = await getAuditUseCases().list.execute({ admin, limit: 100 });

  return (
    <div>
      <AdminPageHeader title="Nhật ký" description="Dấu vết hoạt động chỉ đọc (append-only, không chứa bí mật)." />
      {!isOk(result) ? (
        <LoadError message={result.error.message} />
      ) : result.value.length === 0 ? (
        <EmptyState message="Chưa có sự kiện nào." />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-elevated text-xs uppercase text-fg-subtle">
              <tr>
                <th className="px-4 py-2 font-medium">Thời gian</th>
                <th className="px-4 py-2 font-medium">Hành động</th>
                <th className="px-4 py-2 font-medium">Thực thể</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {result.value.map((e) => (
                <tr key={e.id}>
                  <td className="whitespace-nowrap px-4 py-2 text-xs text-fg-subtle">{e.createdAt.toISOString()}</td>
                  <td className="px-4 py-2 font-mono text-xs text-fg">{e.action}</td>
                  <td className="px-4 py-2 text-xs text-fg-muted">
                    {e.entityType}
                    {e.entityId ? `:${e.entityId.slice(0, 8)}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
