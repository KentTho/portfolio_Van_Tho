"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { markIntroReady } from "@/components/public/motion/intro-gate";
import { MOTION_DURATION, MOTION_EASING } from "@/styles/motion-tokens";

const SESSION_KEY = "vt-v3-preloader-shown";

/**
 * V3Preloader — Ariyana-inspired minimal cinematic preloader (§18).
 * Features '// HÀ VĂN THỌ' with architectural border accents.
 * Never replays on client anchor navigation (sessionStorage guard) and cleanly degrades under reduced-motion.
 */
export function V3Preloader({ name }: { readonly name: string }) {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduced || sessionStorage.getItem(SESSION_KEY)) {
      markIntroReady();
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");

    const raf = requestAnimationFrame(() => setShow(true));
    const t = setTimeout(() => {
      setShow(false);
      markIntroReady();
    }, 850);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-canvas"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: MOTION_DURATION.section, ease: MOTION_EASING.cinematic },
          }}
          aria-hidden
        >
          <div className="relative flex flex-col items-center gap-4">
            <motion.div
              className="flex items-center gap-3 font-mono text-sm tracking-[0.25em] text-brand-primary-soft uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: MOTION_EASING.out }}
            >
              <span className="text-brand-primary font-bold">{"//"}</span>
              <span>PORTFOLIO 2026</span>
            </motion.div>

            <motion.h1
              className="text-display font-display text-fg tracking-tight"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: MOTION_EASING.out, delay: 0.1 }}
            >
              {name || "HÀ VĂN THỌ"}
            </motion.h1>

            {/* Architectural hairline progress accent */}
            <motion.div
              className="h-[1px] w-36 bg-gradient-to-r from-transparent via-brand-primary to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, ease: MOTION_EASING.cinematic, delay: 0.15 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
