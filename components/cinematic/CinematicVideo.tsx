"use client";

import React from "react";
import { CHAPTERS } from "./types";

interface CinematicVideoProps {
  layerRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export const CinematicVideo: React.FC<CinematicVideoProps> = ({ layerRefs }) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#050505]">
      {CHAPTERS.map((chapter, index) => (
        <div
          key={chapter.id}
          ref={(el) => {
            layerRefs.current[index] = el;
          }}
          style={{
            opacity: index === 0 ? 1 : 0,
            visibility: index === 0 ? "visible" : "hidden",
            willChange: "opacity",
          }}
          className="absolute inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none select-none transition-opacity duration-150"
        >
          {/* Subtle architectural background canvas / placeholder */}
          <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
            {/* Minimal architectural frame lines */}
            <div className="w-[85vw] h-[75vh] border border-white/10 relative flex flex-col justify-between p-6 md:p-10">
              {/* Corner Reticles */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t border-l border-white/30" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t border-r border-white/30" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b border-l border-white/30" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b border-r border-white/30" />

              {/* Top Template Telemetry */}
              <div className="flex justify-between items-start text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                <span>PHASE {chapter.code}</span>
                <span>ASPECT 16:9 / CINEMATIC</span>
              </div>

              {/* Center Chapter Title & Description */}
              <div className="text-center max-w-lg mx-auto">
                <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-400 block mb-2 font-light">
                  CHAPTER {chapter.code}
                </span>
                <h3 className="text-3xl md:text-5xl font-light tracking-[0.25em] text-white uppercase">
                  {chapter.title}
                </h3>
                <p className="mt-4 text-xs md:text-sm text-neutral-400 font-light tracking-wide leading-relaxed">
                  {chapter.description}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 border border-white/15 text-[9px] tracking-[0.25em] text-neutral-400 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                  <span>MEDIA TEMPLATE READY</span>
                </div>
              </div>

              {/* Bottom Template Telemetry */}
              <div className="flex justify-between items-end text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                <span>TIMELINE: {chapter.code} / 04</span>
                <span>ARCHITECTURAL PRESENTATION</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Subtle cinematic edge falloff */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#050505]/60 via-transparent to-[#050505]/40" />
    </div>
  );
};
