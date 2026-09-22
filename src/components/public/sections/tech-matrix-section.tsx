import { pick, type Locale } from "@/shared/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import type { TechGroup } from "@/modules/public-portfolio/domain/types";
import { Reveal } from "@/components/public/reveal";
import { TechnologyLogo } from "@/components/technology/technology-logo";

/**
 * COSMIC ENGINEERING EDITORIAL — Tech Matrix
 *
 * Richer group cards: group title as mono label, larger logos (44px),
 * caption as descriptor. Asymmetric grid (2 cols + 1 wide on desktop).
 */
export function TechMatrixSection({
  groups,
  locale,
  dict,
}: {
  readonly groups: readonly TechGroup[];
  readonly locale: Locale;
  readonly dict: Dictionary;
}) {
  return (
    <section
      aria-labelledby="tech-heading"
      className="relative w-full border-t border-white/10 py-24 lg:py-36 overflow-hidden bg-canvas"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-16">
        {/* Caption Header */}
        <div className="flex items-center gap-3 mb-10">
          <span className="caption-pill">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            <span>ARCHITECTURE // MATRIX</span>
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-xs text-brand-primary-soft uppercase tracking-widest hidden sm:inline-block">
            05 // CLUSTERS
          </span>
        </div>

        <Reveal>
          <div className="max-w-3xl mb-14">
            <h2
              id="tech-heading"
              className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-tight text-fg leading-tight"
            >
              {dict.sections?.techMatrix || "TECHNOLOGY ARCHITECTURE MATRIX"}
            </h2>
            <p className="mt-4 text-body-l text-fg-muted">
              {dict.home?.techSubtitle || "Structured domain clusters powering full-stack scalability."}
            </p>
          </div>
        </Reveal>

      {groups.length === 0 ? (
        <div className="rounded-2xl border border-border border-dashed bg-surface/20 px-8 py-12 text-center">
          <p className="text-sm text-fg-subtle">
            Technology groups will appear here once published.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, index) => (
            <Reveal
              key={group.id}
              delay={index * 0.09}
            >
              <div className="h-full group">
                <div className="h-full rounded-2xl border border-border bg-surface/30 p-6 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_12px_24px_-12px_rgba(0,0,0,0.4)] group-hover:bg-surface/50 group-hover:border-border-strong motion-reduce:group-hover:translate-y-0">
                  {/* Group label */}
                  <p className="label-mono mb-1">{pick(group.title, locale)}</p>
                  {/* Caption */}
                  {group.caption && (
                    <p className="mb-5 text-xs leading-relaxed text-fg-subtle transition-colors group-hover:text-fg-muted">
                      {pick(group.caption, locale)}
                    </p>
                  )}
                  {/* Logos */}
                  <ul className="flex flex-wrap gap-3" aria-label={pick(group.title, locale)}>
                    {group.techIds.map((id) => (
                      <li key={id} className="transition-transform duration-300 group-hover:-translate-y-0.5">
                        <TechnologyLogo id={id} size={44} showLabel />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
      </div>
    </section>
  );
}
