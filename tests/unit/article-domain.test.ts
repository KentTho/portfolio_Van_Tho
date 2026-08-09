import { describe, expect, it } from "vitest";
import { isErr, isOk } from "@/shared/domain/result";
import { ARTICLE_STATUSES } from "@/modules/articles/domain/article";
import {
  assertCanArchive,
  assertCanPublish,
  assertCanUnpublish,
} from "@/modules/articles/domain/article-state";
import { articleStatus } from "@/infrastructure/database/schema";

const sorted = (a: readonly string[]) => [...a].sort();

describe("article domain tuple never drifts from the Postgres enum", () => {
  it("article_status", () => {
    expect(sorted(articleStatus.enumValues)).toEqual(sorted(ARTICLE_STATUSES));
  });
});

describe("article status transition policy", () => {
  it("publishes from draft/published, rejects archived", () => {
    expect(isOk(assertCanPublish("draft"))).toBe(true);
    expect(isOk(assertCanPublish("published"))).toBe(true);
    expect(isErr(assertCanPublish("archived"))).toBe(true);
  });

  it("unpublishes only a published article", () => {
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
