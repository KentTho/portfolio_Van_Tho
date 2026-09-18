import { Reveal } from "@/components/public/reveal";
import { Layers, Database, Cpu } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionary";

interface JourneySectionProps {
  readonly dict: Dictionary;
}

/**
 * Ariyana V3 Engineering Journey / Process Section (§26–27).
 * Replaces the old luminous rail and Three.js canvas with an Ariyana Step/Process architecture:
 * - Large numbered phases (Step 01, Step 02, Step 03)
 * - Clear semantic progression: Frontend -> Backend -> Infrastructure & Data
 * - Editorial typography and technology tags
 */
export function JourneySection({ dict }: JourneySectionProps) {
  const steps = [
    {
      step: "01",
      icon: Layers,
      title: dict.journey?.frontend?.title || "FRONTEND & INTERFACE CRAFT",
      description:
        dict.journey?.frontend?.description ||
        "Developing high-fidelity responsive web interfaces with Next.js App Router, React 19, strict TypeScript, and accessible micro-animations.",
      technologies: ["React 19", "Next.js 16", "TypeScript", "Tailwind CSS", "Motion"],
    },
    {
      step: "02",
      icon: Database,
      title: dict.journey?.backend?.title || "BACKEND & SYSTEM INTEGRITY",
      description:
        dict.journey?.backend?.description ||
        "Architecting clean domain repositories, type-safe database schemas with Drizzle ORM and Neon PostgreSQL, and secure API boundaries.",
      technologies: ["Node.js", "Python / FastAPI", "Neon PostgreSQL", "Drizzle ORM", "Supabase"],
    },
    {
      step: "03",
      icon: Cpu,
      title: dict.journey?.infrastructureData?.title || "INFRASTRUCTURE & DEVSECOPS",
      description:
        dict.journey?.infrastructureData?.description ||
        "Hardening deployment pipelines with containerization, automated testing matrices (Vitest & Playwright), and continuous delivery.",
      technologies: ["Docker", "Linux", "Vercel", "Vitest", "Playwright E2E"],
    },
  ];

  return (
    <section
      id="journey"
      aria-labelledby="journey-heading"
      className="relative w-full border-t border-white/10 py-24 lg:py-36 overflow-hidden bg-canvas"
    >
      <div className="mx-auto w-full max-w-[1680px] px-6 md:px-12 lg:px-16">
        {/* Section Caption Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="caption-pill">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            <span>PROCESS // ARCHITECTURE</span>
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-xs text-brand-primary-soft uppercase tracking-widest hidden sm:inline-block">
            02 // METHODOLOGY
          </span>
        </div>

        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <Reveal direction="up" distance={20}>
            <h2
              id="journey-heading"
              className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-tight text-fg leading-tight"
            >
              ENGINEERING PHASES &amp; SYSTEM EVOLUTION
            </h2>
          </Reveal>
          <Reveal direction="up" distance={20} delay={0.1}>
            <p className="mt-4 text-body-l text-fg-muted">
              A comprehensive full-stack execution model ensuring stability, performance, and scalability across every layer.
            </p>
          </Reveal>
        </div>

        {/* 3-Step Ariyana Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.step} direction="up" distance={30} delay={idx * 0.1}>
                <div className="group relative rounded-[2rem] border border-white/15 bg-surface/40 p-8 md:p-10 backdrop-blur-sm transition-all duration-300 hover:border-brand-primary/50 hover:bg-surface/70 hover:shadow-[0_20px_50px_rgba(0,240,255,0.08)] flex flex-col justify-between h-full">
                  <div>
                    {/* Step Count & Icon */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                      <span className="font-display text-4xl text-brand-primary-soft font-normal tracking-tight">
                        {s.step}
                      </span>
                      <div className="size-10 rounded-full border border-white/10 flex items-center justify-center text-brand-primary group-hover:border-brand-primary group-hover:bg-brand-primary/10 transition-colors">
                        <Icon className="size-5" />
                      </div>
                    </div>

                    <h3 className="font-display text-2xl text-fg uppercase tracking-tight mb-4 group-hover:text-brand-primary-soft transition-colors">
                      {s.title}
                    </h3>

                    <p className="text-body-s text-fg-muted leading-relaxed mb-8">
                      {s.description}
                    </p>
                  </div>

                  {/* Technology Tags */}
                  <div className="pt-6 border-t border-white/10">
                    <div className="flex flex-wrap gap-2">
                      {s.technologies.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/10 bg-white/5 text-fg-subtle group-hover:border-white/20 transition-colors"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
