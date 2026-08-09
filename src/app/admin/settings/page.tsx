import { isOk } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { getSiteSettingAdminUseCases } from "@/composition/site-settings";
import { AdminPageHeader, EmptyState, LoadError, StatusBadge } from "@/app/admin/_components/page-parts";
import { DeleteButton } from "@/app/admin/_components/delete-button";
import { SettingForm } from "./setting-form";
import { deleteSettingAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const admin = await getAdminOrRedirect();
  const result = await getSiteSettingAdminUseCases().list.execute({ admin });

  return (
    <div>
      <AdminPageHeader title="Cài đặt" description="Cấu hình key/value. Giá trị công khai chỉ lộ khi được bật." />

      <section className="mt-6">
        <h2 className="text-sm font-medium text-fg-muted">Danh sách</h2>
        {!isOk(result) ? (
          <LoadError message={result.error.message} />
        ) : result.value.length === 0 ? (
          <EmptyState message="Chưa có cài đặt nào." />
        ) : (
          <ul className="mt-3 divide-y divide-border rounded-lg border border-border">
            {result.value.map((s) => (
              <li key={s.key} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <span className="font-mono text-sm text-fg">{s.key}</span>
                  <span className="ml-2 truncate text-xs text-fg-subtle">{JSON.stringify(s.value)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge kind={s.isPublic ? "on" : "off"} label={s.isPublic ? "Công khai" : "Riêng tư"} />
                  <DeleteButton action={deleteSettingAction} id={s.key} confirmLabel={`Xoá cài đặt "${s.key}"?`} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-fg-muted">Thêm / cập nhật</h2>
        <SettingForm />
      </section>
    </div>
  );
}
