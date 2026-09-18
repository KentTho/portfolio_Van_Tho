"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface LenisContextValue {
  readonly lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextValue>({ lenis: null });

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Unified Lenis + GSAP ScrollTrigger Provider.
 * Hooks Lenis scroll events into GSAP ScrollTrigger and drives Lenis
 * through GSAP's RAF ticker to guarantee zero-lag, frame-synced scrub animations.
 */
export function LenisProvider({ children }: { readonly children: ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let destroyed = false;

    import("lenis").then(({ default: LenisClass }) => {
      if (destroyed) return;

      const lenis = new LenisClass({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
      });

      lenisRef.current = lenis;
      setLenisInstance(lenis);

      // Connect Lenis to GSAP ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      // Drive Lenis directly from GSAP ticker for unified RAF
      const tickerCallback = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      // Handle anchor links
      const handleAnchorClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        const anchor = target?.closest("a");
        if (!anchor) return;
        const href = anchor.getAttribute("href");
        if ((href && href.startsWith("/#")) || (href && href.startsWith("#"))) {
          const id = href.split("#")[1];
          if (id) {
            const el = document.getElementById(id);
            if (el) {
              e.preventDefault();
              lenis.scrollTo(el, { offset: -60, duration: 1.2 });
            }
          }
        }
      };

      document.addEventListener("click", handleAnchorClick);

      return () => {
        gsap.ticker.remove(tickerCallback);
        document.removeEventListener("click", handleAnchorClick);
        lenis.destroy();
      };
    });

    return () => {
      destroyed = true;
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return <LenisContext.Provider value={{ lenis: lenisInstance }}>{children}</LenisContext.Provider>;
}
