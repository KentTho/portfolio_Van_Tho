import { describe, expect, it } from "vitest";
import {
  articleCreateSchema,
  articleUpdateSchema,
} from "@/modules/articles/application/article-schema";

const validCreate = {
  slug: "clean-architecture-notes",
  translations: [{ locale: "vi", title: "Ghi chú" }],
};

describe("articleCreateSchema", () => {
  it("accepts a minimal valid article and fills defaults", () => {
    const r = articleCreateSchema.safeParse(validCreate);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.featured).toBe(false);
      expect(r.data.featuredOrder).toBeNull();
      expect(r.data.coverMediaId).toBeNull();
      expect(r.data.tags).toEqual([]);
      expect(r.data.translations[0]?.summary).toBeNull();
      expect(r.data.translations[0]?.bodyMd).toBe("");
    }
  });

  it("requires at least one translation", () => {
    const r = articleCreateSchema.safeParse({ slug: "x-post", translations: [] });
    expect(r.success).toBe(false);
  });

  it("rejects duplicate translation locales", () => {
    const r = articleCreateSchema.safeParse({
      slug: "dup-locale",
      translations: [
        { locale: "vi", title: "A" },
        { locale: "vi", title: "B" },
      ],
    });
    expect(r.success).toBe(false);
  });

  it("rejects a non-kebab slug", () => {
    const r = articleCreateSchema.safeParse({ ...validCreate, slug: "Bad Slug" });
    expect(r.success).toBe(false);
  });

  it("rejects a non-uuid tag id", () => {
    const r = articleCreateSchema.safeParse({
      ...validCreate,
      tags: [{ tagId: "not-a-uuid" }],
    });
    expect(r.success).toBe(false);
  });
});

describe("articleUpdateSchema", () => {
  it("leaves omitted facets undefined (no clobber)", () => {
    const r = articleUpdateSchema.safeParse({ featured: true });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.featured).toBe(true);
      expect(r.data.slug).toBeUndefined();
      expect(r.data.translations).toBeUndefined();
      expect(r.data.tags).toBeUndefined();
      expect(r.data.coverMediaId).toBeUndefined();
    }
  });

  it("accepts an empty patch", () => {
    expect(articleUpdateSchema.safeParse({}).success).toBe(true);
  });
});
