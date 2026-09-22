/**
 * Centralized motion tokens for V3 Ariyana Visual Rebase (§49).
 * Governs all motion/react animations, staggers, and easing curves across the app.
 */

export const MOTION_EASING = {
  // Smooth deceleration for entrances and reveals
  out: [0.22, 1, 0.36, 1] as const,
  // Snappy spring for interactive hover states and magnetic triggers
  spring: [0.34, 1.56, 0.64, 1] as const,
  // Ariyana cinematic curve for oversized type and full-canvas reveals
  cinematic: [0.16, 1, 0.3, 1] as const,
  // Optical focus curve for substrate transitions
  sceneFocus: [0.52, 0.01, 0, 1] as const,
};

export const MOTION_DURATION = {
  micro: 0.16, // Hover, tap, icon rotations
  interaction: 0.32, // Button states, pills, accordions
  section: 0.65, // Card entrances, heading reveals, text lines
  cinematic: 0.95, // Preloader transitions, overlay canvas menu, hero assembly
};

export const MOTION_STAGGER = {
  tight: 0.04, // Words / characters
  normal: 0.08, // List items, badges, matrix cells
  loose: 0.14, // Major section blocks
};

export const MOTION_DISTANCE = {
  micro: 6,
  short: 16,
  medium: 32,
  large: 64,
};

export const MOTION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: MOTION_DURATION.section, ease: MOTION_EASING.out },
    },
  },
  revealUp: {
    hidden: { opacity: 0, y: MOTION_DISTANCE.medium },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: MOTION_DURATION.section, ease: MOTION_EASING.cinematic },
    },
  },
  clipReveal: {
    hidden: { clipPath: "inset(100% 0% 0% 0%)", y: 20 },
    visible: {
      clipPath: "inset(0% 0% 0% 0%)",
      y: 0,
      transition: { duration: MOTION_DURATION.cinematic, ease: MOTION_EASING.cinematic },
    },
  },
};
