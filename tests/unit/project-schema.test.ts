import { describe, expect, it } from "vitest";
import {
  projectCreateSchema,
  projectUpdateSchema,
} from "@/modules/projects/application/project-schema";

const validCreate = {
  slug: "clean-arch-portfolio",
  translations: [{ locale: "vi", title: "Portfolio" }],
};

describe("projectCreateSchema", () => {
  it("accepts a minimal valid project and fills defaults", () => {
    const r = projectCreateSchema.safeParse(validCreate);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.visibility).toBe("private");
      expect(r.data.category).toBe("software");
      expect(r.data.technologies).toEqual([]);
    }
  });

  it("requires at least one translation", () => {
    const r = projectCreateSchema.safeParse({ slug: "x", translations: [] });
    expect(r.success).toBe(false);
  });

  it("rejects duplicate translation locales", () => {
    const r = projectCreateSchema.safeParse({
      slug: "x",
      translations: [
        { locale: "vi", title: "A" },
        { locale: "vi", title: "B" },
      ],
    });
    expect(r.success).toBe(false);
  });

  it("rejects a non-kebab slug", () => {
    const r = projectCreateSchema.safeParse({ ...validCreate, slug: "Bad Slug" });
    expect(r.success).toBe(false);
  });

  it("rejects an invalid link url", () => {
    const r = projectCreateSchema.safeParse({
      ...validCreate,
      links: [{ linkType: "github", url: "not-a-url" }],
    });
    expect(r.success).toBe(false);
  });
});

describe("projectUpdateSchema", () => {
  it("leaves omitted collections undefined (no clobber)", () => {
    const r = projectUpdateSchema.safeParse({ role: "Lead" });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.role).toBe("Lead");
      expect(r.data.translations).toBeUndefined();
      expect(r.data.links).toBeUndefined();
      expect(r.data.technologies).toBeUndefined();
    }
  });

  it("accepts an empty patch", () => {
    expect(projectUpdateSchema.safeParse({}).success).toBe(true);
  });
});
