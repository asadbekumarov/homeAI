"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Loader2,
  Play,
  Pause,
  X,
  Sparkles,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

import { useProject } from "@/context/ProjectContext";

export interface ChapterItem {
  code: string;
  title: string;
  subtitle: string;
  target: number;
}

export const HERO_CHAPTERS: ChapterItem[] = [
  { code: "01", title: "Me'moriy Kontseptsiya", subtitle: "Komfort va Biznes klass uyg'unligi", target: 0.0 },
  { code: "02", title: "Muhtasham Saroy Servis", subtitle: "24/7 xavfsizlik va konsyerj", target: 0.28 },
  { code: "03", title: "Xavfsiz Yashil Hudud", subtitle: "Maxsus landshaft va osoyishtalik", target: 0.58 },
  { code: "04", title: "Zamonaviy Xonadonlar", subtitle: "Orzularingizdagi qulay rejalashtirish", target: 0.88 },
];

export default function HeroSection() {
  const { currentProject } = useProject();
  const chapters = currentProject?.chapters || HERO_CHAPTERS;
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const theaterVideoRef = useRef<HTMLVideoElement>(null);
  const theaterModalRef = useRef<HTMLDivElement>(null);
  const theaterCloseBtnRef = useRef<HTMLButtonElement>(null);
  const theaterTriggerRef = useRef<HTMLButtonElement | null>(null);

  // States
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const [isTheaterOpen, setIsTheaterOpen] = useState(false);

  // High-performance DOM & Animation Refs (Zero React re-render overhead on scroll)
  const currentTimeRef = useRef(0);
  const rafId = useRef<number>(0);
  const isPlayingAutoRef = useRef(false);
  const introOverlayRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const isHudVisibleRef = useRef(false);
  const activeChapterIndexRef = useRef(0);

  // Sync auto-play ref
  useEffect(() => {
    isPlayingAutoRef.current = isPlayingAuto;
  }, [isPlayingAuto]);

  // Audio persistence from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("palisades_muted");
      if (saved !== null) {
        const val = saved === "true";
        if (videoRef.current) {
          videoRef.current.muted = val;
        }
        queueMicrotask(() => {
          setIsMuted(val);
        });
      }
    } catch {}
  }, []);


  // Video metadata loading and ready detection
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncReady = () => {
      if (video.duration && !isNaN(video.duration) && video.duration > 0) {
        setVideoDuration(video.duration);
        setVideoReady(true);
        setVideoError(false);

        // Sync initial time with current scroll position
        if (sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          const scrollDistance = Math.max(1, sectionRef.current.offsetHeight - window.innerHeight);
          const scrollProgress = Math.min(1, Math.max(0, -rect.top / scrollDistance));
          const initTime = scrollProgress * video.duration;
          currentTimeRef.current = initTime;
          video.currentTime = initTime;
        }
      }
    };

    const onError = () => {
      setVideoError(true);
      setVideoReady(true);
    };

    if (video.readyState >= 1) {
      syncReady();
    }

    video.addEventListener("loadedmetadata", syncReady);
    video.addEventListener("loadeddata", syncReady);
    video.addEventListener("canplay", syncReady);
    video.addEventListener("error", onError);

    return () => {
      video.removeEventListener("loadedmetadata", syncReady);
      video.removeEventListener("loadeddata", syncReady);
      video.removeEventListener("canplay", syncReady);
      video.removeEventListener("error", onError);
    };
  }, []);

  const handleMetadataLoaded = useCallback(() => {
    const video = videoRef.current;
    if (video && video.duration && !isNaN(video.duration) && video.duration > 0) {
      setVideoDuration(video.duration);
      setVideoReady(true);
      setVideoError(false);

      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollDistance = Math.max(1, sectionRef.current.offsetHeight - window.innerHeight);
        const scrollProgress = Math.min(1, Math.max(0, -rect.top / scrollDistance));
        const initTime = scrollProgress * video.duration;
        currentTimeRef.current = initTime;
        video.currentTime = initTime;
      }
    }
  }, []);

  // Ensure video frame catches up when scrubbing halts
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onSeeked = () => {
      if (isPlayingAutoRef.current) return;
      const diff = Math.abs(video.currentTime - currentTimeRef.current);
      if (diff > 0.02 && !video.seeking) {
        video.currentTime = currentTimeRef.current;
      }
    };

    video.addEventListener("seeked", onSeeked);
    return () => {
      video.removeEventListener("seeked", onSeeked);
    };
  }, []);

  const retryVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    setVideoError(false);
    setVideoReady(false);
    video.load();
  };

  // Cancel auto-play on manual scroll/interaction
  useEffect(() => {
    const cancelAutoPlay = () => {
      if (isPlayingAutoRef.current) {
        setIsPlayingAuto(false);
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Space"].includes(e.code)) {
        cancelAutoPlay();
      }
    };

    window.addEventListener("wheel", cancelAutoPlay, { passive: true });
    window.addEventListener("touchstart", cancelAutoPlay, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", cancelAutoPlay);
      window.removeEventListener("touchstart", cancelAutoPlay);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // 60/120 FPS Butter-Smooth Hardware Scrollytelling Engine
  useEffect(() => {
    if (!videoDuration || !sectionRef.current || !videoRef.current) return;

    const section = sectionRef.current;

    const updateVideoTime = () => {
      const video = videoRef.current;
      if (!video) {
        rafId.current = requestAnimationFrame(updateVideoTime);
        return;
      }

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      // When section is completely outside viewport, pause video and sleep
      if (rect.bottom < 0 || rect.top > viewportHeight) {
        if (!video.paused) {
          video.pause();
        }
        if (isPlayingAutoRef.current) {
          setIsPlayingAuto(false);
        }
        rafId.current = requestAnimationFrame(updateVideoTime);
        return;
      }

      const scrollDistance = Math.max(1, sectionHeight - viewportHeight);
      const scrollProgress = Math.min(1, Math.max(0, -rect.top / scrollDistance));

      // Direct DOM updates for zero lag & zero React re-render overhead
      if (introOverlayRef.current) {
        const introOpacity = Math.max(0, 1 - scrollProgress * 6);
        introOverlayRef.current.style.opacity = introOpacity.toFixed(3);
        introOverlayRef.current.style.transform = `translate3d(0, -${(scrollProgress * 70).toFixed(1)}px, 0)`;
        introOverlayRef.current.style.pointerEvents = introOpacity > 0.05 ? "auto" : "none";
      }


      // HUD Visibility toggle (only modifies DOM classes when crossing boundary)
      const shouldShowHud = scrollProgress > 0.08;
      if (isHudVisibleRef.current !== shouldShowHud) {
        isHudVisibleRef.current = shouldShowHud;
        if (hudRef.current) {
          if (shouldShowHud) {
            hudRef.current.classList.remove("opacity-0", "translate-y-5", "pointer-events-none");
            hudRef.current.classList.add("opacity-100", "translate-y-0", "pointer-events-auto");
            hudRef.current.removeAttribute("aria-hidden");
          } else {
            hudRef.current.classList.remove("opacity-100", "translate-y-0", "pointer-events-auto");
            hudRef.current.classList.add("opacity-0", "translate-y-5", "pointer-events-none");
            hudRef.current.setAttribute("aria-hidden", "true");
          }
        }
      }

      // Determine active chapter (only triggers React state update when chapter changes)
      let chapterIdx = 0;
      if (scrollProgress < 0.25) {
        chapterIdx = 0;
      } else if (scrollProgress < 0.55) {
        chapterIdx = 1;
      } else if (scrollProgress < 0.82) {
        chapterIdx = 2;
      } else {
        chapterIdx = 3;
      }

      if (activeChapterIndexRef.current !== chapterIdx) {
        activeChapterIndexRef.current = chapterIdx;
        setActiveChapterIndex(chapterIdx);
      }

      // ── VIDEO PLAYBACK & SCRUBBING ──
      if (isPlayingAutoRef.current) {
        // AUTO-PLAY CINEMATIC TOUR MODE
        if (video.paused) {
          video.playbackRate = 1.0;
          video.play().catch(() => {});
        }

        const currentProg = videoDuration > 0 ? video.currentTime / videoDuration : 0;
        currentTimeRef.current = video.currentTime;

        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const targetY = sectionTop + currentProg * scrollDistance;

        if (Math.abs(window.scrollY - targetY) > 2) {
          if (window.__lenis && typeof window.__lenis.scrollTo === "function") {
            window.__lenis.scrollTo(targetY, { immediate: true });
          } else {
            window.scrollTo({ top: targetY, behavior: "instant" });
          }
        }

        if (video.ended || currentProg >= 0.99) {
          setIsPlayingAuto(false);
          if (!video.paused) {
            video.pause();
          }
        }
      } else {
        // MANUAL SCROLLYTELLING SCRUBBING (Video is paused, 100% smooth frame interpolation)
        if (!video.paused) {
          video.pause();
        }

        const targetTime = Math.min(
          videoDuration - 0.05,
          Math.max(0, scrollProgress * videoDuration)
        );

        const delta = Math.abs(targetTime - currentTimeRef.current);

        // Fast leap (large scroll jump / manual scrollbar drag): sync directly
        if (delta > 1.5) {
          currentTimeRef.current = targetTime;
        } else {
          // Responsive progressive lerp for buttery smooth glide with scroll
          currentTimeRef.current += (targetTime - currentTimeRef.current) * 0.2;
        }

        // Apply to video element if delta is perceptible and decoder is not busy seeking
        if (Math.abs(video.currentTime - currentTimeRef.current) > 0.012) {
          if (!video.seeking) {
            video.currentTime = currentTimeRef.current;
          }
        }
      }

      rafId.current = requestAnimationFrame(updateVideoTime);
    };

    rafId.current = requestAnimationFrame(updateVideoTime);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [videoDuration]);

  // Smooth scroll to chapter
  const scrollToChapter = (index: number) => {
    setIsPlayingAuto(false);
    if (!sectionRef.current) return;
    const section = sectionRef.current;
    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollDistance = sectionHeight - viewportHeight;
    const targetProgress = HERO_CHAPTERS[index]?.target ?? (index * 0.28);
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const targetY = sectionTop + targetProgress * scrollDistance;

    if (window.__lenis && typeof window.__lenis.scrollTo === "function") {
      window.__lenis.scrollTo(targetY, { duration: 1.2 });
    } else {
      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    }
  };


  // Toggle Auto-play
  const toggleAutoTour = () => {
    if (isPlayingAuto) {
      setIsPlayingAuto(false);
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    } else {
      const section = sectionRef.current;
      if (section) {
        const rect = section.getBoundingClientRect();
        const sectionHeight = section.offsetHeight;
        const scrollDistance = sectionHeight - window.innerHeight;
        const scrollProgress = -rect.top / scrollDistance;
        if (scrollProgress >= 0.95) {
          scrollToChapter(0);
        }
      }
      setIsPlayingAuto(true);
      if (videoRef.current) {
        videoRef.current.playbackRate = 1.0;
        videoRef.current.play().catch(() => {});
      }
    }
  };

  // Theater modal
  const openTheater = (e: React.MouseEvent<HTMLButtonElement>) => {
    theaterTriggerRef.current = e.currentTarget;
    setIsPlayingAuto(false);
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
    setIsTheaterOpen(true);
  };

  const closeTheater = useCallback(() => {
    setIsTheaterOpen(false);
    theaterTriggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isTheaterOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      theaterCloseBtnRef.current?.focus();
    }, 50);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeTheater();
      } else if (e.key === "Tab") {
        const modal = theaterModalRef.current;
        if (!modal) return;
        const focusables = modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), video'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isTheaterOpen, closeTheater]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-[450vh] w-full"
      aria-label="Murad Buildings taqdimoti"
    >
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#0C0B0A]">
        {/* Background Video */}
        <video
          ref={videoRef}
          src="/videos/professional_qilb_ber_shuni_ma.mp4"
          poster="/gallery/exterior-1.jpg"
          muted={isMuted}
          playsInline
          preload="auto"
          onLoadedMetadata={handleMetadataLoaded}
          aria-label="Murad Buildings rezidensiyasi video sayohati"
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{ transform: "translateZ(0)" }}
        />

        {/* Non-blocking Loading Indicator */}
        <AnimatePresence>
          {!videoReady && !videoError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute top-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-white/80 text-xs tracking-wider font-mono shadow-2xl pointer-events-none"
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
              <span>Taqdimot yuklanmoqda...</span>
            </motion.div>
          )}

          {videoError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-black/85 backdrop-blur-md border border-amber-500/30 text-amber-200 text-xs tracking-wider font-mono shadow-2xl"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Video yuklanmadi</span>
              <button
                onClick={retryVideo}
                className="ml-2 px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/40 text-white text-[10px] uppercase flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Qayta</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── PRIMARY HERO INTRO OVERLAY (Smooth CSS transitions based on progress) ── */}
        <div
          ref={introOverlayRef}
          className="relative z-10 flex flex-col items-center justify-end h-full pb-14 sm:pb-16 lg:pb-24 px-4 sm:px-6 text-center will-change-transform will-change-opacity pointer-events-none"
          style={{
            opacity: 1,
            transform: "translate3d(0, 0px, 0)",
          }}
        >
          {/* Minimalist Serif Title */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-[0.08em] sm:tracking-[0.12em] uppercase font-light drop-shadow-[0_6px_35px_rgba(0,0,0,0.95)] mb-6 sm:mb-8 select-none leading-none">
            {currentProject?.projectName || "Xon Saroy — Orzular"}
          </h1>

          {/* Scroll Down Prompt */}
          <div className="flex flex-col items-center mt-2 pointer-events-auto">
            <button
              onClick={() => scrollToChapter(1)}
              className="min-h-[44px] flex flex-col items-center justify-center text-white/60 hover:text-white transition-colors group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full p-2"
              aria-label="Pastga aylantirib ko'rish"
            >
              <span className="text-[10px] tracking-[0.25em] uppercase mb-1.5 group-hover:text-accent transition-colors font-medium">
                Skroll qilib o&apos;rganing
              </span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-7 h-7 rounded-full border border-white/25 flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:border-accent group-hover:bg-accent/20 transition-all"
              >
                <ChevronDown size={14} />
              </motion.div>
            </button>
          </div>
        </div>

        {/* ── CINEMATIC HUD OVERLAY (Appears smoothly during scroll) ── */}
        <div
          ref={hudRef}
          className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-6 lg:p-8 xl:px-10 transition-all duration-500 opacity-0 translate-y-5 pointer-events-none"
          aria-hidden="true"
        >
          <div className="mx-auto max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            {/* Active Chapter Details Card */}
            <div className="flex items-center gap-3.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/15 shadow-2xl max-w-full">
              <span className="font-mono text-xs text-accent font-bold tracking-widest px-2 py-1 rounded bg-accent/15 border border-accent/30 shrink-0">
                {HERO_CHAPTERS[activeChapterIndex].code}
              </span>
              <div className="text-left overflow-hidden">
                <h4 className="text-white text-xs sm:text-sm font-medium tracking-wide truncate">
                  {HERO_CHAPTERS[activeChapterIndex].title}
                </h4>
                <p className="text-white/60 text-[11px] sm:text-xs truncate">
                  {HERO_CHAPTERS[activeChapterIndex].subtitle}
                </p>
              </div>
            </div>

            {/* Chapter Quick Jump Pills */}
            <div className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-black/80 backdrop-blur-xl border border-white/15 shadow-2xl">
              {HERO_CHAPTERS.map((ch, idx) => (
                <button
                  key={ch.code}
                  onClick={() => scrollToChapter(idx)}
                  className={`min-h-[40px] px-3.5 py-2 rounded-full text-xs font-medium tracking-wider transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    activeChapterIndex === idx
                      ? "bg-accent text-[#0A0908] shadow-lg shadow-accent/25 font-bold"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {ch.code} · {ch.title}
                </button>
              ))}
            </div>


          </div>
        </div>
      </div>

      {/* ── CINEMA / THEATER LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {isTheaterOpen && (
          <motion.div
            ref={theaterModalRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label="Murad Buildings rasmiy video taqdimoti"
            className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 sm:p-8"
          >
            {/* Top Bar with Title & Close button */}
            <div className="w-full max-w-5xl flex items-center justify-between pb-4 text-white">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                <h3 className="font-serif text-lg sm:text-xl tracking-wide uppercase">
                  Murad Buildings — Rasmiy taqdimot
                </h3>
              </div>
              <button
                ref={theaterCloseBtnRef}
                onClick={closeTheater}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Yopish (Esc)"
              >
                <X size={20} />
              </button>
            </div>

            {/* Video Container with Glass Frame */}
            <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-white/20 bg-black shadow-[0_0_80px_rgba(0,0,0,0.8)] relative">
              <video
                ref={theaterVideoRef}
                src="/videos/professional_qilb_ber_shuni_ma.mp4"
                poster="/gallery/exterior-1.jpg"
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {/* Modal Bottom Info */}
            <div className="w-full max-w-5xl pt-4 flex flex-col sm:flex-row items-center justify-between text-white/60 text-xs tracking-wider gap-2">
              <span className="font-mono">Format: 720p HD · 48kHz Stereo audio</span>
              <span className="italic">ESC tugmasini bosib yopishingiz mumkin</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
