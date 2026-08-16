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

export const DURATION = { fast: 0.16, base: 0.38, slow: 0.7, reveal: 0.65 } as const;

/** Premium pointer spring — smooth, low-latency (cursor halo, magnetic, tilt). */
export const POINTER_SPRING: Transition = { type: "spring", stiffness: 320, damping: 30, mass: 0.6 };
export const SOFT_SPRING: Transition = { type: "spring", stiffness: 120, damping: 20 };

/** Reveal (1× on enter, NEVER reset — audit fix vs the reference site). */
export const revealItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.reveal, ease: EASE_OUT } },
};
export const staggerContainer = (stagger = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});
