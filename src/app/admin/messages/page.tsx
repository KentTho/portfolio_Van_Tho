import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { AdminPageHeader } from "@/app/admin/_components/page-parts";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  await getAdminOrRedirect();
  return (
    <div>
      <AdminPageHeader title="Tin nhắn" description="Hộp thư liên hệ." />
      <div className="mt-6 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
        <p className="font-medium">Chưa có backend</p>
        <p className="mt-1 text-warning/90">
          Bảng <span className="font-mono">contact_messages</span> đã có trong schema, nhưng module ứng
          dụng contact (nhận gửi công khai + đọc/đánh dấu/lưu trữ phía admin) thuộc Wave tích hợp/bảo mật
          (Turnstile, rate-limit, IP-hash, email — CLAUDE.md §15). Sẽ xây khi tới Wave đó; không dựng
          inbox giả ở đây.
        </p>
      </div>
    </div>
  );
}
