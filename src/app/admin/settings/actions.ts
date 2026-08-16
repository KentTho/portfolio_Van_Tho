"use server";

import { revalidatePath } from "next/cache";
import { isOk } from "@/shared/domain/result";
import { getSiteSettingAdminUseCases } from "@/composition/site-settings";
import { withAdminAction, fromResultError } from "@/app/admin/_lib/admin-action";
import { failure, success, type FormState } from "@/app/admin/_lib/form-state";
import { bool, str } from "@/app/admin/_lib/form-data";

export async function upsertSettingAction(_p: FormState, fd: FormData): Promise<FormState> {
  return withAdminAction(async (admin) => {
    const raw = str(fd, "value");
    let value: unknown;
    try {
      value = raw === "" ? null : JSON.parse(raw);
    } catch {
      return failure("Giá trị phải là JSON hợp lệ (ví dụ \"text\", 123, true, {\"vi\":\"…\"}).", "SETTING_VALIDATION");
    }
    const data = { key: str(fd, "key"), value, isPublic: bool(fd, "isPublic") };
    const r = await getSiteSettingAdminUseCases().upsert.execute({ admin, data });
    if (!isOk(r)) return fromResultError(r);
    revalidatePath("/admin/settings");
    return success("Đã lưu cài đặt.");
  });
}

export async function deleteSettingAction(fd: FormData): Promise<void> {
  await withAdminAction(async (admin) => {
    const key = typeof fd.get("id") === "string" ? String(fd.get("id")) : "";
    await getSiteSettingAdminUseCases().remove.execute({ admin, key });
    revalidatePath("/admin/settings");
    return success("deleted");
  });
}
