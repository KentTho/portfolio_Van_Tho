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
      {/* Node Bloom & Label */}
      <motion.div 
        className="flex flex-col items-center gap-2 lg:gap-4 cursor-default"
        initial="idle"
        whileInView="active"
        viewport={{ amount: 0.5, margin: "0px 0px -15% 0px" }} // Safe replay contract via layout shift avoidance
      >
        {/* Phase-based Junction Bloom */}
        <motion.div 
          className="relative flex items-center justify-center w-8 h-8 lg:w-12 lg:h-12 rounded-full border border-brand-primary/30 bg-surface/50 backdrop-blur-sm"
          variants={{
            idle: { borderColor: "rgba(var(--brand-primary-rgb), 0.3)", boxShadow: "0 0 0px 0px transparent" },
            active: { borderColor: "rgba(var(--brand-primary-rgb), 0.6)", boxShadow: "0 0 20px 2px color-mix(in oklab, var(--brand-primary) 20%, transparent)" }
          }}
          transition={{ duration: 0.7 }}
        >
          {/* Inner architecture ring */}
          <div className="absolute inset-0 rounded-full border border-brand-primary/10 m-1" />
          
          {/* Gold Handoff Flash (transient) */}
          <motion.div 
            className="absolute inset-0 rounded-full bg-brand-accent/20"
            variants={{
              idle: { opacity: 0 },
              active: { opacity: [0, 0.8, 0] }
            }}
            transition={{ duration: 1.5, times: [0, 0.2, 1] }}
          />
          
          {/* Hot Core */}
          <motion.div 
            className="relative z-10 w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-brand-primary-soft shadow-[0_0_10px_1px_var(--brand-primary)]"
            variants={{
              idle: { backgroundColor: "var(--brand-primary-soft)", boxShadow: "0 0 10px 1px var(--brand-primary)" },
              active: { backgroundColor: "#cffafe", boxShadow: "0 0 15px 3px var(--brand-primary)" }
            }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </motion.div>
        
        <div className="hidden lg:block">
          <h3 className="label-mono text-fg tracking-wider">{title}</h3>
          {!compact && (
            <p className="mt-3 text-sm text-fg-muted leading-relaxed">
              {description}
            </p>
          )}
        </div>
        
        {/* Mobile-only title rotated or just tiny */}
        <div className="lg:hidden mt-2">
           <h3 className="text-[10px] uppercase font-mono tracking-tighter text-fg-muted opacity-80" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{title}</h3>
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
