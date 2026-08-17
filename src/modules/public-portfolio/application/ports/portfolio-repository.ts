import type {
  ArticleDetail,
  ArticleSummary,
  EducationItem,
  ExperienceItem,
  Profile,
  ProjectDetail,
  ProjectSummary,
  TechGroup,
} from "@/modules/public-portfolio/domain/types";

/**
 * Read-only public portfolio port. Implementations MUST NOT return draft/private
 * content from list/get methods (public surface never leaks unpublished rows).
 * Wave 04 is backed by a typed static repository; Wave 05 swaps in Neon-backed
 * repositories behind this same port with no UI change.
 */
export interface PortfolioRepository {
  getProfile(): Promise<Profile>;
  getTechGroups(): Promise<readonly TechGroup[]>;
  listProjects(): Promise<readonly ProjectSummary[]>;
  getProject(slug: string): Promise<ProjectDetail | null>;
  listArticles(): Promise<readonly ArticleSummary[]>;
  getArticle(slug: string): Promise<ArticleDetail | null>;
  listExperience(): Promise<readonly ExperienceItem[]>;
  listEducation(): Promise<readonly EducationItem[]>;
}
