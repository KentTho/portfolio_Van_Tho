import "server-only";
import type { PortfolioRepository } from "@/modules/public-portfolio/application/ports/portfolio-repository";
import type {
  ArticleDetail,
  ArticleSummary,
  ExperienceItem,
  Profile,
  ProjectDetail,
  ProjectSummary,
  TechGroup,
} from "@/modules/public-portfolio/domain/types";
import { getPublicReadModel, type PublicReadModel } from "@/composition/public-read";
import type { Localized } from "@/shared/i18n";

/**
 * Neon-backed public portfolio. Fulfils the same `PortfolioRepository` port the static
 * repository did (Wave 04 promised "Wave 05 swaps in Neon-backed repositories … with no
 * UI change"), so no presentation code changes. It reads ONLY the published/visible/public
 * projection via `getPublicReadModel()` — the underlying repositories enforce the gate.
 *
 * Bilingual: the Neon read model resolves one locale at a time, so each method fetches vi + en
 * and zips them into the `Localized` shape the UI expects. Fields the current schema does not
 * carry (e.g. a curated capability "tech matrix", or per-project sample flags) are returned
 * empty/derived rather than fabricated — honest, and populated the moment the Owner authors
 * real content through the Admin CMS. `sample` is always `false`: live rows are real, not
 * illustrative placeholders.
 */
const loc = (vi: string | null | undefined, en: string | null | undefined): Localized<string> => ({
  vi: vi ?? "",
  en: en ?? "",
});

/** Split a multi-line section body into list items (for decisions / tradeoffs). */
const lines = (viBody: string, enBody: string): readonly Localized<string>[] => {
  const v = viBody.split("\n").map((s) => s.trim()).filter(Boolean);
  const e = enBody.split("\n").map((s) => s.trim()).filter(Boolean);
  const n = Math.max(v.length, e.length);
  return Array.from({ length: n }, (_unused, i) => loc(v[i] ?? "", e[i] ?? ""));
};

type Sections = ReadonlyArray<{ readonly kind: string; readonly bodyMd: string }>;
const section = (s: Sections, kind: string) => s.find((x) => x.kind === kind)?.bodyMd ?? "";

export class NeonPortfolioRepository implements PortfolioRepository {
  // Injectable for unit tests; defaults to the live Neon read model in production wiring.
  constructor(private readonly rm: PublicReadModel = getPublicReadModel()) {}

  async getProfile(): Promise<Profile> {
    const p = await this.rm.getProfile();
    const socials: Profile["socials"] = p.publicEmail
      ? [{ kind: "email", label: p.publicEmail, href: `mailto:${p.publicEmail}` }]
      : [];
    // The profile row is flat (no per-locale translation table); mirror it across locales.
    return {
      name: p.fullName,
      role: loc(p.professionalTitle, p.professionalTitle),
      headline: loc("", ""),
      summary: loc("", ""),
      location: loc(p.location, p.location),
      education: loc("", ""),
      focusAreas: [],
      languages: [],
      socials,
    };
  }

  async getTechGroups(): Promise<readonly TechGroup[]> {
    // No Neon source for curated capability groups yet — returned empty rather than invented.
    return [];
  }

  async listProjects(): Promise<readonly ProjectSummary[]> {
    const [vi, en] = await Promise.all([
      this.rm.listPublishedProjects("vi"),
      this.rm.listPublishedProjects("en"),
    ]);
    const enBySlug = new Map(en.map((p) => [p.slug, p]));
    return vi.map((v) => {
      const e = enBySlug.get(v.slug);
      return {
        slug: v.slug,
        title: loc(v.title, e?.title ?? v.title),
        summary: loc(v.summary, e?.summary ?? v.summary),
        techIds: [],
        status: "published" as const,
        sample: false,
        year: v.publishedAt ? v.publishedAt.getFullYear() : undefined,
        coverAlt: loc(v.title, e?.title ?? v.title),
      };
    });
  }

  async getProject(slug: string): Promise<ProjectDetail | null> {
    const [vi, en] = await Promise.all([
      this.rm.getPublishedProject(slug, "vi"),
      this.rm.getPublishedProject(slug, "en"),
    ]);
    if (!vi) return null;
    const vs = vi.sections;
    const es = en?.sections ?? [];
    const github = vi.links.find((l) => l.linkType === "github")?.url;
    const demo = vi.links.find((l) => l.linkType === "demo")?.url;
    return {
      slug: vi.slug,
      title: loc(vi.title, en?.title ?? vi.title),
      summary: loc(vi.summary, en?.summary ?? vi.summary),
      techIds: vi.technologies.map((t) => t.slug),
      status: "published",
      sample: false,
      year: vi.publishedAt ? vi.publishedAt.getFullYear() : undefined,
      repoUrl: github,
      demoUrl: demo,
      coverAlt: loc(vi.title, en?.title ?? vi.title),
      problem: loc(section(vs, "problem"), section(es, "problem")),
      context: loc(section(vs, "context"), section(es, "context")),
      role: loc(section(vs, "role"), section(es, "role")),
      architecture: loc(section(vs, "architecture"), section(es, "architecture")),
      decisions: lines(section(vs, "decisions"), section(es, "decisions")),
      tradeoffs: lines(section(vs, "tradeoffs"), section(es, "tradeoffs")),
      results: loc(section(vs, "results"), section(es, "results")),
      limitations: loc(section(vs, "limitations"), section(es, "limitations")),
      nextStep: loc(section(vs, "next_step"), section(es, "next_step")),
    };
  }

  async listArticles(): Promise<readonly ArticleSummary[]> {
    const [vi, en] = await Promise.all([
      this.rm.listPublishedArticles("vi"),
      this.rm.listPublishedArticles("en"),
    ]);
    const enBySlug = new Map(en.map((a) => [a.slug, a]));
    return vi.map((v) => {
      const e = enBySlug.get(v.slug);
      return {
        slug: v.slug,
        title: loc(v.title, e?.title ?? v.title),
        summary: loc(v.summary, e?.summary ?? v.summary),
        tags: v.tags,
        publishedAt: v.publishedAt ? v.publishedAt.toISOString().slice(0, 10) : "",
        sample: false,
      };
    });
  }

  async getArticle(slug: string): Promise<ArticleDetail | null> {
    const [vi, en] = await Promise.all([
      this.rm.getPublishedArticle(slug, "vi"),
      this.rm.getPublishedArticle(slug, "en"),
    ]);
    if (!vi) return null;
    return {
      slug: vi.slug,
      title: loc(vi.title, en?.title ?? vi.title),
      summary: loc(vi.summary, en?.summary ?? vi.summary),
      tags: vi.tags,
      publishedAt: vi.publishedAt ? vi.publishedAt.toISOString().slice(0, 10) : "",
      sample: false,
      body: loc(vi.bodyMd, en?.bodyMd ?? vi.bodyMd),
    };
  }

  async listExperience(): Promise<readonly ExperienceItem[]> {
    const [vi, en] = await Promise.all([
      this.rm.listPublicExperiences("vi"),
      this.rm.listPublicExperiences("en"),
    ]);
    const key = (e: { organization: string; startDate: string }) => `${e.organization}::${e.startDate}`;
    const enByKey = new Map(en.map((e) => [key(e), e]));
    return vi.map((v) => {
      const e = enByKey.get(key(v));
      const end = v.isCurrent ? "" : (v.endDate ?? "");
      return {
        id: key(v),
        org: loc(v.organization, e?.organization ?? v.organization),
        role: loc(v.title, e?.title ?? v.title),
        period: `${v.startDate}${end ? ` — ${end}` : " —"}`,
        highlights: v.summary ? [loc(v.summary, e?.summary ?? v.summary)] : [],
        sample: false,
      };
    });
  }
}
