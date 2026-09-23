"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const rafId = useRef<number>(0);
  const currentTimeRef = useRef(0);

  /* Load video lazily after hydration */
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = "/videos/palisades-showcase.mp4";
      videoRef.current.load();
    }
  }, []);

  const handleMetadataLoaded = useCallback(() => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      setVideoReady(true);
    }
  }, []);

  /* Scroll-linked video playback */
  useEffect(() => {
    if (!videoReady || !videoDuration || !sectionRef.current || !videoRef.current)
      return;

    const video = videoRef.current;
    const section = sectionRef.current;

    const updateVideoTime = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      // scrollProgress: 0 at top, 1 when section is fully scrolled past
      const scrollProgress = Math.min(
        1,
        Math.max(0, -rect.top / (sectionHeight - viewportHeight))
      );

      // Target time based on scroll
      const targetTime = scrollProgress * videoDuration;

      // Smooth interpolation to avoid jerkiness
      currentTimeRef.current +=
        (targetTime - currentTimeRef.current) * 0.15;

      // Only update if difference is meaningful (avoid unnecessary updates)
      if (Math.abs(video.currentTime - currentTimeRef.current) > 0.01) {
        video.currentTime = currentTimeRef.current;
      }

      rafId.current = requestAnimationFrame(updateVideoTime);
    };

    rafId.current = requestAnimationFrame(updateVideoTime);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [videoReady, videoDuration]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-[400vh] w-full"
    >
      {/* Sticky container — stays pinned while section scrolls */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Poster / fallback background */}
        <div className="absolute inset-0 bg-[#2a2520]" />

        {/* Video — NOT autoplay, controlled by scroll */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={handleMetadataLoaded}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-24 lg:pb-32 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.3,
              ease: [0.25, 0.4, 0.25, 1],
            }}
          >
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white tracking-[0.15em] uppercase mb-6">
              The Palisades
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.8,
              ease: [0.25, 0.4, 0.25, 1],
            }}
            className="font-serif text-lg md:text-xl lg:text-2xl text-white/80 tracking-wide italic max-w-xl"
          >
            Osmon bilan yer chegarasida yashang
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-8 lg:bottom-12"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center text-white/60"
            >
              <span className="text-xs tracking-[0.3em] uppercase mb-2">
                Pastga aylantiring
              </span>
              <ChevronDown size={20} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
