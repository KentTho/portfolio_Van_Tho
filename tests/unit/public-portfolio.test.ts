import { describe, expect, it } from "vitest";
import { StaticPortfolioRepository } from "@/modules/public-portfolio/infrastructure/static-portfolio-repository";
import {
  projects as projectFixtures,
  techGroups,
} from "@/modules/public-portfolio/infrastructure/fixtures/portfolio-content";
import { isTechId } from "@/config/technology-catalog";

const repo = new StaticPortfolioRepository();

describe("StaticPortfolioRepository (public contract)", () => {
  it("only returns published projects", async () => {
    const list = await repo.listProjects();
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((p) => p.status === "published")).toBe(true);
  });

  it("returns null for an unknown project slug", async () => {
    expect(await repo.getProject("does-not-exist")).toBeNull();
  });

  it("resolves a known project by slug", async () => {
    const slug = projectFixtures[0]!.slug;
    const found = await repo.getProject(slug);
    expect(found?.slug).toBe(slug);
  });

  it("returns articles sorted newest-first", async () => {
    const list = await repo.listArticles();
    const dates = list.map((a) => a.publishedAt);
    expect([...dates]).toEqual([...dates].sort((a, b) => b.localeCompare(a)));
  });

  it("labels every project and article with an explicit sample flag", async () => {
    const [projects, articles] = await Promise.all([repo.listProjects(), repo.listArticles()]);
    expect(projects.every((p) => typeof p.sample === "boolean")).toBe(true);
    expect(articles.every((a) => typeof a.sample === "boolean")).toBe(true);
  });
});

describe("technology catalog coverage", () => {
  it("every techId referenced in content exists in the catalog", () => {
    const referenced = new Set<string>();
    for (const group of techGroups) group.techIds.forEach((id) => referenced.add(id));
    for (const project of projectFixtures) project.techIds.forEach((id) => referenced.add(id));

    const missing = [...referenced].filter((id) => !isTechId(id));
    expect(missing).toEqual([]);
  });
});
