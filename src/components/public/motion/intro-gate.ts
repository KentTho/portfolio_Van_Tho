"use client";

import { useEffect, useState } from "react";

/**
 * Intro gate — a single-authority "the stage is clear, start the entrance" signal.
 *
 * WHY: the IntroCurtain overlay covers the hero for ~1s on first visit. Without
 * coordination the hero's entrance choreography plays *behind* the curtain and the
 * user only ever sees an already-settled hero when the curtain lifts (the exact
 * "entrance can't be felt" defect the Owner reported). The curtain is the single
 * authority: it calls `markIntroReady()` the moment it starts lifting (or right
 * away when it won't show — repeat visit / reduced motion). Entrance animations
 * subscribe via `useIntroReady()` and hold at their `hidden` state until then.
 *
 * Module-level flag + subscriber set (not React context) so it is race-free
 * regardless of component mount order, with a safety timeout so nothing can hang.
 */
let ready = false;
const subscribers = new Set<() => void>();

export function markIntroReady(): void {
  if (ready) return;
  ready = true;
  subscribers.forEach((fn) => fn());
  subscribers.clear();
}

/** Returns true once the intro stage is clear. Safe under SSR (starts false). */
export function useIntroReady(): boolean {
  const [value, setValue] = useState(ready);

  useEffect(() => {
    // If the gate opened between first render and this effect, sync on the next
    // frame (deferred so we never call setState synchronously in the effect body).
    if (ready) {
      const raf = requestAnimationFrame(() => setValue(true));
      return () => cancelAnimationFrame(raf);
    }
    const notify = () => setValue(true);
    subscribers.add(notify);
    // Safety net: never leave entrance content hidden if the curtain never fires
    // (JS error, aborted animation). Kept short so worst-case reveal stays snappy.
    const safety = window.setTimeout(markIntroReady, 1600);
    return () => {
      subscribers.delete(notify);
      window.clearTimeout(safety);
    };
  }, []);

  return value;
}
