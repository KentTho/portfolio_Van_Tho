import type { MetadataRoute } from "next";
import { LOCALES } from "@/shared/i18n";
import { SITE } from "@/config/site";
import { getPortfolioRepository } from "@/composition/public-portfolio";

// Reads live project/article slugs from Neon, so the sitemap is generated on demand
// (keeps `next build` secret-free). Revalidated hourly at runtime.
export const dynamic = "force-dynamic";

const STATIC_PATHS = ["", "/projects", "/articles", "/about", "/resume", "/contact"] as const;

/** Localized sitemap. Sample content is excluded (it also carries noindex metadata). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repo = getPortfolioRepository();
  const [projects, articles] = await Promise.all([repo.listProjects(), repo.listArticles()]);
  const realProjects = projects.filter((p) => !p.sample);
  const realArticles = articles.filter((a) => !a.sample);

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE.url}/${locale}${path}`,
        changeFrequency: "monthly",
        priority: path === "" ? 1 : 0.7,
      });
    }
    for (const project of realProjects) {
      entries.push({ url: `${SITE.url}/${locale}/projects/${project.slug}` });
    }
    for (const article of realArticles) {
      entries.push({ url: `${SITE.url}/${locale}/articles/${article.slug}` });
    }
  }
  return entries;
}
