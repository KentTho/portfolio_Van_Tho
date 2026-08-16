"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { POINTER_SPRING } from "@/components/public/motion/motion-tokens";

/**
 * Magnetic — a small pointer-attraction wrapper for CTAs (Prompt 12R).
 * The child drifts a few px toward the pointer with a spring, snapping back on
 * leave. Amplitude is intentionally small (no jitter). The child keeps its own
 * semantics/focus; on touch or reduced-motion it renders as a plain wrapper.
 */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  readonly children: ReactNode;
  readonly strength?: number;
  readonly className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, POINTER_SPRING);
  const sy = useSpring(y, POINTER_SPRING);

  if (reduced) return <span className={className}>{children}</span>;

  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className ?? ""}`}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}

/**
 * PointerTilt — subtle 3D depth on pointer for a focal element (portrait, cards).
 * CSS perspective + small rotateX/Y spring; snaps flat on leave. No jitter,
 * keyboard-neutral. Touch / reduced-motion → plain wrapper (static, readable).
 */
export function PointerTilt({
  children,
  max = 7,
  className,
}: {
  readonly children: ReactNode;
  readonly max?: number;
  readonly className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 22 });
  const sry = useSpring(ry, { stiffness: 200, damping: 22 });

  if (reduced) return <div className={className}>{children}</div>;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900, transformStyle: "preserve-3d" }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
