"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/components/public/motion/motion-tokens";

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
  as = "span",
}: {
  readonly text: string;
  readonly className?: string;
  readonly delay?: number;
  readonly stagger?: number;
  readonly as?: "span" | "h1" | "h2";
}) {
  const reduced = useReducedMotion();
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
                animate={{ y: 0 }}
                transition={{
                  duration: 0.6,
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
