import { pick, type Locale } from "@/shared/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import type { Profile } from "@/modules/public-portfolio/domain/types";
import { Reveal } from "@/components/public/reveal";

/**
 * SINGLE LANDING — About (V2). Continuation of the hero's cinematic grammar:
 * the same dark canvas + restrained blue backlight, Syne headline / Inter lead /
 * mono facts. Editorial asymmetry — a narrative statement (left) beside a backlit
 * "identity panel" fact rail (right), vertically centred with generous negative
 * space. Not a card grid, not a lonely text block. Live data only; when the Owner
 * has not authored a summary it falls back to the site's own description (config,
 * never fabricated) and empty facts simply drop out.
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
    { label: dict.labels.education, value: pick(profile.education, locale) },
  ].filter((fact) => fact.value.trim().length > 0);

  return (
    <section aria-labelledby="about-heading" className="mx-auto w-full max-w-6xl overflow-x-clip px-6 py-28 lg:py-36">
      <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        {/* ── Statement ─────────────────────────────────────────────────── */}
        <Reveal direction="left" distance={34} className="max-w-xl">
          <p className="label-mono text-brand-primary-soft">{dict.about.eyebrow}</p>
          <h2
            id="about-heading"
            className="mt-4 font-display text-h2 font-semibold leading-[1.05] tracking-tight text-fg"
          >
            {dict.about.headline}
          </h2>
          <p className="mt-6 max-w-[46ch] text-body-l leading-relaxed text-fg-muted">{statement}</p>
        </Reveal>

        {/* ── Identity panel (visual block) — backlit fact rail ─────────── */}
        {facts.length > 0 && (
          <Reveal direction="right" distance={34} delay={0.08} className="relative">
            {/* Restrained blue backlight tying the panel to the hero. */}
            <div
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-[2rem] blur-3xl"
              style={{
                background:
                  "radial-gradient(60% 55% at 70% 20%, color-mix(in oklab, var(--brand-primary) 16%, transparent), transparent 72%)",
              }}
            />
            <div className="relative overflow-hidden rounded-3xl border border-border-strong/70 bg-surface/40 p-8 backdrop-blur-sm sm:p-10" style={{ boxShadow: "inset 0 1px 0 color-mix(in oklab, var(--brand-primary-soft) 12%, transparent)" }}>
              {/* Orbital echo of the logo — quiet continuity with the hero. */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full border border-brand-primary/12"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border border-brand-secondary/10"
              />

              <dl className="relative divide-y divide-border/60">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex flex-col gap-1.5 py-5 first:pt-0 last:pb-0">
                    <dt className="label-mono text-fg-subtle">{fact.label}</dt>
                    <dd className="font-display text-lg font-medium text-fg">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
