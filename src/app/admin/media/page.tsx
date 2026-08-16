import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { AdminPageHeader } from "@/app/admin/_components/page-parts";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  await getAdminOrRedirect();
  return (
    <div>
      <AdminPageHeader title="Media" description="Tải lên qua Supabase Storage do máy chủ trung gian." />
      <div className="mt-6 rounded-lg border border-info/40 bg-info/10 px-4 py-3 text-sm text-info">
        <p className="font-medium">Trạng thái backend</p>
        <p className="mt-1 text-info/90">
          Luồng <span className="font-mono">signed upload</span> đã có và được kiểm chứng (route{" "}
          <span className="font-mono">/api/media/upload-url</span> — máy chủ xác thực role + bucket +
          MIME + kích thước trước khi cấp URL; service key không bao giờ ở client). Giao diện duyệt/đính
          kèm asset cho nội dung sẽ bổ sung ở bước kế (cần <span className="font-mono">media</span> read
          use-case + reference-aware delete). Không dựng UI giả ở đây.
        </p>
      </div>
    </div>
  );
}
