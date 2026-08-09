"use server";

import { revalidatePath } from "next/cache";
import { isOk } from "@/shared/domain/result";
import { getProjectAdminUseCases } from "@/composition/projects";
import { withAdminAction, fromResultError } from "@/app/admin/_lib/admin-action";
import { success, type FormState } from "@/app/admin/_lib/form-state";
import { bool, num, str, strOrNull } from "@/app/admin/_lib/form-data";

/** Project translations: title required, tagline + summary nullable. */
function collectProjectTranslations(fd: FormData) {
  const out: Array<{ locale: string; title: string; tagline: string | null; summary: string | null }> = [];
  for (const locale of ["vi", "en"] as const) {
    const title = str(fd, `${locale}_title`);
    if (!title) continue;
    out.push({
      locale,
      title,
      tagline: str(fd, `${locale}_tagline`) || null,
      summary: str(fd, `${locale}_summary`) || null,
    });
  }
  return out;
}

function collectTechnologies(fd: FormData) {
  return fd
    .getAll("technologyId")
    .filter((v): v is string => typeof v === "string" && v.length > 0)
    .map((technologyId, sortOrder) => ({ technologyId, sortOrder }));
}

/** Core fields the admin form manages. On UPDATE an omitted collection is left untouched, so
 *  links / metrics / sections / media are preserved even though this form doesn't edit them. */
function coreData(fd: FormData) {
  return {
    slug: str(fd, "slug"),
    category: str(fd, "category") || "software",
    visibility: str(fd, "visibility"),
    featured: bool(fd, "featured"),
    featuredOrder: str(fd, "featuredOrder") ? num(fd, "featuredOrder") : null,
    role: strOrNull(fd, "role"),
    translations: collectProjectTranslations(fd),
    technologies: collectTechnologies(fd),
  };
}

export async function createProjectAction(_p: FormState, fd: FormData): Promise<FormState> {
  return withAdminAction(async (admin) => {
    const r = await getProjectAdminUseCases().create.execute({ admin, data: coreData(fd) });
    if (!isOk(r)) return fromResultError(r);
    revalidatePath("/admin/projects");
    return success("Đã tạo dự án.", r.value.id);
  });
}

export async function updateProjectAction(_p: FormState, fd: FormData): Promise<FormState> {
  return withAdminAction(async (admin) => {
    const id = str(fd, "id");
    const expectedRowVersion = num(fd, "rowVersion");
    const r = await getProjectAdminUseCases().update.execute({ admin, id, expectedRowVersion, patch: coreData(fd) });
    if (!isOk(r)) return fromResultError(r);
    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}`);
    return success("Đã lưu dự án.");
  });
}

async function lifecycle(fd: FormData, op: "publish" | "unpublish" | "archive"): Promise<void> {
  await withAdminAction(async (admin) => {
    const id = typeof fd.get("id") === "string" ? String(fd.get("id")) : "";
    const expectedRowVersion = num(fd, "rowVersion");
    await getProjectAdminUseCases()[op].execute({ admin, id, expectedRowVersion });
    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}`);
    return success(op);
  });
}

export async function publishProjectAction(fd: FormData): Promise<void> {
  await lifecycle(fd, "publish");
}
export async function unpublishProjectAction(fd: FormData): Promise<void> {
  await lifecycle(fd, "unpublish");
}
export async function archiveProjectAction(fd: FormData): Promise<void> {
  await lifecycle(fd, "archive");
}
