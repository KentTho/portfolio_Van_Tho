"use server";

import { revalidatePath } from "next/cache";
import { isOk } from "@/shared/domain/result";
import { getTagUseCases } from "@/composition/tags";
import { withAdminAction, fromResultError } from "@/app/admin/_lib/admin-action";
import { success, type FormState } from "@/app/admin/_lib/form-state";

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}
function num(fd: FormData, key: string): number {
  const n = Number(str(fd, key));
  return Number.isFinite(n) ? n : 0;
}

export async function createTagAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return withAdminAction(async (admin) => {
    const data = { slug: str(formData, "slug"), name: str(formData, "name"), sortOrder: num(formData, "sortOrder") };
    const result = await getTagUseCases().create.execute({ admin, data });
    if (!isOk(result)) return fromResultError(result);
    revalidatePath("/admin/tags");
    return success("Đã tạo thẻ.", result.value.id);
  });
}

export async function updateTagAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return withAdminAction(async (admin) => {
    const id = str(formData, "id");
    const patch = { slug: str(formData, "slug"), name: str(formData, "name"), sortOrder: num(formData, "sortOrder") };
    const result = await getTagUseCases().update.execute({ admin, id, patch });
    if (!isOk(result)) return fromResultError(result);
    revalidatePath("/admin/tags");
    revalidatePath(`/admin/tags/${id}`);
    return success("Đã lưu thẻ.");
  });
}

export async function archiveTagAction(formData: FormData): Promise<void> {
  await withAdminAction(async (admin) => {
    const id = typeof formData.get("id") === "string" ? String(formData.get("id")) : "";
    await getTagUseCases().archive.execute({ admin, id });
    revalidatePath("/admin/tags");
    return success("archived");
  });
}
