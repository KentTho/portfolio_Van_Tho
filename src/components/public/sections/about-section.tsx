import { pick, type Locale } from "@/shared/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import type { Profile } from "@/modules/public-portfolio/domain/types";
import { SectionHeading } from "@/components/public/section-heading";
import { Reveal } from "@/components/public/reveal";

/**
 * SINGLE LANDING — About (Wave C). Editorial asymmetry: a large engineering
 * statement (left) beside a mono "fact rail" (right) — not a generic 3-card grid.
 * Education lives in the Experience section, so it is not repeated here. Live data
 * only; when the profile is unauthored the statement falls back to the site's own
 * description (config, not fabricated) and the fact rail simply hides.
 */
export function AboutSection({
  profile,
  locale,
  dict,
}: {
  readonly profile: Profile;
  readonly locale: Locale;
  readonly dict: Dictionary;
}) {
  const statement = pick(profile.summary, locale).trim() || dict.meta.homeDescription;
  const facts = [
    { label: dict.labels.role, value: pick(profile.role, locale) },
    { label: dict.labels.location, value: pick(profile.location, locale) },
    {
      label: dict.labels.languages,
      value: profile.languages.map((lang) => pick(lang, locale)).join(", "),
    },
  ].filter((fact) => fact.value.trim().length > 0);

  return (
    <section aria-labelledby="about-heading" className="mx-auto w-full max-w-6xl px-6 py-24">
      <SectionHeading id="about-heading" title={dict.nav.about} />

      <div className="grid gap-12 lg:grid-cols-[1fr_17rem] lg:gap-16">
        <Reveal className="max-w-2xl font-display text-2xl font-medium leading-[1.4] tracking-tight text-fg sm:text-3xl">
          {statement}
        </Reveal>

        {facts.length > 0 && (
          <Reveal delay={0.1} className="lg:pt-2">
            <dl className="divide-y divide-border/70 border-t border-border/70">
              {facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1 py-4">
                  <dt className="label-mono">{fact.label}</dt>
                  <dd className="text-body text-fg">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </div>
    </section>
  );
}
