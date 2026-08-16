"use server";

import { revalidatePath } from "next/cache";
import { isOk } from "@/shared/domain/result";
import { getArticleAdminUseCases } from "@/composition/articles";
import { withAdminAction, fromResultError } from "@/app/admin/_lib/admin-action";
import { success, type FormState } from "@/app/admin/_lib/form-state";
import { bool, num, str } from "@/app/admin/_lib/form-data";

/** Article translations: summary is nullable, bodyMd is a string (empty "" not null). */
function collectArticleTranslations(fd: FormData) {
  const out: Array<{ locale: string; title: string; summary: string | null; bodyMd: string }> = [];
  for (const locale of ["vi", "en"] as const) {
    const title = str(fd, `${locale}_title`);
    if (!title) continue;
    out.push({
      locale,
      title,
      summary: str(fd, `${locale}_summary`) || null,
      bodyMd: str(fd, `${locale}_bodyMd`),
    });
  }
  return out;
}

/** Checked tags become { tagId, sortOrder } keyed by checkbox order. */
function collectTags(fd: FormData) {
  return fd
    .getAll("tagId")
    .filter((v): v is string => typeof v === "string" && v.length > 0)
    .map((tagId, index) => ({ tagId, sortOrder: index }));
}

export async function createArticleAction(_p: FormState, fd: FormData): Promise<FormState> {
  return withAdminAction(async (admin) => {
    const data = {
      slug: str(fd, "slug"),
      featured: bool(fd, "featured"),
      translations: collectArticleTranslations(fd),
      tags: collectTags(fd),
    };
    const r = await getArticleAdminUseCases().create.execute({ admin, data });
    if (!isOk(r)) return fromResultError(r);
    revalidatePath("/admin/articles");
    return success("Đã tạo bài viết.", r.value.id);
  });
}

export async function updateArticleAction(_p: FormState, fd: FormData): Promise<FormState> {
  return withAdminAction(async (admin) => {
    const id = str(fd, "id");
    const expectedRowVersion = num(fd, "rowVersion");
    const patch = {
      slug: str(fd, "slug"),
      featured: bool(fd, "featured"),
      translations: collectArticleTranslations(fd),
      tags: collectTags(fd),
    };
    const r = await getArticleAdminUseCases().update.execute({ admin, id, expectedRowVersion, patch });
    if (!isOk(r)) return fromResultError(r);
    revalidatePath("/admin/articles");
    revalidatePath(`/admin/articles/${id}`);
    return success("Đã lưu bài viết.");
  });
}

async function lifecycle(fd: FormData, op: "publish" | "unpublish" | "archive"): Promise<void> {
  await withAdminAction(async (admin) => {
    const id = typeof fd.get("id") === "string" ? String(fd.get("id")) : "";
    const expectedRowVersion = num(fd, "rowVersion");
    await getArticleAdminUseCases()[op].execute({ admin, id, expectedRowVersion });
    revalidatePath("/admin/articles");
    revalidatePath(`/admin/articles/${id}`);
    return success(op);
  });
}

export async function publishArticleAction(fd: FormData): Promise<void> {
  await lifecycle(fd, "publish");
}
export async function unpublishArticleAction(fd: FormData): Promise<void> {
  await lifecycle(fd, "unpublish");
}
export async function archiveArticleAction(fd: FormData): Promise<void> {
  await lifecycle(fd, "archive");
}
