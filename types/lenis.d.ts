declare module "lenis" {
  export interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    orientation?: "vertical" | "horizontal";
    gestureOrientation?: "vertical" | "horizontal";
    smoothWheel?: boolean;
    wheelMultiplier?: number;
    touchMultiplier?: number;
    [key: string]: unknown;
  }
  export default class Lenis {
    constructor(options?: LenisOptions);
    raf(time: number): void;
    destroy(): void;
    scrollTo(
      target: HTMLElement | string | number,
      options?: { offset?: number; immediate?: boolean; [key: string]: unknown }
    ): void;
    on(event: string, callback: (...args: unknown[]) => void): void;
    off(event: string, callback: (...args: unknown[]) => void): void;
  }
}
