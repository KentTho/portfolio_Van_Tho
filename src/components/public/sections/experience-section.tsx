import { pick, type Locale } from "@/shared/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import type { ExperienceItem, Profile } from "@/modules/public-portfolio/domain/types";
import { SectionHeading } from "@/components/public/section-heading";
import { SampleBadge } from "@/components/public/sample-badge";
import { Reveal } from "@/components/public/reveal";

/**
 * SINGLE LANDING — Experience & Education
 *
 * Consolidated from the former /resume and /about routes. Work history as an
 * editorial timeline; education surfaced from the profile. Live data only —
 * honest empty state when no experience is published.
 */
export function ExperienceSection({
  experience,
  profile,
  locale,
  dict,
}: {
  readonly experience: readonly ExperienceItem[];
  readonly profile: Profile;
  readonly locale: Locale;
  readonly dict: Dictionary;
}) {
  const education = pick(profile.education, locale).trim();

  return (
    <section aria-labelledby="experience-heading" className="mx-auto w-full max-w-6xl px-6 py-24">
      <div className="mb-12 h-px w-full bg-border/50" aria-hidden />
      <SectionHeading id="experience-heading" title={dict.sections.experience} />

      {experience.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/20 px-8 py-12 text-center">
          <p className="text-sm text-fg-subtle">{dict.labels.empty}</p>
        </div>
      ) : (
        <ol className="space-y-8 border-l border-border pl-6">
          {experience.map((item, index) => (
            <Reveal as="li" key={item.id} delay={index * 0.05} className="relative">
              <span
                className="absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full bg-accent"
                aria-hidden
              />
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-medium text-fg">{pick(item.role, locale)}</h3>
                {item.sample ? <SampleBadge label={dict.labels.sample} /> : null}
              </div>
              <p className="text-sm text-fg-subtle">
                {pick(item.org, locale)} · {item.period}
              </p>
              {item.highlights.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-fg-muted">
                  {item.highlights.map((h) => (
                    <li key={pick(h, "en")}>{pick(h, locale)}</li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </ol>
      )}

      {education.length > 0 && (
        <dl className="mt-10 rounded-2xl border border-border bg-surface/30 px-5 py-4">
          <dt className="label-mono text-fg-subtle">{dict.labels.education}</dt>
          <dd className="mt-1 text-fg">{education}</dd>
        </dl>
      )}
    </section>
  );
}
