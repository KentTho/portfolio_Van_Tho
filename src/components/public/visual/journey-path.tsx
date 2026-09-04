"use client";

import { motion, useScroll, useTransform, useSpring, type MotionValue } from "motion/react";

interface JourneyPathProps {
  /** The container ref to measure scroll progress against. */
  readonly containerRef: React.RefObject<HTMLElement | null>;
}

/**
 * JourneyPath — Production Visual System Redesign.
 *
 * Implements the organic continuous luminous route inspired by docs/image_demo_portfolio/line-based.jpg:
 * - NO thick road/ribbon deck or highway appearance.
 * - Smooth, continuous organic Bézier S-curves.
 * - LAYER A: Ambient Glow (wide, high blur, cyan -> bright blue -> deep blue progression).
 * - LAYER B: Soft Energy Core (5-8px, luminous aura).
 * - LAYER C: Main Dashed Line (1-2px, crisp white/light gray, THE VISUAL HERO).
 * - LAYER D: Energy Packet (Forward-only, continuous data pulse, never reverses).
 */
export function JourneyPath({ containerRef }: JourneyPathProps) {
  // Scroll progress linked to viewport center
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 75%"],
  });

  // Smooth the scroll progress to ensure jitter-free unlock
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  // Convert progress (0 to 1) into pathLength
  const pathLength = useTransform(smoothProgress, [0, 1], [0, 1]);

  // Organic Continuous Bézier Routes
  // Desktop: Sweeping natural S-curve flowing Left 15% -> Right 85% -> Left 15%
  const desktopPathD = `
    M 15 0
    C 15 10, 15 16, 15 22
    C 15 34, 38 38, 58 43
    C 78 47, 85 49, 85 54
    C 85 59, 85 64, 76 68
    C 56 74, 15 76, 15 84
    C 15 90, 18 96, 24 100
  `;

  // Mobile: Organic soft wave along the left rail column
  const mobilePathD = `
    M 50 0
    C 42 18, 58 32, 50 48
    C 42 64, 58 80, 50 100
  `;

  const renderRouteStack = (
    d: string,
    isMobile: boolean,
    pathLengthProgress: MotionValue<number>
  ) => {
    const pfx = isMobile ? "mob-" : "dt-";

    return (
      <>
        <defs>
          {/* Vertical Gradient Glow: TOP (deep blue) -> MIDDLE (bright blue) -> BOTTOM (cyan / turquoise) */}
          <linearGradient id={`${pfx}route-glow-grad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d4ed8" /> {/* Top: Deep Blue */}
            <stop offset="48%" stopColor="#0ea5e9" /> {/* Middle: Bright Blue */}
            <stop offset="100%" stopColor="#06b6d4" /> {/* Bottom: Cyan / Turquoise */}
          </linearGradient>

          {/* Soft Energy Core Gradient */}
          <linearGradient id={`${pfx}route-core-grad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>

          {/* Forward-only Energy Packet Gradient */}
          <linearGradient id={`${pfx}packet-grad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="40%" stopColor="#0ea5e9" stopOpacity="0.4" />
            <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="95%" stopColor="#bae6fd" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>

          {/* Blur Filters */}
          <filter id={`${pfx}glow-ambient`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={isMobile ? "4" : "7"} result="blur" />
          </filter>
          <filter id={`${pfx}glow-core`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={isMobile ? "1.5" : "2.5"} result="blur" />
          </filter>

          {/* Scroll Progress Mask for dynamic route unlocking */}
          <mask id={`${pfx}scroll-mask`}>
            <motion.path
              d={d}
              fill="none"
              stroke="white"
              strokeWidth={isMobile ? "40" : "70"}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: pathLengthProgress }}
            />
          </mask>
        </defs>

        {/* ── UNLOCKED GHOST / LATENT ROUTE ─────────────────────────────── */}
        {/* Subtle dormant path indicating continuity before the energy wave arrives */}
        <g opacity="0.6">
          {/* Latent Ambient Aura */}
          <path
            d={d}
            fill="none"
            stroke={`url(#${pfx}route-glow-grad)`}
            strokeWidth={isMobile ? "10" : "16"}
            filter={`url(#${pfx}glow-ambient)`}
            opacity="0.1"
            vectorEffect="non-scaling-stroke"
          />
          {/* Latent Dashed Route */}
          <path
            d={d}
            fill="none"
            stroke="rgba(148, 163, 184, 0.22)"
            strokeWidth={isMobile ? "1" : "1.2"}
            strokeDasharray={isMobile ? "4 6" : "6 7"}
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* ── ACTIVE LUMINOUS ROUTE (Revealed by Scroll Mask) ──────────── */}
        <g mask={`url(#${pfx}scroll-mask)`}>
          {/* LAYER A — AMBIENT GLOW: Very wide, high blur, cyan -> bright blue -> deep blue */}
          <path
            d={d}
            fill="none"
            stroke={`url(#${pfx}route-glow-grad)`}
            strokeWidth={isMobile ? "16" : "30"}
            filter={`url(#${pfx}glow-ambient)`}
            opacity="0.34"
            vectorEffect="non-scaling-stroke"
          />

          {/* LAYER B — SOFT ENERGY CORE: 5–8px, luminous aura */}
          <path
            d={d}
            fill="none"
            stroke={`url(#${pfx}route-core-grad)`}
            strokeWidth={isMobile ? "4.5" : "6.5"}
            filter={`url(#${pfx}glow-core)`}
            opacity="0.7"
            vectorEffect="non-scaling-stroke"
          />

          {/* LAYER C — MAIN DASHED LINE: THE VISUAL HERO */}
          {/* 1–2px crisp dashed line in bright white, dash and gap uniform */}
          <path
            d={d}
            fill="none"
            stroke="#ffffff"
            strokeWidth={isMobile ? "1.2" : "1.8"}
            strokeDasharray={isMobile ? "5 6" : "7 7"}
            opacity="0.85"
            vectorEffect="non-scaling-stroke"
          />

          {/* LAYER D — ENERGY PACKET: Forward-only pulse */}
          {/* Looping continuously in forward direction, never reverses on scroll */}
          <motion.path
            d={d}
            fill="none"
            stroke={`url(#${pfx}packet-grad)`}
            strokeWidth={isMobile ? "2.2" : "2.8"}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{
              strokeDasharray: "14% 100%",
            }}
            initial={{ strokeDashoffset: "114%" }}
            animate={{ strokeDashoffset: "-14%" }}
            transition={{
              duration: isMobile ? 4.5 : 5.6,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        </g>
      </>
    );
  };

  return (
    <>
      {/* Desktop Container */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden lg:block" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {renderRouteStack(desktopPathD, false, pathLength)}
        </svg>
      </div>

      {/* Mobile/Tablet Container (Constrained to the left rail column) */}
      <div className="absolute top-0 bottom-0 left-0 w-[3rem] md:w-[4rem] z-0 pointer-events-none lg:hidden" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {renderRouteStack(mobilePathD, true, pathLength)}
        </svg>
      </div>
    </>
  );
}
