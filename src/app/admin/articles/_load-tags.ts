import "server-only";
import { isOk } from "@/shared/domain/result";
import { getTagUseCases } from "@/composition/tags";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import type { TagOption } from "./article-form";

/** Load selectable tags for the article form (non-archived only). */
export async function loadTagOptions(admin: AdminUser): Promise<readonly TagOption[]> {
  const result = await getTagUseCases().list.execute({ admin });
  return isOk(result) ? result.value.map((t) => ({ id: t.id, name: t.name })) : [];
}
