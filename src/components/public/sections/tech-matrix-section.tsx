import { pick, type Locale } from "@/shared/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import type { TechGroup } from "@/modules/public-portfolio/domain/types";
import { SectionHeading } from "@/components/public/section-heading";
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
      className="mx-auto w-full max-w-6xl px-6 py-24"
    >
      {/* Hairline divider above section */}
      <div className="mb-12 h-px w-full bg-border/50" aria-hidden />

      <SectionHeading
        id="tech-heading"
        title={dict.sections.techMatrix}
        subtitle={dict.home.techSubtitle}
        index="02"
      />

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
              delay={index * 0.04}
              className="rounded-2xl border border-border bg-surface/30 p-6 transition-colors hover:bg-surface-hover"
            >
              {/* Group label */}
              <p className="label-mono mb-1">{pick(group.title, locale)}</p>
              {/* Caption */}
              {group.caption && (
                <p className="mb-5 text-xs leading-relaxed text-fg-subtle">
                  {pick(group.caption, locale)}
                </p>
              )}
              {/* Logos */}
              <ul className="flex flex-wrap gap-3" aria-label={pick(group.title, locale)}>
                {group.techIds.map((id) => (
                  <li key={id}>
                    <TechnologyLogo id={id} size={44} showLabel />
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
