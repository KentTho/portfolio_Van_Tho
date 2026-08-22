"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/components/public/motion/use-reduced-motion-safe";

/**
 * VIVID SUBSTRATE — the single global visual authority behind all content
 * (evolved from the earlier cosmic-background; still mounted once in the locale
 * layout). Adapted (not cloned) from the vivid_co reference: a graphite-veil
 * depth field + a brand-recoloured chromatic PRISM artifact (electric blue +
 * cooler-blue fringe + restrained gold — no red/lime/purple/rainbow) + a
 * SECTION-AWARE scene state so the environment visibly changes between chapters
 * (Owner Q01A/Q02A/Q03A/Q04A/Q05A/Q06A/Q07A/Q08A). CSS/SVG only — NO WebGL.
 *
 * Scenes: home=identity spotlight · about=convergence · projects=technical plane ·
 * career=vertical trace · skills=capability field · contact=focus collapse ·
 * footer=system rest. Decorative only (aria-hidden, pointer-events:none) — never
 * under body text with aberration; core content readability is untouched.
 * One IntersectionObserver drives the scene (no per-layer observers). One slow
 * shimmer (~7s). Pointer-reactive light on pointer:fine only. Reduced motion →
 * static premium field (no shimmer / no pointer light / no large motion), and
 * mobile simplifies via CSS. Deterministic first render (scene "home") → no
 * hydration divergence.
 */

type Scene = "home" | "about" | "projects" | "career" | "skills" | "contact" | "footer";

/** Per-scene composition of the shared optical language (prism moves/recolours;
 *  scene motifs fade in). Same prism, different visual role per §11. */
const SCENE: Record<Scene, { prism: string; veil: string }> = {
  home: { prism: "left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 scale-100 rotate-0", veil: "50% 32%" },
  about: { prism: "left-[30%] top-[46%] -translate-x-1/2 -translate-y-1/2 scale-90 -rotate-6", veil: "50% 42%" },
  projects: { prism: "left-[78%] top-[40%] -translate-x-1/2 -translate-y-1/2 scale-75 rotate-6", veil: "62% 40%" },
  career: { prism: "left-[16%] top-[50%] -translate-x-1/2 -translate-y-1/2 scale-[0.7] rotate-3", veil: "24% 50%" },
  skills: { prism: "left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 scale-95 -rotate-3", veil: "50% 44%" },
  contact: { prism: "left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 scale-[0.62] rotate-0", veil: "50% 60%" },
  footer: { prism: "left-1/2 top-[64%] -translate-x-1/2 -translate-y-1/2 scale-[0.4] rotate-0", veil: "50% 78%" },
};

export function CosmicBackground() {
  const reduced = useReducedMotionSafe();
  const [sectionScene, setSectionScene] = useState<Scene>("home");
  const [footerRest, setFooterRest] = useState(false);
  const [simplify, setSimplify] = useState(false); // mobile / coarse pointer
  const rootRef = useRef<HTMLDivElement>(null);
  // The footer is the page's last element and never reaches the centre band, so a
  // dedicated observer resolves the closure "rest" scene when it comes into view.
  const scene: Scene = footerRest ? "footer" : sectionScene;

  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      setSimplify(window.matchMedia("(max-width: 767px), (pointer: coarse)").matches),
    );
    return () => cancelAnimationFrame(raf);
  }, []);
  const still = reduced || simplify;

  // ── Scene-state authority: one centre-band observer for the six anchors. ────
  useEffect(() => {
    const ids = ["home", "about", "projects", "career", "skills", "contact"] as const;
    const targets = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        let best: Scene = "home";
        let max = -1;
        for (const id of ids) {
          const r = ratios.get(id) ?? 0;
          if (r > max) {
            max = r;
            best = id;
          }
        }
        setSectionScene(best);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  // ── Footer "rest" — small dedicated observer (the closure state). ──────────
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      (entries) => setFooterRest((entries[0]?.intersectionRatio ?? 0) > 0.45),
      { threshold: [0, 0.45, 0.8] },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // ── Pointer-reactive substrate light (pointer:fine + motion allowed only). ──
  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const root = rootRef.current;
    if (!root) return;
    let raf = 0;
    let px = 50;
    let py = 42;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = (e.clientX / window.innerWidth) * 100;
      py = (e.clientY / window.innerHeight) * 100;
      if (!raf)
        raf = requestAnimationFrame(() => {
          root.style.setProperty("--vx", `${px}%`);
          root.style.setProperty("--vy", `${py}%`);
          raf = 0;
        });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const cfg = SCENE[scene];

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-scene={scene}
      className="vivid-substrate pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ ["--vx" as string]: "50%", ["--vy" as string]: "42%" }}
    >
      {/* Graphite veil — blue-tinted slate depth (never flat black). Moves toward
          the active scene's focus so the *environment* shifts between chapters. */}
      <div
        className="absolute inset-0 transition-[background] duration-[1200ms] [transition-timing-function:var(--ease-scene-focus)]"
        style={{
          background: `radial-gradient(120% 90% at ${cfg.veil}, color-mix(in oklab, var(--surface-raised) 55%, transparent), transparent 70%), radial-gradient(90% 70% at 50% 120%, var(--canvas) 40%, transparent)`,
        }}
      />

      {/* Pointer light — follows the cursor on fine pointers (CSS var driven). */}
      {!reduced && (
        <div
          className="vivid-pointer absolute inset-0 hidden [@media(pointer:fine)]:block"
          style={{
            background:
              "radial-gradient(28rem 28rem at var(--vx) var(--vy), color-mix(in oklab, var(--brand-primary) 9%, transparent), transparent 60%)",
          }}
        />
      )}

      {/* Scene motifs — one is emphasised per scene (opacity crossfade). */}
      {/* Projects: technical perspective plane */}
      <div
        className="vivid-grid absolute inset-x-0 bottom-0 top-1/3 transition-opacity duration-[1000ms] [transition-timing-function:var(--ease-scene-focus)]"
        style={{
          opacity: scene === "projects" ? 0.5 : 0,
          backgroundImage:
            "linear-gradient(color-mix(in oklab, var(--brand-primary-soft) 22%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--brand-primary-soft) 22%, transparent) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(70% 60% at 62% 30%, #000 10%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(70% 60% at 62% 30%, #000 10%, transparent 80%)",
          transform: "perspective(700px) rotateX(58deg)",
          transformOrigin: "center top",
        }}
      />
      {/* Career: vertical refractive channel */}
      <div
        className="absolute inset-y-0 left-[14%] w-40 transition-opacity duration-[1000ms] [transition-timing-function:var(--ease-scene-focus)]"
        style={{
          opacity: scene === "career" ? 0.45 : 0,
          background:
            "linear-gradient(180deg, transparent, color-mix(in oklab, var(--brand-primary) 16%, transparent) 30%, color-mix(in oklab, var(--brand-secondary) 8%, transparent) 60%, transparent)",
          filter: "blur(14px)",
        }}
      />
      {/* Skills: distributed capability nodes */}
      <div
        className="absolute inset-0 transition-opacity duration-[1000ms] [transition-timing-function:var(--ease-scene-focus)]"
        style={{
          opacity: scene === "skills" ? 0.5 : 0,
          background:
            "radial-gradient(10rem 10rem at 20% 35%, color-mix(in oklab, var(--brand-primary) 10%, transparent), transparent 60%), radial-gradient(9rem 9rem at 75% 30%, color-mix(in oklab, var(--brand-primary-soft) 9%, transparent), transparent 60%), radial-gradient(8rem 8rem at 55% 70%, color-mix(in oklab, var(--brand-secondary) 6%, transparent), transparent 60%), radial-gradient(7rem 7rem at 85% 65%, color-mix(in oklab, var(--brand-primary) 8%, transparent), transparent 60%)",
        }}
      />
      {/* Contact: focus collapse toward the CTA region */}
      <div
        className="absolute inset-0 transition-opacity duration-[1000ms] [transition-timing-function:var(--ease-scene-focus)]"
        style={{
          opacity: scene === "contact" ? 0.6 : 0,
          background:
            "radial-gradient(45% 45% at 50% 52%, color-mix(in oklab, var(--brand-primary) 12%, transparent), transparent 62%)",
          boxShadow: "inset 0 0 40vw 10vw color-mix(in oklab, var(--canvas) 55%, transparent)",
        }}
      />

      {/* Brand PRISM artifact — the signature chromatic optical anchor. Same
          language, repositioned/rescaled per scene. Fades out at footer. */}
      <div
        className={`absolute h-[34rem] w-[34rem] transition-[transform,opacity] duration-[1200ms] [transition-timing-function:var(--ease-scene-focus)] ${cfg.prism}`}
        style={{ opacity: scene === "footer" ? 0.12 : 0.85 }}
      >
        <BrandPrism still={still} />
      </div>

      {/* Atmospheric grid — barely-there texture (retained), quiets at footer. */}
      <div
        className="absolute inset-0 transition-opacity duration-[900ms]"
        style={{
          opacity: scene === "footer" ? 0.02 : 0.05,
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(60% 50% at 50% 6%, #000 20%, transparent 92%)",
          WebkitMaskImage: "radial-gradient(60% 50% at 50% 6%, #000 20%, transparent 92%)",
        }}
      />
    </div>
  );
}

/** Brand-recoloured chromatic prism (CSS). Rebuilt as a sharp optical field
 *  (refractive fragments + linear gradient masks) rather than a blurry blob.
 *  Uses restrained gold and cool blue. One slow shimmer nudges the fragments;
 *  off under reduced motion + on mobile (CSS). */
function BrandPrism({ still }: { readonly still: boolean }) {
  const float1 = still ? undefined : { y: [-8, 8, -8], rotate: [-2, 2, -2] };
  const float2 = still ? undefined : { y: [6, -6, 6], rotate: [1, -1, 1] };
  const pulse = still ? undefined : { opacity: [0.4, 0.8, 0.4] };

  return (
    <div className="vivid-prism relative h-full w-full opacity-75 mix-blend-screen">
      {/* Primary Optical Shard — crisp glass plane */}
      <motion.div
        className="absolute left-[20%] top-[20%] h-[60%] w-[60%] -rotate-12 rounded-[2rem] border border-brand-primary/20 backdrop-blur-lg"
        style={{
          background: "linear-gradient(135deg, color-mix(in oklab, var(--brand-primary) 12%, transparent), transparent 60%)",
          boxShadow: "inset 1px 1px 0 color-mix(in oklab, var(--brand-primary-soft) 30%, transparent)",
          maskImage: "linear-gradient(135deg, #000 20%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(135deg, #000 20%, transparent 80%)",
        }}
        animate={float1}
        transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
      />

      {/* Secondary Refractive Fragment — restrained gold accent */}
      <motion.div
        className="absolute left-[35%] top-[35%] h-[45%] w-[45%] rotate-6 rounded-[1.5rem] border border-brand-secondary/15 backdrop-blur-md"
        style={{
          background: "linear-gradient(225deg, color-mix(in oklab, var(--brand-secondary) 8%, transparent), transparent 70%)",
          maskImage: "linear-gradient(225deg, #000 30%, transparent 90%)",
          WebkitMaskImage: "linear-gradient(225deg, #000 30%, transparent 90%)",
        }}
        animate={float2}
        transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, delay: 0.5 }}
      />

      {/* Chromatic Edge / Light Streak — intersecting the fragments */}
      <motion.div
        className="absolute left-[45%] top-[15%] h-[70%] w-px rotate-[35deg]"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--brand-primary-soft) 40%, var(--brand-secondary) 60%, transparent)",
        }}
        animate={pulse}
        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
      />
    </div>
  );
}
