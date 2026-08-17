import type { PortfolioRepository } from "@/modules/public-portfolio/application/ports/portfolio-repository";
import type {
  ArticleDetail,
  ArticleSummary,
  ProjectDetail,
  ProjectSummary,
} from "@/modules/public-portfolio/domain/types";
import {
  articles,
  experience,
  profile,
  projects,
  techGroups,
} from "@/modules/public-portfolio/infrastructure/fixtures/portfolio-content";

const isPublished = (c: { status: "published" | "draft" }) => c.status === "published";

const toProjectSummary = (p: ProjectDetail): ProjectSummary => ({
  slug: p.slug,
  title: p.title,
  summary: p.summary,
  techIds: p.techIds,
  status: p.status,
  sample: p.sample,
  year: p.year,
  repoUrl: p.repoUrl,
  demoUrl: p.demoUrl,
  coverAlt: p.coverAlt,
});

const toArticleSummary = (a: ArticleDetail): ArticleSummary => ({
  slug: a.slug,
  title: a.title,
  summary: a.summary,
  tags: a.tags,
  publishedAt: a.publishedAt,
  sample: a.sample,
});

/**
 * Typed static repository backed by in-repo fixtures. Public methods never return
 * draft content. Swappable for a Neon-backed repository (Wave 05) behind the port.
 */
export class StaticPortfolioRepository implements PortfolioRepository {
  async getProfile() {
    return profile;
  }

  async getTechGroups() {
    return techGroups;
  }

  async listProjects() {
    return projects.filter(isPublished).map(toProjectSummary);
  }

  async getProject(slug: string) {
    const found = projects.find((p) => p.slug === slug && isPublished(p));
    return found ?? null;
  }

  async listArticles() {
    return [...articles]
      .filter((a) => a.publishedAt.length > 0)
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .map(toArticleSummary);
  }

  async getArticle(slug: string) {
    const found = articles.find((a) => a.slug === slug);
    return found ?? null;
  }

  async listExperience() {
    return experience;
  }

  async listEducation() {
    // Fixtures carry no education rows; the live Neon repository is the authority.
    return [];
  }
}
