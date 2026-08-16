import { isOk } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { getProfileAdminUseCases } from "@/composition/profile";
import { ProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const admin = await getAdminOrRedirect();
  const result = await getProfileAdminUseCases().get.execute({ admin });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-fg">Hồ sơ</h1>
      <p className="mt-2 text-sm text-fg-muted">
        Thông tin định danh công khai của chủ sở hữu. Không có dữ liệu bịa đặt.
      </p>
      {isOk(result) ? (
        <ProfileForm profile={result.value} />
      ) : (
        <p role="alert" className="mt-6 rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
          Không tải được hồ sơ: {result.error.message}
        </p>
      )}
    </div>
  );
}
