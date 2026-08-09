"use server";

import { revalidatePath } from "next/cache";
import { isOk } from "@/shared/domain/result";
import { getCareerAdminUseCases } from "@/composition/career";
import { withAdminAction, fromResultError } from "@/app/admin/_lib/admin-action";
import { success, type FormState } from "@/app/admin/_lib/form-state";
import { bool, num, str, strOrNull } from "@/app/admin/_lib/form-data";

function fields(fd: FormData) {
  return {
    institution: str(fd, "institution"),
    degree: strOrNull(fd, "degree"),
    fieldOfStudy: strOrNull(fd, "fieldOfStudy"),
    startDate: strOrNull(fd, "startDate"),
    endDate: strOrNull(fd, "endDate"),
    isCurrent: bool(fd, "isCurrent"),
    url: strOrNull(fd, "url"),
    sortOrder: num(fd, "sortOrder"),
    isVisible: bool(fd, "isVisible"),
  };
}

export async function createEducationAction(_p: FormState, fd: FormData): Promise<FormState> {
  return withAdminAction(async (admin) => {
    const r = await getCareerAdminUseCases().education.create.execute({ admin, data: fields(fd) });
    if (!isOk(r)) return fromResultError(r);
    revalidatePath("/admin/education");
    return success("Đã tạo học vấn.", r.value.id);
  });
}

export async function updateEducationAction(_p: FormState, fd: FormData): Promise<FormState> {
  return withAdminAction(async (admin) => {
    const id = str(fd, "id");
    const expectedRowVersion = num(fd, "rowVersion");
    const r = await getCareerAdminUseCases().education.update.execute({ admin, id, expectedRowVersion, patch: fields(fd) });
    if (!isOk(r)) return fromResultError(r);
    revalidatePath("/admin/education");
    revalidatePath(`/admin/education/${id}`);
    return success("Đã lưu học vấn.");
  });
}

export async function archiveEducationAction(fd: FormData): Promise<void> {
  await withAdminAction(async (admin) => {
    const id = typeof fd.get("id") === "string" ? String(fd.get("id")) : "";
    await getCareerAdminUseCases().education.archive.execute({ admin, id });
    revalidatePath("/admin/education");
    return success("archived");
  });
}
