"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis | null;
  }
}

/** True if the primary input is touch-based (phones, tablets). */
function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafHandle = useRef<number>(0);

  useEffect(() => {
    // On touch/mobile devices, native scroll momentum is smoother for
    // scrollytelling. Skip Lenis to avoid fighting the video-scrub RAF loop.
    if (isTouchDevice()) {
      window.__lenis = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafHandle.current = requestAnimationFrame(raf);
    }

    rafHandle.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafHandle.current);
      window.__lenis = null;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
