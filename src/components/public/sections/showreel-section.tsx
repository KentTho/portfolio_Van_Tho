"use client";

import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles, Maximize2 } from "lucide-react";
import { Reveal } from "@/components/public/reveal";
import { Magnetic } from "@/components/public/motion/interactions";

/**
 * Ariyana V3 Showreel Surface (§10, §19).
 * Features GEMINI_IMAGE_TO_VIDEO.mp4 as the canonical showreel media.
 * Replicates Ariyana's signature "PLAY REEL" centerpiece typography and interactive controls.
 */
export function ShowreelSection() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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
      id="showreel"
      aria-label="Showreel Media"
      className="relative w-full border-t border-white/10 py-20 lg:py-32 overflow-hidden bg-canvas"
    >
      <div className="mx-auto w-full max-w-[1680px] px-6 md:px-12 lg:px-16">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="caption-pill">
              <span className="size-1.5 rounded-full bg-brand-primary" />
              <span>CINEMATIC // SHOWREEL</span>
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-fg-subtle hidden sm:inline-block">
              ENGINEERING VISUAL ENVIRONMENT
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-brand-primary-soft uppercase tracking-widest">
            <Sparkles className="size-3.5" />
            <span>GEMINI MOTION PROTOCOL</span>
          </div>
        </div>

        {/* Full-width Ariyana Showreel Frame */}
        <Reveal direction="up" distance={30}>
          <div className="group relative aspect-[16/9] md:aspect-[21/9] w-full rounded-[2.5rem] overflow-hidden border border-white/20 bg-surface/90 shadow-[0_30px_90px_rgba(0,0,0,0.8)]">
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

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-canvas/80 via-transparent to-canvas/30 pointer-events-none" />

            {/* Ariyana Center "PLAY REEL" Signature Interaction */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Magnetic>
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause Showreel" : "Play Showreel"}
                  className="pointer-events-auto group/btn flex items-center gap-6 px-8 py-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 hover:border-brand-primary hover:bg-black/60 transition-all duration-300 shadow-2xl"
                >
                  <span className="font-display text-2xl sm:text-3xl tracking-tight text-fg uppercase">
                    PLAY
                  </span>
                  <div className="size-12 rounded-full bg-brand-primary text-canvas flex items-center justify-center group-hover/btn:scale-110 group-hover/btn:bg-brand-primary-soft transition-all duration-300">
                    {isPlaying ? <Pause className="size-5" /> : <Play className="size-5 ml-0.5" />}
                  </div>
                  <span className="font-display text-2xl sm:text-3xl tracking-tight text-fg uppercase">
                    REEL
                  </span>
                </button>
              </Magnetic>
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute Video" : "Mute Video"}
                  className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-canvas/70 backdrop-blur-md text-fg hover:border-brand-primary hover:text-brand-primary-soft transition-all duration-200"
                >
                  {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label="Fullscreen Video"
                  className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-canvas/70 backdrop-blur-md text-fg hover:border-brand-primary hover:text-brand-primary-soft transition-all duration-200"
                >
                  <Maximize2 className="size-4" />
                </button>
              </div>

              <span className="font-mono text-xs uppercase tracking-widest text-fg-muted bg-canvas/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hidden sm:inline-block">
                HÀ VĂN THỌ // CREATIVE CRAFT
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
