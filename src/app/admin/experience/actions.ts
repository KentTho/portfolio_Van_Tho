"use server";

import { revalidatePath } from "next/cache";
import { isOk } from "@/shared/domain/result";
import { getCareerAdminUseCases } from "@/composition/career";
import { withAdminAction, fromResultError } from "@/app/admin/_lib/admin-action";
import { success, type FormState } from "@/app/admin/_lib/form-state";
import { bool, num, str, strOrNull } from "@/app/admin/_lib/form-data";
import { collectTranslations } from "@/app/admin/_lib/translations";

function baseFields(fd: FormData) {
  return {
    organization: str(fd, "organization"),
    employmentType: strOrNull(fd, "employmentType"),
    location: strOrNull(fd, "location"),
    url: strOrNull(fd, "url"),
    startDate: str(fd, "startDate"),
    endDate: strOrNull(fd, "endDate"),
    isCurrent: bool(fd, "isCurrent"),
    sortOrder: num(fd, "sortOrder"),
    isVisible: bool(fd, "isVisible"),
  };
}

export async function createExperienceAction(_p: FormState, fd: FormData): Promise<FormState> {
  return withAdminAction(async (admin) => {
    const data = { ...baseFields(fd), translations: collectTranslations(fd, "title", ["summary"]) };
    const r = await getCareerAdminUseCases().experiences.create.execute({ admin, data });
    if (!isOk(r)) return fromResultError(r);
    revalidatePath("/admin/experience");
    return success("Đã tạo kinh nghiệm.", r.value.id);
  });
}

export async function updateExperienceAction(_p: FormState, fd: FormData): Promise<FormState> {
  return withAdminAction(async (admin) => {
    const id = str(fd, "id");
    const expectedRowVersion = num(fd, "rowVersion");
    const patch = { ...baseFields(fd), translations: collectTranslations(fd, "title", ["summary"]) };
    const r = await getCareerAdminUseCases().experiences.update.execute({ admin, id, expectedRowVersion, patch });
    if (!isOk(r)) return fromResultError(r);
    revalidatePath("/admin/experience");
    revalidatePath(`/admin/experience/${id}`);
    return success("Đã lưu kinh nghiệm.");
  });
}

export async function archiveExperienceAction(fd: FormData): Promise<void> {
  await withAdminAction(async (admin) => {
    const id = typeof fd.get("id") === "string" ? String(fd.get("id")) : "";
    await getCareerAdminUseCases().experiences.archive.execute({ admin, id });
    revalidatePath("/admin/experience");
    return success("archived");
  });
}
