"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useReducedMotionSafe } from "@/components/public/motion/use-reduced-motion-safe";

interface ThreeAtmosphericDepthProps {
  readonly className?: string;
}

/**
 * ThreeAtmosphericDepth
 * Subtle 3D WebGL atmospheric depth layer using Three.js.
 * Provides micro energy particles and soft volumetric depth behind the Engineering Journey.
 *
 * Performance Contract:
 * - Render loop strictly pauses when offscreen (IntersectionObserver).
 * - Respects prefers-reduced-motion (no animation loop).
 * - Power-efficient (low particle count, low-power WebGL profile).
 * - Complete disposal of geometries, materials, and renderer on unmount.
 */
export function ThreeAtmosphericDepth({ className = "" }: ThreeAtmosphericDepthProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    if (!container) return;

    let isVisible = false;
    let animationFrameId: number | null = null;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / (container.clientHeight || 1),
      0.1,
      1000
    );
    camera.position.z = 180;

    // 2. Renderer Setup with low-power profile
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 3. Subtle Energy Particle Cloud (48 particles)
    const particleCount = 48;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color("#22d3ee");
    const colorBlue = new THREE.Color("#38bdf8");
    const colorDeepBlue = new THREE.Color("#1d4ed8");

    for (let i = 0; i < particleCount; i++) {
      // Spread across depth field aligned with the route
      positions[i * 3] = (Math.random() - 0.5) * 220;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 320;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;

      // Vertical color progression: top deep blue -> middle bright blue -> bottom cyan
      const yRatio = (positions[i * 3 + 1]! + 160) / 320; // 0 to 1
      const c = new THREE.Color();
      if (yRatio > 0.5) {
        c.lerpColors(colorBlue, colorDeepBlue, (yRatio - 0.5) * 2);
      } else {
        c.lerpColors(colorCyan, colorBlue, yRatio * 2);
      }

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom circle canvas texture for soft point glow without external image assets
    const makePointTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, "rgba(255,255,255,1)");
        grad.addColorStop(0.3, "rgba(56,189,248,0.7)");
        grad.addColorStop(0.8, "rgba(56,189,248,0.15)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const pointTexture = makePointTexture();

    const material = new THREE.PointsMaterial({
      size: 16,
      vertexColors: true,
      map: pointTexture,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 4. Subtle Mouse / Parallax tracking
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 24;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 24;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 5. Resize observer
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / (height || 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // 6. Animation loop with offscreen pausing
    const clock = new THREE.Clock();

    const renderLoop = () => {
      if (!isVisible) return;
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      camera.position.x = mouseX;
      camera.position.y = -mouseY;
      camera.lookAt(0, 0, 0);

      // Subtle organic sway of the energy particles
      particles.rotation.y = elapsedTime * 0.04;
      particles.rotation.x = Math.sin(elapsedTime * 0.03) * 0.05;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    // 7. IntersectionObserver to pause loop when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          isVisible = true;
          if (!animationFrameId) {
            clock.start();
            renderLoop();
          }
        } else {
          isVisible = false;
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 8. Cleanup
    return () => {
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      geometry.dispose();
      material.dispose();
      pointTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [reduced]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    />
  );
}
