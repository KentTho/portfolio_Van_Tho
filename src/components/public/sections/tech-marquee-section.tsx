"use client";

import Image from "next/image";
import { useReducedMotionSafe } from "@/components/public/motion/use-reduced-motion-safe";

interface TechMarqueeProps {
  readonly title?: string;
  readonly subtitle?: string;
}

const VERIFIED_TECH_ITEMS = [
  { id: "react", name: "React 19", src: "/technology-logos/react.png" },
  { id: "nextjs", name: "Next.js 16", src: "/technology-logos/nextjs.png" },
  { id: "typescript", name: "TypeScript 5", src: "/technology-logos/typescript.png" },
  { id: "python", name: "Python", src: "/technology-logos/python.png" },
  { id: "fastapi", name: "FastAPI", src: "/technology-logos/fastapi.png" },
  { id: "postgresql", name: "PostgreSQL", src: "/technology-logos/postgresql.png" },
  { id: "supabase", name: "Supabase", src: "/technology-logos/supabase.png" },
  { id: "tailwind", name: "Tailwind v4", src: "/technology-logos/tailwind.png" },
  { id: "nodejs", name: "Node.js", src: "/technology-logos/nodejs.png" },
  { id: "docker", name: "Docker", src: "/technology-logos/docker.png" },
  { id: "vercel", name: "Vercel", src: "/technology-logos/vercel.png" },
  { id: "git", name: "Git", src: "/technology-logos/git.png" },
];

/**
 * Ariyana V3 Tech & Tools Marquee (§31).
 * Smooth, continuous kinetic ticker featuring only verified technology logos.
 * Reduced-motion safe: gracefully degrades to static grid without scroll lag.
 */
export function TechMarqueeSection({
  title = "TECHNOLOGY STACK & TOOLS",
  subtitle = "CORE ENGINEERING FOUNDATION",
}: TechMarqueeProps) {
  const reduced = useReducedMotionSafe();

  return (
    <section aria-label="Công nghệ và công cụ" className="relative w-full border-t border-white/10 py-16 lg:py-24 overflow-hidden bg-canvas/60">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-16 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="caption-pill mb-3 inline-flex">
              <span className="size-1.5 rounded-full bg-brand-primary" />
              <span>STACK // REPERTOIRE</span>
            </span>
            <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-fg">
              {title}
            </h2>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-brand-primary-soft">
            {subtitle}
          </span>
        </div>
      </div>

      {reduced ? (
        /* Reduced motion: clean static wrap */
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {VERIFIED_TECH_ITEMS.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-full border border-white/15 bg-surface/50 px-5 py-2.5 backdrop-blur-sm"
              >
                <div className="relative size-6 shrink-0">
                  <Image src={item.src} alt={item.name} fill className="object-contain" />
                </div>
                <span className="font-mono text-xs text-fg tracking-wide">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Smooth continuous marquee animation */
        <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex shrink-0 animate-marquee items-center gap-6 py-2">
            {VERIFIED_TECH_ITEMS.concat(VERIFIED_TECH_ITEMS).map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="group flex items-center gap-3.5 rounded-full border border-white/10 bg-surface/40 px-6 py-3 backdrop-blur-sm transition-all duration-300 hover:border-brand-primary hover:bg-surface/80 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)]"
              >
                <div className="relative size-6 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Image src={item.src} alt={item.name} fill className="object-contain" />
                </div>
                <span className="font-mono text-xs text-fg-muted group-hover:text-fg transition-colors tracking-wide uppercase">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
