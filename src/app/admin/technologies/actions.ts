"use server";

import { revalidatePath } from "next/cache";
import { isOk } from "@/shared/domain/result";
import { getTechnologyUseCases } from "@/composition/technologies";
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
function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on";
}
function fields(fd: FormData) {
  return {
    slug: str(fd, "slug"),
    name: str(fd, "name"),
    category: str(fd, "category"),
    deviconKey: str(fd, "deviconKey") || null,
    brandColor: str(fd, "brandColor") || null,
    website: str(fd, "website") || null,
    sortOrder: num(fd, "sortOrder"),
    isVisible: bool(fd, "isVisible"),
  };
}

export async function createTechnologyAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return withAdminAction(async (admin) => {
    const result = await getTechnologyUseCases().create.execute({ admin, data: fields(formData) });
    if (!isOk(result)) return fromResultError(result);
    revalidatePath("/admin/technologies");
    return success("Đã tạo công nghệ.", result.value.id);
  });
}

export async function updateTechnologyAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return withAdminAction(async (admin) => {
    const id = str(formData, "id");
    const result = await getTechnologyUseCases().update.execute({ admin, id, patch: fields(formData) });
    if (!isOk(result)) return fromResultError(result);
    revalidatePath("/admin/technologies");
    revalidatePath(`/admin/technologies/${id}`);
    return success("Đã lưu công nghệ.");
  });
}

export async function archiveTechnologyAction(formData: FormData): Promise<void> {
  await withAdminAction(async (admin) => {
    const id = typeof formData.get("id") === "string" ? String(formData.get("id")) : "";
    await getTechnologyUseCases().archive.execute({ admin, id });
    revalidatePath("/admin/technologies");
    return success("archived");
  });
}
