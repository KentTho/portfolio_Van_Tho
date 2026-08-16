"use server";

import { revalidatePath } from "next/cache";
import { isOk } from "@/shared/domain/result";
import { getProfileAdminUseCases } from "@/composition/profile";
import { withAdminAction, fromResultError } from "@/app/admin/_lib/admin-action";
import { success, type FormState } from "@/app/admin/_lib/form-state";

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function updateProfileAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return withAdminAction(async (admin) => {
    const patch = {
      fullName: str(formData, "fullName"),
      professionalTitle: str(formData, "professionalTitle"),
      location: str(formData, "location") || null,
      publicEmail: str(formData, "publicEmail") || null,
      availabilityStatus: str(formData, "availabilityStatus"),
      defaultLocale: str(formData, "defaultLocale"),
    };
    const result = await getProfileAdminUseCases().update.execute({ admin, patch });
    if (!isOk(result)) return fromResultError(result);
    revalidatePath("/admin/profile");
    return success("Đã lưu hồ sơ.");
  });
}
