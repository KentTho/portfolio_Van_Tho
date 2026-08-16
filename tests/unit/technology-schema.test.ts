import { describe, expect, it } from "vitest";
import { technologyCategory } from "@/infrastructure/database/schema/enums";
import {
  isTechnologyCategory,
  TECHNOLOGY_CATEGORIES,
} from "@/modules/technologies/domain/technology";
import {
  technologyCreateSchema,
  technologyUpdateSchema,
} from "@/modules/technologies/application/technology-schema";

function validInput(overrides: Record<string, unknown> = {}) {
  return {
    slug: "next-js",
    name: "Next.js",
    category: "frontend",
    deviconKey: "nextjs",
    brandColor: "#000000",
    website: "https://nextjs.org",
    sortOrder: 3,
    isVisible: true,
    ...overrides,
  };
}

describe("technology category tuple", () => {
  it("never drifts from the technology_category DB enum", () => {
    expect([...technologyCategory.enumValues].sort()).toEqual([...TECHNOLOGY_CATEGORIES].sort());
  });

  it("guards category membership", () => {
    expect(isTechnologyCategory("backend")).toBe(true);
    expect(isTechnologyCategory("blockchain")).toBe(false);
  });
});

describe("technologyCreateSchema", () => {
  it("accepts a valid technology", () => {
    const parsed = technologyCreateSchema.parse(validInput());
    expect(parsed.slug).toBe("next-js");
    expect(parsed.category).toBe("frontend");
  });

  it("applies defaults for optional fields", () => {
    const parsed = technologyCreateSchema.parse({
      slug: "sql",
      name: "SQL",
      category: "data",
    });
    expect(parsed.deviconKey).toBeNull();
    expect(parsed.brandColor).toBeNull();
    expect(parsed.website).toBeNull();
    expect(parsed.sortOrder).toBe(0);
    expect(parsed.isVisible).toBe(true);
  });

  it("rejects a non-kebab-case slug", () => {
    expect(technologyCreateSchema.safeParse(validInput({ slug: "Next JS" })).success).toBe(false);
    expect(technologyCreateSchema.safeParse(validInput({ slug: "NextJS" })).success).toBe(false);
  });

  it("rejects an unknown category", () => {
    expect(technologyCreateSchema.safeParse(validInput({ category: "quantum" })).success).toBe(false);
  });

  it("rejects a malformed brand color", () => {
    expect(technologyCreateSchema.safeParse(validInput({ brandColor: "black" })).success).toBe(false);
    expect(technologyCreateSchema.safeParse(validInput({ brandColor: "#fff" })).success).toBe(false);
  });

  it("rejects an invalid website URL", () => {
    expect(technologyCreateSchema.safeParse(validInput({ website: "not-a-url" })).success).toBe(false);
  });

  it("rejects a negative sort order", () => {
    expect(technologyCreateSchema.safeParse(validInput({ sortOrder: -1 })).success).toBe(false);
  });
});

describe("technologyUpdateSchema", () => {
  it("allows a partial patch", () => {
    const parsed = technologyUpdateSchema.parse({ sortOrder: 5 });
    expect(parsed.sortOrder).toBe(5);
  });

  it("still validates provided fields", () => {
    expect(technologyUpdateSchema.safeParse({ slug: "Bad Slug" }).success).toBe(false);
  });
});
