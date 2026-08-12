import Link from "next/link";
import { pick, type Locale } from "@/shared/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import type { ArticleSummary } from "@/modules/public-portfolio/domain/types";
import { SectionHeading } from "@/components/public/section-heading";
import { SampleBadge } from "@/components/public/sample-badge";
import { Reveal } from "@/components/public/reveal";

/**
 * SINGLE LANDING — Latest Articles
 *
 * Consolidated from the former /articles list route. Shows published writing
 * with links to the preserved /articles/[slug] detail routes. Live data only —
 * honest empty state when nothing is published (no seeded/fake articles).
 */
export function ArticlesSection({
  articles,
  locale,
  dict,
}: {
  readonly articles: readonly ArticleSummary[];
  readonly locale: Locale;
  readonly dict: Dictionary;
}) {
  return (
    <section aria-labelledby="articles-heading" className="mx-auto w-full max-w-6xl px-6 py-24">
      <div className="mb-12 h-px w-full bg-border/50" aria-hidden />
      <SectionHeading
        id="articles-heading"
        title={dict.sections.writing}
        subtitle={dict.home.writingSubtitle}
      />

      {articles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/20 px-8 py-12 text-center">
          <p className="text-sm text-fg-subtle">{dict.labels.empty}</p>
        </div>
      ) : (
        <ul className="divide-y divide-border/60">
          {articles.map((article, index) => (
            <Reveal as="li" key={article.slug} delay={index * 0.05} className="py-6">
              <Link
                href={`/${locale}/articles/${article.slug}`}
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              >
                <div className="flex items-center gap-3">
                  <time className="label-mono" dateTime={article.publishedAt}>
                    {article.publishedAt}
                  </time>
                  {article.sample ? <SampleBadge label={dict.labels.sample} /> : null}
                </div>
                <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-fg transition-colors group-hover:text-accent">
                  {pick(article.title, locale)}
                </h3>
                <p className="mt-2 text-fg-muted">{pick(article.summary, locale)}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      )}
    </section>
  );
}
