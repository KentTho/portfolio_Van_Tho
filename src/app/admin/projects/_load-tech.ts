import "server-only";
import { isOk } from "@/shared/domain/result";
import { getTechnologyUseCases } from "@/composition/technologies";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import type { TechOption } from "./project-form";

/** Load selectable technologies for the project form (non-archived only). */
export async function loadTechOptions(admin: AdminUser): Promise<readonly TechOption[]> {
  const result = await getTechnologyUseCases().list.execute({ admin });
  return isOk(result) ? result.value.map((t) => ({ id: t.id, name: t.name })) : [];
}
