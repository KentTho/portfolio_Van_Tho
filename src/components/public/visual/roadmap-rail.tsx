"use client";

import { motion } from "motion/react";
import { TechnologyNode } from "./technology-node";
import type { TechId } from "@/config/technology-catalog";

interface RoadmapRailProps {
  readonly title: string;
  readonly description: string;
  readonly techIds: readonly string[];
  readonly availableLogos: readonly string[];
  readonly compact?: boolean;
}

/**
 * The individual chapter rail (Frontend, Backend, Infra) displaying the architectural nodes.
 * Used inside the EngineeringJourney 30/70 layout.
 */
export function RoadmapRail({ title, description, techIds, availableLogos, compact = false }: RoadmapRailProps) {
  // Filter out any missing logos completely to avoid rendering empty placeholders
  const activeTechIds = techIds.filter(id => availableLogos.includes(id));

  return (
    <div className={`relative flex flex-col z-20 items-center text-center max-w-[3rem] md:max-w-[4rem] lg:max-w-xs`}>
      {/* Phase-based Circular Milestone Bloom & Label */}
      <motion.div
        className="flex flex-col items-center gap-2 lg:gap-3 cursor-default"
        initial="idle"
        whileInView="active"
        viewport={{ amount: 0.4, margin: "0px 0px -10% 0px" }}
      >
        {/* Circular Milestone Node: Soft outer glow + thin ring + bright core */}
        <motion.div
          className="relative flex items-center justify-center w-10 h-10 lg:w-14 lg:h-14 rounded-full border border-cyan-400/40 bg-surface/70 backdrop-blur-md"
          variants={{
            idle: {
              borderColor: "rgba(56, 189, 248, 0.35)",
              boxShadow: "0 0 14px 1px rgba(14, 165, 233, 0.2)"
            },
            active: {
              borderColor: "rgba(56, 189, 248, 0.75)",
              boxShadow: "0 0 28px 4px rgba(14, 165, 233, 0.45)"
            }
          }}
          transition={{ duration: 0.6 }}
        >
          {/* Inner architectural ring */}
          <div className="absolute inset-1 rounded-full border border-brand-primary-soft/30" />

          {/* Subtle gold handoff pulse */}
          <motion.div
            className="absolute inset-0 rounded-full bg-brand-accent/20"
            variants={{
              idle: { opacity: 0 },
              active: { opacity: [0, 0.65, 0] }
            }}
            transition={{ duration: 1.4, times: [0, 0.25, 1] }}
          />

          {/* Bright Luminous Hot Core */}
          <motion.div
            className="relative z-10 w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 rounded-full bg-[#cffafe] shadow-[0_0_12px_2px_#38bdf8]"
            variants={{
              idle: { scale: 0.9, backgroundColor: "#38bdf8", boxShadow: "0 0 10px 1px rgba(56,189,248,0.7)" },
              active: { scale: 1.15, backgroundColor: "#ffffff", boxShadow: "0 0 18px 4px rgba(56,189,248,0.95)" }
            }}
            transition={{ duration: 0.5, delay: 0.15 }}
          />
        </motion.div>

        <div className="hidden lg:block">
          <h3 className="font-mono text-sm lg:text-base font-bold tracking-wider text-fg uppercase">{title}</h3>
          {!compact && (
            <p className="mt-2 text-xs lg:text-sm text-fg/80 leading-relaxed max-w-[260px]">
              {description}
            </p>
          )}
        </div>

        {/* Mobile-only title badge */}
        <div className="lg:hidden mt-2">
           <h3 className="text-[11px] font-mono font-bold tracking-tight text-fg-muted uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{title}</h3>
        </div>
      </motion.div>

      {/* Verified Logos Cluster with Thin Branch Lines */}
      <motion.div
        className="flex flex-col lg:flex-row flex-wrap gap-3 lg:gap-4 mt-6 lg:mt-8 justify-center relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.3 }} // Replay safely
      >
        {activeTechIds.map((id, index) => (
          <motion.div
            key={id}
            className="relative flex items-center justify-center group"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            {/* Secondary Branch Line connecting to node */}
            <div className="hidden lg:block absolute -top-6 left-1/2 w-[1px] h-6 bg-gradient-to-b from-brand-primary/40 to-transparent -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <TechnologyNode id={id as TechId} delay={index * 0.1} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
