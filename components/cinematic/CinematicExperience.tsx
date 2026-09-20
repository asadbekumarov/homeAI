"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { CHAPTERS, VIDEO_SRC } from "./types";
import { CinematicVideo } from "./CinematicVideo";
import { IntroOverlay } from "./IntroOverlay";
import { ProgressIndicator } from "./ProgressIndicator";
import { ApartmentCTA } from "./ApartmentCTA";

// Register ScrollTrigger safely in browser context
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Reduced motion listener without cascading React renders
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
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Preloader DOM references for zero-render DOM writes
  const preloaderRef = useRef<HTMLDivElement | null>(null);
  const preloaderPercentRef = useRef<HTMLSpanElement | null>(null);
  const preloaderBarRef = useRef<HTMLDivElement | null>(null);

  // Lenis instance reference
  const lenisRef = useRef<Lenis | null>(null);

  // Video duration and readiness tracking
  const durationRef = useRef<number>(8.0);
  const isMetadataLoadedRef = useRef<boolean>(false);
  const isCanPlayRef = useRef<boolean>(false);
  const isExperienceReadyRef = useRef<boolean>(false);
  const primedRef = useRef<boolean>(false);

  // Master Progress & Scrub engine references (Zero React state during scroll)
  const masterProgressRef = useRef<number>(0);
  const activeChapterIndexRef = useRef<number>(0);
  const targetTimeRef = useRef<number>(0);
  const lerpedTimeRef = useRef<number>(0);

  // Reduced motion preference
  const isReducedMotion = React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Reduced motion active chapter for accessible tabbed view
  const [rmActiveChapter, setRmActiveChapter] = useState<number>(0);
  const rmVideoRef = useRef<HTMLVideoElement | null>(null);

  // Unlock and fade preloader
  const finishPreloader = useCallback(() => {
    if (isExperienceReadyRef.current) return;
    isExperienceReadyRef.current = true;

    if (preloaderPercentRef.current) {
      preloaderPercentRef.current.textContent = "100%";
    }
    if (preloaderBarRef.current) {
      preloaderBarRef.current.style.width = "100%";
    }

    if (preloaderRef.current) {
      gsap.to(preloaderRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          if (preloaderRef.current) {
            preloaderRef.current.style.display = "none";
          }
        },
      });
    }

    // Refresh ScrollTrigger once preloader dissolves
    ScrollTrigger.refresh();
  }, []);

  // Update Preloader progress DOM directly without React re-renders
  const updatePreloaderProgress = useCallback(() => {
    if (isExperienceReadyRef.current) return;

    let progress = 0;
    if (isMetadataLoadedRef.current) progress += 50;
    if (isCanPlayRef.current) progress += 50;

    if (preloaderPercentRef.current) {
      preloaderPercentRef.current.textContent = `${progress.toString().padStart(2, "0")}%`;
    }
    if (preloaderBarRef.current) {
      preloaderBarRef.current.style.width = `${progress}%`;
    }

    if (isCanPlayRef.current && !isExperienceReadyRef.current) {
      finishPreloader();
    }
  }, [finishPreloader]);

  // iOS/Safari priming: play & pause on first gesture or load so decoder initializes
  const primeVideos = useCallback(() => {
    if (primedRef.current) return;
    primedRef.current = true;
    const video = videoRef.current;
    if (video) {
      const promise = video.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            video.pause();
            video.currentTime = 0;
          })
          .catch(() => {
            // Ignore gesture requirement; event listeners will retry
          });
      }
    }
  }, []);

  // Preloader timeout fallback (~8s per specification)
  useEffect(() => {
    const timer = setTimeout(() => {
      finishPreloader();
    }, 8000);

    return () => clearTimeout(timer);
  }, [finishPreloader]);

  // Video event handlers
  const handleLoadedMetadata = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const duration = e.currentTarget.duration;
      if (duration && !isNaN(duration) && duration > 0) {
        durationRef.current = duration;
      }
      isMetadataLoadedRef.current = true;
      updatePreloaderProgress();
    },
    [updatePreloaderProgress]
  );

  const handleCanPlay = useCallback(() => {
    const video = videoRef.current;
    if (video && video.readyState >= 3) {
      isCanPlayRef.current = true;
      updatePreloaderProgress();
    }
  }, [updatePreloaderProgress]);

  const handleProgress = useCallback(() => {
    const video = videoRef.current;
    if (video && video.readyState >= 3 && !isExperienceReadyRef.current) {
      isCanPlayRef.current = true;
      updatePreloaderProgress();
    }
  }, [updatePreloaderProgress]);

  // Setup gesture priming
  useEffect(() => {
    const handleFirstGesture = () => {
      primeVideos();
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("wheel", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };

    window.addEventListener("touchstart", handleFirstGesture, { passive: true });
    window.addEventListener("pointerdown", handleFirstGesture, { passive: true });
    window.addEventListener("wheel", handleFirstGesture, { passive: true });
    window.addEventListener("keydown", handleFirstGesture, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("wheel", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };
  }, [primeVideos]);

  // Frame calculation for target time and UI updates (Direct DOM writes)
  const computeFrame = useCallback((p: number) => {
    const dur = durationRef.current || 8.0;
    const safeDur = Math.max(0.1, dur - 0.04);

    // Target time across the continuous timeline
    targetTimeRef.current = Math.max(0, Math.min(safeDur, p * safeDur));

    // Intro Overlay Fade: fades out over first 5% (0% to 5%)
    if (introRef.current) {
      const introOpacity = Math.max(0, 1 - p / 0.05);
      const introStr = introOpacity.toFixed(3);
      if (introRef.current.style.opacity !== introStr) {
        introRef.current.style.opacity = introStr;
        introRef.current.style.pointerEvents = introOpacity > 0.01 ? "auto" : "none";
        introRef.current.style.visibility = introOpacity <= 0.001 ? "hidden" : "visible";
      }
    }

    // HUD Progress Percentage & Progress Bar (Written directly to DOM)
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

    // Chapter HUD Highlight (01, 02, 03, 04)
    const activeIdx = Math.min(3, Math.max(0, Math.floor(p / 0.25)));
    if (activeIdx !== activeChapterIndexRef.current) {
      activeChapterIndexRef.current = activeIdx;
      chapterRefs.current.forEach((btn, idx) => {
        if (!btn) return;
        const line = btn.querySelector("span:first-child") as HTMLElement;
        if (idx === activeIdx) {
          btn.className =
            "flex items-center gap-2 md:gap-2.5 text-left text-[9px] md:text-xs tracking-[0.25em] uppercase transition-all duration-300 group cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c8b28a] px-1 py-0.5 text-white font-medium translate-x-1";
          if (line) {
            line.className = "h-[1px] transition-all duration-300 w-3 bg-[#c8b28a]";
          }
        } else {
          btn.className =
            "flex items-center gap-2 md:gap-2.5 text-left text-[9px] md:text-xs tracking-[0.25em] uppercase transition-all duration-300 group cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c8b28a] px-1 py-0.5 text-neutral-500 font-light translate-x-0 hover:text-neutral-300";
          if (line) {
            line.className =
              "h-[1px] transition-all duration-300 w-1 bg-neutral-600 group-hover:w-2 group-hover:bg-neutral-400";
          }
        }
      });
    }

    // Apartment CTA Section: Fades in between 75% and 100%
    if (apartmentCtaRef.current) {
      let ctaOpacity = 0;
      if (p >= 0.75) {
        ctaOpacity = Math.min(1, (p - 0.75) / 0.08);
      }
      const ctaStr = ctaOpacity.toFixed(3);
      if (apartmentCtaRef.current.style.opacity !== ctaStr) {
        apartmentCtaRef.current.style.opacity = ctaStr;
        apartmentCtaRef.current.style.pointerEvents = ctaOpacity > 0.02 ? "auto" : "none";
        apartmentCtaRef.current.style.visibility = ctaOpacity <= 0.001 ? "hidden" : "visible";
      }
    }
  }, []);

  // Main GSAP Ticker & ScrollTrigger Engine Setup
  useEffect(() => {
    if (isReducedMotion) return;

    // Single Lenis instance (autoRaf: false) driven by gsap.ticker
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      smoothWheel: true,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;

    // Drive ScrollTrigger from Lenis
    lenis.on("scroll", ScrollTrigger.update);

    const container = containerRef.current;
    const pin = pinRef.current;
    if (!container || !pin) return;

    // Responsive scroll height: ~600vh on desktop, ≈450vh on mobile
    const isMobile = window.innerWidth < 768;
    container.style.height = isMobile ? "450vh" : "600vh";

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      pin: pin,
      scrub: true, // Lenis already smooths, scrub: true keeps tight sync
      anticipatePin: 1,
      onUpdate: (self) => {
        masterProgressRef.current = self.progress;
        computeFrame(self.progress);
      },
    });

    // Single GSAP ticker callback: drives Lenis AND lerps video currentTime
    const tickerCallback = (time: number) => {
      // 1. Step Lenis
      lenis.raf(time * 1000);

      // 2. Lerp video currentTime toward targetTime (~0.15–0.2 factor)
      const video = videoRef.current;
      if (!video) return;

      const target = targetTimeRef.current;
      // Lerp factor ~0.18
      lerpedTimeRef.current += (target - lerpedTimeRef.current) * 0.18;

      const delta = lerpedTimeRef.current - video.currentTime;

      // Skip write if |delta| < ~0.01s or video.seeking is true
      if (Math.abs(delta) >= 0.01 && !video.seeking) {
        video.currentTime = lerpedTimeRef.current;
      }
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Initial frame pass
    computeFrame(0);

    // React Strict Mode double mount safety & unmount cleanup
    return () => {
      gsap.ticker.remove(tickerCallback);
      st.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isReducedMotion, computeFrame]);

  // Handle Chapter click navigation via Lenis
  const handleChapterClick = useCallback((index: number) => {
    if (!lenisRef.current || !containerRef.current) return;
    const chapter = CHAPTERS[index];
    const totalScrollable =
      containerRef.current.scrollHeight - window.innerHeight;
    const targetScroll = chapter.startProgress * totalScrollable;
    lenisRef.current.scrollTo(targetScroll, {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  }, []);

  const handleExploreClick = useCallback(() => {
    handleChapterClick(1);
  }, [handleChapterClick]);

  // Reduced motion mode fallback: no pinning/scrubbing, normal controllable video players + CTA
  if (isReducedMotion) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-between p-6 md:p-12">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <header className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-white font-medium block">
                THE BUILDING / RESIDENCES
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#c8b28a] uppercase mt-1 block">
                Reduced Motion Presentation
              </span>
            </div>
            <span className="text-xs font-mono tracking-widest text-neutral-400">
              0{rmActiveChapter + 1} / 04
            </span>
          </header>

          {/* Normal controllable player (controls, no autoplay) */}
          <div className="relative aspect-video w-full bg-black border border-white/10 overflow-hidden mb-6">
            <video
              ref={rmVideoRef}
              src={VIDEO_SRC}
              controls
              playsInline
              className="w-full h-full object-cover"
              aria-label={CHAPTERS[rmActiveChapter].title}
            />
          </div>

          {/* Chapter Selector Tabs */}
          <nav
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
            aria-label="Select architectural chapter"
          >
            {CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => {
                  setRmActiveChapter(idx);
                  if (rmVideoRef.current) {
                    const dur = rmVideoRef.current.duration || 8.0;
                    rmVideoRef.current.currentTime = ch.startProgress * dur;
                  }
                }}
                className={`p-3 text-left border text-xs tracking-wider transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c8b28a] ${
                  rmActiveChapter === idx
                    ? "border-[#c8b28a] bg-white/5 text-white font-medium"
                    : "border-white/10 text-neutral-400 hover:border-white/30 hover:text-white"
                }`}
              >
                <span className="text-[10px] block opacity-60 text-[#c8b28a]">
                  {ch.code}
                </span>
                <span className="mt-1 block uppercase">{ch.title}</span>
              </button>
            ))}
          </nav>

          {/* Apartment CTA Callout */}
          <div className="p-6 border border-white/10 bg-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#c8b28a] block">
                FEATURED RESIDENCE
              </span>
              <h2 className="text-lg uppercase tracking-[0.2em] text-white font-light mt-1">
                YOUR SPACE
              </h2>
              <p className="text-xs text-neutral-400 font-light mt-1">
                Explore the featured residence.
              </p>
            </div>
            <button
              onClick={() => {
                const btn = apartmentCtaRef.current?.querySelector("button");
                btn?.click();
              }}
              className="px-6 py-2.5 border border-[#c8b28a]/60 text-xs tracking-[0.2em] uppercase hover:bg-[#c8b28a] hover:text-black transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c8b28a]"
            >
              Request Private Viewing
            </button>
          </div>
        </div>

        {/* Hidden modal instance for dialog opening in reduced motion */}
        <ApartmentCTA ref={apartmentCtaRef} />
      </div>
    );
  }

  return (
    <>
      {/* Editorial Preloader */}
      <div
        ref={preloaderRef}
        className="fixed inset-0 z-50 bg-[#050505] flex flex-col justify-between p-8 md:p-16 select-none"
        role="status"
        aria-live="polite"
      >
        {/* Top Preloader Brand */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.3em] text-white font-light">
            THE BUILDING
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#c8b28a]">
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
            <span>PREPARING THE EXPERIENCE</span>
            <span ref={preloaderPercentRef}>00%</span>
          </div>
          <div className="w-full h-[1px] bg-white/10 overflow-hidden">
            <div
              ref={preloaderBarRef}
              className="h-full bg-[#c8b28a] transition-all duration-300 origin-left"
              style={{ width: "0%" }}
            />
          </div>
        </div>
      </div>

      {/* Main Pinned Cinematic Track (~600vh desktop, ≈450vh mobile, overflow-x: clip) */}
      <main
        ref={containerRef}
        className="relative w-full bg-[#050505] overflow-x-clip"
        style={{ height: "600vh" }}
      >
        {/* Pinned Viewport (height: 100svh) */}
        <div
          ref={pinRef}
          className="relative w-full h-[100svh] overflow-hidden select-none"
        >
          {/* HTML5 Video with responsive focal alignment */}
          <CinematicVideo
            videoRef={videoRef}
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={handleCanPlay}
            onProgress={handleProgress}
          />

          {/* Intro Hero Overlay (0% to 5%) */}
          <IntroOverlay ref={introRef} onExploreClick={handleExploreClick} />

          {/* Editorial HUD */}
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
