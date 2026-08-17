"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useReducedMotionSafe } from "@/components/public/motion/use-reduced-motion-safe";

/**
 * CursorHalo — desktop signature pointer halo (Prompt 12R, Owner-specified).
 * A brand-tinted ring that follows the pointer with a subtle spring lag and
 * scales/brightens over interactive targets (`a, button, [data-halo]`).
 *
 * Constraints (locked): pointer-events:none (never captures clicks / never hides
 * the native cursor), desktop fine-pointer only, OFF on touch, OFF under
 * prefers-reduced-motion. Uses motion values (no React re-render per frame).
 */
export function CursorHalo() {
  const reduced = useReducedMotionSafe();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const scale = useMotionValue(0.6);
  const opacity = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 });
  const sScale = useSpring(scale, { stiffness: 260, damping: 22 });
  const sOpacity = useSpring(opacity, { stiffness: 180, damping: 26 });

  useEffect(() => {
    // Only on devices with a precise pointer, and never when motion is reduced.
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      opacity.set(1);
      const interactive = (e.target as Element | null)?.closest(
        "a, button, [role='button'], [data-halo], input, textarea, summary",
      );
      scale.set(interactive ? 1.9 : 1);
    };
    const leave = () => opacity.set(0);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [reduced, x, y, scale, opacity]);

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full [@media(pointer:fine)]:block"
      style={{
        x: sx,
        y: sy,
        scale: sScale,
        opacity: sOpacity,
        border: "1.5px solid color-mix(in oklab, var(--brand-primary-soft) 70%, transparent)",
        boxShadow:
          "0 0 18px color-mix(in oklab, var(--brand-primary) 40%, transparent), inset 0 0 8px color-mix(in oklab, var(--brand-secondary) 22%, transparent)",
        backgroundColor: "color-mix(in oklab, var(--brand-primary) 8%, transparent)",
      }}
    />
  );
}
