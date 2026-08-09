import { describe, expect, it } from "vitest";
import {
  certificationCreateSchema,
  educationCreateSchema,
  experienceCreateSchema,
  experienceUpdateSchema,
} from "@/modules/career/application/career-schema";

describe("experienceCreateSchema", () => {
  const valid = {
    organization: "Acme",
    startDate: "2022-01-01",
    translations: [{ locale: "vi", title: "Kỹ sư" }],
  };

  it("accepts a minimal experience and fills defaults", () => {
    const r = experienceCreateSchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.isCurrent).toBe(false);
      expect(r.data.isVisible).toBe(true);
      expect(r.data.endDate).toBeNull();
      expect(r.data.translations[0]?.summary).toBeNull();
    }
  });

  it("requires at least one translation", () => {
    const r = experienceCreateSchema.safeParse({ ...valid, translations: [] });
    expect(r.success).toBe(false);
  });

  it("rejects duplicate translation locales", () => {
    const r = experienceCreateSchema.safeParse({
      ...valid,
      translations: [
        { locale: "vi", title: "A" },
        { locale: "vi", title: "B" },
      ],
    });
    expect(r.success).toBe(false);
  });

  it("rejects a malformed date", () => {
    const r = experienceCreateSchema.safeParse({ ...valid, startDate: "01/2022" });
    expect(r.success).toBe(false);
  });

  it("rejects a non-http url", () => {
    const r = experienceCreateSchema.safeParse({ ...valid, url: "not-a-url" });
    expect(r.success).toBe(false);
  });
});

describe("experienceUpdateSchema (no clobber)", () => {
  it("leaves omitted facets undefined", () => {
    const r = experienceUpdateSchema.safeParse({ isVisible: false });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.isVisible).toBe(false);
      expect(r.data.organization).toBeUndefined();
      expect(r.data.translations).toBeUndefined();
    }
  });

  it("accepts an empty patch", () => {
    expect(experienceUpdateSchema.safeParse({}).success).toBe(true);
  });
});

describe("education / certification create schemas", () => {
  it("education requires an institution", () => {
    expect(educationCreateSchema.safeParse({ institution: "MIT" }).success).toBe(true);
    expect(educationCreateSchema.safeParse({}).success).toBe(false);
  });

  it("certification requires name and issuer", () => {
    expect(
      certificationCreateSchema.safeParse({ name: "AWS SAA", issuer: "Amazon" }).success,
    ).toBe(true);
    expect(certificationCreateSchema.safeParse({ name: "x" }).success).toBe(false);
  });
});
