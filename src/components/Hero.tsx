"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const isSeekingRef = useRef(false);
  const pendingTimeRef = useRef<number | null>(null);
  const currentTimeRef = useRef(0);
  const rafId = useRef<number>(0);

  const requestSeek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video || !videoDuration) return;

    const clamped = Math.max(0, Math.min(videoDuration - 0.05, time));

    // If browser is already busy seeking, save target and wait for 'seeked' event
    if (video.seeking || isSeekingRef.current) {
      pendingTimeRef.current = clamped;
      return;
    }

    // Skip redundant micro-seeks (< 0.03s, less than 1 video frame)
    if (Math.abs(video.currentTime - clamped) < 0.03) {
      return;
    }

    isSeekingRef.current = true;
    try {
      if ("fastSeek" in video && typeof (video as any).fastSeek === "function") {
        (video as any).fastSeek(clamped);
      } else {
        video.currentTime = clamped;
      }
    } catch {
      video.currentTime = clamped;
    }
  }, [videoDuration]);

  // When video completes a seek, immediately dispatch any pending seek
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onSeeked = () => {
      isSeekingRef.current = false;
      if (pendingTimeRef.current !== null) {
        const nextTime = pendingTimeRef.current;
        pendingTimeRef.current = null;
        requestSeek(nextTime);
      }
    };

    video.addEventListener("seeked", onSeeked);
    return () => {
      video.removeEventListener("seeked", onSeeked);
    };
  }, [requestSeek]);

  // Ensure video readiness is detected even if metadata loaded before hydration
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncReady = () => {
      if (video.duration && !isNaN(video.duration)) {
        setVideoDuration(video.duration);
        setVideoReady(true);
      }
    };

    // Check if already loaded by browser
    if (video.readyState >= 1) {
      syncReady();
    }

    video.addEventListener("loadedmetadata", syncReady);
    video.addEventListener("loadeddata", syncReady);
    video.addEventListener("canplay", syncReady);

    return () => {
      video.removeEventListener("loadedmetadata", syncReady);
      video.removeEventListener("loadeddata", syncReady);
      video.removeEventListener("canplay", syncReady);
    };
  }, []);

  const handleMetadataLoaded = useCallback(() => {
    if (videoRef.current && videoRef.current.duration) {
      setVideoDuration(videoRef.current.duration);
      setVideoReady(true);
    }
  }, []);

  const [progress, setProgress] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const CHAPTERS = [
    { code: "01", title: "Tashqi Me'morchilik", subtitle: "Uchta monolit minora" },
    { code: "02", title: "Grand Lobbi", subtitle: "Marmar va 24/7 konsyerj" },
    { code: "03", title: "Maxsus Koridorlar", subtitle: "Yuqori xavfsizlik va sokinlik" },
    { code: "04", title: "Penthouse & Interyer", subtitle: "Panoramik shahar manzarasi" },
  ];

  /* Scroll-linked video playback with 60fps dynamic hardware playbackRate engine */
  useEffect(() => {
    if (!videoDuration || !sectionRef.current || !videoRef.current)
      return;

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

      // When Hero is not visible in viewport, pause and sleep
      if (rect.bottom < 0 || rect.top > viewportHeight) {
        if (!video.paused) {
          video.pause();
        }
        rafId.current = requestAnimationFrame(updateVideoTime);
        return;
      }

      const scrollDistance = sectionHeight - viewportHeight;
      const scrollProgress = Math.min(
        1,
        Math.max(0, -rect.top / Math.max(1, scrollDistance))
      );

      setProgress(scrollProgress);

      // Determine active chapter
      if (scrollProgress < 0.25) {
        setActiveChapterIndex(0);
      } else if (scrollProgress < 0.55) {
        setActiveChapterIndex(1);
      } else if (scrollProgress < 0.8) {
        setActiveChapterIndex(2);
      } else {
        setActiveChapterIndex(3);
      }

      const targetTime = scrollProgress * videoDuration;
      const diff = targetTime - video.currentTime;

      if (diff > 0.05) {
        // Scrolling forward: Use native 60fps hardware playback
        if (diff > 2.5) {
          // If rapid jump or scroll leap, seek close to target
          requestSeek(targetTime - 0.3);
        } else {
          // Smooth proportional playback rate based on scroll velocity
          const rate = Math.min(6, Math.max(0.75, diff * 3.2));
          video.playbackRate = rate;
          if (video.paused) {
            video.play().catch(() => {});
          }
        }
      } else if (diff < -0.05) {
        // Scrolling backward: Pause and seek backwards smoothly
        if (!video.paused) {
          video.pause();
        }
        requestSeek(targetTime);
      } else {
        // Reached target position: pause cleanly
        if (!video.paused) {
          video.pause();
        }
      }

      rafId.current = requestAnimationFrame(updateVideoTime);
    };

    rafId.current = requestAnimationFrame(updateVideoTime);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [videoDuration, requestSeek]);

  const scrollToChapter = (index: number) => {
    if (!sectionRef.current) return;
    const sectionHeight = sectionRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollDistance = sectionHeight - viewportHeight;
    const targetProgress = index * 0.28;
    const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: sectionTop + targetProgress * scrollDistance,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-[450vh] w-full"
    >
      {/* Sticky container — stays pinned while section scrolls */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Poster / fallback background */}
        <div className="absolute inset-0 bg-[#161412]" />

        {/* Video — NOT autoplay, controlled by scroll */}
        <video
          ref={videoRef}
          src="/videos/palisades-showcase.mp4"
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={handleMetadataLoaded}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dynamic Vignette & Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/70 pointer-events-none" />

        {/* Primary Hero Intro Overlay (Fades out gracefully on scroll) */}
        <div
          className="relative z-10 flex flex-col items-center justify-end h-full pb-20 lg:pb-28 px-6 text-center transition-all duration-700 pointer-events-none"
          style={{
            opacity: Math.max(0, 1 - progress * 5.5),
            transform: `translateY(-${progress * 80}px)`,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.3,
              ease: [0.25, 0.4, 0.25, 1],
            }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] tracking-[0.25em] text-white/90 uppercase font-medium">
                Toshkent, Yunusobod · Premium Residence
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white tracking-[0.15em] uppercase mb-4 drop-shadow-2xl">
              The Palisades
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.7,
              ease: [0.25, 0.4, 0.25, 1],
            }}
            className="font-serif text-lg md:text-xl lg:text-2xl text-white/90 tracking-wide italic max-w-xl mb-10 drop-shadow-md"
          >
            Osmon bilan yer chegarasida yashang
          </motion.p>

          {/* Interactive Scroll prompt */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="pointer-events-auto"
          >
            <button
              onClick={() => scrollToChapter(1)}
              className="flex flex-col items-center text-white/70 hover:text-white transition-colors group cursor-pointer"
            >
              <span className="text-[11px] tracking-[0.3em] uppercase mb-2 group-hover:text-accent transition-colors font-medium">
                Ekskursiyani boshlash
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center bg-black/30 backdrop-blur-sm group-hover:border-accent group-hover:bg-accent/20 transition-all"
              >
                <ChevronDown size={16} />
              </motion.div>
            </button>
          </motion.div>
        </div>

        {/* Cinematic HUD Overlay (Active during scroll tour) */}
        <div
          className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-none transition-all duration-500"
          style={{
            opacity: progress > 0.08 ? 1 : 0,
            transform: progress > 0.08 ? "translateY(0)" : "translateY(20px)",
          }}
        >
          {/* Active Chapter Details Card */}
          <div className="pointer-events-auto flex items-center gap-4 px-5 py-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 shadow-2xl">
            <span className="font-mono text-xs text-accent font-bold tracking-widest px-2 py-1 rounded bg-accent/15 border border-accent/30">
              {CHAPTERS[activeChapterIndex].code}
            </span>
            <div className="text-left">
              <h4 className="text-white text-sm font-medium tracking-wide">
                {CHAPTERS[activeChapterIndex].title}
              </h4>
              <p className="text-white/60 text-xs">
                {CHAPTERS[activeChapterIndex].subtitle}
              </p>
            </div>
          </div>

          {/* Chapter Quick Jump Pills */}
          <div className="pointer-events-auto hidden md:flex items-center gap-2 p-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 shadow-2xl">
            {CHAPTERS.map((ch, idx) => (
              <button
                key={ch.code}
                onClick={() => scrollToChapter(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider transition-all duration-300 cursor-pointer ${
                  activeChapterIndex === idx
                    ? "bg-accent text-white shadow-lg shadow-accent/20"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {ch.code} · {ch.title}
              </button>
            ))}
          </div>

          {/* Progress Percentage & Fast CTA */}
          <div className="pointer-events-auto flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 flex items-center gap-3">
              <div className="w-16 h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-150"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <span className="font-mono text-xs text-white/80 tracking-widest">
                {Math.round(progress * 100)}%
              </span>
            </div>

            <a
              href="#contact"
              className="px-5 py-2.5 rounded-2xl bg-accent hover:bg-accent-dark text-white text-xs uppercase tracking-[0.15em] font-medium transition-all shadow-xl hover:shadow-accent/30 hover:scale-105 active:scale-95"
            >
              Rejani so&apos;rash
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
