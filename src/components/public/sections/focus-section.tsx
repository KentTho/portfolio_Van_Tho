import { pick, type Locale } from "@/shared/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import type { Profile } from "@/modules/public-portfolio/domain/types";
import { SectionHeading } from "@/components/public/section-heading";
import { Reveal } from "@/components/public/reveal";

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
    <section aria-labelledby="focus-heading" className="mx-auto w-full max-w-6xl px-6 py-16">
      <SectionHeading id="focus-heading" eyebrow="01" title={dict.sections.focus} />
      <Reveal className="max-w-3xl text-lg leading-8 text-fg-muted">
        {pick(profile.summary, locale)}
      </Reveal>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {profile.focusAreas.map((area, index) => (
          <Reveal
            as="li"
            key={pick(area, "en")}
            delay={index * 0.05}
            className="rounded-xl border border-border bg-surface/40 px-4 py-3 text-fg"
          >
            {pick(area, locale)}
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
