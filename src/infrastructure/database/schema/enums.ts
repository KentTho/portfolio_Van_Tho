import { pgEnum } from "drizzle-orm/pg-core";

export const appRole = pgEnum("app_role", ["owner_admin", "editor", "viewer"]);
export const userStatus = pgEnum("user_status", ["active", "suspended", "disabled"]);
export const projectStatus = pgEnum("project_status", ["draft", "review", "published", "archived"]);
export const projectVisibility = pgEnum("project_visibility", ["public", "unlisted", "private"]);
export const mediaVisibility = pgEnum("media_visibility", ["public", "private"]);
export const contactStatus = pgEnum("contact_status", ["new", "read", "archived"]);

// Wave 05 CMS — Group 1 (shared content foundations).
export const technologyCategory = pgEnum("technology_category", [
  "language",
  "backend",
  "frontend",
  "data",
  "cloud",
  "ai",
  "tooling",
]);

// Wave 05 CMS — Group 2 (projects).
export const projectSectionKind = pgEnum("project_section_kind", [
  "overview",
  "problem",
  "context",
  "role",
  "architecture",
  "decisions",
  "tradeoffs",
  "results",
  "limitations",
  "next_step",
]);
export const projectLinkType = pgEnum("project_link_type", [
  "github",
  "demo",
  "video",
  "docs",
  "case_study",
  "other",
]);

// Wave 05 CMS — Group 3 (articles).
export const articleStatus = pgEnum("article_status", ["draft", "published", "archived"]);
