"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { useReducedMotionSafe } from "@/components/public/motion/use-reduced-motion-safe";
import { DISTANCE, DURATION, EASE_OUT } from "@/components/public/motion/motion-tokens";

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
 * Scroll-reveal primitive (V2 visible-premium). Content is in the DOM from first
 * render; it enters ONCE when actually visible (`amount` viewport threshold, not a
 * near-zero trigger), then persists — no replay, no fade-to-zero on exit. Motion is
 * transform + opacity (+ optional blur). Honors prefers-reduced-motion (renders the
 * final state immediately, hydration-safe). Direction gives sections their own
 * character (up / horizontal converge) instead of one fade-up repeated everywhere.
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
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </Tag>
  );
}
