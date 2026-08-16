// @vitest-environment node
import { describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { getDb } from "@/infrastructure/database/client";
import { certifications, education, experiences } from "@/infrastructure/database/schema";
import { DrizzleCareerRepository } from "@/modules/career/infrastructure/drizzle-career-repository";

/**
 * Live integration smoke against Neon DEVELOPMENT. Gated by RUN_DB_SMOKE=1 (offline suite
 * skips it). Exercises the real career repository: atomic experience+translations batch,
 * row_version concurrency, soft-delete, and visible-only public projection (no private or
 * soft-deleted leak) across experiences, education, and certifications.
 */
const RUN = process.env.RUN_DB_SMOKE === "1";

const ORG = "SmokeOrg-G4";
const INSTITUTION = "SmokeUni-G4";
const CERT = "SmokeCert-G4";

describe("career write-side on Neon Development", () => {
  it("is gated behind RUN_DB_SMOKE (offline suite skips the live smoke)", () => {
    expect(typeof RUN).toBe("boolean");
  });

  it.runIf(RUN)(
    "experiences/education/certifications: create → public visibility gate → stale → soft-delete disappearance",
    async () => {
      const db = getDb();
      const repo = new DrizzleCareerRepository();

      const clean = async () => {
        await db.delete(experiences).where(eq(experiences.organization, ORG));
        await db.delete(education).where(eq(education.institution, INSTITUTION));
        await db.delete(certifications).where(eq(certifications.name, CERT));
      };

      await clean();
      try {
        // create a HIDDEN experience with a localized translation (atomic batch)
        const exp = await repo.createExperience({
          organization: ORG,
          employmentType: "full-time",
          location: "Remote",
          url: null,
          startDate: "2021-06-01",
          endDate: null,
          isCurrent: true,
          sortOrder: 0,
          isVisible: false,
          translations: [{ locale: "vi", title: "Kỹ sư phần mềm", summary: "tóm tắt" }],
        });
        expect(exp.rowVersion).toBe(1);

        const agg = await repo.findExperienceById(exp.id);
        expect(agg?.translations).toHaveLength(1);

        // hidden → not in public projection
        const hidden = await repo.listPublicExperiences("vi");
        expect(hidden.some((e) => e.organization === ORG)).toBe(false);

        // make visible (version 1 → 2)
        const up = await repo.updateExperience(exp.id, 1, { isVisible: true });
        expect(up.kind === "updated" && up.entity.isVisible).toBe(true);

        const shown = await repo.listPublicExperiences("vi");
        const mine = shown.find((e) => e.organization === ORG);
        expect(mine?.title).toBe("Kỹ sư phần mềm");

        // stale write rejected (current version is 2)
        const stale = await repo.updateExperience(exp.id, 1, { location: "X" });
        expect(stale.kind).toBe("stale");

        // soft-delete → disappears from public + admin
        expect(await repo.softDeleteExperience(exp.id)).toBe(true);
        const afterDelete = await repo.listPublicExperiences("vi");
        expect(afterDelete.some((e) => e.organization === ORG)).toBe(false);
        expect((await repo.listAdminExperiences()).some((e) => e.organization === ORG)).toBe(false);

        // education: visible by default → public; then soft-delete
        const edu = await repo.createEducation({
          institution: INSTITUTION,
          degree: "BSc",
          fieldOfStudy: "CS",
          startDate: null,
          endDate: null,
          isCurrent: false,
          url: null,
          sortOrder: 0,
          isVisible: true,
        });
        expect((await repo.listPublicEducation()).some((e) => e.institution === INSTITUTION)).toBe(
          true,
        );
        const eduUp = await repo.updateEducation(edu.id, 1, { degree: "MSc" });
        expect(eduUp.kind === "updated" && eduUp.entity.degree).toBe("MSc");
        expect(await repo.softDeleteEducation(edu.id)).toBe(true);
        expect((await repo.listPublicEducation()).some((e) => e.institution === INSTITUTION)).toBe(
          false,
        );

        // certification: visible → public; then soft-delete
        const cert = await repo.createCertification({
          name: CERT,
          issuer: "Amazon",
          issueDate: null,
          expiryDate: null,
          credentialId: null,
          credentialUrl: null,
          sortOrder: 0,
          isVisible: true,
        });
        expect((await repo.listPublicCertifications()).some((c) => c.name === CERT)).toBe(true);
        expect(await repo.softDeleteCertification(cert.id)).toBe(true);
        expect((await repo.listPublicCertifications()).some((c) => c.name === CERT)).toBe(false);
      } finally {
        await clean();
      }

      const leftExp = await db
        .select({ id: experiences.id })
        .from(experiences)
        .where(eq(experiences.organization, ORG));
      expect(leftExp).toHaveLength(0);
    },
    60_000,
  );
});
