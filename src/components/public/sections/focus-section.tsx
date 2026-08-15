import { pick, type Locale } from "@/shared/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import type { Profile } from "@/modules/public-portfolio/domain/types";
import { SectionHeading } from "@/components/public/section-heading";
import { Reveal } from "@/components/public/reveal";

/**
 * SINGLE LANDING — Focus (Wave C). Engineering specialization as an editorial
 * capability field: each focus area is a large hairline-divided row with a brand
 * accent marker (a marker, not a false 01/02/03 sequence — the areas are a set,
 * not a process). CSS hover accent keeps it restrained (no card spam). Live data;
 * honest empty state until the Owner authors focus areas.
 */
export function FocusSection({
  profile,
  locale,
  dict,
}: {
  readonly profile: Profile;
  readonly locale: Locale;
  readonly dict: Dictionary;
}) {
  const areas = profile.focusAreas;

  return (
    <section aria-labelledby="focus-heading" className="mx-auto w-full max-w-6xl px-6 py-24">
      <SectionHeading id="focus-heading" title={dict.sections.focus} />

      {areas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/20 px-8 py-12 text-center">
          <p className="text-sm text-fg-subtle">{dict.labels.empty}</p>
        </div>
      ) : (
        <ul className="border-t border-border/70">
          {areas.map((area, index) => (
            <Reveal
              as="li"
              key={pick(area, "en")}
              delay={index * 0.06}
              className="group flex items-center gap-5 border-b border-border/70 py-6 transition-colors hover:bg-surface/30"
            >
              <span
                aria-hidden
                className="h-8 w-1 shrink-0 rounded-full transition-all group-hover:h-10"
                style={{ background: "linear-gradient(180deg, var(--brand-primary), var(--brand-secondary))" }}
              />
              <span className="font-display text-2xl font-medium tracking-tight text-fg transition-colors group-hover:text-accent sm:text-3xl">
                {pick(area, locale)}
              </span>
            </Reveal>
          ))}
        </ul>
      )}
    </section>
  );
}
