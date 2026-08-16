// @vitest-environment node
import { describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { getDb } from "@/infrastructure/database/client";
import { projects, technologies } from "@/infrastructure/database/schema";
import {
  projectCreateSchema,
  projectUpdateSchema,
} from "@/modules/projects/application/project-schema";
import { DrizzleProjectRepository } from "@/modules/projects/infrastructure/drizzle-project-repository";
import { DrizzlePortfolioRepository } from "@/modules/projects/infrastructure/drizzle-portfolio-repository";

/**
 * Live integration smoke against Neon DEVELOPMENT. Registered as a SKIPPED test in the
 * default suite (and CI) — it only runs when RUN_DB_SMOKE=1, so the offline suite needs
 * no database or secrets. `getDb()` is called inside the test body so collection never
 * touches env. Exercises the real Drizzle repositories: atomic batched writes, optimistic
 * concurrency, published-only reads, reference RESTRICT, and transaction atomicity.
 */
const RUN = process.env.RUN_DB_SMOKE === "1";

const PROJECT_SLUG = "smoke-proj-g2b";
const ATOMIC_SLUG = "smoke-proj-atomic";
const TECH_SLUG = "smoke-tech-ref";

describe("projects write-side on Neon Development", () => {
  it("is gated behind RUN_DB_SMOKE (offline suite skips the live smoke)", () => {
    expect(typeof RUN).toBe("boolean");
  });

  it.runIf(RUN)(
    "runs the full lifecycle: create → publish → public read → stale → unpublish → archive, with atomicity + reference rules",
    async () => {
      const db = getDb();
      const repo = new DrizzleProjectRepository();
      const portfolio = new DrizzlePortfolioRepository();

      const clean = async () => {
        await db.delete(projects).where(eq(projects.slug, PROJECT_SLUG));
        await db.delete(projects).where(eq(projects.slug, ATOMIC_SLUG));
        await db.delete(technologies).where(eq(technologies.slug, TECH_SLUG));
      };

      await clean(); // fresh slate
      try {
        // a referenced technology (RESTRICT target)
        const techId = crypto.randomUUID();
        await db.insert(technologies).values({
          id: techId,
          slug: TECH_SLUG,
          name: "SmokeTech",
          category: "frontend",
        });

        // create draft (atomic multi-table batch)
        const input = projectCreateSchema.parse({
          slug: PROJECT_SLUG,
          category: "software",
          visibility: "private",
          role: "Lead",
          translations: [{ locale: "vi", title: "Dự án Smoke", summary: "tóm tắt" }],
          technologies: [{ technologyId: techId }],
          links: [{ linkType: "github", url: "https://github.com/x/y" }],
          metrics: [{ label: "Uptime", value: "99.9%" }],
          sections: [
            {
              kind: "overview",
              translations: [{ locale: "vi", heading: "Tổng quan", bodyMd: "# Hi" }],
            },
          ],
        });
        const created = await repo.create(input);
        expect(created.status).toBe("draft");
        expect(created.rowVersion).toBe(1);

        // aggregate reflects children
        const agg = await repo.findAdminById(created.id);
        expect(agg?.translations).toHaveLength(1);
        expect(agg?.technologies).toHaveLength(1);
        expect(agg?.links).toHaveLength(1);
        expect(agg?.sections).toHaveLength(1);

        // draft leak check: not visible publicly
        const beforePublish = await portfolio.listPublishedProjects("vi");
        expect(beforePublish.some((p) => p.slug === PROJECT_SLUG)).toBe(false);

        // make public + publish (optimistic concurrency)
        const u1 = await repo.update(created.id, 1, projectUpdateSchema.parse({ visibility: "public" }));
        expect(u1.kind).toBe("updated");
        const pub = await repo.setStatus(created.id, 2, { status: "published", publishedAt: new Date() });
        expect(pub.kind === "updated" && pub.project.status).toBe("published");

        // public read now returns it, localized, with technology + link + section
        const detail = await portfolio.getPublishedProject(PROJECT_SLUG, "vi");
        expect(detail).not.toBeNull();
        expect(detail?.title).toBe("Dự án Smoke");
        expect(detail?.technologies.map((t) => t.slug)).toContain(TECH_SLUG);
        expect(detail?.links).toHaveLength(1);
        expect(detail?.sections).toHaveLength(1);

        // stale write rejected (current version is 3)
        const stale = await repo.update(created.id, 2, projectUpdateSchema.parse({ role: "X" }));
        expect(stale.kind).toBe("stale");

        // unpublish → disappears from public
        const un = await repo.setStatus(created.id, 3, { status: "draft", publishedAt: null });
        expect(un.kind).toBe("updated");
        expect(await portfolio.getPublishedProject(PROJECT_SLUG, "vi")).toBeNull();

        // reference RESTRICT: cannot delete a technology still referenced
        let restricted = false;
        try {
          await db.delete(technologies).where(eq(technologies.id, techId));
        } catch {
          restricted = true;
        }
        expect(restricted).toBe(true);

        // transaction atomicity: a batch that violates an FK inserts nothing
        let threw = false;
        try {
          await repo.create(
            projectCreateSchema.parse({
              slug: ATOMIC_SLUG,
              translations: [{ locale: "vi", title: "Atomic" }],
              technologies: [{ technologyId: crypto.randomUUID() }], // non-existent → FK restrict
            }),
          );
        } catch {
          threw = true;
        }
        expect(threw).toBe(true);
        expect(await repo.findBySlug(ATOMIC_SLUG)).toBeNull();

        // archive → still not public
        const arch = await repo.setStatus(created.id, 4, { status: "archived", publishedAt: null });
        expect(arch.kind === "updated" && arch.project.status).toBe("archived");
        expect(await portfolio.getPublishedProject(PROJECT_SLUG, "vi")).toBeNull();
      } finally {
        await clean();
      }

      const leftProjects = await db
        .select({ id: projects.id })
        .from(projects)
        .where(eq(projects.slug, PROJECT_SLUG));
      const leftTech = await db
        .select({ id: technologies.id })
        .from(technologies)
        .where(eq(technologies.slug, TECH_SLUG));
      expect(leftProjects).toHaveLength(0);
      expect(leftTech).toHaveLength(0);
    },
    60_000,
  );
});
