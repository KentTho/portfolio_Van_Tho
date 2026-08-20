"use client";

import { useEffect, useState } from "react";

/**
 * Cosmic engineering backdrop: a soft accent aurora + a masked grid. Pure CSS (no
 * WebGL, no external asset). ONE IntersectionObserver implements the global motion
 * handoff (Owner 3A): once the Hero (#home) scrolls away, the ambient aurora
 * *recedes* (opacity ↓) so visual focus moves forward — this NEVER touches core
 * content readability, only decorative depth. Deterministic (pastHero starts
 * false on server + first client render → no hydration divergence).
 */
export function CosmicBackground() {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const home = document.getElementById("home");
    if (!home) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setPastHero(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-30% 0px 0px 0px" },
    );
    observer.observe(home);
    return () => observer.disconnect();
  }, []);

  // Ambient recede — decorative only; transitions instantly under reduced motion.
  const auroraOpacity = pastHero ? 0.5 : 1;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none"
        style={{
          opacity: auroraOpacity,
          background:
            "radial-gradient(ellipse 70% 45% at 50% -12%, color-mix(in oklab, var(--accent) 7%, transparent), transparent 68%)",
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none"
        style={{
          opacity: auroraOpacity,
          background:
            "radial-gradient(ellipse 42% 34% at 86% 8%, color-mix(in oklab, var(--accent-3) 5%, transparent), transparent 60%)",
        }}
      />
      {/* Atmospheric grid — barely-there texture, never a subject. */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 58% 48% at 50% 2%, #000 22%, transparent 92%)",
          WebkitMaskImage: "radial-gradient(ellipse 58% 48% at 50% 2%, #000 22%, transparent 92%)",
        }}
      />
    </div>
  );
}
