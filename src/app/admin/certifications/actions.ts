"use server";

import { revalidatePath } from "next/cache";
import { isOk } from "@/shared/domain/result";
import { getCareerAdminUseCases } from "@/composition/career";
import { withAdminAction, fromResultError } from "@/app/admin/_lib/admin-action";
import { success, type FormState } from "@/app/admin/_lib/form-state";
import { bool, num, str, strOrNull } from "@/app/admin/_lib/form-data";

function fields(fd: FormData) {
  return {
    name: str(fd, "name"),
    issuer: str(fd, "issuer"),
    issueDate: strOrNull(fd, "issueDate"),
    expiryDate: strOrNull(fd, "expiryDate"),
    credentialId: strOrNull(fd, "credentialId"),
    credentialUrl: strOrNull(fd, "credentialUrl"),
    sortOrder: num(fd, "sortOrder"),
    isVisible: bool(fd, "isVisible"),
  };
}

export async function createCertificationAction(_p: FormState, fd: FormData): Promise<FormState> {
  return withAdminAction(async (admin) => {
    const r = await getCareerAdminUseCases().certifications.create.execute({ admin, data: fields(fd) });
    if (!isOk(r)) return fromResultError(r);
    revalidatePath("/admin/certifications");
    return success("Đã tạo chứng chỉ.", r.value.id);
  });
}

export async function updateCertificationAction(_p: FormState, fd: FormData): Promise<FormState> {
  return withAdminAction(async (admin) => {
    const id = str(fd, "id");
    const expectedRowVersion = num(fd, "rowVersion");
    const r = await getCareerAdminUseCases().certifications.update.execute({ admin, id, expectedRowVersion, patch: fields(fd) });
    if (!isOk(r)) return fromResultError(r);
    revalidatePath("/admin/certifications");
    revalidatePath(`/admin/certifications/${id}`);
    return success("Đã lưu chứng chỉ.");
  });
}

export async function archiveCertificationAction(fd: FormData): Promise<void> {
  await withAdminAction(async (admin) => {
    const id = typeof fd.get("id") === "string" ? String(fd.get("id")) : "";
    await getCareerAdminUseCases().certifications.archive.execute({ admin, id });
    revalidatePath("/admin/certifications");
    return success("archived");
  });
}
