# Wave 04 — Motion & 3D Policy

**Library:** `motion` (the current package; **not** legacy `framer-motion`). Imported from
`motion/react` inside client components only.

## Motion by section
- **Hero:** one staggered entrance (`fadeUp`), CTAs visible without waiting. `hero-section.tsx`.
- **Sections (focus/tech/featured/principles):** single scroll-reveal via `Reveal` (`whileInView`, `once`).
- **Header:** mobile menu height/opacity transition only.
- **Articles/Resume/Contact:** minimal/no motion.

## Reduced motion (accessibility §T)
- `Reveal`, `HeroSection`, `PublicHeader` all branch on `useReducedMotion()` → static render.
- Global CSS (`globals.css`) also collapses animation/transition durations under
  `prefers-reduced-motion: reduce`.
- transform/opacity only; no continuous rAF loops; no offscreen animation.

## 3D policy
- CSS/SVG depth **before** WebGL. The cosmic backdrop is pure CSS (`cosmic-background.tsx`) — no
  WebGL, no external asset, never blocks LCP.
- WebGL/3D is **DEFERRED**: only introduced for the Hero focal object or the architecture-diagram
  viewer if proven necessary, lazy-loaded, offscreen-paused, with a static fallback. Not required
  to understand any content.
