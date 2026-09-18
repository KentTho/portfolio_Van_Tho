import { Reveal } from "@/components/public/reveal";
import { ArrowUpRight } from "lucide-react";

export interface CapabilityItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly technologies: readonly string[];
  readonly isVisible: boolean;
}

interface CapabilitiesSectionProps {
  readonly capabilities?: readonly CapabilityItem[];
  readonly title?: string;
  readonly subtitle?: string;
}

/**
 * Ariyana V3 Capabilities / Services Section (§30).
 * Implements Ariyana Services visual grammar with strict data contract.
 * Owner-locked rule: If no verified public rows exist, section returns null (HIDDEN).
 */
export function CapabilitiesSection({
  capabilities = [],
  title = "CAPABILITIES & SPECIALIZATIONS",
  subtitle = "SYSTEM SERVICES",
}: CapabilitiesSectionProps) {
  const visibleItems = capabilities.filter((c) => c.isVisible);

  // Strict Zero-Fake-Data Gate: Hide section completely if no real data rows exist
  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="relative w-full border-t border-white/10 py-24 lg:py-36 overflow-hidden bg-canvas"
    >
      <div className="mx-auto w-full max-w-[1680px] px-6 md:px-12 lg:px-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="caption-pill">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            <span>SERVICES // CAPABILITIES</span>
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-xs text-brand-primary-soft uppercase tracking-widest hidden sm:inline-block">
            04 // SERVICES
          </span>
        </div>

        <div className="max-w-3xl mb-16">
          <Reveal direction="up" distance={20}>
            <h2
              id="capabilities-heading"
              className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-tight text-fg leading-tight"
            >
              {title}
            </h2>
          </Reveal>
          <Reveal direction="up" distance={20} delay={0.1}>
            <p className="mt-4 text-body-l text-fg-muted">{subtitle}</p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleItems.map((item, idx) => (
            <Reveal key={item.id} direction="up" distance={30} delay={idx * 0.08}>
              <div className="group rounded-[2rem] border border-white/15 bg-surface/40 p-8 backdrop-blur-sm transition-all duration-300 hover:border-brand-primary/50 hover:bg-surface/70 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                    <span className="font-mono text-xs text-brand-primary-soft uppercase tracking-wider">
                      CAPABILITY 0{idx + 1}
                    </span>
                    <ArrowUpRight className="size-4 text-fg-subtle group-hover:text-brand-primary-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <h3 className="font-display text-2xl text-fg uppercase tracking-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-body-s text-fg-muted leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
                  {item.technologies.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded border border-white/10 text-fg-subtle"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
