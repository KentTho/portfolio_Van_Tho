"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  readonly children: ReactNode;
  readonly delay?: number;
  readonly className?: string;
  /** Render as a list item when used inside a <ul>. */
  readonly as?: "div" | "li";
}

/**
 * Scroll-reveal wrapper. Honors prefers-reduced-motion by rendering static content
 * with no transform (design policy §L / accessibility §T). transform+opacity only.
 */
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = as === "li" ? motion.li : motion.div;

  if (reduced) {
    const Plain = as === "li" ? "li" : "div";
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Tag>
  );
}
