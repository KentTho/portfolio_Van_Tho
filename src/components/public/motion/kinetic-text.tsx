"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "@/components/public/motion/motion-tokens";
import { useReducedMotionSafe } from "@/components/public/motion/use-reduced-motion-safe";

/**
 * KineticText — premium per-character mask reveal for the Hero name / major
 * statements (Prompt 12R). Each character rises from an overflow-clipped line
 * with a staggered spring. Readability wins: reduced-motion renders plain text,
 * and the string stays a real accessible heading (aria-label on the wrapper).
 * Not for body copy.
 */
export function KineticText({
  text,
  className,
  delay = 0,
  stagger = 0.035,
  duration = 0.6,
  as = "span",
  play = true,
}: {
  readonly text: string;
  readonly className?: string;
  readonly delay?: number;
  readonly stagger?: number;
  readonly duration?: number;
  readonly as?: "span" | "h1" | "h2";
  /** Gate the reveal (e.g. until the intro curtain clears). Holds hidden while false. */
  readonly play?: boolean;
}) {
  const reduced = useReducedMotionSafe();
  const Tag = as;

  if (reduced) return <Tag className={className}>{text}</Tag>;

  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden className="inline-flex whitespace-nowrap">
          {word.split("").map((ch, ci) => (
            <span key={ci} className="inline-block overflow-hidden" style={{ lineHeight: 0.95 }}>
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={play ? { y: 0 } : { y: "110%" }}
                transition={{
                  duration,
                  ease: EASE_OUT,
                  delay: delay + (wi * 6 + ci) * stagger,
                }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
