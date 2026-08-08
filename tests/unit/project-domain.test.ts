import { describe, expect, it } from "vitest";
import { isErr, isOk } from "@/shared/domain/result";
import {
  PROJECT_LINK_TYPES,
  PROJECT_SECTION_KINDS,
  PROJECT_STATUSES,
  PROJECT_VISIBILITIES,
} from "@/modules/projects/domain/project";
import {
  assertCanArchive,
  assertCanPublish,
  assertCanUnpublish,
} from "@/modules/projects/domain/project-state";
import {
  projectLinkType,
  projectSectionKind,
  projectStatus,
  projectVisibility,
} from "@/infrastructure/database/schema";

const sorted = (a: readonly string[]) => [...a].sort();

describe("domain tuples never drift from the Postgres enums", () => {
  it("project_status", () => {
    expect(sorted(projectStatus.enumValues)).toEqual(sorted(PROJECT_STATUSES));
  });
  it("project_visibility", () => {
    expect(sorted(projectVisibility.enumValues)).toEqual(sorted(PROJECT_VISIBILITIES));
  });
  it("project_link_type", () => {
    expect(sorted(projectLinkType.enumValues)).toEqual(sorted(PROJECT_LINK_TYPES));
  });
  it("project_section_kind", () => {
    expect(sorted(projectSectionKind.enumValues)).toEqual(sorted(PROJECT_SECTION_KINDS));
  });
});

describe("status transition policy", () => {
  it("publishes from draft/review, rejects archived", () => {
    expect(isOk(assertCanPublish("draft"))).toBe(true);
    expect(isOk(assertCanPublish("review"))).toBe(true);
    expect(isOk(assertCanPublish("published"))).toBe(true);
    expect(isErr(assertCanPublish("archived"))).toBe(true);
  });

  it("unpublishes only a published project", () => {
    expect(isOk(assertCanUnpublish("published"))).toBe(true);
    expect(isErr(assertCanUnpublish("draft"))).toBe(true);
    expect(isErr(assertCanUnpublish("archived"))).toBe(true);
  });

  it("archives anything not already archived", () => {
    expect(isOk(assertCanArchive("draft"))).toBe(true);
    expect(isOk(assertCanArchive("published"))).toBe(true);
    expect(isErr(assertCanArchive("archived"))).toBe(true);
  });
});
