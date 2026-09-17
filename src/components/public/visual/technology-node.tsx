"use client";

import { motion } from "motion/react";
import { TechnologyLogo } from "@/components/technology/technology-logo";
import type { TechId } from "@/config/technology-catalog";

interface TechnologyNodeProps {
  readonly id: TechId;
  readonly delay?: number;
}

/**
 * An interactive wrapper for a technology logo.
 * Strict logo-only default state (no primary visible text).
 * Displays a subtle hover tooltip/glow on interaction.
 */
export function TechnologyNode({ id, delay = 0 }: TechnologyNodeProps) {
  return (
    <motion.div
      className="group relative flex items-center justify-center cursor-default"
      initial={{ scale: 0.8, opacity: 0, filter: "blur(4px)" }}
      whileInView={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Glow aura that activates on hover */}
      <div className="absolute inset-0 rounded-full bg-brand-primary opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30" />

      {/* The actual logo (or neutral placeholder if missing) */}
      <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
        <TechnologyLogo id={id} size={48} showLabel={false} />
      </div>
      
      {/* Tooltip (Visible only on hover/focus to prevent text clutter) */}
      <div className="pointer-events-none absolute -top-10 left-1/2 flex -translate-x-1/2 -translate-y-2 items-center justify-center rounded-md border border-border/50 bg-surface/80 px-2 py-1 text-xs font-medium text-fg-muted opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-4 group-hover:opacity-100">
        <span className="whitespace-nowrap">{id}</span>
      </div>
    </motion.div>
  );
}
