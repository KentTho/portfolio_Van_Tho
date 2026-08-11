import { pick, type Locale } from "@/shared/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import type { Profile } from "@/modules/public-portfolio/domain/types";
import { SectionHeading } from "@/components/public/section-heading";
import { Reveal } from "@/components/public/reveal";

/**
 * COSMIC ENGINEERING EDITORIAL — Focus Section
 *
 * Editorial prose treatment: large text block + focus area pills.
 * No card grid for summary — text IS the design.
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
  return (
    <section aria-labelledby="focus-heading" className="mx-auto w-full max-w-6xl px-6 py-24">
      <SectionHeading
        id="focus-heading"
        title={dict.sections.focus}
        index="01"
      />
      <Reveal className="max-w-3xl text-xl leading-[1.65] text-fg-muted sm:text-2xl">
        {pick(profile.summary, locale)}
      </Reveal>
      {profile.focusAreas.length > 0 && (
        <ul className="mt-10 flex flex-wrap gap-2.5">
          {profile.focusAreas.map((area, index) => (
            <Reveal
              as="li"
              key={pick(area, "en")}
              delay={index * 0.04}
              className="rounded-full border border-border bg-surface/50 px-4 py-2 text-sm text-fg transition-colors hover:border-accent/30 hover:bg-surface-hover"
            >
              {pick(area, locale)}
            </Reveal>
          ))}
        </ul>
      )}
    </section>
  );
}
