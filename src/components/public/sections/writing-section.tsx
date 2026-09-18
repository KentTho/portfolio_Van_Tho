import Link from "next/link";
import { Reveal } from "@/components/public/reveal";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/shared/i18n";

export interface ArticleSummaryItem {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly publishedAt: string;
  readonly readingTime?: string;
  readonly isVisible: boolean;
}

interface WritingSectionProps {
  readonly articles?: readonly ArticleSummaryItem[];
  readonly locale: Locale;
}

/**
 * Ariyana V3 Writing / Notes Section (§38).
 * Strictly conditional: If no published articles exist, section returns null (HIDDEN).
 * Zero fake "Coming soon" cards.
 */
export function WritingSection({ articles = [], locale }: WritingSectionProps) {
  const publishedArticles = articles.filter((a) => a.isVisible);

  if (publishedArticles.length === 0) {
    return null;
  }

  return (
    <section
      id="writing"
      aria-labelledby="writing-heading"
      className="relative w-full border-t border-white/10 py-24 lg:py-36 overflow-hidden bg-canvas"
    >
      <div className="mx-auto w-full max-w-[1680px] px-6 md:px-12 lg:px-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="caption-pill">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            <span>JOURNAL // WRITING</span>
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-xs text-brand-primary-soft uppercase tracking-widest hidden sm:inline-block">
            06 // PUBLICATIONS
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <h2
            id="writing-heading"
            className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-tight text-fg leading-tight"
          >
            TECHNICAL WRITING &amp; SYSTEM NOTES
          </h2>

          <Link
            href={`/${locale}/articles`}
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-brand-primary-soft hover:text-fg transition-colors"
          >
            <span>VIEW ALL ESSAYS</span>
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="space-y-6">
          {publishedArticles.map((article, idx) => (
            <Reveal key={article.slug} direction="up" distance={20} delay={idx * 0.08}>
              <Link
                href={`/${locale}/articles/${article.slug}`}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-[2rem] border border-white/15 bg-surface/40 p-8 sm:p-10 backdrop-blur-sm transition-all duration-300 hover:border-brand-primary hover:bg-surface/70"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-3 font-mono text-xs text-brand-primary-soft uppercase tracking-wider">
                    <span>{article.publishedAt}</span>
                    {article.readingTime && (
                      <>
                        <span className="text-white/20">·</span>
                        <span>{article.readingTime}</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display uppercase tracking-tight text-fg group-hover:text-brand-primary-soft transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-body text-fg-muted line-clamp-2">
                    {article.summary}
                  </p>
                </div>

                <div className="size-12 rounded-full border border-white/15 flex items-center justify-center shrink-0 text-fg group-hover:border-brand-primary group-hover:bg-brand-primary group-hover:text-canvas transition-all duration-300">
                  <ArrowUpRight className="size-5" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
