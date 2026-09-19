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
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Lenis instance reference
  const lenisRef = useRef<Lenis | null>(null);

  // Video durations and loading tracking
  const durationsRef = useRef<number[]>([10.0, 10.0, 9.96, 8.62]);
  const loadedCountRef = useRef<number>(0);

  // Scrub & RAF tracking (NO React state during scroll)
  const masterProgressRef = useRef<number>(0);
  const activeChapterIndexRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const lastProgressRef = useRef<number>(-1);

  // Seek queue to avoid dropping frames or interrupting browser video decoder
  const isSeekingRef = useRef<boolean[]>([false, false, false, false]);
  const lastSeekTimeRef = useRef<number[]>([0, 0, 0, 0]);
  const targetTimeRef = useRef<number[]>([0, 0, 0, 0]);

  // Preloader and Reduced Motion states
  const isReducedMotion = React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const [loadingPercent, setLoadingPercent] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);

  // Reduced motion active chapter (only used when reduced motion is preferred)
  const [rmActiveChapter, setRmActiveChapter] = useState<number>(0);
  const [rmIsPlaying, setRmIsPlaying] = useState<boolean>(false);

  // Handle video metadata loading
  const handleMetadata = useCallback((index: number, duration: number) => {
    if (duration && !isNaN(duration) && duration > 0) {
      durationsRef.current[index] = duration;
    }
    loadedCountRef.current += 1;
    const progress = Math.min(
      100,
      Math.round((loadedCountRef.current / 4) * 100)
    );
    setLoadingPercent(progress);
    if (progress >= 100) {
      setTimeout(() => setIsReady(true), 300);
    }
  }, []);

  const handleCanPlay = useCallback((index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (index === 0) {
        video.currentTime = 0;
      }
    }
  }, []);

  const handleSeeked = useCallback((index: number) => {
    isSeekingRef.current[index] = false;
    const video = videoRefs.current[index];
    if (!video) return;
    const target = targetTimeRef.current[index];
    if (Math.abs(video.currentTime - target) > 0.02) {
      isSeekingRef.current[index] = true;
      lastSeekTimeRef.current[index] = performance.now();
      video.currentTime = target;
    }
  }, []);

  // Preloader fallback timer: ensures experience starts even if events are throttled
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingPercent(100);
      setIsReady(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  // Direct DOM and Video seek updates (Zero React re-renders)
  const applyFrameUpdates = useCallback((p: number) => {
    const now = performance.now();

    // 1. Update Video Playback and Opacity
    // Each video is mapped so that it plays all the way from 0.0 to its full duration,
    // holding the completed frame at the transition while crossfading seamlessly into the next.
    for (let i = 0; i < 4; i++) {
      const video = videoRefs.current[i];
      if (!video) continue;

      const duration = durationsRef.current[i] || 10.0;
      // Clamp to safe end frame to ensure the final frame is rendered without triggering video ended freeze
      const safeDuration = Math.max(0.1, duration - 0.04);

      let targetTime = 0;
      let opacity = 0;

      if (i === 0) {
        // Video 1: Construction -> Completed Building (0.00 to 0.25)
        // Plays fully from 0.0 to 10.0s over [0.00, 0.22]
        if (p <= 0.22) {
          targetTime = (p / 0.22) * safeDuration;
          opacity = 1;
        } else if (p < 0.25) {
          targetTime = safeDuration; // Hold completed building frame during crossfade
          opacity = (0.25 - p) / 0.03;
        } else {
          targetTime = safeDuration;
          opacity = 0;
        }
      } else if (i === 1) {
        // Video 2: Entrance -> Grand Lobby (0.25 to 0.50)
        // Plays fully from 0.0 to 10.0s over [0.25, 0.47]
        if (p < 0.22) {
          targetTime = 0;
          opacity = 0;
        } else if (p < 0.25) {
          targetTime = 0; // Primed at first frame while fading in
          opacity = (p - 0.22) / 0.03;
        } else if (p <= 0.47) {
          targetTime = ((p - 0.25) / 0.22) * safeDuration;
          opacity = 1;
        } else if (p < 0.50) {
          targetTime = safeDuration; // Hold completed lobby frame during crossfade
          opacity = (0.50 - p) / 0.03;
        } else {
          targetTime = safeDuration;
          opacity = 0;
        }
      } else if (i === 2) {
        // Video 3: Lobby -> Corridor -> Several Rooms (0.50 to 0.75)
        // Plays fully from 0.0 to 9.96s over [0.50, 0.72]
        if (p < 0.47) {
          targetTime = 0;
          opacity = 0;
        } else if (p < 0.50) {
          targetTime = 0; // Primed at first frame while fading in
          opacity = (p - 0.47) / 0.03;
        } else if (p <= 0.72) {
          targetTime = ((p - 0.50) / 0.22) * safeDuration;
          opacity = 1;
        } else if (p < 0.75) {
          targetTime = safeDuration; // Hold completed corridor frame during crossfade
          opacity = (0.75 - p) / 0.03;
        } else {
          targetTime = safeDuration;
          opacity = 0;
        }
      } else if (i === 3) {
        // Video 4: Corridor -> Featured Apartment (0.75 to 1.00)
        // Plays fully from 0.0 to 8.62s over [0.75, 0.96]
        if (p < 0.72) {
          targetTime = 0;
          opacity = 0;
        } else if (p < 0.75) {
          targetTime = 0; // Primed at first frame while fading in
          opacity = (p - 0.72) / 0.03;
        } else if (p <= 0.96) {
          targetTime = ((p - 0.75) / 0.21) * safeDuration;
          opacity = 1;
        } else {
          targetTime = safeDuration; // Hold completed apartment interior frame
          opacity = 1;
        }
      }

      targetTime = Math.max(0, Math.min(safeDuration, targetTime));
      targetTimeRef.current[i] = targetTime;

      // Apply opacity and visibility
      const opacityClamped = Math.max(0, Math.min(1, opacity));
      const opacityStr = opacityClamped.toFixed(3);
      if (video.style.opacity !== opacityStr) {
        video.style.opacity = opacityStr;
        video.style.visibility = opacityClamped > 0.001 ? "visible" : "hidden";
      }

      // Seek video with watchdog queue: avoids interrupting decoder while ensuring immediate updates
      const isRelevant =
        opacityClamped > 0.001 ||
        (p >= i * 0.25 - 0.05 && p <= (i + 1) * 0.25 + 0.05);

      if (isRelevant) {
        // Watchdog: reset seeking lock if browser took longer than 100ms without firing seeked
        if (
          isSeekingRef.current[i] &&
          now - lastSeekTimeRef.current[i] > 100
        ) {
          isSeekingRef.current[i] = false;
        }

        if (!isSeekingRef.current[i]) {
          if (Math.abs(video.currentTime - targetTime) > 0.02) {
            isSeekingRef.current[i] = true;
            lastSeekTimeRef.current[i] = now;
            video.currentTime = targetTime;
          }
        }
      } else if (p < i * 0.25 && video.currentTime !== 0) {
        video.currentTime = 0;
      } else if (
        p > (i + 1) * 0.25 &&
        Math.abs(video.currentTime - safeDuration) > 0.05
      ) {
        video.currentTime = safeDuration;
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

          {/* Video Player */}
          <div className="relative aspect-video w-full bg-black border border-white/10 overflow-hidden mb-6">
            <video
              key={rmActiveChapter}
              src={CHAPTERS[rmActiveChapter].src}
              controls
              playsInline
              className="w-full h-full object-cover"
              autoPlay={rmIsPlaying}
            />
          </div>

          {/* Chapter Selector Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => {
                  setRmActiveChapter(idx);
                  setRmIsPlaying(true);
                }}
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
              <span>LOADING ASSETS</span>
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

      {/* Main Pinned Cinematic Track (1200vh total scroll distance for complete, unhurried video playback) */}
      <main
        ref={containerRef}
        className="relative w-full bg-[#050505] overflow-x-hidden"
        style={{ height: "1200vh" }}
      >
        {/* Cinematic Pinned Viewport */}
        <div
          ref={pinRef}
          className="relative w-full h-screen overflow-hidden select-none"
        >
          {/* 4 HTML5 Videos */}
          <CinematicVideo
            videoRefs={videoRefs}
            onLoadedMetadata={handleMetadata}
            onCanPlay={handleCanPlay}
            onSeeked={handleSeeked}
          />

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
