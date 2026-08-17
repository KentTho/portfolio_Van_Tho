"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Hydration-safe reduced-motion. `useReducedMotion()` can return `true` on the
 * first client render (reading matchMedia synchronously) while the server always
 * renders `false` — so any component that branches its *rendered DOM* on it
 * (plain text vs animated spans, `{!reduced && …}`, null return) produces a
 * hydration mismatch under `prefers-reduced-motion`.
 *
 * This returns `false` on the server and the first client render, then the real
 * value after mount. First paint therefore always matches the server; reduced
 * users settle to the reduced treatment one tick later (no sustained motion).
 */
export function useReducedMotionSafe(): boolean {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Defer to the next frame so we never call setState synchronously in the
    // effect body (react-hooks/set-state-in-effect) — the extra frame is harmless.
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  return mounted ? Boolean(reduced) : false;
}
