"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/components/public/motion/motion-tokens";
import { markIntroReady } from "@/components/public/motion/intro-gate";

const SESSION_KEY = "vt-intro-shown";

/**
 * IntroCurtain — a brief cinematic brand reveal (~0.9s) on the first visit of a
 * session only (Prompt 12R / V2). Never replays on client navigation
 * (sessionStorage guard) and is skipped entirely under prefers-reduced-motion.
 *
 * It is the single authority for the intro gate: it calls `markIntroReady()` the
 * moment it begins lifting so the hero entrance plays *as the stage clears*
 * (visible), not hidden behind the curtain. When it won't show (repeat visit /
 * reduced motion) it opens the gate immediately.
 */
export function IntroCurtain({ name }: { readonly name: string }) {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduced || sessionStorage.getItem(SESSION_KEY)) {
      // No curtain → the stage is already clear; let the hero enter immediately.
      markIntroReady();
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");
    // Defer the show to the next frame so the state update is not applied
    // synchronously inside the effect (react-hooks/set-state-in-effect).
    const raf = requestAnimationFrame(() => setShow(true));
    const t = setTimeout(() => {
      setShow(false);
      // Curtain starts lifting now — release the hero entrance so it animates
      // into view as the curtain clears (not behind it).
      markIntroReady();
    }, 900);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-canvas"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", transition: { duration: 0.7, ease: EASE_OUT } }}
          aria-hidden
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 45%, color-mix(in oklab, var(--brand-primary) 16%, transparent), transparent 70%)",
            }}
          />
          <div className="relative flex flex-col items-center gap-4">
            <motion.span
              className="text-display font-display text-fg"
              initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            >
              {name}
              <span className="text-brand-primary-soft">.</span>
            </motion.span>
            <motion.span
              className="h-px w-40 origin-left"
              style={{ background: "linear-gradient(90deg, var(--brand-primary), var(--brand-secondary))" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
