"use server";

import { revalidatePath } from "next/cache";
import { isOk } from "@/shared/domain/result";
import { getSkillAdminUseCases } from "@/composition/skills";
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

export async function createSkillAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return withAdminAction(async (admin) => {
    const data = {
      slug: str(formData, "slug"),
      name: str(formData, "name"),
      category: str(formData, "category") || "general",
      proficiencyLabel: str(formData, "proficiencyLabel") || null,
      evidenceText: str(formData, "evidenceText") || null,
      displayOrder: num(formData, "displayOrder"),
      isVisible: bool(formData, "isVisible"),
    };
    const result = await getSkillAdminUseCases().create.execute({ admin, data });
    if (!isOk(result)) return fromResultError(result);
    revalidatePath("/admin/skills");
    return success("Đã tạo kỹ năng.", result.value.id);
  });
}

export async function updateSkillAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return withAdminAction(async (admin) => {
    const id = str(formData, "id");
    const patch = {
      slug: str(formData, "slug"),
      name: str(formData, "name"),
      category: str(formData, "category") || "general",
      proficiencyLabel: str(formData, "proficiencyLabel") || null,
      evidenceText: str(formData, "evidenceText") || null,
      displayOrder: num(formData, "displayOrder"),
      isVisible: bool(formData, "isVisible"),
    };
    const result = await getSkillAdminUseCases().update.execute({ admin, id, patch });
    if (!isOk(result)) return fromResultError(result);
    revalidatePath("/admin/skills");
    revalidatePath(`/admin/skills/${id}`);
    return success("Đã lưu kỹ năng.");
  });
}

export async function deleteSkillAction(formData: FormData): Promise<void> {
  await withAdminAction(async (admin) => {
    const id = typeof formData.get("id") === "string" ? String(formData.get("id")) : "";
    await getSkillAdminUseCases().remove.execute({ admin, id });
    revalidatePath("/admin/skills");
    return success("deleted");
  });
}
