import { describe, expect, it } from "vitest";
import { NeonPortfolioRepository } from "@/modules/public-portfolio/infrastructure/neon-portfolio-repository";
import type { PublicReadModel } from "@/composition/public-read";
import { pick } from "@/shared/i18n";

/**
 * Pure mapper tests for the Neon-backed public repository. The read model is faked (no DB):
 * these prove the vi/en zip, project section-kind mapping, and — critically — that an empty
 * Neon result yields an empty public model with NO static-fixture fallback at runtime.
 */
function fakeReadModel(over: Partial<PublicReadModel> = {}): PublicReadModel {
  const base: PublicReadModel = {
    listPublishedProjects: async () => [],
    getPublishedProject: async () => null,
    listPublishedArticles: async () => [],
    getPublishedArticle: async () => null,
    listPublicExperiences: async () => [],
    listPublicEducation: async () => [],
    listPublicCertifications: async () => [],
    listPublicSkills: async () => [],
    getProfile: async () => ({
      fullName: "",
      professionalTitle: "",
      location: null,
      publicEmail: null,
      availabilityStatus: "unknown",
      defaultLocale: "vi",
    }),
    getPublicSetting: async () => null,
  };
  return { ...base, ...over };
}

describe("NeonPortfolioRepository (mapper)", () => {
  it("empty Neon → empty public model, no fixture fallback", async () => {
    const repo = new NeonPortfolioRepository(fakeReadModel());
    expect(await repo.listProjects()).toEqual([]);
    expect(await repo.listArticles()).toEqual([]);
    expect(await repo.listExperience()).toEqual([]);
    expect(await repo.getTechGroups()).toEqual([]);
    expect(await repo.getProject("anything")).toBeNull();
    expect(await repo.getArticle("anything")).toBeNull();
  });

  it("groups public skills by category into tech groups (slug as tech id)", async () => {
    const repo = new NeonPortfolioRepository(
      fakeReadModel({
        listPublicSkills: async () => [
          { id: "1", slug: "python", name: "Python", category: "Backend", proficiencyLabel: null, evidenceText: null, displayOrder: 0, isVisible: true },
          { id: "2", slug: "fastapi", name: "FastAPI", category: "Backend", proficiencyLabel: null, evidenceText: null, displayOrder: 1, isVisible: true },
          { id: "3", slug: "react", name: "React", category: "Frontend", proficiencyLabel: null, evidenceText: null, displayOrder: 0, isVisible: true },
        ] as never,
      }),
    );
    const groups = await repo.getTechGroups();
    expect(groups.map((g) => g.id).sort()).toEqual(["Backend", "Frontend"]);
    const backend = groups.find((g) => g.id === "Backend");
    expect(backend?.techIds).toEqual(["python", "fastapi"]);
    expect(pick(backend!.title, "vi")).toBe("Backend");
  });

  it("folds visible education into the profile education line", async () => {
    const repo = new NeonPortfolioRepository(
      fakeReadModel({
        listPublicEducation: async () => [
          {
            institution: "Nguyen Tat Thanh University",
            degree: null,
            fieldOfStudy: "Software Engineering",
            startDate: "2022-10-01",
            endDate: null,
            isCurrent: true,
            url: null,
          },
        ],
      }),
    );
    const profile = await repo.getProfile();
    expect(pick(profile.education, "vi")).toBe(
      "Nguyen Tat Thanh University — Software Engineering (2022 — nay)",
    );
  });

  it("zips vi/en project summaries and marks live rows non-sample", async () => {
    const repo = new NeonPortfolioRepository(
      fakeReadModel({
        listPublishedProjects: async (locale) => [
          {
            slug: "p1",
            title: locale === "vi" ? "Dự án" : "Project",
            tagline: null,
            summary: locale === "vi" ? "Tóm tắt" : "Summary",
            category: "web",
            featured: true,
            publishedAt: new Date("2025-03-02T00:00:00Z"),
          },
        ],
      }),
    );
    const [p] = await repo.listProjects();
    expect(p).toBeDefined();
    expect(pick(p!.title, "vi")).toBe("Dự án");
    expect(pick(p!.title, "en")).toBe("Project");
    expect(p!.sample).toBe(false);
    expect(p!.status).toBe("published");
    expect(p!.year).toBe(2025);
  });

  it("maps project detail sections by kind and links to repo/demo urls", async () => {
    const detail = (locale: "vi" | "en") => ({
      slug: "p1",
      title: locale === "vi" ? "Dự án" : "Project",
      tagline: null,
      summary: locale === "vi" ? "Tóm tắt" : "Summary",
      category: "web",
      featured: false,
      publishedAt: new Date("2025-01-01T00:00:00Z"),
      links: [
        { linkType: "github" as const, url: "https://gh/x", label: null },
        { linkType: "demo" as const, url: "https://demo/x", label: null },
      ],
      metrics: [],
      sections: [
        { kind: "problem" as const, heading: null, bodyMd: locale === "vi" ? "Vấn đề" : "Problem" },
        { kind: "architecture" as const, heading: null, bodyMd: "Arch" },
        { kind: "decisions" as const, heading: null, bodyMd: "d1\nd2" },
      ],
      technologies: [{ slug: "typescript", name: "TypeScript" }],
    });
    const repo = new NeonPortfolioRepository(
      fakeReadModel({ getPublishedProject: async (_slug, locale) => detail(locale) }),
    );
    const p = await repo.getProject("p1");
    expect(p).not.toBeNull();
    expect(pick(p!.problem, "vi")).toBe("Vấn đề");
    expect(pick(p!.problem, "en")).toBe("Problem");
    expect(pick(p!.architecture, "vi")).toBe("Arch");
    expect(p!.decisions).toHaveLength(2); // multi-line body → list items
    expect(p!.repoUrl).toBe("https://gh/x");
    expect(p!.demoUrl).toBe("https://demo/x");
    expect(p!.techIds).toEqual(["typescript"]);
    expect(p!.sample).toBe(false);
  });

  it("maps published article with bilingual body and ISO date", async () => {
    const repo = new NeonPortfolioRepository(
      fakeReadModel({
        getPublishedArticle: async (_slug, locale) => ({
          slug: "a1",
          title: locale === "vi" ? "Bài" : "Post",
          summary: null,
          featured: false,
          publishedAt: new Date("2025-06-15T00:00:00Z"),
          tags: ["ts"],
          bodyMd: locale === "vi" ? "# Nội dung" : "# Body",
        }),
      }),
    );
    const a = await repo.getArticle("a1");
    expect(a).not.toBeNull();
    expect(a!.publishedAt).toBe("2025-06-15");
    expect(pick(a!.body, "en")).toBe("# Body");
    expect(a!.sample).toBe(false);
  });

  it("derives profile email social and mirrors flat fields across locales", async () => {
    const repo = new NeonPortfolioRepository(
      fakeReadModel({
        getProfile: async () => ({
          fullName: "Van Tho",
          professionalTitle: "Engineer",
          location: "VN",
          publicEmail: "owner@example.com",
          availabilityStatus: "open",
          defaultLocale: "vi",
        }),
      }),
    );
    const prof = await repo.getProfile();
    expect(prof.name).toBe("Van Tho");
    expect(pick(prof.role, "en")).toBe("Engineer");
    expect(prof.socials).toEqual([
      { kind: "email", label: "owner@example.com", href: "mailto:owner@example.com" },
    ]);
  });
});
