/**
 * Shared motion grammar (Prompt 12R). ONE source of truth for easing/duration/
 * spring so no component invents its own timing. Mirrors --motion-* / --ease-* in
 * tokens.css. Import these instead of hardcoding cubic-beziers.
 */
import type { Transition, Variants } from "motion/react";

/** Brand ease-out (matches --ease-out). */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
/** Slight overshoot for playful accents (matches --ease-spring). */
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const;

/**
 * Visible-premium motion envelope (V2 storyboard). Durations/distances tuned so a
 * NORMAL viewer perceives the entrance at normal scroll speed (not DevTools-only):
 * major sections move ~28–34px over ~0.7s; Hero emphasis a touch longer. Reduced
 * motion renders the final state immediately (see `useReducedMotionSafe`).
 */
export const DURATION = {
  fast: 0.16,
  interaction: 0.32,
  base: 0.38,
  section: 0.72,
  emphasis: 0.85,
  slow: 0.7,
  reveal: 0.66,
} as const;

/** Section entrance displacement (px) — large enough to read as a deliberate slide. */
export const DISTANCE = { subtle: 18, section: 30, emphasis: 34 } as const;

/** Strategic stagger only (never per-item on long lists). */
export const STAGGER = { tight: 0.06, normal: 0.09, group: 0.12 } as const;

/** Premium pointer spring — smooth, low-latency (cursor halo, magnetic, tilt). */
export const POINTER_SPRING: Transition = { type: "spring", stiffness: 320, damping: 30, mass: 0.6 };
export const SOFT_SPRING: Transition = { type: "spring", stiffness: 120, damping: 20 };

/** Reveal (1× on enter, NEVER reset — audit fix vs the reference site). */
export const revealItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.section, ease: EASE_OUT } },
};
export const staggerContainer = (stagger = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});
