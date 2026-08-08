import { err, ok, type Result } from "@/shared/domain/result";
import { ProjectStateError } from "@/modules/projects/domain/project-errors";
import type { ProjectStatus } from "@/modules/projects/domain/project";

/**
 * Pure status-transition policy. Publishing is idempotent from draft/review; an archived
 * project must be restored (unpublished→draft flow) before it can be published again.
 */
export function assertCanPublish(status: ProjectStatus): Result<true, ProjectStateError> {
  if (status === "archived") {
    return err(new ProjectStateError("Cannot publish an archived project; restore it first"));
  }
  return ok(true);
}

export function assertCanUnpublish(status: ProjectStatus): Result<true, ProjectStateError> {
  if (status !== "published") {
    return err(new ProjectStateError("Only a published project can be unpublished"));
  }
  return ok(true);
}

export function assertCanArchive(status: ProjectStatus): Result<true, ProjectStateError> {
  if (status === "archived") {
    return err(new ProjectStateError("Project is already archived"));
  }
  return ok(true);
}
