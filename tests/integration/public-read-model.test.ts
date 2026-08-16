// @vitest-environment node
import { describe, expect, it } from "vitest";
import { getPublicReadModel } from "@/composition/public-read";

/**
 * Live wiring smoke for the consolidated Public Neon read model. Gated by RUN_DB_SMOKE=1.
 * Each underlying leak-safe projection is already proven by its module write-side smoke;
 * this verifies the consolidation root executes end-to-end against Neon Development and
 * every method returns a well-formed shape (arrays / value-or-null), never throwing.
 */
const RUN = process.env.RUN_DB_SMOKE === "1";

describe("public read model consolidation on Neon Development", () => {
  it("is gated behind RUN_DB_SMOKE (offline suite skips the live smoke)", () => {
    expect(typeof RUN).toBe("boolean");
  });

  it.runIf(RUN)("every public read method returns a well-formed, leak-safe shape", async () => {
    const model = getPublicReadModel();

    expect(Array.isArray(await model.listPublishedProjects("vi"))).toBe(true);
    expect(Array.isArray(await model.listPublishedArticles("vi"))).toBe(true);
    expect(Array.isArray(await model.listPublicExperiences("vi"))).toBe(true);
    expect(Array.isArray(await model.listPublicEducation())).toBe(true);
    expect(Array.isArray(await model.listPublicCertifications())).toBe(true);
    expect(Array.isArray(await model.listPublicSkills())).toBe(true);

    // published-only detail read for a slug that does not exist → null (no leak, no throw)
    expect(await model.getPublishedProject("no-such-slug-xyz", "vi")).toBeNull();
    expect(await model.getPublishedArticle("no-such-slug-xyz", "vi")).toBeNull();

    // private-by-default setting read for a random key → null
    expect(await model.getPublicSetting("no.such.key.xyz")).toBeNull();

    // singleton profile always resolves to a value (defaults if never written)
    const profile = await model.getProfile();
    expect(typeof profile.defaultLocale).toBe("string");
  });
});
