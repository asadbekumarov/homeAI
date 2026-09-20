"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { CHAPTERS } from "./types";
import { CinematicVideo } from "./CinematicVideo";
import { IntroOverlay } from "./IntroOverlay";
import { ProgressIndicator } from "./ProgressIndicator";
import { ApartmentCTA } from "./ApartmentCTA";

// Register ScrollTrigger safely in browser context
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Hook for accessible reduced-motion preference without cascading renders
function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

export const CinematicExperience: React.FC = () => {
  // DOM element references
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const percentageRef = useRef<HTMLSpanElement | null>(null);
  const trackBarRef = useRef<HTMLDivElement | null>(null);
  const apartmentCtaRef = useRef<HTMLDivElement | null>(null);
  const chapterRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Lenis instance reference
  const lenisRef = useRef<Lenis | null>(null);

  // Scrub & RAF tracking (NO React state during scroll)
  const masterProgressRef = useRef<number>(0);
  const activeChapterIndexRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const lastProgressRef = useRef<number>(-1);

  // Preloader and Reduced Motion states
  const isReducedMotion = React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const [loadingPercent, setLoadingPercent] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);

  // Reduced motion active chapter
  const [rmActiveChapter, setRmActiveChapter] = useState<number>(0);

  // Clean, lightweight preloader
  useEffect(() => {
    const step1 = setTimeout(() => setLoadingPercent(50), 100);
    const step2 = setTimeout(() => setLoadingPercent(100), 400);
    const readyTimer = setTimeout(() => setIsReady(true), 600);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(readyTimer);
    };
  }, []);

  // Direct DOM updates (Zero React re-renders)
  const applyFrameUpdates = useCallback((p: number) => {
    // 1. Update Chapter Layers Opacity (0.00 to 1.00)
    for (let i = 0; i < 4; i++) {
      const layer = layerRefs.current[i];
      if (!layer) continue;

      let opacity = 0;

      if (i === 0) {
        // Chapter 1: 0.00 to 0.25 (crossfade out at 0.22 - 0.25)
        if (p <= 0.22) {
          opacity = 1;
        } else if (p < 0.25) {
          opacity = (0.25 - p) / 0.03;
        } else {
          opacity = 0;
        }
      } else if (i === 1) {
        // Chapter 2: 0.25 to 0.50 (crossfade in at 0.22 - 0.25, out at 0.47 - 0.50)
        if (p < 0.22) {
          opacity = 0;
        } else if (p < 0.25) {
          opacity = (p - 0.22) / 0.03;
        } else if (p <= 0.47) {
          opacity = 1;
        } else if (p < 0.50) {
          opacity = (0.50 - p) / 0.03;
        } else {
          opacity = 0;
        }
      } else if (i === 2) {
        // Chapter 3: 0.50 to 0.75 (crossfade in at 0.47 - 0.50, out at 0.72 - 0.75)
        if (p < 0.47) {
          opacity = 0;
        } else if (p < 0.50) {
          opacity = (p - 0.47) / 0.03;
        } else if (p <= 0.72) {
          opacity = 1;
        } else if (p < 0.75) {
          opacity = (0.75 - p) / 0.03;
        } else {
          opacity = 0;
        }
      } else if (i === 3) {
        // Chapter 4: 0.75 to 1.00 (crossfade in at 0.72 - 0.75, stays visible)
        if (p < 0.72) {
          opacity = 0;
        } else if (p < 0.75) {
          opacity = (p - 0.72) / 0.03;
        } else {
          opacity = 1;
        }
      }

      const opacityClamped = Math.max(0, Math.min(1, opacity));
      const opacityStr = opacityClamped.toFixed(3);
      if (layer.style.opacity !== opacityStr) {
        layer.style.opacity = opacityStr;
        layer.style.visibility = opacityClamped > 0.001 ? "visible" : "hidden";
      }
    }

    // 2. Intro Overlay Fade (0% to 5%)
    if (introRef.current) {
      const introOpacity = Math.max(0, 1 - p / 0.05);
      introRef.current.style.opacity = introOpacity.toFixed(3);
      introRef.current.style.pointerEvents =
        introOpacity > 0.02 ? "auto" : "none";
      introRef.current.style.visibility =
        introOpacity <= 0.001 ? "hidden" : "visible";
    }

    // 3. HUD Progress Percentage & Progress Bar
    const pct = Math.min(100, Math.max(0, Math.round(p * 100)));
    if (percentageRef.current) {
      const formattedPct = `${pct.toString().padStart(2, "0")}%`;
      if (percentageRef.current.textContent !== formattedPct) {
        percentageRef.current.textContent = formattedPct;
      }
    }
    if (trackBarRef.current) {
      trackBarRef.current.style.width = `${pct}%`;
    }

    // 4. Chapter Highlighting
    const activeIndex = Math.min(3, Math.max(0, Math.floor(p / 0.25)));
    if (activeIndex !== activeChapterIndexRef.current) {
      activeChapterIndexRef.current = activeIndex;
      chapterRefs.current.forEach((btn, idx) => {
        if (!btn) return;
        const line = btn.querySelector("span:first-child") as HTMLElement;
        if (idx === activeIndex) {
          btn.className =
            "flex items-center gap-2.5 text-left text-[10px] md:text-xs tracking-[0.25em] uppercase transition-all duration-300 group cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/40 px-1 py-0.5 rounded-sm text-white font-medium translate-x-1";
          if (line) {
            line.className =
              "h-[1px] transition-all duration-300 w-3 bg-white";
          }
        } else {
          btn.className =
            "flex items-center gap-2.5 text-left text-[10px] md:text-xs tracking-[0.25em] uppercase transition-all duration-300 group cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/40 px-1 py-0.5 rounded-sm text-neutral-500 font-light translate-x-0 hover:text-neutral-300";
          if (line) {
            line.className =
              "h-[1px] transition-all duration-300 w-1 bg-neutral-600 group-hover:w-2 group-hover:bg-neutral-400";
          }
        }
      });
    }

    // 5. Apartment CTA Section (Fades in between 76% and 84%)
    if (apartmentCtaRef.current) {
      let ctaOpacity = 0;
      if (p >= 0.76) {
        ctaOpacity = Math.min(1, (p - 0.76) / 0.08);
      }
      apartmentCtaRef.current.style.opacity = ctaOpacity.toFixed(3);
      apartmentCtaRef.current.style.pointerEvents =
        ctaOpacity > 0.05 ? "auto" : "none";
      apartmentCtaRef.current.style.visibility =
        ctaOpacity <= 0.001 ? "hidden" : "visible";
    }
  }, []);

  // Main ScrollTrigger & Lenis Setup
  useEffect(() => {
    if (isReducedMotion || !isReady) return;

    // Initialize Lenis
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // Connect Lenis to ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Integrate Lenis with GSAP Ticker
    const tickerUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    // GSAP ScrollTrigger pinning container
    const container = containerRef.current;
    const pin = pinRef.current;

    if (!container || !pin) return;

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      pin: pin,
      scrub: 0.5,
      anticipatePin: 1,
      onUpdate: (self) => {
        masterProgressRef.current = self.progress;
      },
    });

    // High performance RAF render loop
    const renderLoop = () => {
      const p = masterProgressRef.current;
      if (Math.abs(p - lastProgressRef.current) > 0.0001) {
        applyFrameUpdates(p);
        lastProgressRef.current = p;
      }
      rafIdRef.current = requestAnimationFrame(renderLoop);
    };
    rafIdRef.current = requestAnimationFrame(renderLoop);

    // Initial frame pass
    applyFrameUpdates(0);

    // Cleanup
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      gsap.ticker.remove(tickerUpdate);
      st.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isReady, isReducedMotion, applyFrameUpdates]);

  // Chapter Navigation click handler
  const handleChapterClick = useCallback((index: number) => {
    if (!lenisRef.current || !containerRef.current) return;
    const chapter = CHAPTERS[index];
    const totalScrollable =
      containerRef.current.scrollHeight - window.innerHeight;
    const targetScroll = chapter.startProgress * totalScrollable;
    lenisRef.current.scrollTo(targetScroll, {
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  }, []);

  const handleExploreClick = useCallback(() => {
    handleChapterClick(1);
  }, [handleChapterClick]);

  // Fallback for prefers-reduced-motion
  if (isReducedMotion) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 md:p-12">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white/15 pb-6 mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-white font-medium block">
                THE BUILDING / RESIDENCES
              </span>
              <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase mt-1 block">
                Reduced Motion Presentation
              </span>
            </div>
            <span className="text-xs font-mono tracking-widest text-neutral-400">
              0{rmActiveChapter + 1} / 04
            </span>
          </div>

          {/* Chapter Details Card */}
          <div className="relative aspect-video w-full bg-black border border-white/10 flex flex-col items-center justify-center p-8 mb-6">
            <span className="text-xs tracking-[0.3em] text-neutral-400 uppercase mb-2">
              CHAPTER {CHAPTERS[rmActiveChapter].code}
            </span>
            <h2 className="text-3xl md:text-4xl font-light tracking-[0.2em] text-white uppercase mb-4 text-center">
              {CHAPTERS[rmActiveChapter].title}
            </h2>
            <p className="text-xs md:text-sm text-neutral-400 text-center max-w-md font-light">
              {CHAPTERS[rmActiveChapter].description}
            </p>
          </div>

          {/* Chapter Selector Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => setRmActiveChapter(idx)}
                className={`p-3 text-left border text-xs tracking-wider transition-colors cursor-pointer ${
                  rmActiveChapter === idx
                    ? "border-white bg-white/10 text-white font-medium"
                    : "border-white/15 text-neutral-400 hover:border-white/40 hover:text-white"
                }`}
              >
                <span className="text-[10px] block opacity-60">{ch.code}</span>
                <span className="mt-1 block">{ch.title}</span>
              </button>
            ))}
          </div>

          {/* Apartment Callout for final chapter */}
          {rmActiveChapter === 3 && (
            <div className="p-6 border border-white/15 bg-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 block">
                  Featured Residence
                </span>
                <h3 className="text-lg uppercase tracking-[0.2em] text-white font-light mt-1">
                  YOUR SPACE
                </h3>
              </div>
              <button
                onClick={() => {
                  const btn = apartmentCtaRef.current?.querySelector("button");
                  btn?.click();
                }}
                className="px-6 py-2.5 border border-white/40 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all"
              >
                Request Private Viewing
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Luxury Editorial Preloader */}
      {!isReady && (
        <div
          className={`fixed inset-0 z-50 bg-[#050505] flex flex-col justify-between p-8 md:p-16 transition-opacity duration-700 select-none ${
            loadingPercent >= 100 ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          role="status"
          aria-live="polite"
        >
          {/* Top Preloader Brand */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.3em] text-white font-light">
              THE BUILDING
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
              RESIDENCES
            </span>
          </div>

          {/* Center Title */}
          <div className="max-w-md mx-auto text-center flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-400 mb-3 block font-light">
              PREPARING THE EXPERIENCE
            </span>
            <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] text-white uppercase">
              CINEMATIC ARCHITECTURAL JOURNEY
            </h2>
          </div>

          {/* Bottom Loading Indicator */}
          <div className="w-full flex flex-col gap-3">
            <div className="flex justify-between items-center text-[11px] font-mono tracking-widest text-neutral-400">
              <span>INITIALIZING</span>
              <span>{loadingPercent.toString().padStart(2, "0")}%</span>
            </div>
            <div className="w-full h-[1px] bg-white/10 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300 origin-left"
                style={{ width: `${loadingPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Pinned Cinematic Track (500vh total scroll distance) */}
      <main
        ref={containerRef}
        className="relative w-full bg-[#050505] overflow-x-hidden"
        style={{ height: "500vh" }}
      >
        {/* Cinematic Pinned Viewport */}
        <div
          ref={pinRef}
          className="relative w-full h-screen overflow-hidden select-none"
        >
          {/* Visual Chapter Layers Template */}
          <CinematicVideo layerRefs={layerRefs} />

          {/* Beginning Intro Hero Overlay (0% to 5%) */}
          <IntroOverlay ref={introRef} onExploreClick={handleExploreClick} />

          {/* Subtle Editorial HUD */}
          <ProgressIndicator
            percentageRef={percentageRef}
            trackBarRef={trackBarRef}
            chapterRefs={chapterRefs}
            onChapterClick={handleChapterClick}
          />

          {/* Featured Residence Apartment CTA (75% to 100%) */}
          <ApartmentCTA ref={apartmentCtaRef} />
        </div>
      </main>
    </>
  );
};
