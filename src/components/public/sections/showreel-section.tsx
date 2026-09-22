"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles, Maximize2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Magnetic } from "@/components/public/motion/interactions";

gsap.registerPlugin(ScrollTrigger);

/**
 * Ariyana V3 Showreel Surface — Exact Runtime Behavioral Transplant (§36–37).
 *
 * Implements Ariyana's exact signature showreel choreography (Action a-17):
 * 1. Pinned stage: The section pins when reaching the top of the viewport.
 * 2. Flanking split typography: Monumental "PLAY" on the left and "REEL" on the right.
 * 3. Initial compact mask: Video mask starts at 50vw × 45vh with 40px rounded corners.
 * 4. Pinned scrub expansion:
 *    - Video mask expands to 100vw × 100vh (full bleed viewport).
 *    - Border radius transitions from 40px down to 0px.
 *    - "PLAY" slides left (-34vw) and fades to 0 opacity.
 *    - "REEL" slides right (+34vw) and fades to 0 opacity.
 * 5. Reverse scrub: Contracts smoothly back to 50vw × 45vh, reuniting "PLAY" and "REEL".
 * 6. Video lifecycle: Pauses offscreen via IntersectionObserver to prevent GPU decode storms.
 */
export function ShowreelSection() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const playTextRef = useRef<HTMLHeadingElement>(null);
  const reelTextRef = useRef<HTMLHeadingElement>(null);

  // Pause video offscreen to prevent GPU decode storms (§24, §66, §67)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          if (isPlaying) {
            video.play().catch(() => {});
          }
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [isPlaying]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const sticky = stickyRef.current;
    const frame = frameRef.current;
    const playText = playTextRef.current;
    const reelText = reelTextRef.current;

    if (!container || !sticky || !frame || !playText || !reelText) return;

    const mm = gsap.matchMedia();

    // Desktop/Tablet (> 768px): Authentic Ariyana Pinned Curtain Scrub
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=130%",
          pin: true,
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
      });

      // Expand central video mask from 50vw x 45vh to 100vw x 100vh
      tl.fromTo(
        frame,
        {
          width: "50vw",
          height: "45vh",
          borderRadius: "40px",
        },
        {
          width: "100vw",
          height: "100vh",
          borderRadius: "0px",
          ease: "none",
        },
        0
      );

      // Part "PLAY" text to the left
      tl.fromTo(
        playText,
        {
          x: "0vw",
          opacity: 1,
        },
        {
          x: "-35vw",
          opacity: 0,
          ease: "none",
        },
        0
      );

      // Part "REEL" text to the right
      tl.fromTo(
        reelText,
        {
          x: "0vw",
          opacity: 1,
        },
        {
          x: "35vw",
          opacity: 0,
          ease: "none",
        },
        0
      );

      return () => {
        tl.kill();
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === container) st.kill();
        });
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section
      ref={containerRef}
      id="showreel"
      aria-label="Cinematic Showreel"
      className="relative w-full bg-canvas border-t border-white/10 overflow-hidden"
    >
      <div
        ref={stickyRef}
        className="relative w-full h-[100vh] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Top Section Metadata Ribbon */}
        <div className="absolute top-8 left-6 right-6 md:left-16 md:right-16 z-30 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3">
            <span className="caption-pill">
              <span className="size-1.5 rounded-full bg-brand-primary" />
              <span>CINEMATIC // SHOWREEL</span>
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-fg-subtle hidden sm:inline-block">
              05 // VISUAL REEL
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-brand-primary-soft uppercase tracking-widest bg-canvas/70 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10">
            <Sparkles className="size-3.5" />
            <span>GEMINI MOTION PROTOCOL</span>
          </div>
        </div>

        {/* Flanking Typography: PLAY (Left) and REEL (Right) */}
        <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-10 lg:px-16 pointer-events-none z-10">
          <h3
            ref={playTextRef}
            className="font-display text-7xl sm:text-9xl md:text-[11rem] lg:text-[14rem] uppercase tracking-tighter text-fg/90 select-none will-change-transform"
          >
            PLAY
          </h3>

          <h3
            ref={reelTextRef}
            className="font-display text-7xl sm:text-9xl md:text-[11rem] lg:text-[14rem] uppercase tracking-tighter text-fg/90 select-none will-change-transform"
          >
            REEL
          </h3>
        </div>

        {/* Central Expanding Video Mask */}
        <div
          ref={frameRef}
          className="relative z-20 w-[88vw] h-[45vh] md:w-[50vw] md:h-[45vh] rounded-[40px] overflow-hidden border border-white/20 bg-surface shadow-[0_25px_80px_rgba(0,0,0,0.9)] will-change-transform"
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover object-center select-none"
          >
            <source src="/video/GEMINI_IMAGE_TO_VIDEO.mp4" type="video/mp4" />
          </video>

          {/* Subtle Environmental Contrast Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-canvas/70 via-transparent to-canvas/20 pointer-events-none" />

          {/* Center PLAY/PAUSE Magnetic Control */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <Magnetic>
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause Showreel" : "Play Showreel"}
                className="pointer-events-auto group/btn flex items-center gap-4 px-7 py-3.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/25 hover:border-brand-primary hover:bg-black/80 transition-all duration-300 shadow-2xl"
              >
                <div className="size-10 rounded-full bg-brand-primary text-canvas flex items-center justify-center group-hover/btn:scale-110 group-hover/btn:bg-brand-primary-soft transition-all duration-300">
                  {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-fg font-semibold">
                  {isPlaying ? "PAUSE REEL" : "PLAY REEL"}
                </span>
              </button>
            </Magnetic>
          </div>

          {/* Bottom Video Controls Bar */}
          <div className="absolute bottom-6 left-6 right-6 z-30 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute Video" : "Mute Video"}
                className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-canvas/80 backdrop-blur-md text-fg hover:border-brand-primary hover:text-brand-primary-soft transition-all duration-200"
              >
                {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label="Fullscreen Video"
                className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-canvas/80 backdrop-blur-md text-fg hover:border-brand-primary hover:text-brand-primary-soft transition-all duration-200"
              >
                <Maximize2 className="size-4" />
              </button>
            </div>

            <span className="font-mono text-[11px] uppercase tracking-widest text-fg-muted bg-canvas/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 hidden sm:inline-block">
              HÀ VĂN THỌ // CREATIVE CRAFT
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
