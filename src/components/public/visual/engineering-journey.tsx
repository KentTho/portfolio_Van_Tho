"use client";

import { useRef, type ReactNode } from "react";
import { type Locale } from "@/shared/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import dynamic from "next/dynamic";
import { JourneyPath } from "./journey-path";
import { RoadmapRail } from "./roadmap-rail";

const ThreeAtmosphericDepth = dynamic(
  () => import("./three-depth-canvas").then((mod) => mod.ThreeAtmosphericDepth),
  { ssr: false }
);

interface EngineeringJourneyProps {
  readonly aboutNode: ReactNode;
  readonly projectsNode: ReactNode;
  readonly careerNode: ReactNode;
  readonly locale: Locale;
  readonly dict: Dictionary;
  readonly availableLogos: readonly string[];
}

/**
 * The Engineering Journey wrapper.
 * Implements the 30/70 desktop layout and the single left-rail mobile layout.
 * Hosts the continuous SVG architecture path + selective Three.js 3D depth layer.
 */
export function EngineeringJourney({
  aboutNode,
  projectsNode,
  careerNode,
  dict,
  availableLogos,
}: EngineeringJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // The actual technology logos can be configured here or passed down.
  // Using verified canonical IDs. If they don't have SVGs yet, they fall back gracefully.
  const frontendTech = ["react", "typescript", "tailwind", "nextjs"];
  const backendTech = ["python", "fastapi", "nodejs", "postgresql"];
  const infraTech = ["docker", "vercel", "linux", "github"];

  return (
    <div ref={containerRef} className="relative w-full max-w-[1400px] mx-auto overflow-hidden">
      {/* 3D WebGL Atmospheric Depth Layer (Three.js - Ambient Energy Particles & Volumetric Light) */}
      <ThreeAtmosphericDepth />

      {/* 4-Layer Continuous Architecture Path (Desktop & Mobile) */}
      <JourneyPath containerRef={containerRef} />

      <div className="relative z-10 flex flex-col w-full">
        
        {/* ABOUT (Frontend) */}
        {/* Desktop: [ RAIL 30% ] [ CONTENT 70% ] */}
        {/* Mobile:  [ RAIL 15% ] [ CONTENT 85% ] (Always left rail) */}
        <div className="grid grid-cols-[3rem_1fr] md:grid-cols-[4rem_1fr] lg:grid-cols-[0.3fr_0.7fr] w-full min-h-[50vh] gap-4 lg:gap-0 relative">
          <div className="flex justify-center items-start lg:items-center pt-24 lg:pt-0">
            <RoadmapRail
              title={dict.journey.frontend.title}
              description={dict.journey.frontend.description}
              techIds={frontendTech}
              availableLogos={availableLogos}
            />
          </div>
          <div className="flex flex-col min-w-0">
            {aboutNode}
          </div>
        </div>

        {/* INTER-SECTION TRANSITION BAND */}
        <div className="hidden lg:block h-32 w-full" aria-hidden="true" />

        {/* PROJECTS (Backend) */}
        {/* Desktop: [ CONTENT 70% ] [ RAIL 30% ] */}
        {/* Mobile:  [ RAIL 15% ] [ CONTENT 85% ] (Always left rail) */}
        <div className="grid grid-cols-[3rem_1fr] md:grid-cols-[4rem_1fr] lg:grid-cols-[0.7fr_0.3fr] w-full min-h-[50vh] gap-4 lg:gap-0 relative">
          {/* On mobile, rail is col 1. On desktop, rail is col 2. */}
          <div className="flex lg:hidden justify-center items-start pt-24">
             <RoadmapRail
              title={dict.journey.backend.title}
              description={dict.journey.backend.description}
              techIds={backendTech}
              availableLogos={availableLogos}
            />
          </div>
          
          <div className="flex flex-col min-w-0 order-2 lg:order-1">
            {projectsNode}
          </div>
          
          <div className="hidden lg:flex justify-center items-center order-1 lg:order-2">
            <RoadmapRail
              title={dict.journey.backend.title}
              description={dict.journey.backend.description}
              techIds={backendTech}
              availableLogos={availableLogos}
            />
          </div>
        </div>

        {/* INTER-SECTION TRANSITION BAND */}
        <div className="hidden lg:block h-32 w-full" aria-hidden="true" />

        {/* CAREER (Infra & Data) */}
        {/* Desktop: [ RAIL 30% ] [ CONTENT 70% ] */}
        {/* Mobile:  [ RAIL 15% ] [ CONTENT 85% ] (Always left rail) */}
        <div className="grid grid-cols-[3rem_1fr] md:grid-cols-[4rem_1fr] lg:grid-cols-[0.3fr_0.7fr] w-full min-h-[50vh] gap-4 lg:gap-0 relative">
          <div className="flex justify-center items-start lg:items-center pt-24 lg:pt-0">
             <RoadmapRail
              title={dict.journey.infrastructureData.title}
              description={dict.journey.infrastructureData.description}
              techIds={infraTech}
              availableLogos={availableLogos}
            />
          </div>
          <div className="flex flex-col min-w-0">
            {careerNode}
          </div>
        </div>

      </div>
    </div>
  );
}
