import { Reveal } from "@/components/public/reveal";
import { Award, ExternalLink } from "lucide-react";

export interface AchievementItem {
  readonly id: string;
  readonly title: string;
  readonly issuer: string;
  readonly date: string;
  readonly url?: string;
  readonly isVisible: boolean;
}

interface AchievementsSectionProps {
  readonly achievements?: readonly AchievementItem[];
}

/**
 * Ariyana V3 Achievements / Certifications Section (§36).
 * Strictly conditional: Hides completely if no verified public rows exist.
 * Zero fabricated credentials.
 */
export function AchievementsSection({ achievements = [] }: AchievementsSectionProps) {
  const visibleItems = achievements.filter((a) => a.isVisible);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section
      id="achievements"
      aria-labelledby="achievements-heading"
      className="relative w-full border-t border-white/10 py-24 lg:py-36 overflow-hidden bg-canvas"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="caption-pill">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            <span>HONORS // CERTIFICATIONS</span>
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-xs text-brand-primary-soft uppercase tracking-widest hidden sm:inline-block">
            05 // PROOF
          </span>
        </div>

        <h2
          id="achievements-heading"
          className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-tight text-fg leading-tight mb-16"
        >
          HONORS &amp; PROFESSIONAL CERTIFICATIONS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visibleItems.map((item, idx) => (
            <Reveal key={item.id} direction="up" distance={20} delay={idx * 0.08}>
              <div className="flex items-start justify-between gap-6 rounded-[2rem] border border-white/15 bg-surface/40 p-8 backdrop-blur-sm transition-all hover:border-brand-primary/40">
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full border border-white/15 flex items-center justify-center text-brand-primary shrink-0 bg-white/5">
                    <Award className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-fg uppercase tracking-tight mb-1">
                      {item.title}
                    </h3>
                    <p className="font-mono text-xs text-brand-primary-soft uppercase tracking-wider">
                      {item.issuer} · {item.date}
                    </p>
                  </div>
                </div>

                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-9 rounded-full border border-white/15 flex items-center justify-center text-fg hover:border-brand-primary hover:text-brand-primary-soft transition-colors"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
