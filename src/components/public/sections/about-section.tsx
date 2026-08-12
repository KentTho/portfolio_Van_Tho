import { pick, type Locale } from "@/shared/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import type { Profile } from "@/modules/public-portfolio/domain/types";
import { SectionHeading } from "@/components/public/section-heading";
import { Reveal } from "@/components/public/reveal";

/**
 * SINGLE LANDING — About
 *
 * Consolidated from the former /about route: bio summary + identity facts.
 * Education is intentionally surfaced in the Experience section (Experience &
 * Education), so it is not repeated here. Live data only; no fabricated facts.
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

      <Reveal className="max-w-3xl text-lg leading-8 text-fg-muted">
        {pick(profile.summary, locale)}
      </Reveal>

      {facts.length > 0 && (
        <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="bg-surface px-5 py-4">
              <dt className="label-mono text-fg-subtle">{fact.label}</dt>
              <dd className="mt-1 text-fg">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
