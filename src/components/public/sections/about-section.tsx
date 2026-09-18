import { pick, type Locale } from "@/shared/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import type { Profile } from "@/modules/public-portfolio/domain/types";
import { Reveal } from "@/components/public/reveal";
import { ArrowUpRight } from "lucide-react";

/**
 * Ariyana V3 About Section (§25).
 * Replaces old card grid with Ariyana editorial grammar:
 * - Caption-pill with glowing indicator
 * - Large typographic headline
 * - Editorial prose narrative
 * - Clean facts rail with real verified data only (no fake metrics).
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
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative w-full border-t border-white/10 py-24 lg:py-36 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1680px] px-6 md:px-12 lg:px-16">
        {/* Caption Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="caption-pill">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            <span>INSIDE // ABOUT</span>
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-xs text-brand-primary-soft uppercase tracking-widest hidden sm:inline-block">
            01 // PROFILE
          </span>
        </div>

        {/* 2-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Headline & Narrative (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <Reveal direction="left" distance={24}>
              <h2
                id="about-heading"
                className="text-3xl sm:text-5xl md:text-6xl font-display uppercase tracking-tight text-fg leading-tight"
              >
                {dict.about.headline || "DRIVEN BY ENGINEERING RIGOR & PRODUCT CRAFT"}
              </h2>
            </Reveal>

            <Reveal direction="up" distance={20} delay={0.1}>
              <p className="text-body-l text-fg-muted leading-relaxed max-w-[62ch]">
                {statement}
              </p>
            </Reveal>
          </div>

          {/* Right Verified Facts Panel (5 Cols) */}
          {facts.length > 0 && (
            <div className="lg:col-span-5">
              <Reveal direction="right" distance={24} delay={0.15}>
                <div className="rounded-[2rem] border border-white/15 bg-surface/50 p-8 sm:p-10 backdrop-blur-md shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                    <span className="font-mono text-xs uppercase tracking-widest text-brand-primary-soft">
                      CORE SPECIFICATIONS
                    </span>
                    <ArrowUpRight className="size-4 text-fg-subtle" />
                  </div>

                  <dl className="space-y-6">
                    {facts.map((fact) => (
                      <div key={fact.label} className="border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
                        <dt className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-1">
                          {fact.label}
                        </dt>
                        <dd className="font-display text-xl text-fg tracking-tight">
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
