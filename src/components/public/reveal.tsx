"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { useReducedMotionSafe } from "@/components/public/motion/use-reduced-motion-safe";
import { DISTANCE, DURATION, EASE_OUT } from "@/components/public/motion/motion-tokens";
import { useReplayableReveal } from "@/components/public/motion/use-replayable-reveal";

type Direction = "up" | "left" | "right" | "none";

interface RevealProps {
  readonly children: ReactNode;
  readonly delay?: number;
  readonly className?: string;
  /** Render as a list item when used inside a <ul>/<ol>. */
  readonly as?: "div" | "li";
  /** Entrance vector. `left`/`right` = horizontal converge (About). Default `up`. */
  readonly direction?: Direction;
  /** Displacement in px (defaults to the visible-premium section distance). */
  readonly distance?: number;
  readonly duration?: number;
  /** Fraction of the element visible before it enters (perception-calibrated). */
  readonly amount?: number;
  /** Optional entrance blur (px) — headings/major visuals only; keeps text crisp. */
  readonly blur?: number;
}

/**
 * Scroll-reveal primitive (V2 Replayable). Content is in the DOM from first
 * render; it enters when crossing the enter margin and resets/arms when leaving
 * the exit margin (hysteresis). Motion is transform + opacity (+ optional blur).
 * Honors prefers-reduced-motion (renders the final state immediately, hydration-safe).
 * Direction gives sections their own character (up / horizontal converge).
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  direction = "up",
  distance = DISTANCE.section,
  duration = DURATION.section,
  amount = 0.22,
  blur,
}: RevealProps) {
  const reduced = useReducedMotionSafe();
  const Tag = as === "li" ? motion.li : motion.div;

  // Custom hysteresis hooks for enter/exit (replaces whileInView with once: true)
  // approx heuristic based on amount
  const marginOffset = Math.max(0, Math.min(40, (1 - amount) * 100));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { ref, hasEntered } = useReplayableReveal<any>(
    `-${marginOffset}% 0px -${marginOffset}% 0px`, // Enter threshold
    "20% 0px 20% 0px" // Exit arm threshold
  );

  if (reduced) {
    const Plain = as === "li" ? "li" : "div";
    return <Plain className={className}>{children}</Plain>;
  }

  const offset =
    direction === "up"
      ? { y: distance }
      : direction === "left"
        ? { x: -distance }
        : direction === "right"
          ? { x: distance }
          : {};

  const variants: Variants = {
    hidden: { opacity: 0, ...offset, ...(blur ? { filter: `blur(${blur}px)` } : {}) },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      ...(blur ? { filter: "blur(0px)" } : {}),
      transition: { duration, ease: EASE_OUT, delay },
    },
  };

  return (
    <Tag
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={hasEntered ? "visible" : "hidden"}
    >
      {children}
    </Tag>
  );
}
