"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

/**
 * Hysteresis-driven replayable reveal.
 *
 * Rules:
 * A. Section becomes eligible to play only when it enters a meaningful focus threshold.
 * B. After playback completes: stay SETTLED.
 * C. When it starts leaving: do NOT hide it.
 * D. Only after it has left far enough (expanded margin): arm initial pose for the NEXT entrance.
 */
export function useReplayableReveal<T extends Element = HTMLDivElement>(
  enterMargin: string = "-20% 0px -25% 0px", // Trigger when entering the 20%-25% inner band
  exitMargin: string = "20% 0px 20% 0px"    // Stay settled until it's pushed 20% completely offscreen
) {
  const ref = useRef<T>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isEntering = useInView(ref, { margin: enterMargin as any });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isSafelyOut = !useInView(ref, { margin: exitMargin as any });

  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (isEntering && !hasEntered) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasEntered(true);
    } else if (isSafelyOut && hasEntered) {
      setHasEntered(false);
    }
  }, [isEntering, isSafelyOut, hasEntered]);

  return { ref, hasEntered };
}
