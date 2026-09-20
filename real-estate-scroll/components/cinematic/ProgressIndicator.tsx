"use client";

import React, { forwardRef } from "react";
import { CHAPTERS } from "./types";

interface ProgressIndicatorProps {
  percentageRef: React.RefObject<HTMLSpanElement | null>;
  trackBarRef: React.RefObject<HTMLDivElement | null>;
  chapterRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  onChapterClick: (index: number) => void;
}

export const ProgressIndicator = forwardRef<
  HTMLDivElement,
  ProgressIndicatorProps
>(({ percentageRef, trackBarRef, chapterRefs, onChapterClick }, ref) => {
  return (
    <div
      ref={ref}
      className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 md:p-6 select-none overflow-hidden"
    >
      {/* Top HUD */}
      <header className="flex justify-between items-start w-full">
        <div className="flex flex-col pointer-events-auto bg-[#050505]/60 px-2 py-1 rounded-xs backdrop-blur-xs">
          <span className="text-[10px] md:text-[11px] tracking-[0.3em] font-medium text-white uppercase">
            THE BUILDING
          </span>
          <span className="text-[8px] md:text-[9px] tracking-[0.35em] text-[#c8b28a] uppercase mt-0.5">
            / RESIDENCES
          </span>
        </div>

        <div className="text-right pointer-events-auto bg-[#050505]/60 px-2 py-1 rounded-xs backdrop-blur-xs">
          <span className="text-[8px] md:text-[9px] tracking-[0.25em] text-neutral-400 uppercase hidden sm:block">
            FEATURED RESIDENCE
          </span>
        </div>
      </header>

      {/* Bottom HUD */}
      <footer className="flex justify-between items-end w-full">
        {/* Chapters list (bottom-left) */}
        <nav
          className="flex flex-col gap-1.5 md:gap-2 pointer-events-auto"
          aria-label="Experience Chapters"
        >
          {CHAPTERS.map((chapter, index) => (
            <button
              key={chapter.id}
              ref={(el) => {
                chapterRefs.current[index] = el;
              }}
              onClick={() => onChapterClick(index)}
              className={`flex items-center gap-2 md:gap-2.5 text-left text-[9px] md:text-xs tracking-[0.25em] uppercase transition-all duration-300 group cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c8b28a] px-1 py-0.5 ${
                index === 0
                  ? "text-white font-medium translate-x-1"
                  : "text-neutral-500 font-light translate-x-0 hover:text-neutral-300"
              }`}
              aria-label={`Jump to chapter ${chapter.code}: ${chapter.title}`}
            >
              <span
                className={`h-[1px] transition-all duration-300 ${
                  index === 0
                    ? "w-3 bg-[#c8b28a]"
                    : "w-1 bg-neutral-600 group-hover:w-2 group-hover:bg-neutral-400"
                }`}
                aria-hidden="true"
              />
              <span className="tracking-[0.2em]">{chapter.label}</span>
            </button>
          ))}
        </nav>

        {/* Master Progress Percentage & Track (bottom-right) */}
        <div className="flex flex-col items-end gap-1.5 md:gap-2 pointer-events-auto">
          <span
            ref={percentageRef}
            className="font-mono text-xs md:text-sm font-light text-white tracking-widest"
            aria-live="polite"
          >
            00%
          </span>

          {/* Minimal 1px progress track */}
          <div
            className="w-16 md:w-28 h-[1px] bg-white/15 overflow-hidden"
            aria-hidden="true"
          >
            <div
              ref={trackBarRef}
              className="h-full bg-[#c8b28a] transition-all duration-75 origin-left"
              style={{ width: "0%" }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
});

ProgressIndicator.displayName = "ProgressIndicator";
